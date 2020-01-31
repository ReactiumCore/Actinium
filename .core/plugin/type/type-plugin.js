const op = require('object-path');
const _ = require('underscore');
const uuidv5 = require('uuid/v5');
const slugify = require(`${ACTINIUM_DIR}/lib/utils/slugify`);
const chalk = require('chalk');

const {
    CloudHasCapabilities,
    CloudCapOptions,
    CloudRunOptions,
} = require(`${ACTINIUM_DIR}/lib/utils`);

const {
    UNINSTALLED_NAMESPACE,
    PLUGIN_BLUEPRINTS,
    PLUGIN_ROUTES,
    PLUGIN,
} = require('./enums');

const COLLECTION = PLUGIN.ID;

Actinium.Plugin.register(PLUGIN, true);

const getNamespace = () => {
    return (
        op.get(Actinium.Plugin.get(PLUGIN.ID), 'meta.namespace') ||
        UNINSTALLED_NAMESPACE
    );
};

Actinium.Hook.register('start', async () => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        const namespace = getNamespace();
        if (namespace === UNINSTALLED_NAMESPACE) {
            LOG('');
            LOG(
                chalk.cyan.bold('Warning:'),
                'It appears you have not set the ID_NAMESPACE to a unique random uuid/v4. The default will be used and your content ids will not be unique!',
            );
            LOG(
                chalk.cyan(`  PLUGINS[${PLUGIN.ID}].meta.namespace → `),
                namespace,
            );
        }
    }
});

// Register Blueprints
Actinium.Hook.register(
    'blueprint-defaults',
    blueprints => {
        PLUGIN_BLUEPRINTS.forEach(item => blueprints.push(item));
    },
    -1000,
);

// Register Routes
Actinium.Hook.register('route-defaults', routes => {
    PLUGIN_ROUTES.forEach(item => routes.push(item));
});

Actinium.Capability.register(
    `${COLLECTION}.create`,
    {},
    Actinium.Enums.priority.highest,
);
Actinium.Capability.register(
    `${COLLECTION}.retrieve`,
    {},
    Actinium.Enums.priority.highest,
);
Actinium.Capability.register(
    `${COLLECTION}.update`,
    {},
    Actinium.Enums.priority.highest,
);
Actinium.Capability.register(
    `${COLLECTION}.delete`,
    {},
    Actinium.Enums.priority.highest,
);
Actinium.Capability.register(
    `${COLLECTION}.addField`,
    {},
    Actinium.Enums.priority.highest,
);

Actinium.Collection.register(
    COLLECTION,
    {
        create: false,
        retrieve: false,
        update: false,
        delete: false,
        addField: false,
    },
    {
        uuid: {
            type: 'String',
        },
        type: {
            type: 'String',
        },
        machineName: {
            type: 'String',
        },
        namespace: {
            type: 'String',
        },
        fields: {
            type: 'Object',
        },
        meta: {
            type: 'Object',
        },
        slugs: {
            type: 'Array',
        },
    },
    ['uuid', 'machineName'],
);

const beforeSave = async req => {
    let { uuid, value, machineName, namespace } = req.object.toJSON();
    const defaultNamespace = getNamespace();

    const old = await new Parse.Query(COLLECTION)
        .equalTo('uuid', uuid)
        .first(CloudRunOptions(req));

    if (!namespace) {
        namespace = defaultNamespace;
        req.object.set('namespace', defaultNamespace);
    }

    if (old) {
        const {
            uuid: existingUUID,
            namespace: existingNamespace,
        } = old.toJSON();

        // disallow change of uuid
        if (uuid !== existingUUID) req.object.set('uuid', existingUUID);

        if (namespace !== existingNamespace) {
            // new namespace is invalid, try default
            if (existingUUID !== uuidv5(machineName, namespace)) {
                // fallback to existing, even if empty
                req.object.set('namespace', existingNamespace);
                if (existingUUID === uuidv5(machineName, defaultNamespace)) {
                    req.object.set('namespace', defaultNamespace);
                }
            }
        }
    } else {
        if (!uuid) {
            req.object.set('uuid', uuidv5(machineName, namespace));
        }
    }
};

