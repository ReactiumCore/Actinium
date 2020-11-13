const chalk = require('chalk');
const op = require('object-path');
const { CloudRunOptions } = require(`${ACTINIUM_DIR}/lib/utils`);
const uuid = require('uuid/v4');

const PLUGIN = {
    ID: 'Navigation',
    description: 'Add navigation content type.',
    name: 'Navigation Plugin',
    order: 100,
    version: {
        actinium: '>=3.2.6',
        plugin: '1.0.0',
    },
    bundle: [],
    meta: {
        builtIn: true,
    },
};

/**
 * ----------------------------------------------------------------------------
 * Plugin registration
 * ----------------------------------------------------------------------------
 */
Actinium.Plugin.register(PLUGIN, true);

/**
 * ----------------------------------------------------------------------------
 * Hook registration
 * ----------------------------------------------------------------------------
 */

Actinium.Hook.register('warning', () => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
    // Your bootstrap warning messages here
    // WARN('');
    // WARN(chalk.cyan.bold('Warning:'), 'about something');
});

Actinium.Hook.register('collection-before-load', async () => {
    Actinium.Type.register({
        type: 'Navigation',
        machineName: 'navigation',
        fields: {
            navigation_menu_builder: {
                fieldName: 'Menu Builder',
                helpText: 'Build your navigation menu.',
                fieldId: 'navigation_menu_builder',
                fieldType: 'MenuBuilder',
                region: 'default',
            },
            navigation_content: {
                fieldName: 'Navigation Content',
                label: null,
                placeholder: null,
                helpText: 'Add additional content along with this navigation.',
                fieldId: 'navigation_content',
                fieldType: 'RichText',
                region: 'default',
            },
            publisher: {
                fieldName: 'Publish',
                statuses: 'DRAFT,PUBLISHED',
                simple: true,
                fieldId: 'publisher',
                fieldType: 'Publisher',
                region: 'sidebar',
            },
        },
        regions: {
            default: {
                id: 'default',
                label: 'Default',
                slug: 'default',
                order: -1000,
            },
            sidebar: {
                id: 'sidebar',
                label: 'Sidebar',
                slug: 'sidebar',
                order: 1000,
            },
        },
        meta: {
            label: 'Navigation',
            icon: 'Linear.Menu3',
        },
    });
});

Actinium.Hook.register('uninstall', async ({ ID }) => {
    if (ID !== PLUGIN.ID) return;
});
