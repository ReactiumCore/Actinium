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

const Content = {};

Content.initFieldSchemaTypes = async () => {
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

    const schema = {
        ...schemaTemplate.schema,
    };

    let type = new Parse.Object('Type');
    type.id = typeId;
    type = await type.fetch(options);

    if (type) {
        const typeObj = serialize(type);
        const { collection, machineName, fields } = typeObj;
        const sample = await new Parse.Query(collection).first(options);
        let sampleObj = {};
        if (sample) sampleObj = serialize(sample);

        const ParseSchema = new Parse.Schema(collection);
        const allFields = Object.values(fields).map(field => {
            field.fieldSlug = slugify(field.fieldName);
            return field;
        });

        const permittedFields = _.indexBy(allFields, 'fieldSlug');
        for (const { fieldType, fieldName, fieldSlug } of allFields) {
            // Parse fieldType is known to Actinium (plugins implement 'content-schema-field-types' hook)
            if (fieldType in schemaTemplate.fieldTypes) {
                // content does not already populate this field
                if (!sample || !(fieldSlug in sampleObj)) {
                    schema[fieldSlug] = schemaTemplate.fieldTypes[fieldType];
                }
            }
        }

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

        await Actinium.Hook.run(
            'content-schema-permissions',
            schemaTemplate.permissions,
            machineName,
        );
        await Actinium.Hook.run(
            'content-schema-indexes',
            schemaTemplate.indexes,
            machineName,
        );

        return {
            collection,
            permissions: schemaTemplate.permissions,
            schema,
            existingSchema,
            indexes: schemaTemplate.indexes,
            permittedFields,
        };
    }
};

/**
 * @api {Asynchronous} Content.sanitize(content) Content.sanitize()
 * @apiDescription Based on content provided, will return array of sanitized content fields
 based on the field types in the content type. (Array of `{fieldSlug, fieldValue}`)
 * @apiParam {Object} content content data to sanitize
 * @apiParam (content) {Object} type The Type object of the content.
 * @apiName Content.sanitize
 * @apiGroup Actinium
 */
Content.sanitize = async content => {
    const { type } = content;

    const { existingSchema, permittedFields } = await Content.getSchema(type);
    const fieldConfigs = permittedFields;

    const fieldData = Object.entries(content)
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
        });

    for (const fieldIndex in fieldData) {
        const field = fieldData[fieldIndex];
        const config = fieldConfigs[field.fieldSlug];
        await Actinium.Hook.run(
            'content-field-sanitize',
            field,
            config,
            fieldIndex,
            fieldData,
        );
    }

    if (op.has(content, 'meta') && typeof content.meta === 'object') {
        fieldData.push({
            fieldSlug: 'meta',
            fieldValue: content.meta,
        });
    }

    return fieldData;
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
Content.createBranch = async (content, type, branch, options) => {
    content = serialize(content);
    type = serialize(type);

    if (!branch || op.has(content, ['branches', branch])) branch = uuidv4();
    const user = await Actinium.Utils.UserFromSession(
        op.get(options, 'sessionToken'),
    );
    const branches = op.get(content, 'branches', {});
    const currentBranchId = op.get(content, 'history.branch');
    const currentRevisionIndex = op.get(content, 'history.revision');

    // get current revision id in case we tagging existing base revision
    let revisionId = op.get(content, [
        'branches',
        currentBranchId,
        'history',
        currentRevisionIndex,
    ]);

    // need to create new base revision for this branch
    if (currentRevisionIndex !== 0) {
        op.set(branches, [branch, 'history'], []);
        op.set(content, 'branches', branches);
        op.set(content, 'history', { branch });

        const revObj = {
            collection: op.get(type, 'collection'),
            object: serialize(content),
        };

        if (user) op.set(revObj, 'user', user);
        const revision = await Actinium.Recycle.revision(revObj, options);
        revisionId = revision.id;
    }

    op.set(branches, [branch, 'history'], [revisionId]);
    const history = { branch, revision: 0 };

    return { branches, history };
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
    const sanitized = await Actinium.Content.sanitize({
        ...changes,
        type: contentObj.type,
    });
    const diff = {};
    for (const { fieldSlug, fieldValue } of sanitized) {
        if (!equal(op.get(contentObj, fieldSlug), fieldValue)) {
            op.set(diff, fieldSlug, fieldValue);
        }
    }

    // No changes
    if (Object.keys(diff).length < 1) return false;

    op.set(diff, 'objectId', contentObj.objectId);
    op.set(diff, 'slug', contentObj.slug);
    op.set(diff, 'history', contentObj.history);
    op.set(diff, 'branches', contentObj.branches);

    return diff;
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

    const revisions = await Parse.Object.fetchAll(
        revisionIds.map(id => {
            const rev = new Parse.Object('Recycle');
            rev.id = id;
            return rev;
        }),
        options,
    );

    const revsById = _.indexBy(revisions, 'id');
    const version = revisionIds.reduce((version, id) => {
        const rev = serialize(op.get(revsById, [id]));
        version = {
            ...version,
            ...op.get(rev, 'object', {}),
        };

        return version;
    }, contentObj);

    version.branches = contentObj.branches;
    version.history = {
        branch,
        revision: revisionIds.length - 1,
    };

    return version;
};

