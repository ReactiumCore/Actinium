const {
    CloudRunOptions,
    CloudHasCapabilities,
} = require(`${ACTINIUM_DIR}/lib/utils`);

const ParseNode = require('parse/node');
const op = require('object-path');
const _ = require('underscore');
const chalk = require('chalk');

const COLLECTION = 'Capability';
const PLUGIN = {
    ID: 'Capability',
    name: 'Capabilities plugin.',
    description:
        'Adds cloud functions to facilitate setting and checking of permissions.',
    order: 0,
    version: {
        actinium: '>=3.1.2',
        plugin: '0.0.1',
    },
    meta: {
        group: 'core',
        builtIn: true,
    },
};

const canEdit = req =>
    CloudHasCapabilities(req, ['Capability.create', 'Capability.update'], true);

Actinium.Plugin.register(PLUGIN, true);

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

Actinium.Collection.register(COLLECTION, {
    create: false,
    retrieve: true,
    update: false,
    delete: false,
    addField: false,
});

Actinium.Cloud.define(PLUGIN.ID, 'capability-check', async req => {
    let caps =
        op.has(req, 'params.capability') &&
        typeof req.params.capability === 'string'
            ? req.params.capability
            : op.has(req, 'params.capabilities') &&
              Array.isArray(req.params.capabilities)
            ? req.params.capabilities
            : [];

    if (typeof caps === 'string') {
        caps = [caps];
    }

    caps = caps.filter(cap => typeof cap === 'string');
    for (let cap of caps) {
        if (cap.length < 4) {
            throw 'capability must be at least 4 characters.';
        }
    }

    const strict = !!op.get(req, 'params.strict', true);
    if (caps.length < 1) {
        throw 'One or more capabilities required.';
    }

    return CloudHasCapabilities(req, caps, strict);
});

Actinium.Cloud.define(PLUGIN.ID, 'capability-bulk-check', async req => {
    const bulkChecks = Object.entries(op.get(req.params, 'checks', {}));
    if (bulkChecks.length < 1)
        throw new Error('No capability checks submitted.');

    const response = {};
    for (const [key, check] of bulkChecks) {
        let { strict = false, capabilities = [] } = check;
        capabilities = _.compact(_.flatten([capabilities])).filter(
            cap => typeof cap === 'string',
        );
        if (capabilities.length < 1)
            throw new Error(`No capabilities provided for check ${key}.`);
        op.set(
            response,
            [key],
            CloudHasCapabilities(req, capabilities, strict),
        );
    }

    return response;
});

Actinium.Cloud.define(PLUGIN.ID, 'capability-grant', async req => {
    if (!canEdit(req)) throw new Error('Permission denied');

    const result = await Actinium.Capability.grant(
        req.params,
        CloudRunOptions(req),
    );
    if (_.isError(result)) throw result;
    return result;
});

Actinium.Cloud.define(PLUGIN.ID, 'capability-revoke', async req => {
    if (!canEdit(req)) throw new Error('Permission denied');

    const result = await Actinium.Capability.revoke(
        req.params,
        CloudRunOptions(req),
    );
    if (_.isError(result)) throw result;
    return result;
});

Actinium.Cloud.define(PLUGIN.ID, 'capability-restrict', async req => {
    if (!canEdit(req)) throw new Error('Permission denied');

    const result = await Actinium.Capability.restrict(
        req.params,
        CloudRunOptions(req),
    );
    if (_.isError(result)) throw result;
    return result;
});

Actinium.Cloud.define(PLUGIN.ID, 'capability-unrestrict', async req => {
    if (!canEdit(req)) throw new Error('Permission denied');

    const result = await Actinium.Capability.unrestrict(
        req.params,
        CloudRunOptions(req),
    );
    if (_.isError(result)) throw result;
    return result;
});

Actinium.Cloud.define(PLUGIN.ID, 'level-check', async req => {
    const { match } = req.params;
    return !!op.get(CloudRunOptions(req, match), 'master', false);
});

