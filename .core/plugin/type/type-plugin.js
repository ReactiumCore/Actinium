const op = require('object-path');
const _ = require('underscore');
const uuidv5 = require('uuid/v5');
const slugify = require(`${ACTINIUM_DIR}/lib/utils/slugify`);
const chalk = require('chalk');
const serialize = require(`${ACTINIUM_DIR}/lib/utils/serialize`);

const {
    CloudHasCapabilities,
    CloudCapOptions,
    CloudRunOptions,
} = require(`${ACTINIUM_DIR}/lib/utils`);

const SDK = require('./sdk');

const {
    UNINSTALLED_NAMESPACE,
    PLUGIN_BLUEPRINTS,
    PLUGIN_ROUTES,
    PLUGIN,
} = require('./enums');

Actinium.Type = SDK;

const COLLECTION = PLUGIN.ID;

Actinium.Plugin.register(PLUGIN, true);

const getNamespace = () => {
    return (
        op.get(Actinium.Plugin.get(PLUGIN.ID), 'meta.namespace') ||
        UNINSTALLED_NAMESPACE
    );
};

Actinium.Hook.register('warning', async () => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;

    const namespace = getNamespace();
    if (namespace === UNINSTALLED_NAMESPACE) {
        WARN('');
        WARN(
            chalk.cyan.bold('Warning:'),
            'It appears you have not set the ID_NAMESPACE to a unique random uuid/v4. The default will be used and your content ids will not be unique!',
        );
        WARN(
            chalk.cyan(`  PLUGINS['${PLUGIN.ID}'].meta.namespace → `),
            namespace,
        );
    }
});

Actinium.Hook.register('type-saved', async () => {
    Actinium.Cache.del('types');
});

Actinium.Hook.register('type-deleted', async () => {
    Actinium.Cache.del('types');
});

const registerBlueprints = (reg = true) => ({ ID }) => {
    if (ID && ID !== PLUGIN.ID) return;
    if (reg === true)
        PLUGIN_BLUEPRINTS.forEach(bp => Actinium.Blueprint.register(bp.ID, bp));
    else PLUGIN_BLUEPRINTS.forEach(bp => Actinium.Blueprint.unregister(bp.ID));
};

// Start: Blueprints
Actinium.Hook.register('start', registerBlueprints(true));

// Activate: Blueprints
Actinium.Hook.register('activate', registerBlueprints(true));

// Deactivate: Blueprints
Actinium.Hook.register('deactivate', registerBlueprints(false));

const saveRoutes = async () => {
    for (const route of PLUGIN_ROUTES) {
        await Actinium.Route.save(route);
    }
};

// Update routes on startup
Actinium.Hook.register('start', async () => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        await saveRoutes();
    }
});

// Update routes on plugin activation
Actinium.Hook.register('activate', async ({ ID }) => {
    if (ID === PLUGIN.ID) {
        await saveRoutes();
    }
});

// Update routes on plugin update
Actinium.Hook.register('update', async ({ ID }) => {
    if (ID === PLUGIN.ID) {
        await saveRoutes();
    }
});

// Remove routes on deactivation
Actinium.Hook.register('deactivate', async ({ ID }) => {
    if (ID === PLUGIN.ID) {
        for (const route of PLUGIN_ROUTES) {
            await Actinium.Route.delete(route);
        }
    }
});

Actinium.Capability.register(
    `${COLLECTION}.create`,
    {},
    Actinium.Enums.priority.highest,
);
Actinium.Capability.register(
    `${COLLECTION}.retrieve`,
    {
        allowed: ['anonymous'],
    },
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
        collection: {
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
    ['uuid', 'machineName', 'collection'],
);

const beforeSave = async req => {
    let { uuid, value, machineName, namespace } = serialize(req.object);
    const defaultNamespace = getNamespace();

    const old = await new Parse.Query(COLLECTION)
        .equalTo('uuid', uuid)
        .first(CloudRunOptions(req));

    if (!namespace) {
        namespace = defaultNamespace;
        req.object.set('namespace', defaultNamespace);
    }

    if (old) {
        const { uuid: existingUUID, namespace: existingNamespace } = serialize(
            old,
        );

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
    return Actinium.Type.list(req.params, CloudRunOptions(req));
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
    return Actinium.Type.create(req.params, options);
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
    return Actinium.Type.status(req.params, options);
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
 * @apiParam {String} [collection] the collection associated with the content type
 * @apiParam {String} [namespace] optional namespace. Will be used to derive the
  uuid from the machine name if the uuid is not known. By default, the current
  APIs content namespace will be used, and this will not be needed.
 *
 * @apiName type-retrieve
 * @apiGroup Cloud
 */
Actinium.Cloud.define(PLUGIN.ID, 'type-retrieve', async req => {
    return Actinium.Type.retrieve(req.params, CloudRunOptions(req));
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
    return Actinium.Type.update(req.params, CloudRunOptions(req));
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
    return Actinium.Type.delete(req.params, CloudRunOptions(req));
});