Parse.Cloud.beforeSave(COLLECTION, async (...params) => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        return beforeSave(...params);
    }
});

/**
 * @api {Asynchronous} types types
 * @apiDescription Retrieve a list of the existing content types.
 * @apiName types
 * @apiGroup Cloud
 */
Actinium.Cloud.define(PLUGIN.ID, 'types', async req => {
    let pages = 0,
        total = 0;

    let { page = 0, limit = 1000, refresh = false } = req.params;

    page = Math.max(page, 0);
    limit = Math.min(limit, 1000);
    let cacheKey = ['types', page, limit, 'types'];

    let types = page < 1 && !refresh ? Actinium.Cache.get(cacheKey, []) : [];

    if (types.length < 1) {
        const skip = page > 0 ? page * limit - limit : 0;
        const query = new Parse.Query(COLLECTION);
        const options = CloudRunOptions(req);

        // Pagination
        total = await query.count(options);

        // Find
        query.skip(skip);
        query.limit(limit);

        let results = await query.find(options);

        while (results.length > 0) {
            types = types.concat(results);

            if (page < 1) {
                query.skip(types.length);
                results = await query.find(options);
            } else {
                break;
            }
        }

        types = types.map(contentType => contentType.toJSON());
        Actinium.Cache.set(cacheKey, types, 20000);
    } else {
        total = types.length;
    }

    pages = Math.ceil(total / limit);

    const list = {
        timestamp: Date.now(),
        limit,
        page,
        pages,
        total,
        types,
    };

    await Actinium.Hook.run('type-list', list);

    return Promise.resolve(list);
});

/**
 * @api {Asynchronous} type-create type-create
 * @apiDescription Save a content type definition.
 *
 * @apiParam {String} type unique label of content type. On save,
 this will be used to generate the machineName and label of the type.
 * @apiParam {String} [namespace] the optional uuid to be used as the uuid/v5 namespace
 of to create the uuid of the new type. This will use the api's configured namespace
 by default.
 * @apiParam {Object} regions indexed by region id, this object contains multiple region objects,
 each with the same id ('default' by default), a label, and a slug. Each field
 in the `fields` has a `region` property with the id of the region to which it belongs.
 * @apiParam {Object} fields indexed by fieldId (an uuid), this object
 contains 1 or more objects that describe the configuration for one "field type"
  in the content type. The only required properties in each object are
 `fieldId`, which matches the index, a string `fieldType` which identifies a supported
 Actinium field type, a string `region`id ("default" region id by default), and
 a unique `fieldName` which will ultimately be the name of the field in the content schema.
 * @apiParam {Object} [meta] largely free-form metadata object associated with this content type.
 Actinium will use this to store the current label of the type.
 *
 * @apiName type-create
 * @apiGroup Cloud
 */
Actinium.Cloud.define(PLUGIN.ID, 'type-create', async req => {
    const options = CloudCapOptions(req, [`${COLLECTION}.create`]);
    const contentType = new Parse.Object(COLLECTION);

    const { type, fields = {} } = req.params;
    if (!type) throw new Error('type parameter required.');
    const machineName = slugify(type);
    const namespace = op.get(req.params, 'namespace', getNamespace());
    const uuid = uuidv5(machineName, namespace);

    const query = new Parse.Query(COLLECTION);
    query.equalTo('uuid', uuid);
    const existing = await query.first(options);
    if (existing)
        throw new Error(`Type ${type} is not unique in namespace ${namespace}`);

    const collection = `Content_${machineName}`.replace(/[^A-Za-z0-9_]/g, '_');

    contentType.set('uuid', uuid);
    contentType.set('type', machineName);
    contentType.set('namespace', namespace);
    contentType.set('machineName', machineName);
    contentType.set('collection', collection);
    contentType.set('fields', op.get(req.params, 'fields'));
    contentType.set('meta', {
        ...op.get(req.params, 'meta', {}),
        label: type,
    });
    contentType.set(
        'regions',
        op.get(req.params, 'regions', {
            default: {
                id: 'default',
                label: 'Default',
                slug: 'default',
            },
        }),
    );

    const saved = await contentType.save(null, options);
    const savedObj = saved.toJSON();

    await Actinium.Hook.run('type-saved', savedObj);

    return savedObj;
});

