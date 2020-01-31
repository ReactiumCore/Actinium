const _ = require('underscore');
const ENUMS = require('./enums');
const op = require('object-path');
const uuidv5 = require('uuid/v5');
const slugify = require(`${ACTINIUM_DIR}/lib/utils/slugify`);

const {
    CloudHasCapabilities,
    CloudRunOptions,
    CloudCapOptions,
} = require(`${ACTINIUM_DIR}/lib/utils`);

const PLUGIN = require('./meta');
const PLUGIN_SDK = require('./sdk');
const PLUGIN_ROUTES = require('./routes');
const PLUGIN_SCHEMA = require('./schema-template');
const PLUGIN_BLUEPRINTS = require('./blueprints');

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

const getRequestContentType = async req => {
    // retrieve type
    let typeObj = op.get(req.params, 'type');
    if (typeObj) {
        typeObj = await Actinium.Cloud.run('type-retrieve', typeObj, {
            useMasterKey: true,
        });
    }
    if (!typeObj) throw new Error('type required.');
    const type = new Parse.Object('Type');
    type.id = typeObj.objectId;

    // construct content
    const collection = op.get(typeObj, 'collection');
    if (!collection) throw new Error('Invalid type. No collection defined.');

    return typeObj;
};

const getACL = async (perms = [], collection) => {
    if (perms.length < 1) return null;
    const groupACL = new Parse.ACL();

    const aclTargets = await Actinium.Cloud.run(
        'acl-targets',
        {},
        { useMasterKey: true },
    );

    const allRoles = _.indexBy(aclTargets.roles, 'name');
    const readRoles = _.chain(
        Actinium.Capability.roles(`${collection}.retrieveAny`).map(name =>
            op.get(allRoles, name),
        ),
    )
        .compact()
        .value();
    const writeRoles = _.chain(
        Actinium.Capability.roles(`${collection}.updateAny`).map(name =>
            op.get(allRoles, name),
        ),
    )
        .compact()
        .value();

    const permission = _.groupBy(perms, 'permission');
    const writePerms = _.groupBy(op.get(permission, 'write', []), 'type');
    const readPerms = _.groupBy(op.get(permission, 'read', []), 'type');

    // read
    op.get(readPerms, 'role', [])
        .concat(readRoles)
        .forEach(roleObj => {
            if (op.has(roleObj, 'name')) {
                if (roleObj.name === 'anonymous')
                    groupACL.setPublicReadAccess(true);
                else groupACL.setRoleReadAccess(roleObj.name, true);
            }
        });
    op.get(readPerms, 'user', []).forEach(userObj => {
        if (op.has(userObj, 'objectId')) {
            groupACL.setReadAccess(userObj.objectId, true);
        }
    });
    op.get(writePerms, 'role', [])
        .concat(writeRoles)
        .forEach(roleObj => {
            if (op.has(roleObj, 'name')) {
                if (roleObj.name === 'anonymous')
                    groupACL.setPublicWriteAccess(true);
                else groupACL.setRoleWriteAccess(roleObj.name, true);
            }
        });
    op.get(writePerms, 'user', []).forEach(userObj => {
        if (op.has(userObj, 'objectId')) {
            groupACL.setWriteAccess(userObj.objectId, true);
        }
    });

    return groupACL;
};

// Actinium.Cloud.define(PLUGIN.ID, 'test-acl', async req => {
//     return getACL(req.params.perms || [], 'Content_article');
// });

