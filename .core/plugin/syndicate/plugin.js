const chalk = require('chalk');
const op = require('object-path');
const Enums = require('./enums');
const path = require('path');

const PLUGIN = {
    ID: 'Syndicate',
    description:
        'Enable Syndicated content to be served across Reactium cloud sites.',
    name: 'Syndicate Plugin',
    order: 100,
    version: {
        actinium: '>=3.2.6',
        plugin: '0.0.2',
    },
    bundle: [],
    meta: {
        settings: true,
        builtIn: true,
    },
};

Actinium.Plugin.addScript(
    PLUGIN.ID,
    path.resolve(__dirname, 'plugin-assets/syndicate.js'),
);
Actinium.Plugin.addStylesheet(
    PLUGIN.ID,
    path.resolve(__dirname, 'plugin-assets/syndicate-plugin.css'),
);

/**
 * ----------------------------------------------------------------------------
 * Extend Actinium SDK
 * ----------------------------------------------------------------------------
 */
const PLUGIN_SDK = require('./sdk');
Actinium['Syndicate'] = op.get(Actinium, 'Syndicate', PLUGIN_SDK);

/**
 * ----------------------------------------------------------------------------
 * Plugin registration
 * ----------------------------------------------------------------------------
 */
Actinium.Plugin.register(PLUGIN, false);

/**
 * ----------------------------------------------------------------------------
 * Hook registration
 * ----------------------------------------------------------------------------
 */

Actinium.Hook.register('schema', async () => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
    const options = Actinium.Utils.MasterOptions();

    const { Syndicate } = require('./schema');
    const { actions = {}, collection, schema = {} } = Syndicate;
    if (!collection) return;

    const { types = [] } = await Actinium.Type.list({}, options);

    // Automatically Add Each Content Type Pointer
    types.forEach(type => {
        schema[type.machineName] = {
            type: 'Pointer',
            targetClass: type.collection,
        };
    });

    Actinium.Collection.register(collection, actions, schema);
});

Actinium.Hook.register('schema', async () => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
    const options = Actinium.Utils.MasterOptions();

    const { SyndicateClient } = require('./schema');
    const { actions = {}, collection, schema = {} } = SyndicateClient;

    if (!collection) return;
    Actinium.Collection.register(collection, actions, schema);
});

Actinium.Hook.register('warning', () => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;

    const DEFAULT_ACCESS_SECRET = op.get(Enums, 'DEFAULT_ACCESS_SECRET');
    const ACCESS_SECRET = op.get(ENV, 'ACCESS_SECRET', DEFAULT_ACCESS_SECRET);
    const DEFAULT_REFRESH_SECRET = op.get(Enums, 'DEFAULT_REFRESH_SECRET');
    const REFRESH_SECRET = op.get(
        ENV,
        'REFRESH_SECRET',
        DEFAULT_REFRESH_SECRET,
    );

    if (ACCESS_SECRET === DEFAULT_ACCESS_SECRET) {
        LOG('');
        LOG(
            chalk.cyan.bold('Warning:'),
            `ENV.ACCESS_SECRET set to default value ${DEFAULT_ACCESS_SECRET}`,
        );
    }

    if (REFRESH_SECRET === DEFAULT_REFRESH_SECRET) {
        LOG('');
        LOG(
            chalk.cyan.bold('Warning:'),
            `ENV.REFRESH_SECRET set to default value ${DEFAULT_REFRESH_SECRET}`,
        );
    }
});

const cloudAPIs = [
    { name: 'syndicate-client-create', sdk: 'Syndicate.Client.create' },
    { name: 'syndicate-client-retrieve', sdk: 'Syndicate.Client.retrieve' },
    { name: 'syndicate-client-delete', sdk: 'Syndicate.Client.delete' },
    { name: 'syndicate-clients', sdk: 'Syndicate.Client.list' },
    { name: 'syndicate-client-token', sdk: 'Syndicate.Client.token' },
    { name: 'syndicate-client-verify', sdk: 'Syndicate.Client.verify' },
    { name: 'syndicate-content-types', sdk: 'Syndicate.Content.types' },
    { name: 'syndicate-content-list', sdk: 'Syndicate.Content.list' },
].forEach(({ name, sdk }) =>
    Actinium.Cloud.define(PLUGIN.ID, name, async req => {
        const cloudFunc = op.get(Actinium, sdk, Promise.resolve);
        return cloudFunc(req);
    }),
);
