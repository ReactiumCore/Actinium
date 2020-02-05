const _ = require('underscore');
const op = require('object-path');
const uuidv5 = require('uuid/v5');
const slugify = require(`${ACTINIUM_DIR}/lib/utils/slugify`);
const serialize = require(`${ACTINIUM_DIR}/lib/utils/serialize`);
const getACL = require(`${ACTINIUM_DIR}/lib/utils/acl`);
const equal = require('fast-deep-equal');

const {
    CloudHasCapabilities,
    CloudRunOptions,
    CloudMasterOptions,
    CloudCapOptions,
    UserFromSession,
} = require(`${ACTINIUM_DIR}/lib/utils`);

const PLUGIN = require('./meta');
const PLUGIN_SDK = require('./sdk');
const PLUGIN_ROUTES = require('./routes');
const PLUGIN_SCHEMA = require('./schema-template');
const PLUGIN_BLUEPRINTS = require('./blueprints');
const ENUMS = require('./enums');

// Create SDK Singleton
Actinium.Content = PLUGIN_SDK;

// Register Plugin
Actinium.Plugin.register(PLUGIN, true);

Actinium.Hook.register('schema', async () => {
    const { types = [] } = await Actinium.Cloud.run(
        'types',
        {},
        { useMasterKey: true },
    );
    for (const type of types) {
        try {
            await Actinium.Content.saveSchema(type);
        } catch (error) {
            console.log(`Error updating content schema ${type.type}`, error);
        }
    }
});

Actinium.Hook.register('type-saved', async contentType => {
    const { objectId, type } = contentType;
    try {
        await Actinium.Content.saveSchema(contentType);
    } catch (error) {
        console.log(`Error updating content schema ${type}`, error);
    }
});

Actinium.Hook.register(
    'content-field-sanitize',
    async (field, config, fieldIndex, fieldData) => {
        if (
            typeof field.fieldValue === 'undefined' ||
            field.fieldValue === null
        )
            return;

        switch (config.fieldType) {
            case 'Text':
                if (typeof field.fieldValue !== 'string') field.fieldValue = '';
                break;
            case 'RichText':
                if (typeof field.fieldValue !== 'object')
                    field.fieldValue = { text: '' };
                break;
            case 'List':
                if (!Array.isArray(field.fieldValue)) field.fieldValue = [];
                break;
            case 'Number':
                if (isNan(field.fieldValue)) field.fieldValue = undefined;
        }
    },
);

// Actinium.Cloud.define(PLUGIN.ID, 'test-acl', async req => {
//     return getACL(
//         req.params.permissions || [],
//         'Content_article.retrieveAny',
//         'Content_article.updateAny',
//     );
// });

/**
 * @api {Asynchronous} content-create content-create
 * @apiDescription Create new content of a defined Type. In addition to the required parameters of
 `type` and `slug`, you can provide any parameter's that conform to the runtime fields saved for that type.
 * @apiParam {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam {String} slug The unique slug for the new content.
 * @apiParam {Array} [permissions=Array] List of permissions to apply to content. If not provided, no ACL will be set.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (permission) {Object} permission Read or write
 * @apiParam (permission) {Object} type role or user
 * @apiParam (permission) {Object} [objectId] objectId of user
 * @apiParam (permission) {Object} [name] name of role
 * @apiName content-create
 * @apiGroup Cloud
 */
Actinium.Cloud.define(PLUGIN.ID, 'content-create', async req => {
    const masterOptions = CloudMasterOptions(req);
    // retrieve type
    const typeObj = await Actinium.Cloud.run(
        'type-retrieve',
        req.params.type,
        masterOptions,
    );
    const type = new Parse.Object('Type');
    type.id = typeObj.objectId;

    // construct content
    const collection = op.get(typeObj, 'collection');
    if (!collection) throw new Error('Invalid type. No collection defined.');
    const content = new Parse.Object(collection);
    const namespace = op.get(typeObj, 'uuid');

    // slug check
    const slugs = op.get(typeObj, 'slugs', []) || [];
    let slug = op.get(req.params, 'slug');
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
    content.set('meta', op.get(req.params, 'meta', {}));
    content.set('status', ENUMS.STATUS.DRAFT);

    // set ACL
    const permissions = op.get(req.params, 'permissions', []);
    const groupACL = await getACL(
        permissions,
        `${collection}.retrieveAny`, // read
        `${collection}.updateAny`, // write
    );

    if (req.user) {
        content.set('user', req.user);
        groupACL.setReadAccess(req.user.id, true);
        groupACL.setWriteAccess(req.user.id, true);
    }
    content.setACL(groupACL);

    const sanitized = await Actinium.Content.sanitize({
        ...req.params,
        type: typeObj,
    });
    for (const { fieldSlug, fieldValue } of sanitized) {
        if (fieldSlug && fieldValue) content.set(fieldSlug, fieldValue);
    }

    const options = CloudRunOptions(req);

    // Create new revision branch
    const { branches, history } = Actinium.Content.createBranch(
        content,
        typeObj,
        'master',
        CloudCapOptions(req, [`${collection}.create`]),
    );

    content.set('branches', branches);
    // only set content history on creation and publishing
    content.set('history', history);

    await content.save(null, options);

    await type.save(null, masterOptions);
    const contentObj = serialize(content);

    await Actinium.Hook.run('content-saved', contentObj);

    return contentObj;
});

