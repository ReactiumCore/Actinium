const op = require('object-path');
const SyndicateClient = {};
const axios = require('axios');
const chalk = require('chalk');
const _ = require('underscore');

SyndicateClient.settings = async () => {
    const SyndicateClient = await Actinium.Setting.get('SyndicateClient');
    const defaultSchedule = '*/30 * * * *';
    let schedule = op.get(SyndicateClient, 'cron', defaultSchedule);
    schedule =
        schedule && typeof schedule === 'string' && schedule.length > 0
            ? schedule
            : defaultSchedule;

    return {
        appId: op.get(SyndicateClient, 'appId'),
        host: op.get(SyndicateClient, 'host'),
        token: op.get(SyndicateClient, 'token'),
        schedule,
        enable: op.get(SyndicateClient, 'enable', false),
    };
};

SyndicateClient.hasCreds = async () => {
    const {
        appId: _ApplicationId,
        host,
        token: refreshToken,
    } = await Actinium.SyndicateClient.settings();

    return _ApplicationId && host && refreshToken;
};

SyndicateClient.isEnabled = async () => {
    const { enable } = await Actinium.SyndicateClient.settings();

    const hasCreds = await SyndicateClient.hasCreds();
    return enable && hasCreds;
};

SyndicateClient.token = async () => {
    const {
        appId: _ApplicationId,
        host,
        token,
    } = await Actinium.SyndicateClient.settings();

    try {
        // get access token
        const response = await axios.post(
            `${host}/functions/syndicate-client-token`,
            {
                _ApplicationId,
                token,
            },
        );

        return op.get(response, 'data.result.token', false);
    } catch (error) {
        return false;
    }
};

SyndicateClient.test = async req => {
    if (
        !Actinium.Utils.CloudHasCapabilities(req, [
            'setting.SyndicateClient-get',
        ])
    )
        throw new Error('Permission Denied');

    const token = await SyndicateClient.token();
    return !!token;
};

SyndicateClient.runRemote = async (funcName, params = {}) => {
    const hasCreds = await SyndicateClient.hasCreds();
    if (!hasCreds) throw new Error('Missing syndicate connection details.');
    if (!funcName || typeof funcName !== 'string')
        throw new Error('Invalid function name.');

    const {
        appId: _ApplicationId,
        host,
    } = await Actinium.SyndicateClient.settings();
    const func = `${host}/functions/${funcName}`;

    // Get access token
    const token = await SyndicateClient.token();

    if (!token)
        throw new Error(
            `Error retrieving access token while running ${funcName}`,
        );

    // Run remote cloud function
    try {
        const result = await axios.post(func, {
            _ApplicationId,
            token,
            ...params,
        });

        return result;
    } catch (error) {
        ERROR(error);
    }
};

SyndicateClient.syncTypes = async () => {
    const enabled = await await SyndicateClient.isEnabled();
    if (!enabled) return;
    const masterOptions = Actinium.Utils.MasterOptions();

    const result = await SyndicateClient.runRemote('syndicate-content-types');
    const remoteTypes = op.get(result, 'data.result', []);
    const { types = [] } = await Actinium.Type.list({}, masterOptions);

    if (remoteTypes.length) INFO(' ');
    for (const remoteType of remoteTypes) {
        const {
            objectId: remoteObjectId,
            createdAt: remoteCreatedAt,
            updatedAt: remoteUpdatedAt,
            slugs,
            meta = {},
            ...type
        } = remoteType;

        // Synchronization meta data
        op.set(meta, 'remoteObjectId', remoteObjectId);
        op.set(meta, 'remoteCreatedAt', remoteCreatedAt);
        op.set(meta, 'remoteUpdatedAt', remoteUpdatedAt);
        op.set(type, 'meta', meta);

        INFO(
            chalk.cyan(
                'Synchronizing syndicated type:',
                op.get(type, 'meta.label', op.get(type, 'type')),
            ),
        );

        await Actinium.Hook.run('syndicate-type-before-save', type);

        // Update
        let saved;
        if (types.find(t => t.machineName === type.machineName)) {
            saved = await Actinium.Type.update(type, masterOptions);
        } else {
            saved = await Actinium.Type.create(type, masterOptions);
        }

        await Actinium.Hook.run('syndicate-type-saved', saved);
    }

    return remoteTypes.map(({ objectId, ...type }) => type);
};

