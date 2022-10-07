const op = require('object-path');
const _ = require('underscore');
const uuidv5 = require('uuid/v5');

const {
    PLUGIN,
    STATUS,
    UNINSTALLED_NAMESPACE,
    DEFAULT_TYPE_REGISTRY,
} = require('./enums');

const SDK = Actinium => {
    const slugify = require(`${ACTINIUM_DIR}/lib/utils/slugify`);
    const serialize = require(`${ACTINIUM_DIR}/lib/utils/serialize`);
    const { Registry } = Actinium.Utils;

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
 * @apiDefine FieldType Field Type configuration
 * @apiParam (field) {String} fieldId (uuid) unique id of field in content type
 * @apiParam (field) {String} fieldName unique name of field in content type, in general becomes slugified column name
for storing the field data.
 * @apiParam (field) {String} fieldType field identifier used in `content-schema-field-types` and `content-schema` hooks,
 describing how the schema should store data submitted for this field using the Content SDK.
 * @apiParam (field) {String} region id of the region where the field will appear in the Content Editor
 */

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
 * @apiParam (params) {Object} fields indexed by fieldId (an uuid), a `field` object. Except for required `fieldId`,
 `fieldName`, `fieldType` and `region` properties, each field object may contain free-form variants
 that aid in the presentation of the editor/configuration of Content Editor.
 e.g. fieldType "Text" has a "defaultValue" property which is used for the Content Editor to display the default value
 in the field editor. fieldType "Publisher" has a boolean "simple" property that changes the behavior of the publishing
 feature in the Content Editor.
 * @apiParam (params) {Object} [meta] largely free-form metadata object associated with this content type.
 Actinium will use this to store the current label of the type.
 * @apiParam {Object} options Parse query options object
 * @apiUse FieldType
 * @apiName Type.create
 * @apiGroup Actinium
 */
    Type.create = async (params, options) => {
        const contentType = new Parse.Object(COLLECTION);

        const type = op.get(params, 'meta.label', op.get(params, 'type'));
        const machineName = slugify(op.get(params, 'machineName', type));
        if (!type) throw new Error('type parameter required.');
        if (!machineName) throw new Error('Invalid machineName provided.');

        const namespace = op.get(params, 'namespace', getNamespace());
        const uuid = uuidv5(String(machineName), namespace);

        const query = new Parse.Query(COLLECTION);
        query.equalTo('uuid', uuid);
        const existing = await query.first(options);
        if (existing)
            throw new Error(
                `Type ${type} is not unique in namespace ${namespace}`,
            );

        const collection = `Content_${machineName}`.replace(
            /[^A-Za-z0-9_]/g,
            '_',
        );

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
 * @apiParam (params) {Object} fields indexed by fieldId (an uuid), a `field` object. Except for required `fieldId`,
 `fieldName`, `fieldType` and `region` properties, each field object may contain free-form variants
 that aid in the presentation of the editor/configuration of Content Editor.
 e.g. fieldType "Text" has a "defaultValue" property which is used for the Content Editor to display the default value
 in the field editor. fieldType "Publisher" has a boolean "simple" property that changes the behavior of the publishing
 feature in the Content Editor.
 * @apiParam (params) {Object} [meta] largely free-form metadata object associated with this content type.
 Actinium will use this to store the current label of the type.
 * @apiUse FieldType
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
        const { fields = {} } = params;
        const type = op.get(params, 'meta.label', op.get(params, 'type'));
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
 * @apiParam (params) {String} [collection] the collection associated with the content type
 * @apiParam (params) {String} [namespace] optional namespace. Will be used to derive the
  uuid from the machine name if the uuid is not known. By default, the current
  APIs content namespace will be used, and this will not be needed.
 * @apiParam {Object} options Parse query options object
 *
 * @apiName Type.retrieve
 * @apiGroup Actinium
 */
    Type.retrieve = async (params, options) => {
        const id = op.get(params, 'id') || op.get(params, 'objectId');

        const machineName = op.get(params, 'machineName');
        const namespace = op.get(params, 'namespace', getNamespace());
        const uuid = machineName
            ? uuidv5(machineName, namespace)
            : op.get(params, 'uuid');
        const collection = op.get(params, 'collection');

        if (!id && !uuid && !collection)
            throw new Error(
                'One of id, uuid, collection or machineName parameters required.',
            );

        const query = new Parse.Query(COLLECTION);
        if (id) query.equalTo('objectId', id);
        if (!id && uuid) query.equalTo('uuid', uuid);
        if (collection) query.equalTo('collection', collection);

        const contentType = await query.first(options);

        if (!contentType) throw new Error('Unable to find type.');
        const result = serialize(contentType);

        if (op.get(params, 'schema', false) === true) {
            const { schema } = await Actinium.Content.getSchema(result);
            op.set(result, 'schema', schema);
        }

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
    Type.list = async (params = {}, options) => {
        let pages = 0,
            total = 0;

        let { page = 0, limit = 1000, refresh = false } = params;

        page = Math.max(page, 0);
        limit = Math.min(limit, 1000);
        let cacheKey = ['types', page, limit, 'types'];

        let types =
            page < 1 && !refresh ? Actinium.Cache.get(cacheKey, []) : [];

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

    /**
 * @api {Asynchronous} Type.register(template) Type.register()
 * @apiDescription Utility for plugin developers to programattically ensure a content type
 definition exists. WARNING: do not use or expose this function to the CLOUD/REST API. Has similar
 object argument to Type.create or Type.update, however type label and machineName are required parameters, and type uuid is not allowed.
 *
 * @apiParam (template) {String} type String label of the content type to programmatically maintain.
 * @apiParam (template) {String} machineName the machine name of the existing content type
 * @apiParam (template) {String} [namespace] optional namespace. Will be used to derive the
  uuid from the machine name. By default, the current
  APIs content namespace will be used, and this will not be needed.
 * @apiParam (template) {Object} regions indexed by region id, this object contains multiple region objects,
 each with the same id ('default' by default), a label, and a slug. Each field
 in the `fields` has a `region` property with the id of the region to which it belongs.
 * @apiParam (template) {Object} fields indexed by fieldId (an uuid), a `field` object. Except for required `fieldId`,
 `fieldName`, `fieldType` and `region` properties, each field object may contain free-form variants
 that aid in the presentation of the editor/configuration of Content Editor.
 e.g. fieldType "Text" has a "defaultValue" property which is used for the Content Editor to display the default value
 in the field editor. fieldType "Publisher" has a boolean "simple" property that changes the behavior of the publishing
 feature in the Content Editor.
 * @apiParam (template) {Object} [meta] largely free-form metadata object associated with this content type.
 Actinium will use this to store the current label of the type.
 * @apiUse FieldType
 *
 * @apiName Type.register
 * @apiGroup Actinium
 */

    Type.validateFields = (fields = {}, regions = {}) => {
        return Object.entries(fields).reduce((valid, [fieldId, field]) => {
            if (!op.has(field, 'fieldId') || fieldId !== field.fieldId) {
                WARN(`Mismatch defining content type fieldId`, { field });
                return valid && false;
            }
            if (!op.has(field, 'fieldType')) {
                WARN(`Missing fieldType defining content type field.`, {
                    field,
                });
                return valid && false;
            }
            if (
                !op.has(field, 'fieldName') ||
                String(field.fieldName).length < 1
            ) {
                WARN(
                    `Missing or invalid fieldName defining content type field.`,
                    {
                        field,
                    },
                );
                return valid && false;
            }
            if (
                !op.has(field, 'region') ||
                _.where(Object.values(regions), { slug: field.region })
                    .length !== 1
            ) {
                WARN(`Missing or invalid region defining content type field.`, {
                    field,
                });
                return valid && false;
            }

            return valid;
        }, true);
    };

    Type.saveSchema = async type => {
        // ignore malformed types
        if (
            type.machineName === 'undefined' ||
            type.collection === 'Content_undefined'
        ) {
            throw new Error('Invalid type');
            return;
        }

        await Actinium.Content.saveSchema(type);

        // content CLP should allow broad access to retrieve content by default
        Actinium.Capability.register(`${type.collection}.retrieve`, {
            allowed: ['anonymous', 'user', 'contributor', 'moderator'],
        });

        // Only admins should be able to escalate permission to retrieve any content
        Actinium.Capability.register(`${type.collection}.retrieveany`);

        // Only admin should be able to escalate cloud create by default
        Actinium.Capability.register(`${type.collection}.createany`);
        // Content creators should be able to create content by default
        Actinium.Capability.register(`${type.collection}.create`, {
            allowed: ['contributor', 'moderator'],
        });

        // Only admin should be able to update collection items by REST by default
        Actinium.Capability.register(`${type.collection}.update`);
        // Only admin should be able to escalate cloud update by default
        Actinium.Capability.register(`${type.collection}.updateany`);

        // Only admin should be able to delete collection items by REST by default
        Actinium.Capability.register(`${type.collection}.delete`);
        // Only admin should be able to escalate cloud delete by default
        Actinium.Capability.register(`${type.collection}.deleteany`);

        const statuses = _.chain(
            op
                .get(type, 'fields.publisher.statuses', 'TRASH,DRAFT,PUBLISHED')
                .split(',')
                .concat(Object.values(STATUS)),
        )
            .uniq()
            .compact()
            .value()
            .forEach(status =>
                Actinium.Capability.register(
                    `${type.collection}.setstatus-${status}`,
                    { allowed: ['contributor', 'moderator'] },
                ),
            );

        // Content creators should be able to publish/unpublish content by default
        Actinium.Capability.register(`${type.collection}.publish`, {
            allowed: ['contributor', 'moderator'],
        });
        Actinium.Capability.register(`${type.collection}.unpublish`, {
            allowed: ['contributor', 'moderator'],
        });
    };

    Type[DEFAULT_TYPE_REGISTRY] = new Registry('machineName');

    Type.register = async (typeTemplate = {}) => {
        const type = op.get(typeTemplate, 'type');
        const machineName = op.get(typeTemplate, 'machineName');
        if (!type || !machineName)
            throw new Error(
                'type label and machineName required for type registration',
                { typeTemplate },
            );

        const regions = op.get(typeTemplate, 'regions', {
            default: {
                id: 'default',
                label: 'Default',
                slug: 'default',
            },
        });

        const fields = op.get(typeTemplate, 'fields', {});
        if (!Type.validateFields(fields, regions))
            throw new Error('Invalid fields for type registration');

        const meta = op.get(typeTemplate, 'meta', {});
        Type[DEFAULT_TYPE_REGISTRY].register(machineName, {
            type,
            machineName,
            regions,
            fields,
            meta,
        });
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

    return Type;
};

module.exports = SDK;