/**
 * @api {Asynchronous} content-retrieve content-retrieve
 * @apiDescription Retrieve one item of content.
 * @apiParam {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam {Boolean} [current=false] When true, get the currently committed content (not from revision system).
 otherwise, construct the content from the provided history (branch and revision index).
 * @apiParam {Object} [history] revision history to retrieve, containing branch and revision index.
 * @apiParam {String} [slug] The unique slug for the content.
 * @apiParam {String} [objectId] The objectId for the content.
 * @apiParam {String} [uuid] The uuid for the content.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (history) {String} [branch=master] the revision branch of current content
 * @apiParam (history) {Number} [revision] index in branch history to retrieve
 (default index of latest revision)
 * @apiName content-retrieve
 * @apiGroup Cloud
 */
Actinium.Cloud.define(PLUGIN.ID, 'content-retrieve', async req => {
    const masterOptions = CloudMasterOptions(req);
    // retrieve type
    const typeObj = await Actinium.Cloud.run(
        'type-retrieve',
        req.params.type,
        masterOptions,
    );

    // construct content
    const collection = op.get(typeObj, 'collection');
    if (!collection) throw new Error('Invalid type. No collection defined.');

    const id = op.get(
        req.params,
        'id',
        op.get(req.params, 'ID', op.get(req.params, 'objectId')),
    );
    const uuid = op.get(req.params, 'uuid');
    const slug = op.get(req.params, 'slug');

    // ordinary session and capability escalated
    const attempts = [
        CloudRunOptions(req),
        CloudCapOptions(req, [`${collection}.retrieveAny`]),
    ];

    const query = new Parse.Query(collection);
    if (id) query.equalTo('objectId', id);
    if (uuid) query.equalTo('uuid', uuid);
    if (slug) query.equalTo('slug', slug);

    let content;
    for (const options of attempts) {
        content = await query.first(options);
        if (content) break;
    }

    if (content) {
        const contentObj = serialize(content);

        // if content is published, and publshed is requested, return the current content
        if (op.get(req.params, 'current', false)) {
            return contentObj;
        }

        // build the current revision
        const branch = op.get(req.params, 'history.branch', 'master');
        const revisionIndex = op.get(req.params, 'history.revision');

        const version = Actinium.Content.getVersion(
            contentObj,
            branch,
            revisionIndex,
            masterOptions,
        );

        return version;
    }
});

/**
 * @api {Asynchronous} content-set-current content-set-current
 * @apiDescription Take content from a specified branch or revision,
 and make it the "official" version of the content. If no `history` is param is
 specified the latest master branch revision will be used.
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
 * @apiName content-set-current
 * @apiGroup Cloud
 * @apiExample Usage
 Actinium.Cloud.run('content-set-current', {
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
 });
 */
Actinium.Cloud.define(PLUGIN.ID, 'content-set-current', async req => {
    const masterOptions = CloudMasterOptions(req);
    const options = CloudRunOptions(req);
    const contentObj = await Actinium.Cloud.run(
        'content-retrieve',
        req.params,
        options,
    );
    if (!contentObj) throw 'Unable to find content';
    const typeObj = await Actinium.Cloud.run(
        'type-retrieve',
        req.params.type,
        masterOptions,
    );

    const attempts = [
        CloudRunOptions(req),
        CloudCapOptions(req, [`${typeObj.collection}.updateAny`]),
    ];

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
    for (const options of attempts) {
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
    }

    throw errors;
});

/**
 * @api {Asynchronous} content-permissions content-permissions
 * @apiDescription Update permissions for content.
 * @apiParam {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam {String} [slug] The unique slug for the content.
 * @apiParam {String} [objectId] The Parse object id of the content.
 * @apiParam {String} [uuid] The uuid of the content.
 * @apiParam {Array} permissions List of permissions to apply to content.
 If unset, ACL will not be updated. If empty array, public read access will be applied.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (permission) {Object} permission Read or write
 * @apiParam (permission) {Object} type role or user
 * @apiParam (permission) {Object} [objectId] objectId of user
 * @apiParam (permission) {Object} [name] name of role
 * @apiName content-permissions
 * @apiGroup Cloud
 */