/**
 * @api {Asynchronous} Content.list(params,options) Content.list()
 * @apiDescription Retrieve one item of content.
 * @apiParam {Object} params parameters for content
 * @apiParam {Object} options Parse Query options (controls access)
 * @apiParam (params) {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam (params) {String} [status=PUBLISHED] "PUBLISHED" or "DRAFT" status of the content
 * @apiParam (params) {String} [orderBy=createdAt] Field to order the results by.
 * @apiParam (params) {String} [direction=descending] Order "descending" or "ascending"
 * @apiParam (params) {Number} [limit=1000] Limit page results
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

    const page = Math.max(op.get(params, 'page', 1), 1);
    const limit = Math.min(op.get(params, 'limit', 1000), 1000);
    const skip = page * limit - limit;
    const orderBy = op.get(params, 'orderBy', 'createdAt');

    let direction = op.get(params, 'direction', 'descending');
    const directions = ['ascending', 'descending'];
    if (!directions.includes(direction)) direction = 'descending';

    let status = op.get(params, 'status', ENUMS.STATUS.PUBLISHED);
    if (!Object.values(ENUMS.STATUS).includes(status))
        status = ENUMS.STATUS.PUBLISHED;

    const qry = new Parse.Query(collection)
        [direction](orderBy)
        .limit(limit)
        .skip(skip)
        .equalTo('status', status);

    const count = await qry.count(options);
    const pages = Math.ceil(count / limit);
    const next = page + 1 <= pages ? page + 1 : null;
    const prev = page - 1 > 0 ? page + 1 : null;
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

/**
 * @api {Asynchronous} Content.create(params,options) Content.create()
 * @apiDescription Create new content of a defined Type. In addition to the required parameters of
 `type` and `slug`, you can provide any parameter's that conform to the runtime fields saved for that type.
 * @apiParam {Object} params parameters for content
 * @apiParam {Object} options Parse Query options (controls access)
 * @apiParam (params) {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam (params) {String} slug The unique slug for the new content.
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
    const type = new Parse.Object('Type');
    type.id = typeObj.objectId;

    // construct content
    const collection = op.get(typeObj, 'collection');
    if (!collection) throw new Error('Invalid type. No collection defined.');
    const content = new Parse.Object(collection);
    const namespace = op.get(typeObj, 'uuid');

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
    content.set('type', { objectId: type.id });
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

    const sanitized = await Actinium.Content.sanitize({
        ...params,
        type: typeObj,
    });
    for (const { fieldSlug, fieldValue } of sanitized) {
        if (fieldSlug && fieldValue) content.set(fieldSlug, fieldValue);
    }

    // Create new revision branch
    const { branches, history } = await Actinium.Content.createBranch(
        content,
        typeObj,
        'master',
        options,
    );

    content.set('branches', branches);
    // only set content history on creation and publishing
    content.set('history', history);

    await content.save(null, options);

    await type.save(null, masterOptions);
    const contentObj = serialize(content);

    await Actinium.Hook.run('content-saved', contentObj);

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

    const content = await query.first(options);

    if (content) {
        const contentObj = serialize(content);

        // if content is published, and publshed is requested, return the current content
        if (op.get(params, 'current', false)) {
            return contentObj;
        }

        // build the current revision
        const branch = op.get(params, 'history.branch', 'master');
        const revisionIndex = op.get(params, 'history.revision');

        const version = Actinium.Content.getVersion(
            contentObj,
            branch,
            revisionIndex,
            masterOptions,
        );

        return version;
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

    const content = new Parse.Object(typeObj.collection);
    content.id = contentObj.objectId;

    const sanitized = await Actinium.Content.sanitize({
        ...contentObj,
        type: typeObj,
    });

    for (const { fieldSlug, fieldValue } of sanitized) {
        if (fieldSlug && fieldValue) content.set(fieldSlug, fieldValue);
    }

    content.set('history', contentObj.history);

    let saved, errors;
    try {
        saved = await content.save(null, options);
        if (saved) {
            saved = await content.fetch(masterOptions);
            const savedObj = serialize(saved);
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
 * @apiName Content.setPermissions()
 * @apiGroup Actinium
 */
