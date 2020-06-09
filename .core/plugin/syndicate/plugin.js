const chalk = require('chalk');
const op = require('object-path');
const Enums = require('./enums');

const PLUGIN = {
    ID: 'Syndicate',
    description:
        'Enable Syndicated content to be served across Reactium cloud sites.',
    name: 'Syndicate Plugin',
    order: 100,
    version: {
        actinium: '>=3.2.6',
        plugin: '0.0.1',
    },
    bundle: [],
    meta: {
        builtIn: true,
    },
};

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

Actinium.Cloud.define(PLUGIN.ID, 'syndicate-client-create', async req =>
    Actinium.Syndicate.Client.create(req, Actinium.Utils.CloudRunOptions(req)),
);

Actinium.Cloud.define(PLUGIN.ID, 'syndicate-client-retrieve', async req =>
    Actinium.Syndicate.Client.retrieve(
        req,
        Actinium.Utils.CloudRunOptions(req),
    ),
);

Actinium.Cloud.define(PLUGIN.ID, 'syndicate-clients', async req =>
    Actinium.Syndicate.Client.list(req, Actinium.Utils.CloudRunOptions(req)),
);

Actinium.Cloud.define(PLUGIN.ID, 'syndicate-client-delete', async req =>
    Actinium.Syndicate.Client.delete(req, Actinium.Utils.CloudRunOptions(req)),
);

Actinium.Cloud.define(PLUGIN.ID, 'syndicate-client-token', async req =>
    Actinium.Syndicate.Client.token(req),
);

Actinium.Cloud.define(PLUGIN.ID, 'syndicate-client-verify', async req =>
    Actinium.Syndicate.Client.verify(req),
);
