const op = require('object-path');
const _ = require('underscore');
const uuidv5 = require('uuid/v5');
const slugify = require(`${ACTINIUM_DIR}/lib/utils/slugify`);
const chalk = require('chalk');
const serialize = require(`${ACTINIUM_DIR}/lib/utils/serialize`);

const { UNINSTALLED_NAMESPACE, PLUGIN } = require('./enums');

const COLLECTION = PLUGIN.ID;

const Type = {};

const getNamespace = () => {
    return (
        op.get(Actinium.Plugin.get(PLUGIN.ID), 'meta.namespace') ||
        UNINSTALLED_NAMESPACE
    );
};

Type.getNamespace = getNamespace;

/**
 * @api {Asynchronous} Type.create(params,options) Type.create()
 * @apiDescription Save a content type definition.
 *
 * @apiParam (params) {String} type unique label of content type. On save,
 this will be used to generate the machineName and label of the type.
 * @apiParam (params) {String} [namespace] the optional uuid to be used as the uuid/v5 namespace
 of to create the uuid of the new type. This will use the api's configured namespace
 by default.
 * @apiParam (params) {Object} regions indexed by region id, this object contains multiple region objects,
 each with the same id ('default' by default), a label, and a slug. Each field
 in the `fields` has a `region` property with the id of the region to which it belongs.
 * @apiParam (params) {Object} fields indexed by fieldId (an uuid), this object
 contains 1 or more objects that describe the configuration for one "field type"
  in the content type. The only required properties in each object are
 `fieldId`, which matches the index, a string `fieldType` which identifies a supported
 Actinium field type, a string `region`id ("default" region id by default), and
 a unique `fieldName` which will ultimately be the name of the field in the content schema.
 * @apiParam (params) {Object} [meta] largely free-form metadata object associated with this content type.
 Actinium will use this to store the current label of the type.
 * @apiParam {Object} options Parse query options object
 *
 * @apiName Type.create
 * @apiGroup Actinium
 */
Type.create = async (params, options) => {
    const contentType = new Parse.Object(COLLECTION);

    const { type } = params;
    if (!type) throw new Error('type parameter required.');
    const machineName = slugify(type);
    const namespace = op.get(params, 'namespace', getNamespace());
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
    contentType.set('fields', op.get(params, 'fields'));
    contentType.set('meta', {
        ...op.get(params, 'meta', {}),
        label: type,
    });
    contentType.set(
        'regions',
        op.get(params, 'regions', {
            default: {
                id: 'default',
                label: 'Default',
                slug: 'default',
            },
        }),
    );

    const saved = await contentType.save(null, options);
    const savedObj = serialize(saved);

    await Actinium.Hook.run('type-saved', savedObj);

    return savedObj;
};

/**
 * @api {Asynchronous} Type.update(params,options) Type.update()
 * @apiDescription Save an existing content type definition. To target the existing
 content type, you must provide either the uuid or the machineName and optionally
 the content namespace used during the creation of the type.
 *
 * @apiParam (params) {String} [uuid] UUID of content type
 * @apiParam (params) {String} [machineName] the machine name of the existing content type
 * @apiParam (params) {String} [namespace] optional namespace. Will be used to derive the
  uuid from the machine name if the uuid is not known. By default, the current
  APIs content namespace will be used, and this will not be needed.
 * @apiParam (params) {String} type unique label of content type. Only the label will be
 modified, and the machineName will remain the same.
 * @apiParam (params) {Object} regions indexed by region id, this object contains multiple region objects,
 each with the same id ('default' by default), a label, and a slug. Each field
 in the `fields` has a `region` property with the id of the region to which it belongs.
 * @apiParam (params) {Object} fields indexed by fieldId (an uuid), this object
 contains 1 or more objects that describe the configuration for one "field type"
  in the content type. The only required properties in each object are
 `fieldId`, which matches the index, a string `fieldType` which identifies a supported
 Actinium field type, a string `region`id ("default" region id by default), and
 a unique `fieldName` which will ultimately be the name of the field in the content schema.
 * @apiParam (params) {Object} [meta] largely free-form metadata object associated with this content type.
 Actinium will use this to store the current label of the type.
 * @apiParam {Object} options Parse query options object
 *
 * @apiName Type.update
 * @apiGroup Actinium
 */
