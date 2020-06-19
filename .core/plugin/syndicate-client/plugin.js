const chalk = require('chalk');
const op = require('object-path');
const { CloudRunOptions } = require(`${ACTINIUM_DIR}/lib/utils`);
const path = require('path');

const PLUGIN = {
    ID: 'SyndicateClient',
    description: 'Subscribe to syndicated content on root site.',
    name: 'SyndicateClient',
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
    path.resolve(__dirname, 'plugin-assets/syndicate-client.js'),
);
Actinium.Plugin.addStylesheet(
    PLUGIN.ID,
    path.resolve(__dirname, 'plugin-assets/syndicate-client-plugin.css'),
);

/**
 * ----------------------------------------------------------------------------
 * Extend Actinium SDK
 * ----------------------------------------------------------------------------
 */
const PLUGIN_SDK = require('./sdk');
Actinium['SyndicateClient'] = op.get(Actinium, 'SyndicateClient', PLUGIN_SDK);

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
Actinium.Hook.register('warning', async () => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;

    const { appId, host, token } = await Actinium.SyndicateClient.settings();

    if (!appId) {
        LOG('');
        LOG(chalk.cyan.bold('Warning:'), 'missing syndicate Application Id');
    }

    if (!host) {
        LOG('');
        LOG(chalk.cyan.bold('Warning:'), 'missing syndicate host');
    }

    if (!token) {
        LOG('');
        LOG(
            chalk.cyan.bold('Warning:'),
            'missing syndicate client refresh token',
        );
    }
});

Actinium.Hook.register('running', async () => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
    const { schedule } = await Actinium.SyndicateClient.settings();

    Actinium.Pulse.define(
        'syndicate-synchronize',
        {
            schedule,
        },
        Actinium.SyndicateClient.sync,
    );

    await Actinium.SyndicateClient.sync();
});

const cloudAPIs = [
    { name: 'syndicate-satellite-test', sdk: 'SyndicateClient.test' },
].forEach(({ name, sdk }) =>
    Actinium.Cloud.define(PLUGIN.ID, name, async req => {
        const cloudFunc = op.get(Actinium, sdk, Promise.resolve);
        return cloudFunc(req);
    }),
);