SyndicateClient.syncMediaDirectories = async () => {
    const masterOptions = Actinium.Utils.MasterOptions();
    let page = 1;
    let response = await SyndicateClient.runRemote(
        'syndicate-content-media-directories',
        { limit: 10, page: page++ },
    );

    let results = Object.values(op.get(response, 'data.result.results', {}));
    while (results.length) {
        for (const {
            user,
            createdAt,
            updatedAt,
            ACL,
            objectId,
            ...result
        } of results) {
            const query = new Parse.Query('MediaDirectory');
            query.equalTo('directory', result.directory);
            let directory = await query.first(masterOptions);
            if (!directory) {
                directory = new Parse.Object('MediaDirectory');
                directory.set('directory', result.directory);
                directory.set('capabilities', result.capabilities);

                await Actinium.Hook.run(
                    'syndicate-media-directory-before-save',
                    directory,
                );

                INFO(
                    chalk.cyan(
                        `Creating synced media directory ${result.directory}`,
                    ),
                );

                await directory.save(null, masterOptions);

                await Actinium.Hook.run(
                    'syndicate-media-directory-saved',
                    directory,
                );
            }
        }

        // next page
        response = await SyndicateClient.runRemote(
            'syndicate-content-media-directories',
            { limit: 10, page: page++ },
        );
        results = Object.values(op.get(response, 'data.result.results', {}));
    }
};

SyndicateClient.syncMedia = async () => {
    const masterOptions = Actinium.Utils.MasterOptions();
    const { host: apiURL } = await Actinium.SyndicateClient.settings();

    let page = 1;
    let response = await SyndicateClient.runRemote('syndicate-content-media', {
        limit: 10,
        page: page++,
    });

    let results = Object.values(op.get(response, 'data.result.results', {}));
    while (results.length) {
        for (const {
            file,
            user,
            thumbnail,
            createdAt,
            updatedAt,
            objectId,
            meta = {},
            redirect = {},
            ...result
        } of results) {
            op.set(meta, 'syndicate.createdAt', createdAt);
            op.set(meta, 'syndicate.updatedAt', updatedAt);
            op.set(meta, 'syndicate.objectId', objectId);
            op.set(meta, 'syndicate.user', user);
            op.set(result, 'meta', meta);

            const query = new Parse.Query('Media');
            query.equalTo('url', result.url);
            query.equalTo('filename', result.filename);

            let media = await query.first(masterOptions);
            if (!media) {
                media = new Parse.Object('Media');
            }

            for (const [key, value] of Object.entries(result))
                media.set(key, value);
            media.set('meta', meta);

            // absolute urls
            if (/^https?:/.test(result.url))
                op.set(redirect, 'url', result.url);
            // api urls should be redirected to syndication host
            else {
                let {
                    protocol,
                    hostname,
                    port,
                    pathname,
                } = require('url').parse(apiURL);
                port = ['80', '443'].includes(port) ? '' : `:${port}`;
                const baseURL = `${protocol}//${hostname}${port}`;
                // media urls
                if (/^\/media/.test(result.url))
                    op.set(redirect, 'url', `${baseURL}${result.url}`);
                // file api urls
                else op.set(redirect, 'url', `${apiURL}${result.url}`);
            }
            media.set('redirect', redirect);

            await Actinium.Hook.run('syndicate-media-before-save', media);

            INFO(chalk.cyan(`Syncing media file ${result.url}`));

            await media.save(null, masterOptions);

            await Actinium.Hook.run('syndicate-media-saved', media);
        }

        // next page
        response = await SyndicateClient.runRemote('syndicate-content-media', {
            limit: 10,
            page: page++,
        });
        results = Object.values(op.get(response, 'data.result.results', {}));
    }
};

const simplifyURLS = (urls = {}, type = {}) =>
    _.indexBy(
        Object.values(urls).map(url => {
            op.del(url, 'meta.contentId');
            op.set(url, 'meta.type', op.get(type, 'machineName'));
            op.set(url, 'meta.collection', op.get(type, 'collection'));
            op.del(url, 'objectId');
            op.del(url, 'createdAt');
            op.del(url, 'updatedAt');

            return url;
        }),
        'route',
    );

