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

const getClientSettings = async () => {
    const SyndicateClient = await Actinium.Setting.get('SyndicateClient');
    return {
        appId: op.get(SyndicateClient, 'appId'),
        host: op.get(SyndicateClient, 'host'),
        token: op.get(SyndicateClient, 'token'),
        cron: op.get(SyndicationClient, 'cron', '*/30 * * * *'),
        enabled: op.get(SyndicationClient, 'enabled', false),
    };
};

Actinium.Hook.register('warning', async () => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;

    const { appId, host, token } = await getClientSettings();

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
