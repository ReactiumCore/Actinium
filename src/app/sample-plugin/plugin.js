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
    if (ID !== PLUGIN.ID) return;
    LOG(`  Installed ${PLUGIN.ID}!`);
});

Actinium.Hook.register(
    'warning',
    () => {
        if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
        LOG('');
        LOG(
            chalk.cyan.bold('Warning:'),
            'The',
            chalk.bold('sample-plugin'),
            'is active.',
        );
        LOG(' ', 'If you do not need it, deactivate or remove it!');
        LOG(' ', chalk.magenta(__dirname));
    },
    -1,
);

Actinium.Hook.register('activate', ({ ID }) => {
    if (ID !== PLUGIN.ID) return;
    LOG(`  Activated ${PLUGIN.ID}!`);
});

Actinium.Hook.register('deactivate', ({ ID }) => {
    if (ID !== PLUGIN.ID) return;
    LOG(`  Deactivated ${PLUGIN.ID}!`);
});

Actinium.Hook.register('uninstall', async ({ ID }) => {
    if (ID !== PLUGIN.ID) return;
    LOG(`  Uninstalled ${PLUGIN.ID}!`);
});

Actinium.Cloud.define(PLUGIN.ID, 'sample-plugin', async req => {
    return { sample: 'plugin' };
});

module.exports = PLUGIN;
