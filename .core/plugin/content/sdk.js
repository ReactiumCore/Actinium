const schemaTemplate = require('./schema-template');
const slugify = require(`${ACTINIUM_DIR}/lib/utils/slugify`);
const moment = require('moment');
const _ = require('underscore');
const op = require('object-path');
const chalk = require('chalk');
const serialize = require(`${ACTINIUM_DIR}/lib/utils/serialize`);
const equal = require('fast-deep-equal');
const uuidv4 = require('uuid/v4');
const uuidv5 = require('uuid/v5');
const getACL = require(`${ACTINIUM_DIR}/lib/utils/acl`);
const ENUMS = require('./enums');

const Content = { ENUMS };

Content.Log = {};

/**
 * @api {Asynchronous} Content.Log.add(params,options) Content.Log.add()
 * @apiParam {Object} params parameters for log
 * @apiParam {Object} options Parse Query options (controls access)
 * @apiParam (params) {String} [user] Parse user object
 * @apiParam (params) {String} [userId] Parse user object id (alternative)
 * @apiParam (params) {String} contentId objectId of the content
 * @apiParam (params) {String} collection the Parse collection of the content
 * @apiParam (params) {String} changeType the type of change being logged
 * @apiParam (params) {Object} meta meta data for the change log
 * @apiName Content.Log.add
 * @apiGroup Actinium
 */
Content.Log.add = async (params, options) => {
    const userId = op.get(
        params,
        'user.id',
        op.get(params, 'user.objectId', op.get(params, 'userId')),
    );
    const contentId = op.get(params, 'contentId');
    const collection = op.get(params, 'collection');
    const changeType = op.get(params, 'changeType');
    const meta = op.get(params, 'meta', {});

    if (!contentId) throw 'contentId required';
    if (!collection) throw 'collection required';
    if (!changeType) throw 'changeType required';

    if (!(changeType in ENUMS.CHANGES)) throw 'Invalid change type.';

    const change = new Actinium.Object('Changelog');

    change.set('contentId', contentId);
    change.set('collection', collection);
    change.set('userId', userId);
    change.set('changeType', changeType);
    change.set('meta', meta);

    await change.save(null, options);

    const obj = serialize(change);
    return obj;
};

/**
 * @api {Asynchronous} Content.Log.list(params,options) Content.Log.list()
 * @apiParam {Object} params parameters for log
 * @apiParam {Object} options Parse Query options (controls access)
 * @apiParam (params) {String} [orderBy=createdAt] Field to order the results by.
 * @apiParam (params) {String} [direction=descending] Order "descending" or "ascending"
 * @apiParam (params) {Number} [page=1] Limit page results
 * @apiParam (params) {Number} [limit=50] Limit page results
 * @apiParam (params) {String} [userId] Parse user object id (alternative)
 * @apiParam (params) {String} [contentId] objectId of the content
 * @apiParam (params) {String} [collection] the Parse collection of the content
 * @apiParam (params) {String} [changeType] the type of change being logged
 * @apiName Content.Log.list
 * @apiGroup Actinium
 */
Content.Log.list = async (params, options) => {
    const page = Math.max(op.get(params, 'page', 1), 1);
    const limit = Math.min(op.get(params, 'limit', 50), 50);
    const skip = page * limit - limit;

    const orderBy = op.get(params, 'orderBy', 'updatedAt');
    let direction = op.get(params, 'direction', 'descending');
    const directions = ['ascending', 'descending'];
    if (!directions.includes(direction)) direction = 'descending';

    const userId = op.get(params, 'userId');
    const collection = op.get(params, 'collection');
    const contentId = op.get(params, 'contentId');
    const changeType = op.get(params, 'changeType');

    const qry = new Parse.Query('Changelog');
    if (contentId) qry.equalTo('contentId', contentId);
    if (collection) qry.equalTo('collection', collection);
    if (changeType) qry.equalTo('changeType', changeType);
    if (userId) qry.equalTo('userId', userId);

    const count = await qry.count(options);

    qry[direction](orderBy)
        .limit(limit)
        .skip(skip);

    const pages = Math.ceil(count / limit);
    const next = page + 1 <= pages ? page + 1 : null;
    const prev = page - 1 > 0 && page <= pages ? page - 1 : null;
    const results = await qry.find(options);

    return {
        count,
        next,
        page,
        pages,
        prev,
        results: results.map(item => serialize(item)),
    };
};

Content.initFieldSchemaTypes = async () => {
    /**
     * @api {Hook} content-schema-field-types content-schema-field-types
     * @apiDescription Hook called during content type schema creation/updates.
     Useful for defining Parse column type mapping for a given custom field type.
     Only use the hook if you intend to create a new field type to store content.
     Any Parse column type can be used (e.g. Boolean, String, Number, Date, Object, Array, etc.)
     You **must** implement this hook if you wish to store content in a custom column in
     your content type, otherwise, you can tried your custom field as content type specific configuration.
     * @apiParam {Object} fieldTypes pass by reference of the current field type mappings.
     * @apiName content-schema-field-types
     * @apiGroup Hooks
     * @apiExample Usage
Actinium.Hook.register('content-schema-field-types', async fieldTypes => {
    // If Content Type is created with one or more fields of fieldType 'MyCustomType'
    // a column in your content collection of type "Object" will be created.
    fieldTypes['MyCustomType'] = { type: 'Object' };
})
     */
    await Actinium.Hook.run(
        'content-schema-field-types',
        schemaTemplate.fieldTypes,
    );
};

Content.saveSchema = async contentTypeObj => {
    const {
        collection,
        permissions,
        schema,
        indexes,
    } = await Content.getSchema(contentTypeObj);

    Actinium.Collection.register(collection, permissions, schema, indexes);
};

Content.getSchema = async contentTypeObj => {
    const typeId = op.get(
        contentTypeObj,
        'objectId',
        op.get(contentTypeObj, 'id'),
    );

    if (!typeId) throw new Error('Invalid content type.');

    const options = { useMasterKey: true };
    await Content.initFieldSchemaTypes();

    let type = new Actinium.Object('Type');
    type.id = typeId;
    type = await type.fetch(options);

    if (type) {
        const typeObj = serialize(type);
        const { collection, machineName, fields } = typeObj;
        const registrationConfig = {
            schema: {
                ...schemaTemplate.schema,
            },
            permissions: {
                ...schemaTemplate.permissions,
            },
            indexes: [...schemaTemplate.indexes],
        };

        /**
         * @api {Hook} content-schema content-schema
         * @apiDescription Hook called during content type schema creation/updates.
         Useful for changing default base fields/columns that will be created for one
         or more content types.
         * @apiParam {Object} schema pass by reference base schema (not including those provided by Type fields).
         * @apiParam {String} machineName machine name of the type.
         * @apiName content-schema
         * @apiGroup Hooks
         * @apiExample Usage
    Actinium.Hook.register('content-schema', async (schema, machineName) => {
        if (machineName === 'my_custom_type') {
            // retrieve the type
            const type = await Actinium.Type.retrieve({
                machineName,
            }, { useMasterKey: true });

            // find any fields of fieldType: "Pointer"
            const fields = Object.values(fields)
            .filter(field => field.fieldType === 'Pointer')
            .map(field => {
                field.fieldSlug = Actinium.Utils.slugify(field.fieldName);
                return field;
            })

            // create one or more custom Parse pointer fields, based on the
            // type configuration
            for (const field of fields) {
                if (field.targetClass) {
                    schema[field.fieldSlug] = {
                        type: 'Pointer',
                        targetClass: field.targetClass
                    };
                }
            }
        }
    })
         */
        await Actinium.Hook.run(
            'content-schema',
            registrationConfig.schema,
            machineName,
        );

        const schema = registrationConfig.schema;

        const sample = await new Parse.Query(collection).first(options);
        let sampleObj = {};
        if (sample) sampleObj = serialize(sample);

        const ParseSchema = new Parse.Schema(collection);
        const allFields = Object.values(fields).map(field => {
            field.fieldSlug = slugify(field.fieldName);
            return field;
        });
        const permittedFields = _.indexBy(allFields, 'fieldSlug');

        // Remove fields that have been removed from schema
        // destructive operation
        let existingSchema;
        try {
            existingSchema = await ParseSchema.get(options);
            const requiredFields = [
                'objectId',
                'createdAt',
                'updatedAt',
                'ACL',
            ].concat(Object.keys(schemaTemplate.schema));
            // console.log({ requiredFields, permittedFields, existing: Object.keys(existingSchema.fields)});
            for (const name of Object.keys(existingSchema.fields)) {
                if (requiredFields.includes(name)) continue;
                if (!op.has(permittedFields, [name])) {
                    schema[name] = { delete: true };
                }
            }
        } catch (error) {}

        for (const { fieldType, fieldName, fieldSlug } of allFields) {
            // skip if already defined above (for deletion)
            if (fieldSlug in schema) continue;

            // Parse fieldType is known to Actinium (plugins implement 'content-schema-field-types' hook)
            if (fieldType in schemaTemplate.fieldTypes) {
                const allExistingFieldSchemas = (existingSchema || {}).fields;
                const existingFieldSchema = op.get(
                    Object.assign({}, allExistingFieldSchemas || {}),
                    [fieldSlug],
                    {},
                );

                const {
                    type: existingType,
                    targetClass: existingTargetClass,
                } = existingFieldSchema;
                const {
                    type: proposedType,
                    targetClass: proposedTargetClass,
                } = schemaTemplate.fieldTypes[fieldType];

                // allow field schema set/update if any of these are true
                const fieldCheck = {
                    // 1. no content yet saved to this content type (create/update)
                    noContent: !sample,

                    // 2. this column doesn't appear to exist yet
                    noDataInField: !(fieldSlug in sampleObj),

                    // 3. the field schema is unchanged
                    fieldSchemaUnchanged:
                        existingType === proposedType &&
                        existingTargetClass === proposedTargetClass,
                };

                if (
                    fieldCheck.noContent ||
                    fieldCheck.noDataInField ||
                    fieldCheck.fieldSchemaUnchanged
                ) {
                    schema[fieldSlug] = schemaTemplate.fieldTypes[fieldType];
                } else {
                    WARN(
                        chalk.cyan('Warning:'),
                        `Cannot change field type schema on existing field ${fieldSlug} for content type ${machineName}.`,
                    );
                    if (existingFieldSchema)
                        schema[fieldSlug] = existingFieldSchema;
                }
            }
        }

        /**
         * @api {Hook} content-schema-permissions content-schema-permissions
         * @apiDescription Hook called during content type schema creation/updates.
         Useful for changing default permissions used during `Actinium.Collection.register()` for
         content schemas only. Governs the creation and maintenance, of the Class Level Permissions
         of a content collection. By default, all actions are private but `retrieve`.
         Because this is content, the assumption is that unless otherwise specified, you would
         like the content to be publicly readable.
         Note that content can **may** still be restricted by individual object Access Control List,
         (if using Parse REST api) or additional capability check (if using Actinium.Cloud functions),
         even if the CLP allows public retrieve.
         * @apiParam {Object} permissions pass by reference of the permission defaults.
         * @apiParam {String} machineName machine name of the type.
         * @apiName content-schema-permissions
         * @apiGroup Hooks
         * @apiExample Usage
Actinium.Hook.register('content-schema-permissions', async (permissions, machineName) => {
    if (machineName === 'my_sensitive_content') {
        // public create (like an anonymous contact form submission)
        permissions['create'] = true;

        // not publicly readable, unless logged in / escalated user
        permissions['retrieve'] = false;
    }
})
         */
        await Actinium.Hook.run(
            'content-schema-permissions',
            registrationConfig.permissions,
            machineName,
        );

        /**
     * @api {Hook} content-schema-indexes content-schema-indexes
     * @apiDescription Hook called during content type schema creation/updates.
     Useful for changing/adding which database indexes will be created by
     `Actinium.Collection.register()` for your content type schema.
     * @apiParam {Object} indexes pass by reference of the index configuration
     * @apiParam {String} machineName machine name of the type.
     * @apiName content-schema-field-types
     * @apiGroup Hooks
     * @apiExample Usage
Actinium.Hook.register('content-schema-indexes', async (indexes, machineName) => {
    if (machineName = 'my_custom_type') {
        // index the "slug" column in my type.
        indexes.push('slug');
    }
})
     */
        await Actinium.Hook.run(
            'content-schema-indexes',
            registrationConfig.indexes,
            machineName,
        );

        return {
            collection,
            ...registrationConfig,
            existingSchema,
            permittedFields,
        };
    }
};

