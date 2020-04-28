const _ = require('underscore');
const ENUMS = require('./enums');
const op = require('object-path');
const {
    CloudHasCapabilities,
    CloudRunOptions,
} = require(`${ACTINIUM_DIR}/lib/utils`);

const COLLECTION = ENUMS.COLLECTION;
const PLUGIN = require('./meta');
const PLUGIN_SCHEMA = require('./schema');
const PLUGIN_SDK = require('./sdk');

// Create SDK Singleton
Actinium[COLLECTION] = op.get(Actinium, COLLECTION, PLUGIN_SDK);

// Register Plugin
Actinium.Plugin.register(PLUGIN, true);

// Register Capabilities & Schema
Actinium.Hook.register('activate', async ({ ID }) => {
    if (ID !== PLUGIN.ID) return;

    Object.keys(PLUGIN_SCHEMA.ACTIONS.RECYCLE).forEach(action =>
        Actinium.Capability.register(`${COLLECTION}.${action}`),
    );

    Actinium.Collection.register(
        COLLECTION,
        PLUGIN_SCHEMA.ACTIONS.RECYCLE,
        PLUGIN_SCHEMA.SCHEMA.RECYCLE,
    );
});

// Define Cloud functions

/**
 * @api {Cloud} recycle-archive recycle-archive
 * @apiVersion 3.1.7
 * @apiGroup Cloud
 * @apiName recycle-archive
 * @apiDescription Move a `Parse.Object` to the `Recycle` collection and mark it as an `archve` type.
 * @apiParam {String} collection The Parse.Object type.
 * @apiParam {Object} object The Parse.Object data.
 * @apiParam {Parse.User} [user] The Parse.User object.
 * @apiExample Example Usage:
Actinium.Cloud.run('recycle-archive', {
  collection: '_User',
  object: MyUserObject,
});
 */
Actinium.Cloud.define(PLUGIN.ID, 'recycle-archive', async req => {
    const cap = await Actinium.Setting.get('recycle.capabilities.create', [
        'Recycle.create',
    ]);

    if (!CloudHasCapabilities(req, cap))
        return Promise.reject(ENUMS.ERRORS.PERMISSION);

    req.params['user'] = req.user;
    return Actinium.Recycle.archive(req.params, CloudRunOptions(req));
});

/**
 * @api {Cloud} recycle-archived recycle-archived
 * @apiVersion 3.1.7
 * @apiGroup Cloud
 * @apiName recycle-archived
 * @apiDescription Retrieve a paginated list of archived `Recycle` objects.
 * @apiParam {String} [collection] Retrieve specific collection objects.
 * @apiParam {Number} [page=1] The results page to return.
 * @apiParam {Number} [limit=1000] The number of results to return per page.
 * @apiExample Example Usage:
Actinium.Cloud.run('recycle-archived', { collection: '_User' });
 */
Actinium.Cloud.define(PLUGIN.ID, 'recycle-archived', async req => {
    const cap = await Actinium.Setting.get('recycle.capabilities.retrieve', [
        'Recycle.retrieve',
    ]);

    if (!CloudHasCapabilities(req, cap))
        return Promise.reject(ENUMS.ERRORS.PERMISSION);

    req.params['type'] = 'archive';
    return Actinium.Recycle.retrieve(req.params, CloudRunOptions(req));
});

/**
 * @api {Cloud} recycle recycle
 * @apiVersion 3.1.7
 * @apiGroup Cloud
 * @apiName recycle
 * @apiDescription Move a `Parse.Object` to the `Recycle` collection and mark it as a `delete` type.
 * @apiParam {String} collection The Parse.Object type.
 * @apiParam {Object} object The Parse.Object data.
 * @apiParam {Parse.User} [user] The Parse.User object.
 * @apiExample Example Usage:
Actinium.Cloud.run('recycle', {
  collection: 'SomeCollection',
  object: SomeObject,
});
 */
Actinium.Cloud.define(PLUGIN.ID, 'recycle', async req => {
    const cap = await Actinium.Setting.get('recycle.capabilities.create', [
        'Recycle.create',
    ]);

    if (!CloudHasCapabilities(req, cap))
        return Promise.reject(ENUMS.ERRORS.PERMISSION);

    req.params['user'] = req.user;
    return Actinium.Recycle.trash(req.params, CloudRunOptions(req));
});

/**
 * @api {Cloud} recycle-purge recycle-purge
 * @apiVersion 3.1.7
 * @apiGroup Cloud
 * @apiName recycle-purge
 * @apiDescription Clear the `Recycle` collection.
 * @apiParam {String} [collection] Purge specific collection objects.
 * @apiParam {String} [objectId] Delete a specific collection object.
 * @apiParam {String} [type] Delete a specific type of Recycle objects. Valid options: `archive`, `delete`, `revision`.
 * @apiExample Example Usage:
Actinium.Cloud.run('recycle-purge', { collect: '_User' });
 */
