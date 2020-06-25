const chalk = require('chalk');
const op = require('object-path');
const _ = require('underscore');
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

Actinium.Hook.register(
    'syndicate-content-before-save',
    async (content, type, existing, requireManualUpdate = false) => {
        const masterOptions = Actinium.Utils.MasterOptions();

        // ignore urls changes if content has been marked for manual update only
        if (!requireManualUpdate) {
            const syncedURLs = op.get(content, 'meta.syndicate.urls', {});
            if (!Boolean(existing)) {
                if (Object.values(syncedURLs).length) {
                    op.set(
                        content,
                        'urls',
                        _.indexBy(
                            Object.values(syncedURLs).map(url => {
                                op.set(url, 'objectId', Number(new Date()));
                                op.set(url, 'pending', true);
                                return url;
                            }),
                        ),
                        'objectId',
                    );
                }
            } else {
                const contentId = op.get(existing, 'objectId');
                const { results: existingURLs = {} } = await Actinium.URL.list(
                    { contentId },
                    masterOptions,
                );

                const urls = {};
                const current = Object.values(existingURLs);
                const synced = Object.values(syncedURLs);

                // existing urls on the satellite
                current.forEach(url => {
                    const { route, objectId } = url;
                    // remove routes that no longer exist on root site
                    if (!op.has(syncedURLs, [route])) {
                        op.set(url, 'pending', true);
                        op.set(url, 'delete', true);
                        op.set(urls, [objectId], url);
                    }
                });

                // urls from root
                synced.forEach(url => {
                    const [found] = _.where(current, { route: url.route });
                    if (!found) {
                        const objectId = Number(new Date());
                        op.set(url, 'objectId', objectId);
                        op.set(url, 'pending', true);
                        op.set(urls, [objectId], url);
                    }
                });

                // if changes to urls, add them before save
                if (Object.values(urls).length) op.set(content, 'urls', urls);
            }
        }
    },
);

const cloudAPIs = [
    { name: 'syndicate-satellite-test', sdk: 'SyndicateClient.test' },
].forEach(({ name, sdk }) =>
    Actinium.Cloud.define(PLUGIN.ID, name, async req => {
        const cloudFunc = op.get(Actinium, sdk, Promise.resolve);
        return cloudFunc(req);
    }),
);