/**
 * @api {Asynchronous} Content.sanitize(content) Content.sanitize()
 * @apiDescription Based on content provided, will return array of sanitized content fields
 based on the field types in the content type. (Array of `{fieldSlug, fieldValue}`)
 * @apiParam {Object} params params data to sanitize
 * @apiParam {ActiniumObject} object the Actinium.Object to be saved
 * @apiParam (params) {Object} type The Type object of the content.
 * @apiName Content.sanitize
 * @apiGroup Actinium
 */
Content.sanitize = async (params, object) => {
    const { type } = params;

    const { existingSchema, permittedFields } = await Content.getSchema(type);
    const fieldConfigs = permittedFields;

    const fieldData = _.indexBy(
        Object.entries(params)
            .map(([fieldName, fieldValue]) => ({
                fieldSlug: slugify(fieldName),
                fieldValue,
            }))

            // only custom fields in schema
            .filter(({ fieldSlug }) => {
                return (
                    fieldSlug in permittedFields &&
                    fieldSlug in op.get(existingSchema, 'fields', {})
                );
            }),
        'fieldSlug',
    );

    for (const [fieldSlug, field] of Object.entries(fieldData)) {
        const fieldConfig = fieldConfigs[fieldSlug];

        /**
         * @api {Hook} content-field-sanitize content-field-sanitize
         * @apiDescription Triggered during `Content.sanitize()` (content creation / updates).
         Used to sanitize data into sane fieldSlug=>fieldValue key pairs, which
         will be set on content object. Useful for normalizing data before it is
         stored in Parse column. Note this will only be called for fields that
         have a defined schema. See `content-schema-field-types`.
         * @apiParam {Object} params the params object passed to the hook
         * @apiParam (params) {Object} field `{fieldSlug, fieldValue}` the key-pair for this field
         * @apiParam (params) {Object} fieldConfig the configuration of this field (including `fieldType`) stored in the type
         * @apiParam (params) {Object} fieldData object of all permitted field data, indexed by fieldSlug.
         * @apiParam (params) {Object} params object passed to `Content.sanitize()`
         * @apiParam (params) {Object} fieldSchema The schema of the field in DB
         * @apiParam (params) {Object} fullSchema The full schema of all fields in DB
         * @apiParam (params) {Object} permittedFields Field types that are registered for schema.
         * @apiParam (params) {ActiniumObject} object the Actinium.Object to be saved
         * @apiName content-field-sanitize
         * @apiGroup Hooks
         */
        await Actinium.Hook.run('content-field-sanitize', {
            field,
            fieldConfig,
            fieldData,
            params,
            fieldSchema: op.get(existingSchema, ['fields', field.fieldSlug]),
            fullSchema: existingSchema, // full schema
            permittedFields,
            object,
        });
    }

    if (op.has(params, 'meta') && typeof params.meta === 'object') {
        object.set('meta', params.meta);
    }

    return Object.values(fieldData);
};

/**
 * @api {Asynchronous} Content.createBranch(content,type,branch,options) Content.createBranch()
 * @apiDescription Create a new revision branch based on the current revision of some content.
 Returns new branches and fresh history objects.
 * @apiParam {Object} content A specific version of your content.
 * @apiParam {Object} type The Type object of the content.
 * @apiParam {String} [branch=master] the new branch name. If not provided or already taken, will be generated uuid.
 * @apiParam {Object} options Parse Query options (controls access)
 * @apiName Content.createBranch
 * @apiGroup Actinium
 */
Content.createBranch = async (
    content,
    type,
    branch,
    branchLabel = 'Master',
    options,
) => {
    const masterOptions = Actinium.Utils.MasterOptions(options);
    content = serialize(content);
    type = serialize(type);

    if (!branch || op.has(content, ['branches', branch])) branch = uuidv4();
    if (!branchLabel && branch !== 'master') branchLabel = 'Unlabeled';

    const branches = op.get(content, 'branches', {});
    op.set(branches, [branch, 'label'], branchLabel);
    op.set(branches, [branch, 'history'], []);

    const currentBranchId = op.get(content, 'history.branch');
    const currentRevisionIndex = op.get(content, 'history.revision');

    const user = await Actinium.Utils.UserFromSession(
        op.get(options, 'sessionToken'),
    );

    // get current revision id in case we tagging existing base revision
    let revisionId = op.get(content, [
        'branches',
        currentBranchId,
        'history',
        currentRevisionIndex,
    ]);

    // need to create new base revision for this branch
    if (currentRevisionIndex !== 0) {
        const revObj = {
            collection: op.get(type, 'collection'),
            object: serialize(content),
        };

        const revision = await Actinium.Recycle.revision(revObj, options);
        revisionId = revision.id;
    }

    op.set(branches, [branch, 'history'], [revisionId]);
    const history = { branch, revision: 0 };

    if (op.get(content, 'objectId')) {
        await Actinium.Content.Log.add(
            {
                contentId: op.get(content, 'objectId'),
                collection: op.get(type, 'collection'),
                userId: op.get(user, 'id'),
                changeType: ENUMS.CHANGES.CREATED_BRANCH,
                meta: {
                    uuid: op.get(content, 'uuid'),
                    slug: op.get(content, 'slug'),
                    type: op.get(type, 'type'),
                    branch: op.get(branches, op.get(history, 'branch'), {}),
                    history,
                },
            },
            masterOptions,
        );
    }

    return { branches, history };
};

/**
 * @api {Asynchronous} Content.labelBranch(params,options) Content.labelBranch()
 * @apiDescription Clone a branch / specific region as a new branch.
 * @apiParam {Object} params parameters for content
 * @apiParam {Object} options Parse Query options (controls access)
 * @apiParam (params) {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam (params) {Object} branchLabel New branch label.
 * @apiParam (params) {Boolean} [current=false] When true, get the currently committed content (not from revision system).
 otherwise, construct the content from the provided history (branch and revision index).
 * @apiParam (params) {Object} [history] revision history to retrieve, containing branch and revision index.
 * @apiParam (params) {String} [slug] The unique slug for the content.
 * @apiParam (params) {String} [objectId] The objectId for the content.
 * @apiParam (params) {String} [uuid] The uuid for the content.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (history) {String} [branch=master] the revision branch of current content
 * @apiName Content.labelBranch()
 * @apiGroup Actinium
 */
Content.labelBranch = async (params, options) => {
    const masterOptions = Actinium.Utils.MasterOptions(options);
    const contentObj = await Actinium.Content.retrieve(params, options);
    if (!contentObj) throw 'Unable to find content';
    const typeObj = await Actinium.Type.retrieve(params.type, masterOptions);

    const branches = op.get(contentObj, 'branches');
    const branchLabel = op.get(params, 'branchLabel');
    const branch = op.get(contentObj, 'history.branch');

    if (!branchLabel) throw 'branchLabel required';
    op.set(branches, [branch, 'label'], branchLabel);

    const content = new Actinium.Object(op.get(typeObj, 'collection'));
    content.id = contentObj.objectId;
    content.set('branches', branches);
    await content.save(null, options);

    const userId = op.get(
        params,
        'user.objectId',
        op.get(params, 'user.id', op.get(params, 'userId')),
    );

    await Actinium.Content.Log.add(
        {
            contentId: contentObj.objectId,
            collection: typeObj.collection,
            userId,
            changeType: ENUMS.CHANGES.LABELED_BRANCH,
            meta: {
                uuid: op.get(contentObj, 'uuid'),
                slug: op.get(contentObj, 'slug'),
                type: op.get(typeObj, 'type'),
                branchLabel,
                branch: op.get(branches, branch),
            },
        },
        masterOptions,
    );

    await Actinium.Hook.run(
        'content-branch-label',
        contentObj,
        typeObj,
        params,
    );
    return contentObj;
};

/**
 * @api {Asynchronous} Content.deleteBranch(params,options) Content.deleteBranch()
 * @apiDescription Delete a branch and mark its revisions for deletion.
 * @apiParam {Object} params parameters for content
 * @apiParam {Object} options Parse Query options (controls access)
 * @apiParam (params) {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam (params) {Boolean} [current=false] When true, get the currently committed content (not from revision system).
 otherwise, construct the content from the provided history (branch and revision index).
 * @apiParam (params) {Object} [history] revision history to retrieve, containing branch and revision index.
 * @apiParam (params) {String} [slug] The unique slug for the content.
 * @apiParam (params) {String} [objectId] The objectId for the content.
 * @apiParam (params) {String} [uuid] The uuid for the content.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (history) {String} [branch=master] the revision branch of current content
 * @apiName Content.deleteBranch()
 * @apiGroup Actinium
 */
Content.deleteBranch = async (params, options) => {
    const masterOptions = Actinium.Utils.MasterOptions(options);
    const contentObj = await Actinium.Content.retrieve(params, options);
    if (!contentObj) throw 'Unable to find content';
    const typeObj = await Actinium.Type.retrieve(params.type, masterOptions);

    const branches = op.get(contentObj, 'branches');
    const originalBranches = { ...branches };
    const branch = op.get(contentObj, 'history.branch');
    if (branch === 'master') throw 'master branch cannot be deleted';

    // all revisions in other branches
    const otherRevs = _.chain(
        Object.entries(branches)
            .map(([id, value]) => ({ ...value, id }))
            .filter(({ id }) => id !== branch),
    )
        .pluck('history')
        .flatten()
        .uniq()
        .value();

    // all revisions not in use by another branch
    const revs = op
        .get(branches, [branch, 'history'], [])
        .filter(rev => !otherRevs.includes(rev));

    const content = new Actinium.Object(op.get(typeObj, 'collection'));
    content.id = contentObj.objectId;
    op.del(branches, [branch]);
    content.set('branches', branches);
    await content.save(null, options);

    const revisions = revs.map(objectId => {
        const rev = new Actinium.Object('Recycle');
        rev.id = objectId;
        rev.set('type', 'trash');
        return rev;
    });

    const trashedRevs = await Actinium.Object.saveAll(revisions, masterOptions);

    const userId = op.get(
        params,
        'user.objectId',
        op.get(params, 'user.id', op.get(params, 'userId')),
    );

    await Actinium.Content.Log.add(
        {
            contentId: contentObj.objectId,
            collection: typeObj.collection,
            userId,
            changeType: ENUMS.CHANGES.DELETED_BRANCH,
            meta: {
                uuid: op.get(contentObj, 'uuid'),
                slug: op.get(contentObj, 'slug'),
                type: op.get(typeObj, 'type'),
                branch: op.get(originalBranches, branch, {}),
                trashedRevs,
            },
        },
        masterOptions,
    );

    await Actinium.Hook.run(
        'content-branch-deleted',
        contentObj,
        typeObj,
        params,
        trashedRevs,
    );

    return contentObj;
};

/**
 * @api {Asynchronous} Content.cloneBranch(params,options) Content.cloneBranch()
 * @apiDescription Clone a branch / specific revision as a new branch.
 * @apiParam {Object} params parameters for content
 * @apiParam {Object} options Parse Query options (controls access)
 * @apiParam (params) {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam (params) {Object} branchLabel New branch label.
 * @apiParam (params) {Boolean} [current=false] When true, get the currently committed content (not from revision system).
 otherwise, construct the content from the provided history (branch and revision index).
 * @apiParam (params) {Object} [history] revision history to retrieve, containing branch and revision index.
 * @apiParam (params) {String} [slug] The unique slug for the content.
 * @apiParam (params) {String} [objectId] The objectId for the content.
 * @apiParam (params) {String} [uuid] The uuid for the content.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (history) {String} [branch=master] the revision branch of current content
 * @apiName Content.cloneBranch()
 * @apiGroup Actinium
 */