Type.update = async (params, options) => {
    const machineName = op.get(params, 'machineName');
    const namespace = op.get(params, 'namespace', getNamespace());
    const uuid = machineName
        ? uuidv5(machineName, namespace)
        : op.get(params, 'uuid');
    const { type, fields = {} } = params;
    if (!uuid) throw new Error('uuid or machineName parameter required.');

    const query = new Parse.Query(COLLECTION);
    query.equalTo('uuid', uuid);
    const contentType = await query.first(options);

    if (!contentType) throw new Error('Unable to find type.');

    let meta = contentType.get('meta') || {};
    meta = {
        ...meta,
        ...op.get(params, 'meta'),
        ...(type ? { label: type } : {}),
    };

    contentType.set('meta', meta);
    contentType.set('fields', fields);
    contentType.set(
        'regions',
        op.get(params, 'regions', {
            default: {
                id: 'default',
                label: 'Default',
                slug: 'default',
            },
        }),
    );

    const saved = await contentType.save(null, options);
    const savedObj = serialize(saved);

    await Actinium.Hook.run('type-saved', savedObj);
    return savedObj;
};

/**
 * @api {Asynchronous} Type.delete(params,options) Type.delete()
 * @apiDescription Delete a content type configuration. Note that this will not delete the content or its schema,
 only the content type configuration.
 * @apiParam (params) {String} [uuid] UUID of content type
 * @apiParam (params) {String} [machineName] the machine name of the existing content type
 * @apiParam (params) {String} [namespace] optional namespace. Will be used to derive the uuid from the machine name if
 the uuid is not known. By default, the current APIs content namespace will be used, and this will not be needed.
 * @apiName Type.delete
 * @apiGroup Actinium
 */
Type.delete = async (params, options) => {
    const machineName = op.get(params, 'machineName');
    const namespace = op.get(params, 'namespace', getNamespace());
    const uuid = machineName
        ? uuidv5(machineName, namespace)
        : op.get(params, 'uuid');
    if (!uuid) throw new Error('uuid or machineName parameter required.');

    const query = new Parse.Query(COLLECTION);

    query.equalTo('uuid', uuid);
    const contentType = await query.first(options);
    if (!contentType) throw new Error('Unable to find type.');

    const typeObj = serialize(contentType);
    const trash = await Actinium.Cloud.run(
        'recycle',
        { collection: 'Type', object: typeObj },
        options,
    );
    await contentType.destroy(options);

    Actinium.Cache.del('types');

    await Actinium.Hook.run('type-deleted', typeObj);
    return trash;
};

/**
 * @api {Asynchronous} Type.retrieve(params,options) Type.retrieve()
 * @apiDescription Retrieve configuration for one content type. You must provide
 either the id|ID|objectId, uuid or the machineName.
 * @apiParam (params) {String} [id] Parse objectId of content type
 * @apiParam (params) {String} [ID] Parse objectId of content type
 * @apiParam (params) {String} [objectId] Parse objectId of content type
 * @apiParam (params) {String} [uuid] UUID of content type
 * @apiParam (params) {String} [machineName] the machine name of the existing content type
 * @apiParam (params) {String} [namespace] optional namespace. Will be used to derive the
  uuid from the machine name if the uuid is not known. By default, the current
  APIs content namespace will be used, and this will not be needed.
 * @apiParam {Object} options Parse query options object
 *
 * @apiName Type.retrieve
 * @apiGroup Actinium
 */
Type.retrieve = async (params, options) => {
    const id = op.get(
        params,
        'id',
        op.get(params, 'ID', op.get(params, 'objectId')),
    );
    const machineName = op.get(params, 'machineName');
    const namespace = op.get(params, 'namespace', getNamespace());
    const uuid = machineName
        ? uuidv5(machineName, namespace)
        : op.get(params, 'uuid');

    if (!id && !uuid)
        throw new Error('id, uuid or machineName parameter required.');

    const query = new Parse.Query(COLLECTION);
    if (id) query.equalTo('objectId', id);
    if (uuid) query.equalTo('uuid', uuid);

    const contentType = await query.first(options);

    if (!contentType) throw new Error('Unable to find type.');
    const result = serialize(contentType);

    await Actinium.Hook.run('type-retrieved', result);
    return result;
};