Actinium.Cloud.define(PLUGIN.ID, 'capability-get', async req => {
    if (!CloudHasCapabilities(req, 'Capability.retrieve')) {
        throw new Error('Permission denied');
    }

    const { capability } = req.params;
    const capabilities = _.chain([capability])
        .flatten()
        .compact()
        .value();

    let results = Actinium.Capability.get(capabilities);
    if (_.isError(results)) {
        throw results;
    }

    if (!results || Object.keys(results).length < 1) {
        results = await Actinium.Capability.getAsync(capabilities);
        if (_.isError(results)) {
            throw results;
        }
    }

    return _.isString(capability) ? _.first(Object.values(results)) : results;
});

Actinium.Hook.register(
    'start',
    () => {
        if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
        Actinium.Capability.propagate();
    },
    -1000000,
);

Actinium.Cloud.beforeSave(COLLECTION, async req => {
    await Actinium.Hook.run('before-capability-save', req);
});

Actinium.Cloud.beforeDelete(COLLECTION, async req => {
    await Actinium.Hook.run('before-capability-delete', req);
});

Actinium.Cloud.afterSave(COLLECTION, async req => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
    if (Actinium.Cache.get('capability.propagating')) return;

    const ignore = ['createdAt', 'updatedAt'];
    const relKeys = ['allowed', 'excluded'];
    const group = req.object.get('group');
    const previous = Actinium.Capability.get(group);

    const relations = {
        allowed: {
            origin: op.get(previous, 'allowed'),
            value: await Actinium.Capability.relation(req.object, 'allowed', {
                limit: 10000,
                outputType: 'LIST',
            }),
        },
        excluded: {
            origin: op.get(previous, 'excluded'),
            value: await Actinium.Capability.relation(req.object, 'excluded', {
                limit: 10000,
                outputType: 'LIST',
            }),
        },
    };

    const diff = Object.keys(req.object.toJSON()).reduce((obj, key) => {
        const origin = !relKeys.includes(key)
            ? req.original.get(key)
            : op.get(relations, [key, 'origin']);

        const value = !relKeys.includes(key)
            ? req.object.get(key)
            : op.get(relations, [key, 'value']);

        if (!_.isEqual(origin, value) && !ignore.includes(key)) {
            obj[key] = {
                previous: origin,
                current: value,
            };
        }
        return obj;
    }, {});

    await Actinium.Capability.load(true, true);

    if (Object.keys(diff).length > 0) {
        await Actinium.Hook.run('capability-change', req, diff);
    }

    await Actinium.Hook.run('capability-saved', req);
});

Actinium.Cloud.afterDelete(COLLECTION, async req => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
    if (Actinium.Cache.get('capability.propagating')) return;

    await Actinium.Capability.load(true, true);
    await Actinium.Hook.run('capability-deleted', req);
});

/**
 * @api {Cloud} capability-check capability-check
 * @apiVersion 3.1.2
 * @apiGroup Cloud
 * @apiName capability-check
 * @apiDescription Check one or more capabilities for the request user.
 * @apiParam {String} [capability] string capability name
 * @apiParam {String} [capabilities] list of string capabilities. if multiple are provided, `strict` will apply
 * @apiParam {Boolean} [strict=true] if [true] all capabilities must be permitted for request user, else only one must match
 * @apiExample Example Usage
Reactium.Cloud.run('capability-check', { capability: 'user.view', strict: false})
 * @apiSuccess {Boolean} permitted
 */