Content.cloneBranch = async (params, options) => {
    const masterOptions = Actinium.Utils.MasterOptions(options);
    const branchLabel = op.get(params, 'branchLabel');
    if (!branchLabel) throw 'branchLabel required';

    const contentObj = await Actinium.Content.retrieve(params, options);

    let newBranchId = op.get(params, 'newBranchId', null);
    if (newBranchId in op.get(contentObj, 'branches', {}))
        newBranchId = uuidv4();

    if (!contentObj) throw 'Unable to find content';
    const typeObj = await Actinium.Type.retrieve(params.type, masterOptions);

    const { branches, history } = await Content.createBranch(
        contentObj,
        typeObj,
        newBranchId,
        branchLabel,
        options,
    );

    const content = new Actinium.Object(op.get(typeObj, 'collection'));
    content.id = contentObj.objectId;
    content.set('branches', branches);
    await content.save(null, options);

    op.set(contentObj, 'branches', branches);
    op.set(contentObj, 'history', history);

    await Actinium.Hook.run(
        'content-clone-branch',
        contentObj,
        typeObj,
        params,
    );

    return contentObj;
};

/**
 * @api {Asynchronous} Content.diff(content,changes) Content.diff()
 * @apiDescription Compares content object to proposed changes, and returns difference.
 * @apiParam {Object} content your content object
 * @apiParam {Object} changes proposed changes to the content
 * @apiName Content.diff
 * @apiGroup Actinium
 */
Content.diff = async (contentObj, changes) => {
    const diff = {};

    for (const { fieldSlug, fieldValue } of changes) {
        // console.log({fieldSlug, fieldValue});
        if (!equal(op.get(contentObj, fieldSlug), fieldValue)) {
            op.set(diff, fieldSlug, fieldValue);
        }
    }

    const title = op.get(changes, 'title');
    if (title && op.get(contentObj, 'title') !== title) {
        op.set(diff, 'title', title);
    }

    // No changes
    if (Object.keys(diff).length < 1) return false;

    // Stuff from top-level content object
    op.set(diff, 'objectId', contentObj.objectId);
    op.set(diff, 'history', contentObj.history);
    op.set(diff, 'branches', contentObj.branches);

    // Remove these things to cut down noise in diff
    op.del(diff, 'status');
    op.del(diff, 'slug');
    op.del(diff, 'uuid');

    return diff;
};

/**
 * @api {Asynchronous} Content.revision(params,options) Content.revision()
 * @apiDescription Retrieve branch history of some content.
 * @apiParam {Object} params parameters for content
 * @apiParam {Object} options Parse Query options (controls access)
 * @apiParam (params) {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam (params) {Boolean} [current=false] When true, get the currently committed content (not from revision system).
 otherwise, construct the content from the provided history (branch and revision index).
 * @apiParam (params) {Object} [history] revision history to retrieve, containing branch and revision index.
 * @apiParam (params) {String} [slug] The unique slug for the content.
 * @apiParam (params) {String} [objectId] The objectId for the content.
 * @apiParam (params) {String} [uuid] The uuid for the content.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (history) {String} [branch=master] the revision branch of current content
 * @apiName Content.revision()
 * @apiGroup Actinium
 */
Content.revisions = async (params, options) => {
    const masterOptions = Actinium.Utils.MasterOptions(options);
    const contentObj = await Actinium.Content.retrieve(params, options);
    if (!contentObj) throw 'Unable to find content';

    const typeObj = await Actinium.Type.retrieve(params.type, masterOptions);

    const branch = op.get(contentObj, 'history.branch');
    const history = op.get(contentObj, ['branches', branch, 'history'], []);

    const revisions = await Actinium.Object.fetchAll(
        history.map(id => {
            const rev = new Actinium.Object('Recycle');
            rev.id = id;
            return rev;
        }),
        options,
    );

    const byRevId = _.indexBy(
        revisions.map(rev => serialize(rev)),
        'objectId',
    );
    const baseId = history[0];
    const base = op.get(byRevId, [baseId, 'object'], {});

    const revObjs = Object.values(byRevId).map(rev => {
        const changes = {
            ...op.get(rev, 'object', {}),
        };
        const revId = op.get(rev, 'objectId');

        op.del(changes, 'objectId');
        op.del(changes, 'slug');
        op.del(changes, 'type');
        op.del(changes, 'user');
        op.del(changes, 'title');
        op.del(changes, 'uuid');
        op.del(changes, 'ACL');
        op.del(changes, 'status');
        op.del(changes, 'history');
        op.del(changes, 'branches');
        op.del(changes, 'createdAt');
        op.del(changes, 'updatedAt');

        return {
            revId,
            changes,
            createdAt: op.get(rev, 'createdAt'),
            updatedAt: op.get(rev, 'updatedAt'),
        };
    });

    const response = {
        base: { ...base, revId: baseId },
        revisions: revObjs,
        branch,
    };

    await Actinium.Hook.run('content-revisions', response, contentObj, typeObj);

    return response;
};

/**
 * @api {Asynchronous} Content.getVersion(content,branch,revision,options) Content.getVersion()
 * @apiDescription Given a content object, fetch a specific revision of that content.
 * @apiParam {Object} content your content object
 * @apiParam {String} [branch=master] the revision branch of current content
 * @apiParam {Number} [revision] index in branch history to retrieve (default latest)
 * @apiParam {Object} options Parse Query options (controls access)
 * @apiName Content.getVersion
 * @apiGroup Actinium
 */
Content.getVersion = async (contentObj, branch, revisionIndex, options) => {
    if (!op.has(contentObj, ['branches', branch]))
        throw 'No such branch in history';

    const history = op.get(contentObj, ['branches', branch, 'history'], []);

    const range = [0];
    if (typeof revisionIndex !== 'undefined' && revisionIndex < history.length)
        range.push(revisionIndex + 1);
    if (!history.length) throw 'No revision history in branch';

    const revisionIds = history.slice(...range);

    const revisions = await Actinium.Object.fetchAll(
        revisionIds.map(id => {
            const rev = new Actinium.Object('Recycle');
            rev.id = id;
            return rev;
        }),
        options,
    );

    const revsById = _.indexBy(revisions, 'id');
    let version = { ...contentObj };
    revisionIds.forEach(id => {
        const rev = serialize(op.get(revsById, [id]));
        version = {
            ...version,
            ...op.get(rev, 'object', {}),
        };
    });

    // Things that are always references to top-level record
    // regardless of revision selected
    version.objectId = contentObj.objectId;
    version.title = contentObj.title;
    version.slug = contentObj.slug;
    version.status = contentObj.status;
    version.uuid = contentObj.uuid;
    version.branches = contentObj.branches;
    version.history = {
        branch,
        revision: revisionIds.length - 1,
    };
    version.publish = contentObj.publish;
    version.createdAt = contentObj.createdAt;
    version.updatedAt = contentObj.updatedAt;

    return version;
};

/**
 * @api {Asynchronous} Content.list(params,options) Content.list()
 * @apiDescription Get list of content of a specific Type.
 * @apiParam {Object} params parameters for content
 * @apiParam {Object} options Parse Query options (controls access)
 * @apiParam (params) {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam (params) {Boolean} [refresh=false] skip cache check when true
 * @apiParam (params) {Boolean} [optimize=false] if optimize is true, and collection contains
less than 1000 records, the entire set will be delivered in one page for application-side pagination.
 * @apiParam (params) {String} [status] "PUBLISHED" or "DRAFT", or other custom status of the content
 * @apiParam (params) {String} [orderBy=updatedAt] Field to order the results by.
 * @apiParam (params) {String} [order=descending] Order "descending" or "ascending"
 * @apiParam (params) {String} [indexBy] Out put the results as an {Object} indexed by the specified collection field.
 * @apiParam (params) {Number} [limit=20] Limit page results
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiName Content.list
 * @apiGroup Actinium
 * @apiExample Usage
Actinium.Content.list({
    "type": {
        "machineName": "article"
    },
    "orderBy":"title",
    "direction": "ascending",
    "limit": 1,
    "status": "DRAFT"
});
 */
Content.list = async (params, options) => {
    const masterOptions = Actinium.Utils.MasterOptions(options);
    const collection = await Actinium.Type.getCollection(
        params.type,
        masterOptions,
    );

    let page = Math.max(op.get(params, 'page', 1), 1);
    let limit = Math.min(op.get(params, 'limit', 20), 1000);
    const optimize = op.get(params, 'optimize', false);
    const refresh = op.get(params, 'refresh', false);
    const indexBy = op.get(params, 'indexBy');
    const orderBy = op.get(params, 'orderBy', 'updatedAt');
    const orders = ['ascending', 'descending'];
    let order = op.get(
        params,
        'order',
        op.get(params, 'direction', 'descending'),
    );
    order = !orders.includes(order) ? 'descending' : order;

    const qry = new Parse.Query(collection);
    const status = op.get(params, 'status');
    if (status) qry.equalTo('status', status);
    else qry.notEqualTo('status', ENUMS.STATUS.TRASH);

    const count = await qry.count(options);
    if (optimize && count <= 1000) {
        page = 1;
        limit = 1000;
    }

    const cacheKey = [
        `content-${collection}`,
        _.compact([limit, page, order, orderBy, status]).join('_'),
    ];

    let response = Actinium.Cache.get(cacheKey);
    if (response && !refresh) return response;

    const skip = page * limit - limit;

    qry[order](orderBy)
        .limit(limit)
        .skip(skip);

    /**
     * @api {Hook} content-query content-query
     * @apiDescription Called before a content query has taken place via Content.list() function.
     * @apiParam {Array} query Actinium Query object
     * @apiParam {Object} params The request.params object
     * @apiParam {Object} options The request options object
     * @apiName content-query
     * @apiGroup Hooks
     */
    await Actinium.Hook.run('content-query', qry, params, options);

    const pages = Math.ceil(count / limit);
    const next = page + 1 <= pages ? page + 1 : null;
    const prev = page - 1 > 0 && page <= pages ? page - 1 : null;
    const results = await qry.find(options);

    /**
     * @api {Hook} content-query-results content-query-results
     * @apiDescription Called after a content query has taken place via Content.list() function.
     * @apiParam {Array} results Array of Actinium Objects
     * @apiParam {Object} params The request.params object
     * @apiParam {Object} options The request options object
     * @apiName content-query-results
     * @apiGroup Hooks
     */
    await Actinium.Hook.run('content-query-results', results, params, options);

    response = {
        count,
        next,
        page,
        pages,
        prev,
        limit,
        order,
        orderBy,
        indexBy,
        results: results.map(item => serialize(item)),
    };

    if (indexBy) {
        op.set(response, 'results', _.indexBy(response.results, indexBy));
    }

    Actinium.Cache.set(cacheKey, response, ENUMS.CACHE);

    /**
     * @api {Hook} content-list content-list
     * @apiDescription Called before the response object is return from Content.list()
     * @apiParam {Object} response Response object
     * @apiParam {Object} params The request.params object
     * @apiParam {Object} options The request options object
     * @apiName content-list
     * @apiGroup Hooks
     */
    await Actinium.Hook.run('content-list', response, params, options);

    return response;
};

/**
 * @api {Asynchronous} Content.create(params,options) Content.create()
 * @apiDescription Create new content of a defined Type. In addition to the required parameters of
 `type` and `slug`, you can provide any parameter's that conform to the runtime fields saved for that type.
 * @apiParam {Object} params parameters for content
 * @apiParam {Object} options Parse Query options (controls access)
 * @apiParam (params) {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam (params) {String} slug The unique slug for the new content.
 * @apiParam (params) {String} title The title of the new content.
 * @apiParam (params) {Array} [permissions=Array] List of permissions to apply to content. If not provided, no ACL will be set.
 * @apiParam (params) {ParseUser} [user] User object that created ("owns") the content.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (permission) {Object} permission Read or write
 * @apiParam (permission) {Object} type role or user
 * @apiParam (permission) {Object} [objectId] objectId of user
 * @apiParam (permission) {Object} [name] name of role
 * @apiName Content.create
 * @apiGroup Actinium
 */
