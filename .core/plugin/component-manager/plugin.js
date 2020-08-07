const path = require('path');

const PLUGIN = {
    ID: 'Components',
    description: 'Enable Components to be used in content rich text editor',
    name: 'Components Plugin',
    order: 100,
    version: {
        actinium: '>=3.2.6',
        plugin: '0.0.2',
    },
    bundle: [],
    meta: {
        admin: true,
        settings: false,
        builtIn: false,
        group: 'utilities',
    },
};

const blueprintReg = () => {
    const PLUGIN_BLUEPRINTS = require('./blueprints');
    PLUGIN_BLUEPRINTS.forEach(blueprint =>
        Actinium.Blueprint.register(blueprint.ID, blueprint),
    );
};

/**
 * ----------------------------------------------------------------------------
 * Plugin registration
 * ----------------------------------------------------------------------------
 */
Actinium.Plugin.register(PLUGIN, false);

/**
 * ----------------------------------------------------------------------------
 * Capability registration
 * ----------------------------------------------------------------------------
 */
Actinium.Hook.register('before-capability-load', () => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
    const read = { allowed: ['anonymous'] };
    Actinium.Capability.register('components.write');
    Actinium.Capability.register('components.delete');
    Actinium.Capability.register('components.read', read);
    Actinium.Capability.register('setting.components-set');
    Actinium.Capability.register('setting.components-delete');
    Actinium.Capability.register('setting.components-get', read);
});

/**
 * ----------------------------------------------------------------------------
 * Hook registration
 * ----------------------------------------------------------------------------
 */

// Start: Blueprints
Actinium.Hook.register('start', () => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
    blueprintReg();
});

// Activate: Register Routes & Blueprints
Actinium.Hook.register('activate', async ({ ID }) => {
    if (ID !== PLUGIN.ID) return;

    blueprintReg();

    const PLUGIN_ROUTES = require('./routes');
    await Promise.all(
        PLUGIN_ROUTES.map(route =>
            Actinium.Route.save(route, { useMasterKey: true }),
        ),
    );
});

// Deactivate: Blueprints
Actinium.Hook.register('deactivate', async ({ ID }) => {
    if (ID !== PLUGIN.ID) return;

    // Remove blueprints
    const PLUGIN_BLUEPRINTS = require('./blueprints');
    PLUGIN_BLUEPRINTS.forEach(blueprint =>
        Actinium.Blueprint.unregister(blueprint.ID),
    );

    // Remove routes
    const PLUGIN_ROUTES = require('./routes');
    await Promise.all(
        PLUGIN_ROUTES.map(route =>
            Actinium.Route.delete(route, { useMasterKey: true }),
        ),
    );
});