Content.setPermissions = async (params, options) => {
    const masterOptions = Actinium.Utils.MasterOptions(options);
    const contentObj = await Actinium.Content.retrieve(params, options);
    if (!contentObj) throw 'Unable to find content';
    const typeObj = await Actinium.Type.retrieve(params.type, masterOptions);

    const collection = op.get(typeObj, 'collection');
    const content = new Parse.Object(collection);
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
            if (saved) {
                return saved.getACL();
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
 * @apiParam {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam {String} [slug] The unique slug for the content.
 * @apiParam {String} [objectId] The Parse object id of the content.
 * @apiParam {String} [uuid] The uuid of the content.
 * @apiParam {Object} [history] revision history to retrieve, containing branch and revision index.
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
        text: 'simple text',
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

    const content = new Parse.Object(typeObj.collection);
    content.id = contentObj.objectId;

    // verify that save is allowed, but do not apply new values
    // those will go in revision
    const saved = await content.save(null, options);

    let contentRevision = contentObj;
    if (revisions.length > revisionIndex + 1) {
        const { branches, history } = await Actinium.Content.createBranch(
            contentObj,
            typeObj,
            null,
            masterOptions,
            params.user,
        );

        branchId = op.get(history, 'branch');
        op.set(contentObj, 'branches', branches);
        op.set(contentObj, 'history', history);
    }

    const diff = await Actinium.Content.diff(contentObj, params);
    if (!diff) return contentObj;

    // Create new revision branch
    const newRevision = {
        collection: typeObj.collection,
        object: diff,
    };

    if (params.user) op.set(newRevision, 'user', params.user);
    const revision = await Actinium.Recycle.revision(
        newRevision,
        masterOptions,
    );

    currentBranches = op.get(contentObj, 'branches');
    currentBranches[branchId].history.push(revision.id);

    content.set('branches', currentBranches);
    await content.save(null, masterOptions);

    contentRevision = {
        ...contentRevision,
        ...serialize(content),
        ...diff,
        history: {
            branch: branchId,
            revision: currentBranches[branchId].history.length - 1,
        },
    };

    await Actinium.Hook.run('content-saved', contentRevision);

    return contentRevision;
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

    const content = new Parse.Object(typeObj.collection);
    content.id = contentObj.objectId;

    const type = new Parse.Object('Type');
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
            const rev = new Parse.Object('Recycle');
            rev.id = objectId;
            rev.set('type', 'trash');
            return rev;
        });
    await Parse.Object.saveAll(revisions, masterOptions);

    // update type to free up the slug
    type.remove('slugs', op.get(contentObj, 'slug'));
    await type.save(null, masterOptions);

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
    const type = new Parse.Object('Type');
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
            const rev = new Parse.Object('Recycle');
            rev.id = objectId;
            rev.set('type', 'revision');
            rev.set('object.objectId', contentObj.objectId);
            return rev;
        });

    await Parse.Object.saveAll(revisions, masterOptions);

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
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (history) {String} [branch=master] the revision branch of current content
 * @apiParam (history) {Number} [revision] index in branch history to update (defaults to most recent in branch).
 * @apiName Content.publish()
 * @apiGroup Actinium
 */