Content.create = async (params, options) => {
    const masterOptions = Actinium.Utils.MasterOptions(options);

    // retrieve type
    const typeObj = await Actinium.Type.retrieve(params.type, masterOptions);
    const type = new Actinium.Object('Type');
    type.id = typeObj.objectId;

    // construct content
    const collection = op.get(typeObj, 'collection');
    if (!collection) throw new Error('Invalid type. No collection defined.');
    const content = new Actinium.Object(collection);
    const namespace = op.get(typeObj, 'uuid');

    const title = op.get(params, 'title');
    if (!title) throw new Error('Content title required.');

    // slug check
    const slugs = op.get(typeObj, 'slugs', []) || [];
    let slug = op.get(params, 'slug');
    if (!slug || typeof slug !== 'string')
        throw new Error('Content slug required');
    slug = require('slugify')(slug, {
        lower: true,
    });
    if (slugs.includes(slug)) throw new Error(`Slug ${slug} already taken`);
    type.addUnique('slugs', slug);

    content.set('slug', slug);
    content.set('title', title);
    content.set('type', {
        machineName: typeObj.machineName,
        uuid: typeObj.uuid,
    });
    content.set('uuid', uuidv5(slug, namespace));
    content.set('meta', op.get(params, 'meta', {}));
    content.set('status', ENUMS.STATUS.DRAFT);

    // set ACL
    const permissions = op.get(params, 'permissions', []);
    const groupACL = await Actinium.Utils.CloudACL(
        permissions,
        `${collection}.retrieveAny`, // read
        `${collection}.updateAny`, // write
    );

    if (op.get(params, 'user')) {
        content.set('user', op.get(params, 'user'));
        groupACL.setReadAccess(op.get(params, 'user').id, true);
        groupACL.setWriteAccess(op.get(params, 'user').id, true);
    }
    content.setACL(groupACL);

    const sanitized = await Actinium.Content.sanitize(
        {
            ...params,
            type: typeObj,
        },
        content,
    );

    for (const { fieldSlug, fieldValue } of sanitized) {
        if (fieldSlug && typeof fieldValue !== 'undefined')
            content.set(fieldSlug, fieldValue);
    }

    // Create new revision branch
    const { branches, history } = await Actinium.Content.createBranch(
        content,
        typeObj,
        'master',
        'Master',
        options,
    );

    content.set('branches', branches);
    // only set content history on creation and publishing
    content.set('history', history);

    /**
     * @api {Hook} content-before-save content-before-save
     * @apiDescription Called after content saved with `Content.create()` or `Content.update()`
     * @apiParam {Object} contentObj the Content Actinium.Object
     * @apiParam {Object} typeObj the content Type Actinium.Object
     * @apiParam {Boolean} isNew If the content object is new or existing.
     * @apiParam {Object} params The request.params object.
     * @apiName content-before-save
     * @apiGroup Hooks
     */
    await Actinium.Hook.run(
        'content-before-save',
        content,
        type,
        true,
        params,
        options,
    );

    await content.save(null, options);

    await type.save(null, masterOptions);
    const contentObj = serialize(content);

    const userId = op.get(
        params,
        'user.objectId',
        op.get(params, 'user.id', op.get(params, 'userId')),
    );
    await Actinium.Content.Log.add(
        {
            contentId: contentObj.objectId,
            collection: typeObj.collection,
            userId,
            changeType: ENUMS.CHANGES.CREATED,
            meta: {
                uuid: op.get(contentObj, 'uuid'),
                slug: op.get(contentObj, 'slug'),
                type: op.get(typeObj, 'type'),
                branch: op.get(branches, op.get(history, 'branch'), {}),
                history,
            },
        },
        masterOptions,
    );

    /**
     * @api {Hook} content-saved content-saved
     * @apiDescription Called after content saved with `Content.create()` or `Content.update()`
     * @apiParam {Object} contentObj the saved content object
     * @apiParam {Object} typeObj the type of the content
     * @apiParam {Boolean} isNew If the content object is new or existing.
     * @apiParam {Object} params The request.params object.
     * @apiName content-saved
     * @apiGroup Hooks
     */
    await Actinium.Hook.run(
        'content-saved',
        contentObj,
        typeObj,
        true,
        params,
        options,
    );
    return contentObj;
};

/**
 * @api {Asynchronous} Content.changeSlug(params,options) Content.changeSlug()
 * @apiDescription Update the official slug for existing content. This results in a new uuid.
 * @apiParam {Object} params parameters for content lookup and newSlug
 * @apiParam {Object} options Parse Query options (controls access)
 * @apiParam (params) {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam (params) {String} newSlug The new content slug.
 * @apiParam (params) {String} [slug] The unique slug for the content (for lookup only).
 * @apiParam (params) {String} [objectId] The Parse object id of the content (for lookup only).
 * @apiParam (params) {String} [uuid] The uuid of the content. (for lookup only)
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiName Content.changeSlug
 * @apiGroup Actinium
 */
Content.changeSlug = async (params, options) => {
    const masterOptions = Actinium.Utils.MasterOptions(options);
    const contentObj = await Actinium.Content.retrieve(params, options);
    if (!contentObj) throw 'Unable to find content';

    const typeObj = await Actinium.Type.retrieve(params.type, masterOptions);

    const content = new Actinium.Object(typeObj.collection);
    content.id = contentObj.objectId;
    const { slug: originalSlug, uuid: originalUUID } = contentObj;

    // slug check
    const slugs = _.without(op.get(typeObj, 'slugs', []) || [], originalSlug);
    let slug = op.get(params, 'newSlug');
    if (!slug || typeof slug !== 'string')
        throw new Error('Content slug required');
    slug = require('slugify')(slug, {
        lower: true,
    });
    if (slugs.includes(slug)) throw new Error(`Slug ${slug} already taken`);

    const type = new Actinium.Object('Type');
    type.id = typeObj.objectId;
    await type.fetch(masterOptions);

    type.set(slugs.concat([slug]));

    content.set('slug', slug);
    op.set(contentObj, 'slug', slug);
    const namespace = op.get(typeObj, 'uuid');
    const uuid = uuidv5(slug, namespace);
    content.set('uuid', uuid);
    op.set(contentObj, 'uuid', uuid);

    await content.save(null, options);
    await type.save(null, masterOptions);

    const userId = op.get(
        params,
        'user.objectId',
        op.get(params, 'user.id', op.get(params, 'userId')),
    );
    await Actinium.Content.Log.add(
        {
            contentId: contentObj.objectId,
            collection: typeObj.collection,
            userId,
            changeType: ENUMS.CHANGES.SLUG_CHANGED,
            meta: {
                uuid,
                slug,
                type: op.get(typeObj, 'type'),
                originalSlug,
                originalUUID,
            },
        },
        masterOptions,
    );

    /**
     * @api {Hook} content-slug-changed content-slug-changed
     * @apiDescription Called after slug/uuid changed with `Content.changeSlug()`
     * @apiParam {Object} contentObj the saved content object
     * @apiParam {Object} typeObj the type of the content
     * @apiName content-slug-changed
     * @apiGroup Hooks
     */
    await Actinium.Hook.run('content-slug-changed', contentObj, typeObj);
    return contentObj;
};

/**
 * @api {Asynchronous} Content.retrieve(params,options) Content.retrieve()
 * @apiDescription Retrieve one item of content.
 * @apiParam {Object} params parameters for content
 * @apiParam {Object} options Parse Query options (controls access)
 * @apiParam (params) {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam (params) {Boolean} [current=false] When true, get the currently committed content (not from revision system).
 otherwise, construct the content from the provided history (branch and revision index).
 * @apiParam (params) {Object} [history] revision history to retrieve, containing branch and revision index.
 * @apiParam (params) {String} [slug] The unique slug for the content.
 * @apiParam (params) {String} [objectId] The objectId for the content.
 * @apiParam (params) {String} [uuid] The uuid for the content.
 * @apiParam (params) {Boolean} [attach=false] boolean flag to attach Pointers and Relations.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (history) {String} [branch=master] the revision branch of current content
 * @apiParam (history) {Number} [revision] index in branch history to retrieve
 (default index of latest revision)
 * @apiName Content.retrieve
 * @apiGroup Actinium
 */
Content.retrieve = async (params, options) => {
    const masterOptions = Actinium.Utils.MasterOptions(options);
    // retrieve type
    const typeObj = await Actinium.Type.retrieve(params.type, masterOptions);
    const { schema } = await Actinium.Content.getSchema(typeObj);

    // construct content
    const collection = op.get(typeObj, 'collection');
    if (!collection) throw new Error('Invalid type. No collection defined.');

    const id = op.get(
        params,
        'id',
        op.get(params, 'ID', op.get(params, 'objectId')),
    );
    const uuid = op.get(params, 'uuid');
    const slug = op.get(params, 'slug');

    const query = new Parse.Query(collection);
    if (id) query.equalTo('objectId', id);
    if (uuid) query.equalTo('uuid', uuid);
    if (slug) query.equalTo('slug', slug);

    const relationData = {};
    const pointers = Object.entries(schema).filter(
        ([, fs]) => op.get(fs, 'type') === 'Pointer',
    );
    const relations = Object.entries(schema).filter(
        ([, fs]) => op.get(fs, 'type') === 'Relation',
    );
    // Attach Pointers
    if (op.get(params, 'attach', false) === true) {
        for (const [fieldSlug, fieldSchema] of pointers) {
            query.include(fieldSlug);
        }
    }

    const content = await query.first(options);

    if (op.get(params, 'attach', false) === true) {
        for (const [fieldSlug, fieldSchema] of pointers) {
            content &&
                content.get(fieldSlug) &&
                op.set(
                    relationData,
                    fieldSlug,
                    Actinium.Utils.serialize(content.get(fieldSlug)),
                );
        }
    }

    if (content) {
        const contentObj = serialize(content);

        // Attach Relations
        if (op.get(params, 'attach', false) === true) {
            for (const [fieldSlug, fieldSchema] of relations) {
                const objs = await content
                    .relation(fieldSlug)
                    .query()
                    .find(options);
                op.set(relationData, fieldSlug, objs.map(serialize));
            }
        }

        contentObj['schema'] = schema;

        // if content is published, and published version is requested, return the current content
        if (op.get(params, 'current', false) === true) {
            contentObj['type'] = typeObj;
            const output = {
                ...contentObj,
                ...relationData,
            };

            await Actinium.Hook.run(
                'content-retrieve',
                output,
                params,
                options,
                op.get(params, 'current', false) === true,
            );
            return output;
        }

        // build the current revision
        const branch = op.get(params, 'history.branch', 'master');
        const revisionIndex = op.get(params, 'history.revision');

        const version = await Actinium.Content.getVersion(
            contentObj,
            branch,
            revisionIndex,
            masterOptions,
        );

        version['type'] = typeObj;

        const masterCopyProps = await Actinium.Content.masterCopyProps(
            contentObj,
            schema,
            typeObj,
        );
        const output = {
            ...version,
            ...masterCopyProps,
            ...relationData,
        };

        /**
         * @api {Hook} content-retrieve content-retrieve
         * @apiDescription Called after a content object is retrieved via Content.retrieve() function.
         * @apiParam {Object} contentObject Serialized Actinium Content Object
         * @apiParam {Object} params The request.params object
         * @apiParam {Object} options The request options object
         * @apiParam {Boolean} isCurrent Will be true if this response represents the current full version of the content, or a revision.
         * @apiName content-retrieve
         * @apiGroup Hooks
         */
        await Actinium.Hook.run(
            'content-retrieve',
            output,
            params,
            options,
            op.get(params, 'current', false) === true,
        );

        return output;
    }
};

/**
 * @api {Asynchronous} Content.setCurrent(params,options) Content.setCurrent()
 * @apiDescription Take content from a specified branch or revision,
 and make it the "official" version of the content. If no `history` is param is
 specified the latest master branch revision will be used.
 * @apiParam {Object} params parameters for content
 * @apiParam {Object} options Parse Query options (controls access)
 * @apiParam (params) {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam (params) {String} [slug] The unique slug for the content.
 * @apiParam (params) {String} [objectId] The Parse object id of the content.
 * @apiParam (params) {String} [uuid] The uuid of the content.
 * @apiParam (params) {Object} [history] revision history to retrieve, containing branch and revision index.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (history) {String} [branch=master] the revision branch of current content
 * @apiParam (history) {Number} [revision] index in branch history to update (defaults to most recent in branch).
 * @apiName Content.setCurrent
 * @apiGroup Actinium
 * @apiExample Usage
Actinium.Content.setCurrent({
    // Type object required to look up content
    // i.e. the collection is determined by the parent Type
    type: {
        // one of these 3 required to look up content
        objectId: 'MvAerDoRQN',
        machineName: 'article',
        uuid: '975776a5-7070-5c23-bee6-4e9bba84a431',
    },

    // one of these 3 required to look up content
    objectId: 'tEiojmmHA1',
    slug: 'test-article1',
    uuid: '5320803c-b709-5327-a06f-b482c8f41b92',

    history: { branch: 'master' }
}, { sessionToken: 'lkjasfdliewaoijfesoij'});
 */
