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
        plugin: '0.0.5',
    },
    bundle: [],
    meta: {
        group: 'Networking',
        settings: true,
        builtIn: true,
    },
};

Actinium.Plugin.addScript(
    PLUGIN.ID,
    path.resolve(__dirname, 'plugin-assets/syndicate-client.js'),
    'admin',
);

// Currently no styles, so don't bother trying to upload
// Actinium.Plugin.addStylesheet(
//     PLUGIN.ID,
//     path.resolve(__dirname, 'plugin-assets/syndicate-client-plugin.css'),
//     'admin',
// );

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

Actinium.Hook.register('before-capability-load', async () => {
    // setting caps
    Actinium.Capability.register('setting.SyndicateClient-get', {});
    Actinium.Capability.register('setting.SyndicateClient-set', {});
    Actinium.Capability.register('setting.SyndicateClient-delete', {});
});

Actinium.Hook.register('warning', async () => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;

    const { appId, host, token } = await Actinium.SyndicateClient.settings();

    if (!appId) {
        WARN('');
        WARN(chalk.cyan.bold('Warning:'), 'missing syndicate Application Id');
    }

    if (!host) {
        WARN('');
        WARN(chalk.cyan.bold('Warning:'), 'missing syndicate host');
    }

    if (!token) {
        WARN('');
        WARN(
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

Actinium.Hook.register(
    'syndicate-content-before-save',
    async (content, type, existing, requireManualUpdate = false) => {
        if (
            !requireManualUpdate &&
            Object.values(type.fields).find(
                ({ fieldType }) => fieldType === 'Taxonomy',
            )
        ) {
            const { machineName, collection } = type;
            const contentId = op.set(content, 'meta.syndicate.objectId');
            const response = await Actinium.SyndicateClient.runRemote(
                'syndicate-content-taxonomies-attached',
                { type: { machineName, collection }, contentId },
            );

            const result = op.get(response, 'data.result', {});
            for (const [fieldSlug, remoteTerms] of Object.entries(result)) {
                const terms = [];
                for (const { slug, type } of remoteTerms) {
                    const { objectId: termId } = await Actinium.Taxonomy.exists(
                        {
                            slug,
                            type: type.slug,
                        },
                    );
                    terms.push({ objectId: termId });
                }

                if (terms.length > 0) op.set(content, fieldSlug, terms);
            }
        }
    },
);

Actinium.Hook.register('syndicate-client-sync-begin', async () => {
    Actinium.Cache.set('syndicate.status', 'begin');
});

Actinium.Hook.register('syndicate-client-sync-after-taxonomies', async () => {
    Actinium.Cache.set('syndicate.status', 'after-taxonomies');
});

Actinium.Hook.register('syndicate-client-sync-after-media', async () => {
    Actinium.Cache.set('syndicate.status', 'after-media');
});

Actinium.Hook.register('syndicate-client-sync-after-types', async () => {
    Actinium.Cache.set('syndicate.status', 'after-types');
});

Actinium.Hook.register('syndicate-client-sync-end', async () => {
    Actinium.Cache.set('syndicate.status', 'end');
});

const cloudAPIs = [
    { name: 'syndicate-satellite-test', sdk: 'SyndicateClient.test' },
].forEach(({ name, sdk }) =>
    Actinium.Cloud.define(PLUGIN.ID, name, async req => {
        const cloudFunc = op.get(Actinium, sdk, Promise.resolve);
        return cloudFunc(req);
    }),
);

/**
 * @api {Cloud} syndicate-satellite-sync syndicate-satellite-sync
 * @apiDescription Manually trigger a content synchronization from root site as administrator.
 * @apiPermission Syndicate.ManualSync
 * @apiGroup Cloud
 * @apiName syndicate-satellite-sync
 */
Actinium.Cloud.define(PLUGIN.ID, 'syndicate-satellite-sync', async req => {
    if (!Actinium.Utils.CloudHasCapabilities(req, ['Syndicate.ManualSync']))
        throw new Error('Not permitted.');

    const syncStatus = Actinium.Cache.get('syndicate.status', 'idle');
    const syncContext = Actinium.Cache.get('syndicate.context', {
        label: '',
        count: [0, 0],
    });

    if (syncStatus === 'idle') {
        BOOT('Manual content sync triggered.');
        Actinium.Cache.get('syndicate.status', 'start');
        Actinium.SyndicateClient.sync();
        return 'start';
    }

    return { syncStatus, syncContext };
});

/**
 * @api {Cloud} syndicate-satellite-sync-reset syndicate-satellite-sync-reset
 * @apiDescription Reset sync status to idle, allowing a manual sync.
 * @apiPermission Syndicate.ManualSync
 * @apiGroup Cloud
 * @apiName syndicate-satellite-sync-reset
 */
Actinium.Cloud.define(
    PLUGIN.ID,
    'syndicate-satellite-sync-reset',
    async req => {
        if (!Actinium.Utils.CloudHasCapabilities(req, ['Syndicate.ManualSync']))
            throw new Error('Not permitted.');

        Actinium.Cache.set('syndicate.status', 'idle');
        Actinium.Cache.set('syndicate.context', {
            label: '',
            count: [0, 0],
        });

        return 'ok';
    },
);