Actinium.Cloud.define(PLUGIN.ID, 'recycle-purge', async req => {
    const cap = await Actinium.Setting.get('recycle.capabilities.delete', [
        'Recycle.delete',
    ]);

    if (!CloudHasCapabilities(req, cap))
        return Promise.reject(ENUMS.ERRORS.PERMISSION);

    return Actinium.Recycle.purge(req.params, CloudRunOptions(req));
});

/**
 * @api {Cloud} recycled recycled
 * @apiVersion 3.1.7
 * @apiGroup Cloud
 * @apiName recycled
 * @apiDescription Retrieve a paginated list of trashed `Recycle` objects.
 * @apiParam {String} [collection] Retrieve specific collection objects.
 * @apiParam {Number} [page=1] The results page to return.
 * @apiParam {Number} [limit=1000] The number of results to return per page.
 * @apiExample Example Usage:
Actinium.Cloud.run('recycled', { collection: '_User' });
 */
Actinium.Cloud.define(PLUGIN.ID, 'recycled', async req => {
    const cap = await Actinium.Setting.get('recycle.capabilities.retrieve', [
        'Recycle.retrieve',
    ]);

    if (!CloudHasCapabilities(req, cap))
        return Promise.reject(ENUMS.ERRORS.PERMISSION);

    return Actinium.Recycle.retrieve(req.params, CloudRunOptions(req));
});

/**
 * @api {Cloud} recycle-restore recycle-restore
 * @apiVersion 3.1.7
 * @apiGroup Cloud
 * @apiName recycle-restore
 * @apiDescription Restore a `Parse.Object` to it's original collection.
 * @apiParam {String} [collection] Restore the most recent specified collection object.
 * @apiParam {String} [objectId] Restore a specific collection object.
 * @apiExample Example Usage:
Actinium.Cloud.run('recycle-restore', { object: 'aetkalq43r'});
 */
Actinium.Cloud.define(PLUGIN.ID, 'recycle-restore', async req => {
    const cap = await Actinium.Setting.get('recycle.capabilities.create', [
        'Recycle.create',
    ]);

    if (!CloudHasCapabilities(req, cap))
        return Promise.reject(ENUMS.ERRORS.PERMISSION);

    return Actinium.Recycle.restore(req.params, CloudRunOptions(req));
});

/**
 * @api {Cloud} recycle-revision recycle-revision
 * @apiVersion 3.1.7
 * @apiGroup Cloud
 * @apiName recycle-revision
 * @apiDescription Move a `Parse.Object` to the `Recycle` collection and mark it as a `revision` type.
 * @apiParam {String} collection The Parse.Object type.
 * @apiParam {Object} object The Parse.Object data.
 * @apiParam {Parse.User} [user] The Parse.User object.
 * @apiExample Example Usage:
Actinium.Cloud.run('recycle-revision', {
  collection: 'SomeCollection',
  object: SomeObject,
});
 */
Actinium.Cloud.define(PLUGIN.ID, 'recycle-revision', async req => {
    const cap = await Actinium.Setting.get('recycle.capabilities.create', [
        'Recycle.create',
    ]);

    if (!CloudHasCapabilities(req, cap))
        return Promise.reject(ENUMS.ERRORS.PERMISSION);

    req.params['user'] = req.user;
    return Actinium.Recycle.revision(req.params, CloudRunOptions(req));
});

/**
 * @api {Cloud} recycle-revisions recycle-revisions
 * @apiVersion 3.1.7
 * @apiGroup Cloud
 * @apiName recycle-revisions
 * @apiDescription Retrieve a paginated list of revision `Recycle` objects.
 * @apiParam {String} [collection] Retrieve specific collection objects.
 * @apiParam {Number} [page=1] The results page to return.
 * @apiParam {Number} [limit=1000] The number of results to return per page.
 * @apiExample Example Usage:
Actinium.Cloud.run('recycle-revisions', { collection: '_User' });
 */
Actinium.Cloud.define(PLUGIN.ID, 'recycle-revisions', async req => {
    const cap = await Actinium.Setting.get('recycle.capabilities.retrieve', [
        'Recycle.retrieve',
    ]);

    if (!CloudHasCapabilities(req, cap))
        return Promise.reject(ENUMS.ERRORS.PERMISSION);

    req.params['type'] = 'revision';
    return Actinium.Recycle.retrieve(req.params, CloudRunOptions(req));
});