Content.setCurrent = async (params, options) => {
    const masterOptions = Actinium.Utils.MasterOptions(options);
    const contentObj = await Actinium.Content.retrieve(params, options);

    if (!contentObj) throw 'Unable to find content';
    const typeObj = await Actinium.Type.retrieve(params.type, masterOptions);

    const content = new Actinium.Object(typeObj.collection);
    content.id = contentObj.objectId;

    const sanitized = await Actinium.Content.sanitize(
        {
            ...contentObj,
            type: typeObj,
        },
        content,
    );

    for (const { fieldSlug, fieldValue } of sanitized) {
        if (fieldSlug && typeof fieldValue !== 'undefined')
            content.set(fieldSlug, fieldValue);
    }

    content.set('history', contentObj.history);

    let saved, errors;
    try {
        saved = await content.save(null, options);
        if (saved) {
            saved = await content.fetch(masterOptions);
            const savedObj = serialize(saved);

            const userId = op.get(
                params,
                'user.objectId',
                op.get(params, 'user.id', op.get(params, 'userId')),
            );
            await Actinium.Content.Log.add(
                {
                    contentId: savedObj.objectId,
                    collection: typeObj.collection,
                    userId,
                    changeType: ENUMS.CHANGES.SET_REVISION,
                    meta: {
                        uuid: op.get(contentObj, 'uuid'),
                        slug: op.get(contentObj, 'slug'),
                        type: op.get(typeObj, 'type'),
                        branch: op.get(
                            contentObj,
                            ['branches', op.get(savedObj, 'history.branch')],
                            {},
                        ),
                        history: savedObj.history,
                    },
                },
                masterOptions,
            );

            return savedObj;
        }
    } catch (error) {
        errors = error;
    }

    throw errors;
};

/**
 * @api {Asynchronous} Content.setPermissions(params,options) Content.setPermissions()
 * @apiDescription Update permissions for content.
 * @apiParam {Object} params parameters for content
 * @apiParam {Object} options Parse Query options (controls access)
 * @apiParam (params) {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam (params) {String} [slug] The unique slug for the content.
 * @apiParam (params) {String} [objectId] The Parse object id of the content.
 * @apiParam (params) {String} [uuid] The uuid of the content.
 * @apiParam (params) {Array} permissions List of permissions to apply to content.
 If unset, ACL will not be updated. If empty array, public read access will be applied.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (permission) {Object} permission Read or write
 * @apiParam (permission) {Object} type role or user
 * @apiParam (permission) {Object} [objectId] objectId of user
 * @apiParam (permission) {Object} [name] name of role
 * @apiName Content.setPermissions
 * @apiGroup Actinium
 */
Content.setPermissions = async (params, options) => {
    const masterOptions = Actinium.Utils.MasterOptions(options);
    const contentObj = await Actinium.Content.retrieve(params, options);
    if (!contentObj) throw 'Unable to find content';
    const typeObj = await Actinium.Type.retrieve(params.type, masterOptions);

    const collection = op.get(typeObj, 'collection');
    const content = new Actinium.Object(collection);
    content.id = contentObj.objectId;
    const permissions = op.get(params, 'permissions', []);

    // set ACL
    if (Array.isArray(permissions)) {
        let userId = op.get(contentObj, 'user.objectId');
        const groupACL = await Actinium.Utils.CloudACL(
            permissions,
            `${typeObj.collection}.retrieveAny`,
            `${typeObj.collection}.updateAny`,
        );

        if (userId) {
            groupACL.setReadAccess(userId, true);
            groupACL.setWriteAccess(userId, true);
        }

        content.setACL(groupACL);

        let saved, errors;
        try {
            saved = await content.save(null, options);
            const ACL = saved.getACL();

            const changeUserId = op.get(
                params,
                'changeUser.objectId',
                op.get(params, 'changeUser.id'),
            );
            await Actinium.Content.Log.add(
                {
                    contentId: contentObj.objectId,
                    collection,
                    userId: changeUserId,
                    changeType: ENUMS.CHANGES.SET_ACL,
                    meta: {
                        uuid: op.get(contentObj, 'uuid'),
                        slug: op.get(contentObj, 'slug'),
                        type: op.get(typeObj, 'type'),
                        ACL,
                    },
                },
                masterOptions,
            );

            if (saved) {
                return ACL;
            }
        } catch (error) {
            errors = error;
        }

        throw errors;
    }
};

/**
 * @api {Asynchronous} Content.update(params,options) Content.update()
 * @apiDescription Update content of a defined Type. In addition to the required parameters of
 `type` and `slug`, you can provide any parameter's that conform to the runtime fields saved for that type.
 Changes to content will be staged as a new delta revision. If no `history` (branch and revision index) are provided
 A new revision will be added in the master branch. To commit a revision to your content
 collection, use `content-set-current`.
 * @apiParam {Object} params parameters for content
 * @apiParam {Object} options Parse Query options (controls access)
 * @apiParam (params) {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam (params) {String} [title] The updated title of the content.
 * @apiParam (params) {String} [slug] The unique slug for the content (for lookup only, use `Content.changeSlug() to change.`).
 * @apiParam (params) {String} [objectId] The Parse object id of the content (for lookup only).
 * @apiParam (params) {String} [uuid] The uuid of the content. (for lookup only)
 * @apiParam (params) {Object} [history] revision history to retrieve, containing branch and revision index.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (history) {String} [branch=master] the revision branch of current content
 * @apiParam (history) {Number} [revision] index in branch history to update (defaults to most recent in branch).
 If you select a revision before the latest revision, a new branch will be created.
 * @apiName Content.update
 * @apiGroup Actinium
 * @apiExample Usage
 Actinium.Content.update({
     // Type object required to look up content
     // i.e. the collection is determined by the parent Type
     type: {
         // one of these 3 required to look up content
         objectId: 'MvAerDoRQN',
         machineName: 'article',
         uuid: '975776a5-7070-5c23-bee6-4e9bba84a431',
     },

     // one of these 3 required to look up content
     objectId: 'tEiojmmHA1',
     slug: 'test-article1',
     uuid: '5320803c-b709-5327-a06f-b482c8f41b92',

     // optionally set meta data for the content
     meta: {},

     // Any additional field as defined in the Type object `fields`.
     // Can be different from one type to another.
     title: 'Test Article',
     body: {
        children: [
            {
                text: 'simple text',
            },
        ],
     },

     // Update the latest master revision
     history: { branch: 'master' }
 }, { sessionToken: 'lkjasdljadsfoijaef'});
 */
Content.update = async (params, options) => {
    const masterOptions = Actinium.Utils.MasterOptions(options);
    const contentObj = await Actinium.Content.retrieve(params, options);
    if (!contentObj) throw 'Unable to find content';

    // build the current revision
    let branchId = op.get(params, 'history.branch', 'master');
    const revisionIndex = op.get(params, 'history.revision');
    let currentBranches = op.get(contentObj, 'branches');
    const revisions = op.get(currentBranches, [branchId, 'history']);

    const typeObj = await Actinium.Type.retrieve(params.type, masterOptions);
    const content = new Actinium.Object(typeObj.collection);

    const title = op.get(params, 'title');
    if (title && op.get(contentObj, 'title') !== title) {
        content.set('title', title);
    }
    content.id = contentObj.objectId;
    content.set('type', {
        machineName: typeObj.machineName,
        uuid: typeObj.uuid,
        namespace: typeObj.namespace,
    });

    let contentRevision = {
        ...contentObj,
    };

    if (revisions.length > revisionIndex + 1) {
        const { branches, history } = await Actinium.Content.createBranch(
            contentRevision,
            typeObj,
            null,
            null,
            masterOptions,
        );

        branchId = op.get(history, 'branch');
        op.set(contentRevision, 'branches', branches);
        op.set(contentRevision, 'history', history);
    }

    const sanitized = await Actinium.Content.sanitize(
        {
            ...params,
            type: contentObj.type,
        },
        content,
    );

    const diff = await Actinium.Content.diff(contentRevision, sanitized);

    await Actinium.Hook.run(
        'content-before-save',
        content,
        typeObj,
        false,
        params,
        options,
    );

    const contentUpdateBeforeSave = content.toJSON();

    // Changes going into revision
    if (diff !== false) {
        // Create new revision branch
        const newRevision = {
            collection: typeObj.collection,
            object: {
                ...diff,
                ACL: contentObj.ACL,
            },
        };

        if (params.user) op.set(newRevision, 'user', params.user);
        const revision = await Actinium.Recycle.revision(
            newRevision,
            masterOptions,
        );

        currentBranches = op.get(contentRevision, 'branches');
        currentBranches[branchId].history.push(revision.id);

        content.set('branches', currentBranches);
        const savedBase = await content.save(null, options);

        const revHistory = {
            branch: branchId,
            revision: currentBranches[branchId].history.length - 1,
        };

        const masterCopyProps = await Actinium.Content.masterCopyProps(
            savedBase,
            contentObj.schema,
            typeObj,
        );

        contentRevision = {
            ...contentRevision,
            ...diff,
            history: revHistory,
            ...masterCopyProps,
        };

        const userId = op.get(
            params,
            'user.objectId',
            op.get(params, 'user.id', op.get(params, 'userId')),
        );

        await Actinium.Content.Log.add(
            {
                contentId: contentRevision.objectId,
                collection: typeObj.collection,
                userId,
                changeType: ENUMS.CHANGES.REVISED,
                meta: {
                    uuid: op.get(contentObj, 'uuid'),
                    slug: op.get(contentObj, 'slug'),
                    type: op.get(typeObj, 'type'),
                    branch: op.get(
                        currentBranches,
                        op.get(revHistory, 'branch'),
                        {},
                    ),
                    history: revHistory,
                },
            },
            masterOptions,
        );

        // no revision changes, but content object was updated
    } else if (Object.values(contentUpdateBeforeSave).length > 0) {
        // most saves go in revision
        const savedBase = await content.save(null, options);
        const masterCopyProps = await Actinium.Content.masterCopyProps(
            savedBase,
            contentObj.schema,
            typeObj,
        );

        contentRevision = {
            ...contentRevision,
            ...masterCopyProps,
        };
    }

    // hook documented with api doc at bottom of Content.create()
    await Actinium.Hook.run(
        'content-saved',
        contentRevision,
        typeObj,
        false,
        params,
        options,
    );

    return contentRevision;
};

/**
 * @api {Asynchronous} Content.trash(params,options) Content.trash()
 * @apiDescription Mark content for deletion.
 * @apiParam {Object} params parameters for content
 * @apiParam {Object} options Parse Query options (controls access)
 * @apiParam (params) {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam (params) {String} [slug] The unique slug for the content.
 * @apiParam (params) {String} [objectId] The Parse object id of the content.
 * @apiParam (params) {String} [uuid] The uuid of the content.
 * @apiParam (params) {Object} [history] revision history to retrieve, containing branch and revision index.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (history) {String} [branch=master] the revision branch of current content
 * @apiParam (history) {Number} [revision] index in branch history to update (defaults to most recent in branch).
 * @apiName Content.trash
 * @apiGroup Actinium
 */
Content.trash = async (params, options) => {
    const masterOptions = Actinium.Utils.MasterOptions(options);

    params.status = ENUMS.STATUS.TRASH;
    params.reason = ENUMS.CHANGES.TRASHED;

    const contentObj = await Actinium.Content.setStatus(params, options);
    const typeObj = await Actinium.Type.retrieve(params.type, masterOptions);

    /**
     * @api {Hook} content-trashed content-trashed
     * @apiDescription Called after `Content.trash()`
     * @apiParam {Object} contentObj the content marked trash
     * @apiParam {Object} typeObj the type of the content
     * @apiName content-trashed
     * @apiGroup Hooks
     */
    await Actinium.Hook.run(
        'content-trashed',
        contentObj,
        typeObj,
        params,
        options,
    );
    return contentObj;
};