/**
 * @api {Asynchronous} type-status type-status
 * @apiDescription Get content type collection, content count, field slugs.
 * @apiParam {String} [uuid] UUID of content type
 * @apiParam {String} [machineName] the machine name of the existing content type
 * @apiParam {String} [namespace] optional namespace. Will be used to derive the
  uuid from the machine name if the uuid is not known. By default, the current
  APIs content namespace will be used, and this will not be needed.
 *
 * @apiName type-status
 * @apiGroup Cloud
 */
Actinium.Cloud.define(PLUGIN.ID, 'type-status', async req => {
    const options = CloudRunOptions(req);
    const contentType = await Actinium.Cloud.run(
        'type-retrieve',
        req.params,
        options,
    );
    if (!contentType) return { collection: null, count: 0, fields: [] };

    const { collection } = contentType;
    const ParseSchema = new Parse.Schema(collection);
    options.useMasterKey = true;

    let schema = {};
    try {
        schema = await ParseSchema.get(options);
    } catch (e) {}

    const fields = Object.keys(op.get(schema, 'fields', {}));
    const query = new Parse.Query(collection);
    const count = await query.count(options);

    return {
        collection,
        count,
        fields,
    };
});

/**
 * @api {Asynchronous} type-retrieve type-retrieve
 * @apiDescription Retrieve configuration for one content type. You must provide
 either the id|ID|objectId, uuid or the machineName.
 * @apiParam {String} [id] Parse objectId of content type
 * @apiParam {String} [ID] Parse objectId of content type
 * @apiParam {String} [objectId] Parse objectId of content type
 * @apiParam {String} [uuid] UUID of content type
 * @apiParam {String} [machineName] the machine name of the existing content type
 * @apiParam {String} [namespace] optional namespace. Will be used to derive the
  uuid from the machine name if the uuid is not known. By default, the current
  APIs content namespace will be used, and this will not be needed.
 *
 * @apiName type-retrieve
 * @apiGroup Cloud
 */
Actinium.Cloud.define(PLUGIN.ID, 'type-retrieve', async req => {
    const id = op.get(
        req.params,
        'id',
        op.get(req.params, 'ID', op.get(req.params, 'objectId')),
    );
    const machineName = op.get(req.params, 'machineName');
    const namespace = op.get(req.params, 'namespace', getNamespace());
    const uuid = machineName
        ? uuidv5(machineName, namespace)
        : op.get(req.params, 'uuid');

    if (!id && !uuid)
        throw new Error('id, uuid or machineName parameter required.');

    const options = CloudCapOptions(req, [`${COLLECTION}.retrieve`]);
    const query = new Parse.Query(COLLECTION);
    if (id) query.equalTo('objectId', id);
    if (uuid) query.equalTo('uuid', uuid);

    const contentType = await query.first(options);

    if (!contentType) throw new Error('Unable to find type.');

    return contentType.toJSON();
});

