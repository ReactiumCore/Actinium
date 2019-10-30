const {
    CloudRunOptions,
    CloudHasCapabilities,
} = require(`${ACTINIUM_DIR}/lib/utils`);
const ParseNode = require('parse/node');
const op = require('object-path');
const _ = require('underscore');
const chalk = require('chalk');

const COLLECTION = 'Capability';
const PLUGIN = {
    ID: 'Capability',
    description: 'Capabilities plugin.',
    order: 0,
    version: {
        actinium: '>=3.1.2',
        plugin: '0.0.1',
    },
    meta: {
        builtIn: true,
    },
};

Actinium.Plugin.register(PLUGIN, true);

Actinium.Capability.register(
    `${COLLECTION}.create`,
    {},
    Actinium.Enums.priority.highest,
);

Actinium.Capability.register(
    `${COLLECTION}.retrieve`,
    {},
    Actinium.Enums.priority.highest,
);

Actinium.Capability.register(
    `${COLLECTION}.update`,
    {},
    Actinium.Enums.priority.highest,
);

Actinium.Capability.register(
    `${COLLECTION}.delete`,
    {},
    Actinium.Enums.priority.highest,
);

Actinium.Capability.register(
    `${COLLECTION}.addField`,
    {},
    Actinium.Enums.priority.highest,
);

Actinium.Collection.register(COLLECTION, {
    create: false,
    retrieve: true,
    update: false,
    delete: false,
    addField: false,
});

Actinium.Cloud.define(PLUGIN.ID, 'capability-check', req => {
    const { params } = req;
    const { capabilities = [], strict = false } = params;
    return CloudHasCapabilities(req, capabilities, strict);
});

Actinium.Cloud.define(PLUGIN.ID, 'capability-get', async req => {
    if (!CloudHasCapabilities(req, 'Capability.retrieve'))
        throw new Error('Permission denied');
    const { group } = req.params;
    if (group in Actinium.Capability._groups)
        return Actinium.Capability._groups[group];
    return Actinium.Capability._groups;
});

// Update Collection classLevelPermissions on capability updates
Actinium.Hook.register('capability-updated', async group => {
    if (/\.(create|retrieve|update|delete)$/.test(group)) {
        LOG(chalk.cyan('Updating Collections'));
        await Actinium.Collection.load();
    }
});

const edit = async req => {
    if (
        !CloudHasCapabilities(
            req,
            ['Capability.create', 'Capability.update'],
            false,
        )
    )
        throw new Error('Permission denied');

    const group = op.get(req, 'params.group', '');
    const perms = op.get(req, 'params.perms', {});

    if (typeof group !== 'string' || group.split('.').length !== 2)
        throw new Error('Group of form `object.action` required.');

    await Actinium.Hook.run('capability-edit', req, group, perms);
    Actinium.Capability.register(group, perms);
    return Promise.resolve('success');
};

Actinium.Cloud.define(PLUGIN.ID, 'capability-create', edit);

Actinium.Cloud.define(PLUGIN.ID, 'capability-edit', edit);

Actinium.Cloud.define(PLUGIN.ID, 'capability-delete', async req => {
    if (!CloudHasCapabilities(req, 'Capability.delete'))
        throw new Error('Permission denied');

    const group = op.get(req, 'params.group', '');
    if (typeof group !== 'string' || group.split('.').length !== 2)
        throw new Error('Group of form `object.action` required.');

    await Actinium.Hook.run('capability-edit', req, group);
    Actinium.Capability.unregister(group);
    return Promise.resolve('success');
});