/**
 * @api {Asynchronous} Content.masterCopyProps(content, schema, type) Content.masterCopyProps()
 * @apiDescription Return subset of all properties from master copy of content that *must* come from the master copy (not revisions). This helps with certainty about
 which properties are comeing from the collection, and which may be coming from revisions.
 * @apiParam {Object} content Actinium.Object or serialized object from recently fetched content.
 * @apiParams {Object} schema Content type current field schemas.
 * @apiParams {Object} type Type object of evaluated content.
 * @apiName Content.masterCopyProps
 * @apiGroup Actinium
 */
Content.masterCopyProps = async (contentObject, schema, typeObj) => {
    const content = serialize(contentObject);
    const masterCopyFields = {
        objectId: true,
        slug: true,
        uuid: true,
        title: true,
        branches: true,
        publish: true,
        status: true,
        meta: true,
        ACL: true,
        user: true,
        createdAt: true,
        updatedAt: true,
    };

    await Actinium.Hook.run(
        'content-master-copy-fields',
        masterCopyFields,
        schema,
        typeObj,
    );

    const props = {};
    for (const [prop, included] of Object.entries(masterCopyFields)) {
        if (included === true && op.has(content, prop)) {
            op.set(props, prop, op.get(content, prop));
        }
    }

    return props;
};

/**
 * @api {Asynchronous} Content.delete(params,options) Content.delete()
 * @apiDescription Delete content of a defined Type. To identify the content, you must provided
the `type` object, and one of `slug`, `objectId`, or `uuid` of the content. Destroys
main record for content, marks all revisions for cleanup, and returns recycled master
record.
 * @apiParam {Object} params parameters for content
 * @apiParam {Object} options Parse Query options (controls access)
 * @apiParam (params) {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam (params) {String} [slug] The unique slug for the content.
 * @apiParam (params) {String} [objectId] The Parse object id of the content.
 * @apiParam (params) {String} [uuid] The uuid of the content.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiName Content.delete
 * @apiGroup Actinium
 */
Content.delete = async (params, options) => {
    const masterOptions = Actinium.Utils.MasterOptions(options);
    const contentObj = await Actinium.Content.retrieve(
        {
            ...params,
            current: true,
        },
        masterOptions,
    );

    if (!contentObj) return contentObj;

    const typeObj = await Actinium.Type.retrieve(params.type, masterOptions);
    const collection = op.get(typeObj, 'collection');

    const content = new Actinium.Object(typeObj.collection);
    content.id = contentObj.objectId;

    const type = new Actinium.Object('Type');
    type.id = typeObj.objectId;
    await type.fetch(masterOptions);

    const destroyed = await content.destroy(options);

    // Add master record as trash
    const trashParams = { collection, object: contentObj };
    if (params.user) trashParams.user = params.user;
    const trash = await Actinium.Recycle.trash(trashParams, masterOptions);

    // target all revisions for cleanup
    const revisions = _.chain(Object.values(op.get(contentObj, 'branches', {})))
        .pluck('history')
        .flatten()
        .uniq()
        .value()
        .map(objectId => {
            const rev = new Actinium.Object('Recycle');
            rev.id = objectId;
            rev.set('type', 'trash');
            return rev;
        });
    await Actinium.Object.saveAll(revisions, masterOptions);

    const userId = op.get(
        params,
        'user.objectId',
        op.get(params, 'user.id', op.get(params, 'userId')),
    );
    await Actinium.Content.Log.add(
        {
            contentId: contentObj.objectId,
            collection,
            userId,
            changeType: ENUMS.CHANGES.DELETED,
            meta: {
                uuid: op.get(contentObj, 'uuid'),
                slug: op.get(contentObj, 'slug'),
                type: op.get(typeObj, 'type'),
            },
        },
        masterOptions,
    );

    // update type to free up the slug
    type.remove('slugs', op.get(contentObj, 'slug'));
    await type.save(null, masterOptions);

    /**
     * @api {Hook} content-deleted content-deleted
     * @apiDescription Called after `Content.delete()`
     * @apiParam {Object} contentObj The Content Object
     * @apiParam {Object} typeObj The Type Object
     * @apiParam {Object} trash The Trash Object
     * @apiParam {Object} params The request.params object
     * @apiParam {Object} options The Cloud run options
     * @apiName content-deleted
     * @apiGroup Hooks
     */
    await Actinium.Hook.run(
        'content-deleted',
        contentObj,
        typeObj,
        trash,
        params,
        options,
    );

    return trash;
};

/**
 * @api {Asynchronous} Content.restore(params,options) Content.restore()
 * @apiDescription Restore deleted content of a defined Type (if still in recycle).
 To identify the content, you must provided the `type` object, and `objectId` of
 the content. Restores main record for content as well as any revisions.
 * @apiParam {Object} params parameters for content
 * @apiParam {Object} options Parse Query options (controls access)
 * @apiParam (params) {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam (params) {String} objectId The Parse object id of the deleted content.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiName Content.restore
 * @apiGroup Actinium
 */
Content.restore = async (params, options) => {
    const masterOptions = Actinium.Utils.MasterOptions(options);
    const typeObj = await Actinium.Type.retrieve(params.type, masterOptions);
    const collection = op.get(typeObj, 'collection');

    // restore master record
    const restored = await Actinium.Recycle.restore(
        {
            collection,
            objectId: op.get(params, 'objectId'),
        },
        options,
    );

    const contentObj = serialize(restored);

    // update type to restore the slug
    const type = new Actinium.Object('Type');
    type.id = typeObj.objectId;
    await type.fetch(masterOptions);
    type.addUnique('slugs', op.get(contentObj, 'slug'));
    await type.save(null, masterOptions);

    // restore all revisions
    const revisions = _.chain(Object.values(op.get(contentObj, 'branches', {})))
        .pluck('history')
        .flatten()
        .uniq()
        .value()
        .map(objectId => {
            const rev = new Actinium.Object('Recycle');
            rev.id = objectId;
            rev.set('type', 'revision');
            rev.set('object.objectId', contentObj.objectId);
            return rev;
        });

    const userId = op.get(
        params,
        'user.objectId',
        op.get(params, 'user.id', op.get(params, 'userId')),
    );
    await Actinium.Content.Log.add(
        {
            contentId: contentObj.objectId,
            collection,
            userId,
            changeType: ENUMS.CHANGES.RESTORED,
            meta: {
                uuid: op.get(contentObj, 'uuid'),
                slug: op.get(contentObj, 'slug'),
                type: op.get(typeObj, 'type'),
                originalId: op.get(params, 'objectId'),
                branch: op.get(
                    contentObj,
                    ['branches', op.get(contentObj, 'history.branch')],
                    {},
                ),
                history: op.get(contentObj, 'history'),
            },
        },
        masterOptions,
    );

    await Actinium.Object.saveAll(revisions, masterOptions);

    /**
     * @api {Hook} content-restored content-restored
     * @apiGroup Hooks
     * @apiName content-restored
     * @apiParam {Object} contentObj The content marked trash
     * @apiParam {Object} typeObj The type of the content
     * @apiParam {Object} params The request.params object
     * @apiParam {Object} options The options object
     * @apiDescription Called after `Content.restore()`
     */
    await Actinium.Hook.run(
        'content-restored',
        contentObj,
        typeObj,
        params,
        options,
    );

    return contentObj;
};

/**
 * @api {Asynchronous} Content.publish(params,options) Content.publish()
 * @apiDescription Set revision to current version and publish content.
 * @apiParam {Object} params parameters for content
 * @apiParam {Object} options Parse Query options (controls access)
 * @apiParam (params) {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam (params) {String} [slug] The unique slug for the content.
 * @apiParam (params) {String} [objectId] The Parse object id of the content.
 * @apiParam (params) {String} [uuid] The uuid of the content.
 * @apiParam (params) {Object} [history] revision history to retrieve, containing branch and revision index.
 * @apiParam (params) {String} [userId] User objectId that published the content.
 * @apiParam (params) {String} [reason] Cause of publish action, default ENUMS.CHANGES.PUBLISHED
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (history) {String} [branch=master] the revision branch of current content
 * @apiParam (history) {Number} [revision] index in branch history to update (defaults to most recent in branch).
 * @apiName Content.publish
 * @apiGroup Actinium
 */
Content.publish = async (params, options) => {
    const masterOptions = Actinium.Utils.MasterOptions(options);

    const contentObj = await Content.setCurrent(params, options);
    if (!contentObj) throw 'Unable to find content';
    const typeObj = await Actinium.Type.retrieve(params.type, masterOptions);
    const collection = op.get(typeObj, 'collection');
    const content = new Actinium.Object(collection);
    content.id = contentObj.objectId;
    content.set('status', ENUMS.STATUS.PUBLISHED);
    op.set(contentObj, 'status', ENUMS.STATUS.PUBLISHED);

    await content.save(null, options);

    const userId = op.get(
        params,
        'user.objectId',
        op.get(params, 'user.id', op.get(params, 'userId')),
    );
    const changeType = op.get(params, 'reason', ENUMS.CHANGES.PUBLISHED);
    await Actinium.Content.Log.add(
        {
            contentId: contentObj.objectId,
            collection,
            userId,
            changeType,
            meta: {
                uuid: op.get(contentObj, 'uuid'),
                slug: op.get(contentObj, 'slug'),
                type: op.get(typeObj, 'type'),
                branch: op.get(
                    contentObj,
                    ['branches', op.get(contentObj, 'history.branch')],
                    {},
                ),
                history: op.get(contentObj, 'history'),
            },
        },
        masterOptions,
    );

    /**
     * @api {Hook} content-published content-published
     * @apiDescription Called after `Content.publish()`
     * @apiParam {Object} contentObj the published content object
     * @apiParam {Object} typeObj the type of the content
     * @apiName content-published
     * @apiGroup Hooks
     */
    await Actinium.Hook.run('content-published', contentObj, typeObj);
    return contentObj;
};

/**
 * @api {Asynchronous} Content.setStatus(params,options) Content.setStatus()
 * @apiDescription Set revision to current version and set the status of the content.
 * @apiParam {Object} params parameters for content
 * @apiParam {Object} options Parse Query options (controls access)
 * @apiParam (params) {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam (params) {String} [slug] The unique slug for the content.
 * @apiParam (params) {String} [objectId] The Parse object id of the content.
 * @apiParam (params) {String} [uuid] The uuid of the content.
 * @apiParam (params) {Object} [history] revision history to retrieve, containing branch and revision index.
 * @apiParam (params) {String} [userId] User objectId that set the status of the content.
 * @apiParam (params) {String} [reason] Change log change reason. Cause of setStatus action, default ENUMS.CHANGES.SET_STATUS
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (history) {String} [branch=master] the revision branch of current content
 * @apiParam (history) {Number} [revision] index in branch history to update (defaults to most recent in branch).
 * @apiName Content.setStatus
 * @apiGroup Actinium
 */