SyndicateClient.syncContent = async (remoteTypes = []) => {
    const masterOptions = Actinium.Utils.MasterOptions();
    for (const type of remoteTypes) {
        let page = 1;
        let response = await SyndicateClient.runRemote(
            'syndicate-content-list',
            { type, resolveRelations: true, limit: 10, page: page++ },
        );
        let results = op.get(response, 'data.result.results', []);
        let theCount = [0, op.get(response, 'data.result.count')];
        Actinium.Cache.set('syndicate.context', {
            label: op.get(type, 'machineName'),
            count: theCount,
        });

        while (results.length) {
            for (const content of results) {
                const {
                    objectId,
                    type: sourceType,
                    branches,
                    history,
                    user,
                    ACL,
                    publish,
                    createdAt,
                    updatedAt,
                    urls = {},
                    ...syncContent
                } = content;
                theCount[0]++;
                Actinium.Cache.set('syndicate.context', {
                    label: op.get(type, 'machineName'),
                    count: theCount,
                });

                op.set(syncContent, 'meta.syndicate.objectId', objectId);
                op.set(syncContent, 'meta.syndicate.sourceType', sourceType);
                op.set(syncContent, 'meta.syndicate.branches', branches);
                op.set(syncContent, 'meta.syndicate.history', history);
                op.set(syncContent, 'meta.syndicate.user', user);
                op.set(syncContent, 'meta.syndicate.createdAt', createdAt);
                op.set(syncContent, 'meta.syndicate.updatedAt', updatedAt);
                op.set(
                    syncContent,
                    'meta.syndicate.urls',
                    simplifyURLS(urls, type),
                );

                // check to see if each result already exists
                const existing = await Actinium.Content.retrieve(
                    { type, slug: syncContent.slug, current: true },
                    masterOptions,
                );

                const typeLabel = op.get(
                    type,
                    'meta.label',
                    op.get(type, 'type'),
                );
                const contentLabel = op.get(
                    syncContent,
                    'title',
                    op.get(syncContent, 'slug'),
                );

                // if it does exist, check to see if it shouldn't be automatically updated
                if (existing) {
                    const manual =
                        op.get(existing, 'meta.syndicate.manual', false) ===
                        true;

                    op.set(syncContent, 'meta.syndicate.manual', manual);

                    const from =
                        op.get(existing, 'meta.syndicate.history.branch') +
                        op.get(existing, 'meta.syndicate.history.revision');
                    const to =
                        op.get(syncContent, 'meta.syndicate.history.branch') +
                        op.get(syncContent, 'meta.syndicate.history.revision');

                    // content updated
                    if (updatedAt !== existing.updatedAt || from !== to) {
                        INFO(
                            chalk.cyan(
                                `Updating syndicated ${typeLabel} content`,
                                contentLabel,
                            ),
                        );

                        if (manual === true) {
                            await Actinium.Hook.run(
                                'syndicate-content-before-save',
                                syncContent,
                                type,
                                existing,
                                manual === true,
                            );

                            if (!op.get(existing, 'branches.syndicate')) {
                                await Actinium.Content.cloneBranch(
                                    {
                                        ...existing,
                                        branchLabel: 'Syndicate',
                                        newBranchId: 'syndicate',
                                    },
                                    masterOptions,
                                );
                            }

                            const local = await Actinium.Content.update(
                                {
                                    type,
                                    history: { branch: 'syndicate' },
                                    ...syncContent,
                                },
                                masterOptions,
                            );
                            await Actinium.Hook.run(
                                'syndicate-content-saved',
                                local,
                                type,
                                existing,
                                manual === true,
                            );
                        } else {
                            await Actinium.Hook.run(
                                'syndicate-content-before-save',
                                syncContent,
                                type,
                                existing,
                                manual === true,
                            );

                            if (!op.get(existing, 'branches.syndicate')) {
                                await Actinium.Content.cloneBranch(
                                    {
                                        ...existing,
                                        branchLabel: 'Syndicate',
                                        newBranchId: 'syndicate',
                                    },
                                    masterOptions,
                                );
                            }

                            // If sync is on, update the local copy
                            const local = await Actinium.Content.update(
                                { type, ...syncContent },
                                masterOptions,
                            );

                            // Keep syndication branch up to date with synced changes
                            await Actinium.Content.update(
                                {
                                    type,
                                    ...local,
                                    history: { branch: 'syndicate' },
                                },
                                masterOptions,
                            );

                            // publish synced version
                            await Actinium.Content.publish(
                                local,
                                masterOptions,
                            );

                            await Actinium.Hook.run(
                                'syndicate-content-saved',
                                local,
                                type,
                                existing,
                                manual === true,
                            );
                        }
                    }
                    // if it doesn't exist, create/publish it
                } else {
                    INFO(
                        chalk.cyan(
                            `Creating syndicated ${typeLabel} content`,
                            contentLabel,
                        ),
                    );
                    await Actinium.Hook.run(
                        'syndicate-content-before-save',
                        syncContent,
                        type,
                        false,
                        false,
                    );
                    const local = await Actinium.Content.create(
                        { type, ...syncContent },
                        masterOptions,
                    );
                    await Actinium.Content.cloneBranch(
                        {
                            ...local,
                            branchLabel: 'Syndicate',
                            newBranchId: 'syndicate',
                        },
                        masterOptions,
                    );
                    await Actinium.Content.publish(local, masterOptions);
                    await Actinium.Hook.run(
                        'syndicate-content-saved',
                        local,
                        type,
                        false,
                        false,
                    );
                }
            }

            // next page
            response = await SyndicateClient.runRemote(
                'syndicate-content-list',
                { type, limit: 10, page: page++ },
            );
            results = op.get(response, 'data.result.results', []);
        }
    }
};

