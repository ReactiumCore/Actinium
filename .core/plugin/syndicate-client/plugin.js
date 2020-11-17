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
    Actinium.Capability.register('syndicate.manualsync', {});
});

Actinium.Hook.register('warning', async () => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;

    const { appId, host, token } = await Actinium.SyndicateClient.settings();

    if (!appId) {
        WARN('');
        WARN(
            chalk.cyan.bold('Warning:'),
            chalk.magenta.bold('Syndication Client'),
            'missing syndicate Application Id',
        );
    }

    if (!host) {
        WARN('');
        WARN(
            chalk.cyan.bold('Warning:'),
            chalk.magenta.bold('Syndication Client'),
            'missing syndicate host',
        );
    }

    if (!token) {
        WARN('');
        WARN(
            chalk.cyan.bold('Warning:'),
            chalk.magenta.bold('Syndication Client'),
            'missing syndicate client refresh token',
        );
    }

    if (appId && host && token) {
        const valid = await Actinium.SyndicateClient.test(
            null,
            Actinium.Utils.MasterOptions(),
        );
        if (!valid) {
            WARN('');
            WARN(
                chalk.cyan.bold('Warning:'),
                chalk.magenta.bold('Syndication Client'),
                'unable to connect to syndication host',
            );
        }
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

// Attach Routes
Actinium.Hook.register(
    'syndicate-content-before-save',
    async (content, type, existing) => {
        const masterOptions = Actinium.Utils.MasterOptions();

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
    },
);

// Attach Taxonomies
Actinium.Hook.register(
    'syndicate-content-before-save',
    async (content, type, existing) => {
        if (
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

// Attach Media
Actinium.Hook.register(
    'syndicate-content-before-save',
    async (content, type, existing) => {
        const fieldSlugs = Object.values(type.fields)
            .filter(({ fieldType }) => fieldType === 'Media')
            .map(({ fieldName }) => Actinium.Utils.slugify(fieldName));

        if (fieldSlugs.length > 0) {
            const mediaMappings = Actinium.Cache.get(
                ['syndicate', 'mappings', 'media'],
                {},
            );

            for (const fieldSlug of fieldSlugs) {
                const media = op.get(content, fieldSlug);
                if (Array.isArray(media)) {
                    op.set(
                        content,
                        fieldSlug,
                        _.compact(
                            media.map(item => {
                                const localMediaId = op.get(
                                    mediaMappings,
                                    op.get(item, 'objectId', 'undefined'),
                                    '',
                                );
                                if (localMediaId)
                                    return { objectId: localMediaId };
                            }),
                        ),
                    );
                }
            }
        }
    },
);

// Stage content relations fields for migration
Actinium.Hook.register(
    'syndicate-content-before-save',
    async (content, type, existing, manual, localType) => {
        const relationFields = Object.entries(localType.schema).filter(
            ([, schema]) =>
                schema.targetClass && /^Content_/.test(schema.targetClass),
        );

        const stage = {
            uuid: content.uuid,
            type: { uuid: type.uuid },
            relationFields,
            staged: {},
        };
        let passNeeded = false;

        for (const [fieldSlug, fieldSchema] of relationFields) {
            const fieldType = fieldSchema.type;
            const field = op.get(content, [fieldSlug]);

            if (fieldType === 'Pointer' && op.has(field, ['objectId'])) {
                passNeeded = true;
                op.set(stage, ['staged', fieldSlug], {
                    objectId: field.objectId,
                });
            } else if (fieldType === 'Relation' && Array.isArray(field)) {
                if (field.length > 0) passNeeded = true;
                op.set(
                    stage,
                    ['staged', fieldSlug],
                    field.map(({ objectId }) => ({ objectId })),
                );
            }
        }

        if (passNeeded) {
            Actinium.Cache.set(
                ['syndicate', 'contentRelations', content.uuid],
                stage,
            );
        }
    },
);

Actinium.Hook.register('syndicate-client-sync-relations', async () => {
    const contentRelations = Actinium.Cache.get('syndicate.contentRelations');
    const context = {
        label: 'Relation',
        count: [0, Object.values(contentRelations).length],
    };

    Actinium.Cache.set('syndicate.context', context);

    for (const { uuid, type, relationFields, staged } of Object.values(
        contentRelations,
    )) {
        const mapped = {};
        let hasMapping = false;
        for (const [fieldSlug, schema] of relationFields) {
            const field = op.get(staged, [fieldSlug]);

            if (schema.type === 'Pointer' && op.has(field, ['objectId'])) {
                const objectId = Actinium.Cache.get([
                    'syndicate',
                    'mappings',
                    'content',
                    field.objectId,
                ]);

                if (objectId) {
                    hasMapping = true;
                    op.set(mapped, [fieldSlug], { objectId });
                }
            } else if (schema.type === 'Relation' && Array.isArray(field)) {
                op.set(
                    mapped,
                    [fieldSlug],
                    _.compact(
                        field.map(item => {
                            const objectId = Actinium.Cache.get([
                                'syndicate',
                                'mappings',
                                'content',
                                item.objectId,
                            ]);
                            if (objectId) {
                                hasMapping = true;
                                return { objectId };
                            }
                        }),
                    ),
                );
            }
        }

        if (hasMapping) {
            await Actinium.Content.update(
                { uuid, type, ...mapped },
                Actinium.Utils.MasterOptions(),
            );
        }

        context.count[0]++;
        Actinium.Cache.set('syndicate.context', context);
    }
});

Actinium.Hook.register('syndicate-client-sync-end', () => {
    Actinium.Cache.del('syndicate');
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
 * @apiPermission syndicate.manualsync
 * @apiGroup Cloud
 * @apiName syndicate-satellite-sync
 */
Actinium.Cloud.define(PLUGIN.ID, 'syndicate-satellite-sync', async req => {
    if (!Actinium.Utils.CloudHasCapabilities(req, ['syndicate.manualsync']))
        throw new Error('Not permitted.');

    let syncStatus = Actinium.Cache.get('syndicate.status');

    const syncContext = Actinium.Cache.get('syndicate.context', {
        label: '',
        count: [0, 0],
    });

    if (!syncStatus || syncStatus === 'end') {
        BOOT('Manual content sync triggered.');
        syncStatus = 'begin';
        Actinium.Cache.set('syndicate.status', syncStatus);
        Actinium.SyndicateClient.sync();
        syncStatus = Actinium.Cache.get('syndicate.status', syncStatus);
    }

    return { syncStatus, syncContext };
});

Actinium.Cloud.define(PLUGIN.ID, 'syndicate-satellite-status', async req => {
    if (!Actinium.Utils.CloudHasCapabilities(req, ['syndicate.manualsync']))
        throw new Error('Not permitted.');

    let syncStatus = Actinium.Cache.get('syndicate.status');
    if (!syncStatus) {
        syncStatus = 'end';
        Actinium.Cache.set('syndicate.status', syncStatus);
    }

    const syncContext = Actinium.Cache.get('syndicate.context', {
        label: '',
        count: [0, 0],
    });

    return { syncStatus, syncContext };
});

/**
 * @api {Cloud} syndicate-satellite-sync-reset syndicate-satellite-sync-reset
 * @apiDescription Reset sync status to "end", allowing a manual sync.
 * @apiPermission syndicate.manualsync
 * @apiGroup Cloud
 * @apiName syndicate-satellite-sync-reset
 */
Actinium.Cloud.define(
    PLUGIN.ID,
    'syndicate-satellite-sync-reset',
    async req => {
        if (!Actinium.Utils.CloudHasCapabilities(req, ['syndicate.manualsync']))
            throw new Error('Not permitted.');

        Actinium.Cache.set('syndicate.status', 'end');
        Actinium.Cache.set('syndicate.context', {
            label: '',
            count: [0, 0],
        });

        return 'ok';
    },
);