Actinium.Cloud.define(PLUGIN.ID, 'content-permissions', async req => {
    const masterOptions = CloudMasterOptions(req);
    const options = CloudRunOptions(req);
    const contentObj = await Actinium.Cloud.run(
        'content-retrieve',
        req.params,
        options,
    );
    if (!contentObj) throw 'Unable to find content';
    const typeObj = await Actinium.Cloud.run(
        'type-retrieve',
        req.params.type,
        masterOptions,
    );

    const collection = op.get(typeObj, 'collection');
    const content = new Parse.Object(collection);
    content.id = contentObj.objectId;
    const permissions = op.get(req.params, 'permissions', []);

    // set ACL
    if (Array.isArray(permissions)) {
        let userId = op.get(contentObj, 'user.objectId');
        const groupACL = await getACL(
            permissions,
            `${typeObj.collection}.retrieveAny`,
            `${typeObj.collection}.updateAny`,
        );

        if (userId) {
            groupACL.setReadAccess(userId, true);
            groupACL.setWriteAccess(userId, true);
        }

        content.setACL(groupACL);

        const attempts = [
            CloudRunOptions(req),
            CloudCapOptions(req, [`${typeObj.collection}.updateAny`]),
        ];

        let saved, errors;
        for (const options of attempts) {
            try {
                saved = await content.save(null, options);
                if (saved) {
                    return saved.getACL();
                }
            } catch (error) {
                errors = error;
            }
        }

        throw errors;
    }
});

/**
 * @api {Asynchronous} content-update content-update
 * @apiDescription Update content of a defined Type. In addition to the required parameters of
 `type` and `slug`, you can provide any parameter's that conform to the runtime fields saved for that type.
 Changes to content will be staged as a new delta revision. If no `history` (branch and revision index) are provided
 A new revision will be added in the master branch. To commit a revision to your content
 collection, use `content-set-current`.
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
 * @apiName content-update
 * @apiGroup Cloud
 * @apiExample Usage
 Actinium.Cloud.run('content-update', {
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
 });
 */
Actinium.Cloud.define(PLUGIN.ID, 'content-update', async req => {
    const options = CloudRunOptions(req);
    const masterOptions = CloudMasterOptions(req);
    const contentObj = await Actinium.Cloud.run(
        'content-retrieve',
        req.params,
        options,
    );
    if (!contentObj) throw 'Unable to find content';

    // build the current revision
    let branchId = op.get(req.params, 'history.branch', 'master');
    const revisionIndex = op.get(req.params, 'history.revision');
    let currentBranches = op.get(contentObj, 'branches');
    const revisions = op.get(currentBranches, [branchId, 'history']);

    const typeObj = await Actinium.Cloud.run(
        'type-retrieve',
        req.params.type,
        masterOptions,
    );

    const attempts = [
        CloudRunOptions(req),
        CloudCapOptions(req, [`${typeObj.collection}.updateAny`]),
    ];

    const content = new Parse.Object(typeObj.collection);
    content.id = contentObj.objectId;

    // verify that save is allowed, but do not apply new values
    // those will go in revision
    let savedObj;
    let errors;
    for (const options of attempts) {
        let saved;

        try {
            saved = await content.save(null, options);
            savedObj = serialize(saved);
            break;
        } catch (error) {
            errors = error;
        }
    }
    if (!savedObj) throw errors;

    if (revisions.length > revisionIndex + 1) {
        const { branches, history } = await Actinium.Content.createBranch(
            contentObj,
            typeObj,
            null,
            masterOptions,
            req.user,
        );

        branchId = op.get(history, 'branch');
        op.set(contentObj, 'branches', branches);
        op.set(contentObj, 'history', history);
    }

    const diff = await Actinium.Content.diff(contentObj, req.params);
    if (!diff) return contentObj;

    // Create new revision branch
    const revObj = {
        collection: typeObj.collection,
        object: diff,
    };

    if (req.user) op.set(revObj, 'user', req.user);
    const revision = await Actinium.Recycle.revision(revObj, masterOptions);

    currentBranches = op.get(contentObj, 'branches');
    currentBranches[branchId].history.push(revision.id);

    content.set('branches', currentBranches);
    await content.save(null, masterOptions);

    savedObj = {
        ...contentObj,
        ...serialize(content),
        ...diff,
        history: {
            branch: branchId,
            revision: currentBranches[branchId].history.length - 1,
        },
    };

    await Actinium.Hook.run('content-saved', savedObj);

    return savedObj;
});