/**
 * @api {Asynchronous} type-update type-update
 * @apiDescription Save an existing content type definition. To target the existing
 content type, you must provide either the uuid or the machineName and optionally
 the content namespace used during the creation of the type.
 *
 * @apiParam {String} [uuid] UUID of content type
 * @apiParam {String} [machineName] the machine name of the existing content type
 * @apiParam {String} [namespace] optional namespace. Will be used to derive the
  uuid from the machine name if the uuid is not known. By default, the current
  APIs content namespace will be used, and this will not be needed.
 * @apiParam {String} type unique label of content type. Only the label will be
 modified, and the machineName will remain the same.
 * @apiParam {Object} regions indexed by region id, this object contains multiple region objects,
 each with the same id ('default' by default), a label, and a slug. Each field
 in the `fields` has a `region` property with the id of the region to which it belongs.
 * @apiParam {Object} fields indexed by fieldId (an uuid), this object
 contains 1 or more objects that describe the configuration for one "field type"
  in the content type. The only required properties in each object are
 `fieldId`, which matches the index, a string `fieldType` which identifies a supported
 Actinium field type, a string `region`id ("default" region id by default), and
 a unique `fieldName` which will ultimately be the name of the field in the content schema.
 * @apiParam {Object} [meta] largely free-form metadata object associated with this content type.
 Actinium will use this to store the current label of the type.
 *
 * @apiName type-update
 * @apiGroup Cloud
 */
Actinium.Cloud.define(PLUGIN.ID, 'type-update', async req => {
    const machineName = op.get(req.params, 'machineName');
    const namespace = op.get(req.params, 'namespace', getNamespace());
    const uuid = machineName
        ? uuidv5(machineName, namespace)
        : op.get(req.params, 'uuid');
    const { type, fields = {} } = req.params;
    if (!uuid) throw new Error('uuid or machineName parameter required.');

    const options = CloudCapOptions(req, [`${COLLECTION}.update`]);
    const query = new Parse.Query(COLLECTION);
    query.equalTo('uuid', uuid);
    const contentType = await query.first(options);

    if (!contentType) throw new Error('Unable to find type.');

    let meta = contentType.get('meta') || {};
    meta = {
        ...meta,
        ...op.get(req.params, 'meta'),
        ...(type ? { label: type } : {}),
    };

    contentType.set('meta', meta);
    contentType.set('fields', fields);
    contentType.set(
        'regions',
        op.get(req.params, 'regions', {
            default: {
                id: 'default',
                label: 'Default',
                slug: 'default',
            },
        }),
    );

    const saved = await contentType.save(null, options);
    const savedObj = saved.toJSON();

    await Actinium.Hook.run('type-saved', savedObj);
    return savedObj;
});

/**
 * @api {Asynchronous} type-delete type-delete
 * @apiDescription Delete a content type configuration. Note that this will not delete the content or its schema,
 only the content type configuration.
 * @apiParam {String} [uuid] UUID of content type
 * @apiParam {String} [machineName] the machine name of the existing content type
 * @apiParam {String} [namespace] optional namespace. Will be used to derive the uuid from the machine name if
 the uuid is not known. By default, the current APIs content namespace will be used, and this will not be needed.
 * @apiName type-delete
 * @apiGroup Cloud
 */
Actinium.Cloud.define(PLUGIN.ID, 'type-delete', async req => {
    const machineName = op.get(req.params, 'machineName');
    const namespace = op.get(req.params, 'namespace', getNamespace());
    const uuid = machineName
        ? uuidv5(machineName, namespace)
        : op.get(req.params, 'uuid');
    if (!uuid) throw new Error('uuid or machineName parameter required.');

    const options = CloudCapOptions(req, [`${COLLECTION}.delete`]);
    const query = new Parse.Query(COLLECTION);

    query.equalTo('uuid', uuid);
    const contentType = await query.first(options);
    if (!contentType) throw new Error('Unable to find type.');

    const typeObj = contentType.toJSON();
    const trash = await Actinium.Cloud.run(
        'recycle',
        { collection: 'Type', object: contentType },
        options,
    );
    await contentType.destroy(options);

    Actinium.Cache.del('types');

    await Actinium.Hook.run('type-deleted', typeObj);
    return trash;
});