Content.publish = async (params, options) => {
    const masterOptions = Actinium.Utils.MasterOptions(options);

    const contentObj = await Content.setCurrent(params, options);
    if (!contentObj) throw 'Unable to find content';
    const typeObj = await Actinium.Type.retrieve(params.type, masterOptions);

    const collection = op.get(typeObj, 'collection');
    const content = new Parse.Object(collection);
    content.id = contentObj.objectId;
    content.set('status', ENUMS.STATUS.PUBLISHED);
    op.set(contentObj, 'status', ENUMS.STATUS.PUBLISHED);

    await content.save(null, options);

    Actinium.Hook.run('content-published', contentObj, typeObj);
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
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (history) {String} [branch=master] the revision branch of current content
 * @apiParam (history) {Number} [revision] index in branch history to update (defaults to most recent in branch).
 * @apiName Content.unpublish()
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
    const content = new Parse.Object(collection);
    content.id = contentObj.objectId;
    content.set('status', ENUMS.STATUS.DRAFT);
    op.set(contentObj, 'status', ENUMS.STATUS.DRAFT);

    await content.save(null, options);

    Actinium.Hook.run('content-unpublished', contentObj, typeObj);
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
    publish[uuidv4()] = { sunrise: sunriseISO, sunset: sunsetISO, history };

    const content = new Parse.Object(collection);
    content.id = contentObj.objectId;
    content.set('publish', publish);
    await content.save(null, options);

    const pulseDefs = Actinium.Pulse.definitions;
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
    LOG(chalk.cyan('Content Scheduler:'));
    for (const type of types) {
        const { collection } = type;
        const query = new Parse.Query(collection);
        query.notEqualTo('publish', undefined);
        query.notEqualTo('publish', null);

        const items = await query.find(options);
        LOG(`(${items.length})` + chalk.cyan(` ${collection}:`));

        const now = moment();

        for (const item of items) {
            const publish = item.get('publish');

            let updated = false;
            for (const [id, instructions] of Object.entries(publish)) {
                const { sunrise, sunset, history } = instructions;

                // sunrise
                if (sunrise) {
                    if (now.isAfter(moment(sunrise))) {
                        LOG(' - ', chalk.cyan('Publishing'), item.get('slug'));

                        await Actinium.Content.publish(
                            {
                                type,
                                objectId: item.id,
                                history,
                            },
                            options,
                        );
                        op.del(publish, [id, 'sunrise']);
                        updated = true;
                    }
                }

                if (sunset) {
                    if (now.isAfter(moment(sunset))) {
                        LOG(
                            ' - ',
                            chalk.cyan('Unpublishing'),
                            item.get('slug'),
                        );

                        await Actinium.Content.unpublish(
                            {
                                type,
                                objectId: item.id,
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
                const obj = new Parse.Object(collection);
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
        LOG(' - ', 'Done');
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
                                fieldName: 'Title',
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

        await Actinium.Content.delete(params, Actinium.Utils.MasterOptions());

        const trashedQuery = new Parse.Query('Recycle');
        trashedQuery.equalTo('collection', collection);
        trashedQuery.equalTo('object.slug', 'a-test-content');
        const trashed = await trashedQuery.find(Actinium.Utils.MasterOptions());
        assert.equal(trashed.length, 3, 'Main item and 2 revisions.');
        assert.ok(trashed.find(trash => trash.get('type') === 'delete'));

        await Actinium.Content.restore(content, Actinium.Utils.MasterOptions());

        const revisionQuery = new Parse.Query('Recycle');
        revisionQuery.equalTo('collection', collection);
        revisionQuery.equalTo('object.slug', 'a-test-content');
        const recycled = await revisionQuery.find(
            Actinium.Utils.MasterOptions(),
        );
        const revisions = recycled.filter(
            revision => revision.get('type') === 'revision',
        );
        assert.equal(revisions.length, 2, '2 revisions');
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
            await Parse.Object.destroyAll(items, options);

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
            await Parse.Object.destroyAll(items, options);

            // delete archived Type
            recycleQuery = new Parse.Query('Recycle');
            recycleQuery.equalTo('collection', 'Type');
            recycleQuery.equalTo('object.objectId', objectId);
            items = await recycleQuery.find(options);
            await Parse.Object.destroyAll(items, options);
        } catch (error) {
            console.log('teardown error', error);
        }
    },
);

module.exports = Content;