/**
 * @api {Asynchronous} content-delete content-delete
 * @apiDescription Delete content of a defined Type. To identify the content, you must provided
the `type` object, and one of `slug`, `objectId`, or `uuid` of the content.
 * @apiParam {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam {String} [slug] The unique slug for the content.
 * @apiParam {String} [objectId] The Parse object id of the content.
 * @apiParam {String} [uuid] The uuid of the content.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiName content-delete
 * @apiGroup Cloud
 */
Actinium.Cloud.define(PLUGIN.ID, 'content-delete', async req => {
    const masterOptions = CloudMasterOptions(req);
    const contentObj = await Actinium.Cloud.run(
        'content-retrieve',
        req.params,
        masterOptions,
    );
    if (!contentObj) return contentObj;

    const typeObj = await Actinium.Cloud.run(
        'type-retrieve',
        req.params.type,
        masterOptions,
    );
    const collection = op.get(typeObj, 'collection');

    const content = new Parse.Object(typeObj.collection);
    content.id = contentObj.objectId;

    const type = new Parse.Object('Type');
    type.id = typeObj.objectId;
    await type.fetch(masterOptions);

    const attempts = [
        CloudRunOptions(req),
        CloudCapOptions(req, [`${typeObj.collection}.deleteAny`]),
    ];

    const trash = await Actinium.Cloud.run(
        'recycle',
        { collection, object: contentObj },
        masterOptions,
    );

    for (const options of attempts) {
        const destroyed = await content.destroy(options);
        if (destroyed) {
            break;
        }
    }

    type.remove('slugs', op.get(contentObj, 'slug'));
    await type.save(null, masterOptions);

    return trash;
});

/*
1. CLP (Class Level Permissions) is primarily guard against using Parse Cloud REST API improperly
- capabilities can be used to guard cloud functions, but not direct Parse API use (such as REST)
- Actinium.Collection.register() provides mapping from capabilities (COLLECTION.create, COLLECTION.retrieve, COLLECTION.update, COLLECTION.delete, COLLECTION.addFields) to role based CLP
- Granting a capability such as above will automatically update the appropriate CLP on that schema.

2. Content schema's (Content-{type}) should NOT use Content-{type}.create/retrieve/update/delete
in conjuction with CloudCapOptions(), which escalates the action to useMasterKey: true. Instead, use
CloudRunOptions() or equivalent only, and let the CLP naturally filter out responses.

3. ACLs will be required to protect any individual content from read/write.
- By default a REST interaction retrieve/update/delete of existing content will need to first pass CLP, and then read/write ACL check.

4. When we want to provide "super" retrieve, update, delete permission, we can use CloudCapOptions(), but for a different
set of permissions (COLLECTION.createAny, COLLECTION.retrieveAny, COLLECTION.updateAny, COLLECTION.deleteAny), and only
through cloud function. "super" operations should be impossible through ordinary Parse REST API calls.

Use Cases:
1. Publicly creatable, not publicly readable

  How:
  Content-{type}.create capability applied to anonymous role

  Check:
  CLP enforced

2. Publicly readable, not writable in any way, enforce ACL.

  How:
  Content-{type}.retrieve capability applied to anonymous role

  Check:
  CLP enforced, ACL enforced

3. Publicly readable, not writable in any way, ignore ACL.

  How:
  Content-{type}.retrieveAny capability applied to anonymous role.

  Check:
  Escalate to master read for cloud function if Content-{type}.retrieveAny using CloudCapOptions()
  Neither CLP nor ACL enforced on read of content type.

4. Role X has one or more CRUD permission, but only RUD "own" content

  How:
  Content-{type}.[create|update|retrieve|delete] for role X.

  Check:
  CLP enforced, ACL enforced

5. Role X is moderator, has one or more RUD permission, access to content owned by others, ACL not enforced.

  How:
  Content-{type}.[updateAny|retrieveAny|deleteAny] for role X.

  Check:
  Escalate to master for cloud function if Content-{type}.[updateAny|retrieveAny|deleteAny] using CloudCapOptions()
  CLP and ACL ignored

Cloud Pseudo:

# contents
options = CloudCapOptions([Content-{type}.retrieveAny])
perform fetch

# content-create:

options = CloudRunOptions()
perform creation

# content-retrieve: (1)

options = CloudCapOptions([Content-{type}.retrieveAny])
perform fetch

# content-update: (1)

options = CloudCapOptions([Content-{type}.updateAny])
perform fetch/update

# content-delete: (1)

options = CloudCapOptions([Content-{type}.deleteAny])
perform fetch/update

*/