/**
  * @api {Cloud} capability-bulk-check capability-bulk-check
  * @apiVersion 3.5.0
  * @apiGroup Cloud
  * @apiName capability-bulk-check
  * @apiDescription Check groups of capabilities in bulk.
  * @apiParams {Object} checks key pairs checks to perform for current session indexed by a label.
  * @apiParam (check) {Array} capabilities one or more string capabilities to check together
  * @apiParam (check) {Boolean} [strict=true] if [true] all capabilities in the check must be permitted for request user, else only one must match
  * @apiExample Example Usage
const checks = {
 canPublish: {
  capabilities: ['Content_article.publish', 'publish-content'],
  strict: false,
 },
 canUnpublish: {
  capabilities: ['Content_article.unpublish', 'unpublish-content'],
  strict: false,
 },
 canSetStatusDRAFT: {
  capabilities: ["Content_article.setStatus-DRAFT", "set-content-status"],
  strict: false,
 },
 canSetStatusTEST: {
  capabilities: ["Content_article.setStatus-TEST", "set-content-status"],
  strict: false,
 },
 canSetStatusREVIEW: {
  capabilities: ["Content_article.setStatus-REVIEW", "set-content-status"],
  strict: false,
 },
};

Reactium.Cloud.run('capability-bulk-check', { checks });
  * @apiSuccess response
{
    canPublish: false
    canUnpublish: false,
    canSetStatusDRAFT: true,
    canSetStatusTEST: true,
    canSetStatusREVIEW: true,
}
  */

/**
 * @api {Cloud} capability-get capability-get
 * @apiVersion 3.1.2
 * @apiGroup Cloud
 * @apiName capability-get
 * @apiDescription Get list of registered capabilities.
 * @apiParam {String} [capability] Optional capability name to get allowed and excluded roles for a registered capability. If not provided,
 * returns a list of names of registered capabilities. (Note: capabilities not listed may be enforced with defaults)
 * @apiExample Single Capability Usage
Reactium.Cloud.run('capability-get', { capability: 'user.view'})
 * @apiExample Single Capability Response
 {
         "allowed": [
             "administrator",
             "super-admin"
         ],
         "excluded": [
             "banned"
         ]
     }
 * @apiExample List Usage
 Reactium.Cloud.run('capability-get')
 * @apiExample List Response Example
 [
        "Capability.addField",
        "Capability.create",
        "Capability.delete",
        "Capability.retrieve",
        "Capability.update",
        "Media.addField",
        "Media.create",
        "Media.delete",
        "Media.retrieve",
        "Media.update",
        "Plugin.addField",
        "Plugin.create",
        "Plugin.delete",
        "Plugin.retrieve",
        "Plugin.update",
        "Route.addField",
        "Route.create",
        "Route.delete",
        "Route.retrieve",
        "Route.update",
        "Setting.addField",
        "Setting.create",
        "Setting.delete",
        "Setting.retrieve",
        "Setting.update",
        "Token.addField",
        "Token.create",
        "Token.delete",
        "Token.retrieve",
        "Token.update",
        "_Role.addField",
        "_Role.create",
        "_Role.delete",
        "_Role.retrieve",
        "_Role.update",
        "blueprint.retrieve",
        "user.admin",
        "user.ban",
        "user.view"
    ]
 */

/**
 * @api {Cloud} capability-edit capability-edit
 * @apiVersion 3.1.2
 * @apiGroup Cloud
 * @apiName capability-edit
 * @apiDescription Create new capability or edit an existing one.
 * @apiParam {String} group capability name in object path form `group.action` (e.g. user.edit)
 * @apiParam {Object} perms `allowed` roles and `excluded` roles.
 * @apiExample Example Usage
// only administrators and super-admin users can "mail.send"
Reactium.Cloud.run('capability-edit', 'mail.send', {
    "allowed": [
        "administrator",
        "super-admin"
    ],
    "excluded": [
        "banned"
    ]
})
 */

/**
 * @api {Cloud} capability-create capability-create
 * @apiVersion 3.1.2
 * @apiGroup Cloud
 * @apiName capability-create
 * @apiDescription Alias for capability-edit
 */

/**
 * @api {Cloud} capability-delete capability-delete
 * @apiVersion 3.1.2
 * @apiGroup Cloud
 * @apiName capability-delete
 * @apiDescription Delete a capability.
 * @apiParam {String} group capability name in object path form `group.action` (e.g. user.edit)
 * @apiExample Example Usage
Reactium.Cloud.run('capability-delete', { capability: 'user.view'})
 */
