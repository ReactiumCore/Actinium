const op = require('object-path');
const SyndicateClient = {};
const axios = require('axios');
const chalk = require('chalk');

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
        console.log({ error });
    }
};

SyndicateClient.syncTypes = async () => {
    const enabled = await await SyndicateClient.isEnabled();
    if (!enabled) return;
    const masterOptions = Actinium.Utils.MasterOptions();

    const result = await SyndicateClient.runRemote('syndicate-content-types');
    const remoteTypes = op.get(result, 'data.result', []);
    const { types = [] } = await Actinium.Type.list({}, masterOptions);

    if (remoteTypes.length) LOG(' ');
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

        LOG(
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

SyndicateClient.syncContent = async remoteTypes => {
    const masterOptions = Actinium.Utils.MasterOptions();
    for (const type of remoteTypes) {
        let page = 1;
        let response = await SyndicateClient.runRemote(
            'syndicate-content-list',
            { type, limit: 10, page: page++ },
        );
        while (op.get(response, 'data.result.results', []).length) {
            const results = op.get(response, 'data.result.results', []);
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
                    ...syncContent
                } = content;

                op.set(syncContent, 'meta.syndicate.objectId', objectId);
                op.set(syncContent, 'meta.syndicate.sourceType', sourceType);
                op.set(syncContent, 'meta.syndicate.branches', branches);
                op.set(syncContent, 'meta.syndicate.history', history);
                op.set(syncContent, 'meta.syndicate.user', user);
                op.set(syncContent, 'meta.syndicate.createdAt', createdAt);
                op.set(syncContent, 'meta.syndicate.updatedAt', updatedAt);

                // check to see if each result already exists
                const existing = await Actinium.Content.retrieve(
                    { type, slug: syncContent.slug },
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
                    const from =
                        op.get(existing, 'meta.syndicate.history.branch') +
                        op.get(existing, 'meta.syndicate.history.revision');
                    const to =
                        op.get(syncContent, 'meta.syndicate.history.branch') +
                        op.get(syncContent, 'meta.syndicate.history.revision');

                    // content updated
                    if (from !== to) {
                        LOG(
                            chalk.cyan(
                                `Updating syndicated ${typeLabel} content`,
                                contentLabel,
                            ),
                        );
                        if (op.get(existing, 'meta.syndicate.manual')) {
                            await Actinium.Hook.run(
                                'syndicate-content-before-save',
                                type,
                                syncContent,
                            );
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
                                type,
                                local,
                            );
                        } else {
                            await Actinium.Hook.run(
                                'syndicate-content-before-save',
                                type,
                                syncContent,
                            );
                            const local = await Actinium.Content.update(
                                { type, ...syncContent },
                                masterOptions,
                            );
                            await Actinium.Content.publish(
                                local,
                                masterOptions,
                            );
                            await Actinium.Hook.run(
                                'syndicate-content-saved',
                                type,
                                local,
                            );
                        }
                    }
                    // if it doesn't exist, create/publish it
                } else {
                    LOG(
                        chalk.cyan(
                            `Creating syndicated ${typeLabel} content`,
                            contentLabel,
                        ),
                    );
                    await Actinium.Hook.run(
                        'syndicate-content-before-save',
                        type,
                        syncContent,
                    );
                    const local = await Actinium.Content.create(
                        { type, ...syncContent },
                        masterOptions,
                    );
                    await Actinium.Content.createBranch(
                        local,
                        type,
                        'syndicate',
                        'Syndicate',
                        masterOptions,
                    );
                    await Actinium.Content.publish(local, masterOptions);
                    await Actinium.Hook.run(
                        'syndicate-content-saved',
                        type,
                        local,
                    );
                }
            }
            // console.log({machineName: type.machineName, page, results});
            response = await SyndicateClient.runRemote(
                'syndicate-content-list',
                { type, limit: 10, page: page++ },
            );
        }
    }
};

SyndicateClient.sync = async () => {
    const remoteTypes = await SyndicateClient.syncTypes();
    await SyndicateClient.syncContent(remoteTypes);
};

module.exports = SyndicateClient;
