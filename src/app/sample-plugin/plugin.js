const chalk = require('chalk');

const PLUGIN = {
    ID: 'SAMPLE-PLUGIN',
    description:
        'This is a sample plugin designed to show how the plugin api works.',
    name: 'The Awesome Sample Plugin',
    order: 100,
    version: {
        actinium: '>=3.0.5',
        plugin: '0.0.1',
    },
    bundle: [],
    meta: {},
};

Actinium.Plugin.register(PLUGIN, true);

Actinium.Hook.register('install', ({ ID }) => {
    if (ID !== PLUGIN.ID) {
        return Promise.resolve();
    }

    LOG(`  Installed ${PLUGIN.ID}!`);

    return Promise.resolve();
});

Actinium.Hook.register('start', () => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        Actinium.Hook.register('warning', () => {
            LOG('');
            LOG(
                chalk.cyan.bold('Warning:'),
                'The',
                chalk.bold('sample-plugin'),
                'is active.',
            );
            LOG(' ', 'If you do not need it, deactivate or remove it!');
            LOG(' ', chalk.magenta(__dirname));

            return Promise.resolve();
        });

        LOG(`  Started ${PLUGIN.ID}`);
    }

    return Promise.resolve();
});

Actinium.Hook.register('activate', ({ ID }) => {
    if (ID !== PLUGIN.ID) {
        return Promise.resolve();
    }

    LOG(`  Activated ${PLUGIN.ID}!`);

    return Promise.resolve();
});

Actinium.Hook.register('deactivate', ({ ID }) => {
    if (ID !== PLUGIN.ID) {
        return Promise.resolve();
    }

    LOG(`  Deactivated ${PLUGIN.ID}!`);

    return Promise.resolve();
});

Actinium.Hook.register('uninstall', async ({ ID }) => {
    if (ID !== PLUGIN.ID) {
        return Promise.resolve();
    }

    LOG(`  Uninstalled ${PLUGIN.ID}!`);

    return Promise.resolve();
});

Actinium.Cloud.define(PLUGIN.ID, 'sample-plugin', async req => {
    return Promise.resolve({ sample: 'plugin' });
});

module.exports = PLUGIN;