Content.setStatus = async (params, options) => {
    const masterOptions = Actinium.Utils.MasterOptions(options);

    const contentObj = await Content.setCurrent(params, options);
    if (!contentObj) throw 'Unable to find content';
    const typeObj = await Actinium.Type.retrieve(params.type, masterOptions);

    const currentStatus = op.get(contentObj, 'status');
    const statuses = _.chain(
        op
            .get(typeObj, 'fields.publisher.statuses', 'TRASH,DRAFT,PUBLISHED')
            .split(',')
            .concat(Object.values(ENUMS.STATUS)),
    )
        .uniq()
        .compact()
        .value();

    const status = op.get(params, 'status');
    if (!status) throw 'status parameter required';
    if (!statuses.includes(status)) throw 'Invalid status.';

    // no change in status
    if (status === currentStatus) return contentObj;

    // publish and unpublish are reserved
    if (status === ENUMS.STATUS.PUBLISHED)
        throw 'Use Content.publish() or content-publish cloud functions to publish content.';
    if (currentStatus === ENUMS.STATUS.PUBLISHED)
        throw 'Use Content.unpublish() or content-unpublish cloud functions to unpublish content.';

    const collection = op.get(typeObj, 'collection');
    const content = new Actinium.Object(collection);
    content.id = contentObj.objectId;
    content.set('status', status);
    op.set(contentObj, 'status', status);

    await Actinium.Hook.run(
        'before-content-status-changed',
        content,
        typeObj,
        status,
        currentStatus,
    );

    await content.save(null, options);

    const userId = op.get(
        params,
        'user.objectId',
        op.get(params, 'user.id', op.get(params, 'userId')),
    );
    const changeType = op.get(params, 'reason', ENUMS.CHANGES.SET_STATUS);
    await Actinium.Content.Log.add(
        {
            contentId: contentObj.objectId,
            collection,
            userId,
            changeType,
            meta: {
                uuid: op.get(contentObj, 'uuid'),
                slug: op.get(contentObj, 'slug'),
                type: op.get(typeObj, 'type'),
                branch: op.get(
                    contentObj,
                    ['branches', op.get(contentObj, 'history.branch')],
                    {},
                ),
                history: op.get(contentObj, 'history'),
                status,
            },
        },
        masterOptions,
    );

    /**
     * @api {Hook} content-status-changed content-status-changed
     * @apiDescription Hook called before return of `Content.setStatus()`.
     Useful for responding to changes of content status.
     * @apiParam {Object} contentObj the content object after status change.
     * @apiParam {Object} typeObj the type object of the content.
     * @apiParam {String} status the new status.
     * @apiParam {String} previousStatus the previous status.
     * @apiName content-status-changed
     * @apiGroup Hooks
     */
    await Actinium.Hook.run(
        'content-status-changed',
        contentObj,
        typeObj,
        status,
        currentStatus,
    );
    return contentObj;
};

/**
 * @api {Asynchronous} Content.unpublish(params,options) Content.unpublish()
 * @apiDescription Unpublish current version of content.
 * @apiParam {Object} params parameters for content
 * @apiParam {Object} options Parse Query options (controls access)
 * @apiParam (params) {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam (params) {String} [slug] The unique slug for the content.
 * @apiParam (params) {String} [objectId] The Parse object id of the content.
 * @apiParam (params) {String} [uuid] The uuid of the content.
 * @apiParam (params) {Object} [history] revision history to retrieve, containing branch and revision index.
 * @apiParam (params) {String} [userId] User objectId that unpublished the content.
 * @apiParam (params) {String} [reason] Cause of unpublish action, default ENUMS.CHANGES.UNPUBLISH
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (history) {String} [branch=master] the revision branch of current content
 * @apiParam (history) {Number} [revision] index in branch history to update (defaults to most recent in branch).
 * @apiName Content.unpublish
 * @apiGroup Actinium
 */
Content.unpublish = async (params, options) => {
    const masterOptions = Actinium.Utils.MasterOptions(options);
    const contentObj = await Actinium.Content.retrieve(
        {
            ...params,
            current: true,
        },
        options,
    );

    if (!contentObj) throw 'Unable to find content';
    const typeObj = await Actinium.Type.retrieve(params.type, masterOptions);

    const collection = op.get(typeObj, 'collection');
    const content = new Actinium.Object(collection);
    content.id = contentObj.objectId;
    content.set('status', ENUMS.STATUS.DRAFT);
    op.set(contentObj, 'status', ENUMS.STATUS.DRAFT);

    await content.save(null, options);

    const userId = op.get(
        params,
        'user.objectId',
        op.get(params, 'user.id', op.get(params, 'userId')),
    );
    const changeType = op.get(params, 'reason', ENUMS.CHANGES.UNPUBLISHED);
    await Actinium.Content.Log.add(
        {
            contentId: contentObj.objectId,
            collection,
            userId,
            changeType,
            meta: {
                uuid: op.get(contentObj, 'uuid'),
                slug: op.get(contentObj, 'slug'),
                type: op.get(typeObj, 'type'),
            },
        },
        masterOptions,
    );

    /**
     * @api {Hook} content-unpublished content-unpublished
     * @apiDescription Hook called before return of `Content.unpublish()`.
     Useful for responding to unpublishing of content.
     * @apiParam {Object} contentObj the content object after unpublished.
     * @apiParam {Object} typeObj the type object of the content
     * @apiName content-unpublished
     * @apiGroup Hooks
     */
    await Actinium.Hook.run('content-unpublished', contentObj, typeObj);
    return contentObj;
};

/**
 * @api {Asynchronous} Content.schedule(params,options) Content.schedule()
 * @apiDescription Schedule the publishing / unpublishing of content. If `history` is provided, that revision will be
 made current and published on optional `sunrise`. On optional `sunset`, the current version of the content will be unpublished.
 * @apiParam {Object} params parameters for content
 * @apiParam {Object} options Parse Query options (controls access)
 * @apiParam (params) {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam (params) {String} [slug] The unique slug for the content.
 * @apiParam (params) {String} [objectId] The Parse object id of the content.
 * @apiParam (params) {String} [uuid] The uuid of the content.
 * @apiParam (params) {String} [sunrise] Optional ISO8601 + UTC Offset datetime string (moment.format()) for sunrise of content. e.g. 2020-02-07T11:15:04-05:00
 * @apiParam (params) {String} [sunset] Optional ISO8601 + UTC Offset datetime string (moment.format()) for sunset of content. e.g. 2020-02-07T11:15:04-05:00
 * @apiParam (params) {Object} [history] revision history to retrieve, containing branch and revision index.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (history) {String} [branch=master] the revision branch of current content
 * @apiParam (history) {Number} [revision] index in branch history to update (defaults to most recent in branch).
 * @apiName Content.schedule
 * @apiGroup Actinium
 * @apiExample Usage
const moment = require('moment');
const now = moment();

// publish version 3 of master branch a month from now
// unpublish the article in 2 months
Actinium.Content.schedule({
  type: { machineName: 'article' },
  slug: 'my-article',
  history: { branch: 'master', revision: 3 },
  sunrise: now.clone().add(1, 'month').format(),
  sunset: now.clone().add(2, 'month').format(),
}, Actinium.Utils.MasterOptions());
 */
Content.schedule = async (params, options) => {
    const masterOptions = Actinium.Utils.MasterOptions(options);
    const contentObj = await Actinium.Content.retrieve(params, options);

    if (!contentObj) throw 'Unable to find content';
    const typeObj = await Actinium.Type.retrieve(params.type, masterOptions);
    const collection = op.get(typeObj, 'collection');
    const jobId = `${collection}-scheduled`;

    const revision = op.get(params, 'history.revision');
    const userId = op.get(
        params,
        'user.objectId',
        op.get(params, 'user.id', op.get(params, 'userId')),
    );

    // new schedule
    const sunriseISO = op.get(params, 'sunrise');
    if (sunriseISO) {
        const sunrise = moment(sunriseISO);
        if (sunrise.format() !== sunriseISO)
            throw 'Invalid sunrise provided. Valid ISO8601 + UTC offset such as 2020-02-07T11:15:04-05:00. Use moment >=v2.20.0 moment.format().';
    }

    const sunsetISO = op.get(params, 'sunset');
    if (sunsetISO) {
        const sunset = moment(sunsetISO);
        if (sunset.format() !== sunsetISO)
            throw 'Invalid sunset provided. Valid ISO8601 + UTC offset such as 2020-02-07T11:15:04-05:00. Use moment >=v2.20.0 moment.format().';
    }

    let publish = op.get(contentObj, 'publish', {}) || {};
    const history = op.get(contentObj, 'history');
    if (!revision) op.del(history, 'revision');

    const pubId = uuidv4();
    publish[pubId] = { sunrise: sunriseISO, sunset: sunsetISO, history };
    if (userId) publish[pubId].userId = userId;

    const content = new Actinium.Object(collection);
    content.id = contentObj.objectId;
    content.set('publish', publish);
    await content.save(null, options);

    await Actinium.Content.Log.add(
        {
            contentId: contentObj.objectId,
            collection,
            userId,
            changeType: ENUMS.CHANGES.SCHEDULE,
            meta: {
                uuid: op.get(contentObj, 'uuid'),
                slug: op.get(contentObj, 'slug'),
                type: op.get(typeObj, 'type'),
                branch: op.get(
                    contentObj,
                    ['branches', op.get(publish, [pubId, 'history', 'branch'])],
                    {},
                ),
                publish: publish[pubId],
            },
        },
        masterOptions,
    );

    const pulseDefs = Actinium.Pulse.definitions;

    return serialize(content);
};

/**
 * @api {Asynchronous} Content.unschedule(params,options) Content.unschedule()
 * @apiDescription Remove scheduled publishing job by id.
 * @apiParam {Object} params parameters for content
 * @apiParam {Object} options Parse Query options (controls access)
 * @apiParam (params) {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam (params) {String} [slug] The unique slug for the content.
 * @apiParam (params) {String} [objectId] The Parse object id of the content.
 * @apiParam (params) {String} [uuid] The uuid of the content.
 * @apiParam (params) {String} jobId The id of the schedule job.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiName Content.unschedule
 * @apiGroup Actinium
 */
Content.unschedule = async (params, options) => {
    const masterOptions = Actinium.Utils.MasterOptions(options);
    const contentObj = await Actinium.Content.retrieve(params, options);

    if (!contentObj) throw 'Unable to find content';
    const typeObj = await Actinium.Type.retrieve(params.type, masterOptions);
    const publish = op.get(contentObj, 'publish', {}) || {};
    const jobId = op.get(params, 'jobId');
    const userId = op.get(
        params,
        'user.objectId',
        op.get(params, 'user.id', op.get(params, 'userId')),
    );

    if (!jobId) throw new Error('jobId missing');
    if (!op.has(publish, jobId)) throw new Error('Invalid jobId');

    op.del(publish, jobId);

    const content = new Actinium.Object(typeObj.collection);
    content.id = contentObj.objectId;
    content.set('publish', publish);
    await content.save(null, options);

    await Actinium.Content.Log.add(
        {
            contentId: contentObj.objectId,
            collection: typeObj.collection,
            userId,
            changeType: ENUMS.CHANGES.UNSCHEDULE,
            meta: {
                uuid: op.get(contentObj, 'uuid'),
                slug: op.get(contentObj, 'slug'),
                type: op.get(typeObj, 'type'),
                publish,
            },
        },
        masterOptions,
    );

    const pulseDefs = Actinium.Pulse.definitions;

    return serialize(content);
};

/**
 * @api {Asynchronous} Content.publishScheduled() Content.publishScheduled()
 * @apiDescription Manually run content scheduler. Publishes or unpublishes any
 content that is scheduled.
 * @apiName Content.publishScheduled
 * @apiGroup Actinium
 */
Content.publishScheduled = async () => {
    const options = Actinium.Utils.MasterOptions();
    const { types = [] } = await Actinium.Type.list({}, options);

    let logged = false;

    for (const type of types) {
        const { collection } = type;
        const query = new Parse.Query(collection);
        query.notEqualTo('publish', undefined);
        query.notEqualTo('publish', null);

        const items = await query.find(options);

        if (items.length > 0 && logged === false) {
            if (logged === false) {
                INFO(chalk.cyan('Content Scheduler:'));
                logged = true;
            }
            INFO(`(${items.length})` + chalk.cyan(` ${collection}:`));
        }

        const now = moment();

        for (const item of items) {
            const publish = item.get('publish');

            let updated = false;
            for (const [id, instructions] of Object.entries(publish)) {
                const { sunrise, sunset, history, userId } = instructions;

                // sunrise
                if (sunrise) {
                    if (now.isAfter(moment(sunrise))) {
                        INFO(' - ', chalk.cyan('Publishing'), item.get('slug'));

                        await Actinium.Content.publish(
                            {
                                type,
                                objectId: item.id,
                                history,
                                userId,
                                reason: ENUMS.CHANGES.SCHEDULED_PUBLISH,
                            },
                            options,
                        );
                        op.del(publish, [id, 'sunrise']);
                        updated = true;
                    }
                }

                if (sunset) {
                    if (now.isAfter(moment(sunset))) {
                        INFO(
                            ' - ',
                            chalk.cyan('Unpublishing'),
                            item.get('slug'),
                        );

                        await Actinium.Content.unpublish(
                            {
                                type,
                                objectId: item.id,
                                userId,
                                reason: ENUMS.CHANGES.SCHEDULED_UNPUBLISH,
                            },
                            options,
                        );
                        op.del(publish, [id, 'sunset']);
                        updated = true;
                    }
                }

                if (
                    !op.get(publish, [id, 'sunrise']) &&
                    !op.get(publish, [id, 'sunset'])
                ) {
                    op.del(publish, [id]);
                    updated = true;
                }
            }

            const remainingInstructions = Object.keys(publish);
            if (updated || remainingInstructions.length < 1) {
                const obj = new Actinium.Object(collection);
                obj.id = item.id;

                // instructions remain
                if (remainingInstructions.length > 0) {
                    obj.set('publish', publish);
                }
                // no more publishing tasks
                else {
                    obj.set('publish');
                }
                await obj.save(null, options);
            }
        }

        if (items.length > 0) {
            INFO(' - ', 'Done');
            INFO('');
        }
    }
};

