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
Actinium.Cloud.define(PLUGIN.ID, 'archive', req => {
    const cap = Actinium.Setting.get('recycle.capabilities.create', [
        'Recycle.create',
    ]);

    if (!CloudHasCapabilities(req, cap))
        return Promise.reject(ENUMS.ERRORS.PERMISSION);

    req.params['user'] = req.user;
    return Actinium.Recycle.archive(req.params, CloudRunOptions(req));
});

Actinium.Cloud.define(PLUGIN.ID, 'archived', req => {
    const cap = Actinium.Setting.get('recycle.capabilities.retrieve', [
        'Recycle.retrieve',
    ]);

    if (!CloudHasCapabilities(req, cap))
        return Promise.reject(ENUMS.ERRORS.PERMISSION);

    req.params['type'] = 'archive';
    return Actinium.Recycle.retrieve(req.params, CloudRunOptions(req));
});

Actinium.Cloud.define(PLUGIN.ID, 'recycle', req => {
    const cap = Actinium.Setting.get('recycle.capabilities.create', [
        'Recycle.create',
    ]);

    if (!CloudHasCapabilities(req, cap))
        return Promise.reject(ENUMS.ERRORS.PERMISSION);

    req.params['user'] = req.user;
    return Actinium.Recycle.trash(req.params, CloudRunOptions(req));
});

Actinium.Cloud.define(PLUGIN.ID, 'recycle-purge', req => {
    const cap = Actinium.Setting.get('recycle.capabilities.delete', [
        'Recycle.delete',
    ]);

    if (!CloudHasCapabilities(req, cap))
        return Promise.reject(ENUMS.ERRORS.PERMISSION);

    return Actinium.Recycle.purge(req.params, CloudRunOptions(req));
});

Actinium.Cloud.define(PLUGIN.ID, 'recycled', req => {
    const cap = Actinium.Setting.get('recycle.capabilities.retrieve', [
        'Recycle.retrieve',
    ]);

    if (!CloudHasCapabilities(req, cap))
        return Promise.reject(ENUMS.ERRORS.PERMISSION);

    return Actinium.Recycle.retrieve(req.params, CloudRunOptions(req));
});

Actinium.Cloud.define(PLUGIN.ID, 'restore', req => {
    const cap = Actinium.Setting.get('recycle.capabilities.create', [
        'Recycle.create',
    ]);

    if (!CloudHasCapabilities(req, cap))
        return Promise.reject(ENUMS.ERRORS.PERMISSION);

    return Actinium.Recycle.restore(req.params, CloudRunOptions(req));
});

Actinium.Cloud.define(PLUGIN.ID, 'revision', req => {
    const cap = Actinium.Setting.get('recycle.capabilities.create', [
        'Recycle.create',
    ]);

    if (!CloudHasCapabilities(req, cap))
        return Promise.reject(ENUMS.ERRORS.PERMISSION);

    req.params['user'] = req.user;
    return Actinium.Recycle.revision(req.params, CloudRunOptions(req));
});

Actinium.Cloud.define(PLUGIN.ID, 'revisions', req => {
    const cap = Actinium.Setting.get('recycle.capabilities.retrieve', [
        'Recycle.retrieve',
    ]);

    if (!CloudHasCapabilities(req, cap))
        return Promise.reject(ENUMS.ERRORS.PERMISSION);

    req.params['type'] = 'revision';
    return Actinium.Recycle.retrieve(req.params, CloudRunOptions(req));
});