/**
 * @api {Asynchronous} content-create content-create
 * @apiDescription Create new content of a defined Type. In addition to the required parameters of
 `type` and `slug`, you can provide any parameter's that conform to the runtime fields saved for that type.
 * @apiParam {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam {String} slug The unique slug for the new content.
 * @apiParam {Array} [permissions] List of permissions to apply to content. If not provided, no ACL will be set.
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
    // retrieve type
    const typeObj = await getRequestContentType(req);

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
    content.set('type', type);
    content.set('uuid', uuidv5(slug, namespace));
    content.set('meta', op.get(req.params, 'meta', {}));

    // set ACL
    const perms = op.get(req.params, 'permissions', []);
    if (req.user) {
        content.set('user', req.user);
        perms.push([
            { type: 'user', permission: 'read', objectId: req.user.id },
        ]);
        perms.push([
            { type: 'user', permission: 'write', objectId: req.user.id },
        ]);
    }

    const ACL = await getACL(perms, collection);
    if (ACL) {
        content.setACL(ACL);
    }

    const sanitized = await Actinium.Content.sanitize({
        ...req.params,
        type: typeObj,
    });
    for (const { fieldSlug, fieldValue } of sanitized) {
        if (fieldSlug && fieldValue) content.set(fieldSlug, fieldValue);
    }

    const options = CloudRunOptions(req);

    await content.save(null, options);
    await type.save(null, options);
    const contentObj = content.toJSON();

    await Actinium.Hook.run('content-saved', contentObj);

    return contentObj;
});

/**
 * @api {Asynchronous} content-retrieve content-retrieve
 * @apiDescription Retrieve one item of content.
 * @apiParam {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam {String} [slug] The unique slug for the content.
 * @apiParam {String} [objectId] The objectId for the content.
 * @apiParam {String} [uuid] The uuid for the content.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiName content-retrieve
 * @apiGroup Cloud
 */
Actinium.Cloud.define(PLUGIN.ID, 'content-retrieve', async req => {
    // retrieve type
    const typeObj = await getRequestContentType(req);

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
        const obj = content.toJSON();
        return obj;
    }
});

/**
 * @api {Asynchronous} content-create content-create
 * @apiDescription Update content of a defined Type. In addition to the required parameters of
 `type` and `slug`, you can provide any parameter's that conform to the runtime fields saved for that type.
 * @apiParam {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam {String} [slug] The unique slug for the content.
 * @apiParam {String} [objectId] The Parse object id of the content.
 * @apiParam {String} [uuid] The uuid of the content.
 * @apiParam {Array} [permissions] List of permissions to apply to content. If unset or empty, ACL will not be updated.
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
Actinium.Cloud.define(PLUGIN.ID, 'content-update', async req => {
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
        options,
    );

    const content = new Parse.Object(typeObj.collection);
    content.id = contentObj.objectId;

    content.set('meta', op.get(req.params, 'meta', {}));

    // set ACL
    const perms = op.get(req.params, 'permissions', []);
    let userId = op.get(contentObj, 'user.objectId');
    if (
        op.has(req.params, 'user') &&
        op.get(req.params, 'user.objectId') !==
            op.get(contentObj, 'user.objectId')
    ) {
        userId = op.get(req.params, 'user.objectId');
    }

    if (userId) {
        const user = new Parse.User();
        user.id = userId;
        content.set('user', user);
        perms.push([{ type: 'user', permission: 'read', objectId: userId }]);
        perms.push([{ type: 'user', permission: 'write', objectId: userId }]);
    }

    const ACL = await getACL(perms, typeObj.collection);
    if (ACL) {
        content.setACL(ACL);
    }

    const sanitized = await Actinium.Content.sanitize({
        ...req.params,
        type: typeObj,
    });

    for (const { fieldSlug, fieldValue } of sanitized) {
        if (fieldSlug && fieldValue) content.set(fieldSlug, fieldValue);
    }

    const attempts = [
        CloudRunOptions(req),
        CloudCapOptions(req, [`${typeObj.collection}.updateAny`]),
    ];
    let savedObj;
    for (const options of attempts) {
        const saved = await content.save(null, options);
        if (saved) {
            savedObj = saved.toJSON();
            break;
        }
    }

    await Actinium.Hook.run('content-saved', savedObj);

    return savedObj;
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