/**
 * @api {Asynchronous} Content.typeMaintenance() Content.typeMaintenance()
 * @apiDescription Manually run content maintenance. Primarily makes sure that
 the current content slugs are accounted for in the Type object, but also runs
 the Hook `type-maintenance` for each type, giving plugins an opportunity to do
 their own maintenance.
 * @apiName Content.typeMaintenance
 * @apiGroup Actinium
 */
Content.typeMaintenance = async () => {
    const options = Actinium.Utils.MasterOptions();
    const { types = [] } = await Actinium.Type.list({}, options);
    let logged = false;
    for (const type of types) {
        const { collection, slugs } = type;
        const query = new Parse.Query(collection);
        query.limit(1000);
        query.skip(0);

        let results = await query.find(options);
        const currentSlugs = [];
        while (results.length > 0) {
            results.forEach(result => currentSlugs.push(result.get('slug')));
            query.skip(currentSlugs.length);
            results = await query.find(options);
        }

        if (_.difference(slugs, currentSlugs).length > 0) {
            if (logged === false) {
                INFO(chalk.cyan('Content Type Maintenance:'));
                logged = true;
            }

            const typeLabel = op.get(type, 'meta.label', op.get(type, 'type'));
            INFO(` - Cleanup ${typeLabel} slugs`);
            const typeObj = new Actinium.Object('Type');
            typeObj.id = type.objectId;
            typeObj.set('slugs', currentSlugs);
            typeObj.save(null, options);
        }

        /**
         * @api {Hook} type-maintenance type-maintenance
         * @apiDescription Hook called on each scheduled Pulse type-maintenance job.
         * Useful for regular jobs that must be run on content types or their content.
         * @apiParam {Object} typeObj the type object of the content
         * @apiName type-maintenance
         * @apiGroup Hooks
         */
        await Actinium.Hook.run('type-maintenance', type);
    }
    if (logged === true) {
        INFO('');
    }
};

Actinium.Harness.test(
    'Content.create()',
    async assert => {
        const createParams = {
            type: {
                machineName: 'test_content',
            },
            slug: 'a-test-content',
            title: 'A Title',
            display_title: 'My happy title',
            body_text: {
                text: 'Some body text',
            },
            something_else: 'foo',
        };

        let content = await Actinium.Content.create(
            createParams,
            Actinium.Utils.MasterOptions(),
        );

        assert.equal(content.slug, createParams.slug, 'Slug should match');
        assert.equal(content.title, createParams.title, 'Title should match');
        assert.equal(
            content.display_title,
            createParams.display_title,
            'Display Title should match',
        );
        assert.deepEqual(
            content.body_text,
            createParams.body_text,
            'Body object should match',
        );
        assert.notEqual(
            content.something_else,
            createParams.something_else,
            'something_else field should be ignored.',
        );
    },
    // Setup
    async () => {
        const options = Actinium.Utils.MasterOptions();
        let collection;
        try {
            const type = await Actinium.Type.retrieve(
                { machineName: 'test_content' },
                options,
            );
            const typeObj = new Actinium.Object('Type');
            typeObj.id = type.objectId;
            typeObj.fetch(options);
            typeObj.set('slugs', []);
            typeObj.save(null, options);

            collection = type.collection;
        } catch (error) {}

        try {
            if (!collection) {
                await Actinium.Type.create(
                    {
                        type: 'Test Content',
                        fields: {
                            '07b5a9a3-0a77-4925-8642-07549715d5bb': {
                                fieldId: '07b5a9a3-0a77-4925-8642-07549715d5bb',
                                fieldType: 'Text',
                                fieldName: 'Display Title',
                                defaultValue: null,
                                pattern: null,
                                helpText: null,
                                region: 'default',
                            },
                            'f9f9b96f-1fcd-44b7-bd34-576ca5c79470': {
                                fieldId: 'f9f9b96f-1fcd-44b7-bd34-576ca5c79470',
                                fieldType: 'RichText',
                                fieldName: 'Body Text',
                                helpText: null,
                                region: 'efde4c06-9e3f-40b3-b098-2a1d3e6275cc',
                            },
                        },
                        regions: {
                            default: {
                                id: 'default',
                                label: 'Header',
                                slug: 'header',
                            },
                            'efde4c06-9e3f-40b3-b098-2a1d3e6275cc': {
                                id: 'efde4c06-9e3f-40b3-b098-2a1d3e6275cc',
                                label: 'Body',
                                slug: 'body',
                            },
                        },
                    },
                    options,
                );
                await new Promise(resolve => setTimeout(resolve, 250));
            }
        } catch (error) {
            console.log('setup error', error);
        }
    },
);

Actinium.Harness.test('Content.update()', async assert => {
    const updateParams = {
        // query
        title: 'Title Update',
        type: {
            machineName: 'test_content',
        },
        slug: 'a-test-content',

        body_text: {
            text: 'Updated',
        },
    };

    let content = await Actinium.Content.update(
        updateParams,
        Actinium.Utils.MasterOptions(),
    );

    assert.equal(content.title, updateParams.title, 'Title should match');
    assert.deepEqual(
        content.body_text,
        updateParams.body_text,
        'Body object should match',
    );
    assert.equal(
        op.get(content, 'branches.master.history.length'),
        2,
        'Should have 2 revisions in master.',
    );
});

Actinium.Harness.test('Content.setCurrent()', async assert => {
    const params = {
        // query
        type: {
            machineName: 'test_content',
        },
        slug: 'a-test-content',
    };

    let current = await Actinium.Content.retrieve(
        {
            ...params,
            current: true,
        },
        Actinium.Utils.MasterOptions(),
    );

    assert.equal(
        op.get(current, 'history.branch'),
        'master',
        'Should be master branch',
    );

    assert.equal(
        op.get(current, 'history.revision'),
        0,
        'Should be first revision',
    );

    assert.deepEqual(op.get(current, 'body_text'), {
        text: 'Some body text',
    });

    await Actinium.Content.setCurrent(params, Actinium.Utils.MasterOptions());

    current = await Actinium.Content.retrieve(
        {
            ...params,
            current: true,
        },
        Actinium.Utils.MasterOptions(),
    );

    assert.equal(
        op.get(current, 'history.branch'),
        'master',
        'Should be master branch',
    );

    assert.equal(
        op.get(current, 'history.revision'),
        1,
        'Should be second revision',
    );

    assert.deepEqual(op.get(current, 'body_text'), {
        text: 'Updated',
    });
});

Actinium.Harness.test('Content.publish()', async assert => {
    const params = {
        // query
        type: {
            machineName: 'test_content',
        },
        slug: 'a-test-content',
        history: { branch: 'master', revision: 0 },
    };

    await Actinium.Content.publish(params, Actinium.Utils.MasterOptions());

    let current = await Actinium.Content.retrieve(
        {
            ...params,
            current: true,
        },
        Actinium.Utils.MasterOptions(),
    );

    assert.equal(
        op.get(current, 'history.branch'),
        'master',
        'Should be master branch',
    );

    assert.equal(
        op.get(current, 'history.revision'),
        0,
        'Should be second revision',
    );

    assert.deepEqual(op.get(current, 'body_text'), {
        text: 'Some body text',
    });

    assert.equal(op.get(current, 'status'), ENUMS.STATUS.PUBLISHED);
});

Actinium.Harness.test('Content.unpublish()', async assert => {
    const params = {
        // query
        type: {
            machineName: 'test_content',
        },
        slug: 'a-test-content',
    };

    await Actinium.Content.unpublish(params, Actinium.Utils.MasterOptions());

    let current = await Actinium.Content.retrieve(
        params,
        Actinium.Utils.MasterOptions(),
    );

    assert.equal(op.get(current, 'status'), ENUMS.STATUS.DRAFT);
});

Actinium.Harness.test(
    'Content.delete() and Content.restore()',
    async assert => {
        const params = {
            // query
            type: {
                machineName: 'test_content',
            },
            slug: 'a-test-content',
        };

        const type = await Actinium.Type.retrieve(
            params.type,
            Actinium.Utils.MasterOptions(),
        );
        const { collection } = type;

        let content = await Actinium.Content.retrieve(
            params,
            Actinium.Utils.MasterOptions(),
        );

        const recycle = await Actinium.Content.delete(
            params,
            Actinium.Utils.MasterOptions(),
        );
        const objectId = op.get(recycle.get('object'), 'objectId');

        const trashedQuery = new Parse.Query('Recycle');
        trashedQuery.equalTo('collection', collection);
        trashedQuery.equalTo('object.objectId', objectId);

        const trashed = await trashedQuery.find(Actinium.Utils.MasterOptions());

        assert.equal(trashed.length, 2, 'Main item and 1 revisions.');
        assert.ok(trashed.find(trash => trash.get('type') === 'delete'));

        const restored = await Actinium.Content.restore(
            content,
            Actinium.Utils.MasterOptions(),
        );

        const revisionQuery = new Parse.Query('Recycle');
        revisionQuery.equalTo('collection', collection);
        revisionQuery.equalTo('object.slug', 'a-test-content');
        const recycled = await revisionQuery.find(
            Actinium.Utils.MasterOptions(),
        );
        const revisions = recycled.filter(
            revision => revision.get('type') === 'revision',
        );
        assert.equal(revisions.length, 1, '1 revision');
    },
);

Actinium.Harness.test(
    'Content Teardown',
    async assert => {},
    null,
    // Teardown
    async () => {
        try {
            const options = Actinium.Utils.MasterOptions();
            const { objectId, collection } = await Actinium.Type.retrieve(
                { machineName: 'test_content' },
                options,
            );

            // destroy all items in test_content collection
            const contentQuery = new Parse.Query(collection);
            let items = await contentQuery.find(options);
            await Actinium.Object.destroyAll(items, options);

            // destroy/archive Type
            await Actinium.Type.delete(
                {
                    machineName: 'test_content',
                },
                options,
            );

            // delete test_content schema
            const ParseSchema = new Parse.Schema(collection);
            const schema = await ParseSchema.get(options);
            if (schema) await ParseSchema.delete(options);

            // delete revisions
            let recycleQuery = new Parse.Query('Recycle');
            recycleQuery.equalTo('collection', collection);
            items = await recycleQuery.find(options);
            await Actinium.Object.destroyAll(items, options);

            // delete archived Type
            recycleQuery = new Parse.Query('Recycle');
            recycleQuery.equalTo('collection', 'Type');
            recycleQuery.equalTo('object.objectId', objectId);
            items = await recycleQuery.find(options);
            await Actinium.Object.destroyAll(items, options);

            // destroy changelog
            const clQuery = new Parse.Query('Changelog');
            clQuery.equalTo('collection', collection);
            const logs = await clQuery.find(options);
            await Actinium.Object.destroyAll(logs, options);
        } catch (error) {
            console.log('teardown error', error);
        }
    },
);

Content.registerActivity = activityType => {
    Actinium.Hook.register(activityType, async (contentObj, typeObj, isNew) => {
        let newFlag = typeof isNew === 'boolean' ? isNew : false;

        await Actinium.Hook.run(
            'content-activity',
            activityType,
            contentObj,
            typeObj,
            newFlag,
        );
    });
};

module.exports = Content;