SyndicateClient.syncTaxonomyTypes = async () => {
    const masterOptions = Actinium.Utils.MasterOptions();
    let page = 1;
    let response = await SyndicateClient.runRemote(
        'syndicate-content-taxonomy-types',
        { limit: 10, page: page++ },
    );

    let results = Object.values(op.get(response, 'data.result.results', {}));
    let types = {};
    while (results.length) {
        for (const {
            user,
            createdAt,
            updatedAt,
            ACL,
            objectId,
            ...result
        } of results) {
            const { name, slug, description } = result;
            INFO(chalk.cyan(`Syncing taxonomy type ${name} (${slug})`));
            const { objectId: existingId } =
                (await Actinium.Taxonomy.Type.exists({ slug })) || {};
            const taxType = { name, slug, description };
            if (existingId) op.set(taxType, 'objectId', existingId);

            await Actinium.Hook.run(
                'syndicate-content-taxonomy-types-before-save',
                taxType,
            );

            await Actinium.Taxonomy.Type.update(taxType);
            types[slug] = taxType;
        }

        // next page
        response = await SyndicateClient.runRemote(
            'syndicate-content-taxonomy-types',
            { limit: 10, page: page++ },
        );
        results = Object.values(op.get(response, 'data.result.results', {}));
    }

    return types;
};

SyndicateClient.syncTaxonomies = async taxTypes => {
    const masterOptions = Actinium.Utils.MasterOptions();
    let page = 1;
    let response = await SyndicateClient.runRemote(
        'syndicate-content-taxonomies',
        { limit: 10, page: page++ },
    );

    let results = Object.values(op.get(response, 'data.result.results', {}));
    while (results.length) {
        for (const {
            user,
            createdAt,
            updatedAt,
            ACL,
            objectId,
            ...result
        } of results) {
            const { name, slug, description, type = {} } = result;
            const { slug: typeSlug } = type;

            INFO(chalk.cyan(`Syncing taxonomy ${slug} of type ${typeSlug}.`));

            const { objectId: existingId } =
                (await Actinium.Taxonomy.exists({ slug, type: typeSlug })) ||
                {};
            const { objectId: taxTypeId } = op.get(taxTypes, [typeSlug], {});
            const T = new Actinium.Object('Type_taxonomy');
            T.id = taxTypeId;

            const tax = { name, slug, description, type: T };
            if (existingId) op.set(tax, 'objectId', existingId);

            await Actinium.Hook.run(
                'syndicate-content-taxonomy-before-save',
                tax,
            );

            await Actinium.Taxonomy.update(tax);
        }

        // next page
        response = await SyndicateClient.runRemote(
            'syndicate-content-taxonomies',
            { limit: 10, page: page++ },
        );
        results = Object.values(op.get(response, 'data.result.results', {}));
    }
};

SyndicateClient.sync = async () => {
    await Actinium.Hook.run('syndicate-client-sync-begin');
    const taxTypes = await SyndicateClient.syncTaxonomyTypes();
    await SyndicateClient.syncTaxonomies(taxTypes);

    await Actinium.Hook.run('syndicate-client-sync-after-taxonomies');
    await SyndicateClient.syncMediaDirectories();
    await SyndicateClient.syncMedia();

    await Actinium.Hook.run('syndicate-client-sync-after-media');
    const remoteTypes = await SyndicateClient.syncTypes();

    await Actinium.Hook.run('syndicate-client-sync-after-types', remoteTypes);
    await SyndicateClient.syncContent(remoteTypes);

    await Actinium.Hook.run('syndicate-client-sync-end');
};

module.exports = SyndicateClient;