/**
 * @api {Asynchronous} Type.getCollection(params,options) Type.getCollection()
 * @apiDescription Get collection of a content type. You must provide
 either the id|ID|objectId, uuid or the machineName.
 * @apiParam (params) {String} [id] Parse objectId of content type
 * @apiParam (params) {String} [ID] Parse objectId of content type
 * @apiParam (params) {String} [objectId] Parse objectId of content type
 * @apiParam (params) {String} [uuid] UUID of content type
 * @apiParam (params) {String} [machineName] the machine name of the existing content type
 * @apiParam (params) {String} [namespace] optional namespace. Will be used to derive the
  uuid from the machine name if the uuid is not known. By default, the current
  APIs content namespace will be used, and this will not be needed.
 * @apiParam {Object} options Parse query options object
 *
 * @apiName Type.getCollection
 * @apiGroup Actinium
 */
Type.getCollection = async params => {
    const typeObj = await Actinium.Type.retrieve(
        params,
        Actinium.Utils.MasterOptions(),
    );
    return op.get(typeObj, 'collection');
};

/**
 * @api {Asynchronous} Type.status(params,options) Type.status()
 * @apiDescription Get content type collection, content count, field slugs.
 * @apiParam (params) {String} [uuid] UUID of content type
 * @apiParam (params) {String} [machineName] the machine name of the existing content type
 * @apiParam (params) {String} [namespace] optional namespace. Will be used to derive the
  uuid from the machine name if the uuid is not known. By default, the current
  APIs content namespace will be used, and this will not be needed.
 * @apiParam {Object} options Parse query options object
 *
 * @apiName Type.status
 * @apiGroup Actinium
 */
Type.status = async (params, options) => {
    const contentType = await Actinium.Type.retrieve(params, options);

    if (!contentType) return { collection: null, count: 0, fields: [] };

    const { collection } = contentType;

    // use master key to get schema
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
};

/**
 * @api {Asynchronous} Type.list(params,options) Type.list()
 * @apiDescription Retrieve a list of the existing content types.
 * @apiName Type.list
 * @apiGroup Actinium
 * @apiParam {Boolean} schema Whether to include the schema object of the Type.
 */
Type.list = async (params, options) => {
    let pages = 0,
        total = 0;

    let { page = 0, limit = 1000, refresh = false } = params;

    page = Math.max(page, 0);
    limit = Math.min(limit, 1000);
    let cacheKey = ['types', page, limit, 'types'];

    let types = page < 1 && !refresh ? Actinium.Cache.get(cacheKey, []) : [];

    if (types.length < 1) {
        const skip = page > 0 ? page * limit - limit : 0;
        const query = new Parse.Query(COLLECTION);

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

        types = types.map(contentType => serialize(contentType));

        // Get schema if specified
        if (op.get(params, 'schema') === true) {
            for (let i = 0; i < types.length; i++) {
                const type = types[i];
                const { schema } = await Actinium.Content.getSchema(type);
                op.set(type, 'schema', schema);
            }
        }

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
};

const ensurePublisher = async typeObj => {
    if (!op.has(typeObj, 'fields.publisher')) {
        op.set(typeObj, 'fields.publisher', {
            fieldId: 'publisher',
            fieldType: 'Publisher',
            fieldName: 'Publish',
            statuses: 'DRAFT,PUBLISHED',
            simple: false,
            region: 'sidebar',
        });
    }
};

Actinium.Hook.register('type-retrieved', async typeObj => {
    await ensurePublisher(typeObj);
});

Actinium.Hook.register('type-list', async result => {
    for (const typeObj of result.types) {
        await ensurePublisher(typeObj);
    }
});

module.exports = Type;
