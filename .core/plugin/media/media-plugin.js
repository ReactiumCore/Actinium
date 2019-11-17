const op = require('object-path');
const { CloudRunOptions } = require(`${ACTINIUM_DIR}/lib/utils`);

const COLLECTION = 'Media';
const PLUGIN = require('./meta');
const PLUGIN_LIB = require('./lib');
const PLUGIN_ROUTES = require('./routes');
const PLUGIN_SCHEMA = require('./schema');
const PLUGIN_BLUEPRINTS = require('./blueprints');

// Create Singleton
Actinium[COLLECTION] = op.get(Actinium, COLLECTION, PLUGIN_LIB);

// Register Plugin
Actinium.Plugin.register(PLUGIN, true);

// Register Capabilities & Schema
Actinium.Hook.register('activate', async ({ ID }) => {
    if (ID !== PLUGIN.ID) {
        return;
    }

    Object.keys(PLUGIN_SCHEMA.ACTIONS).forEach(action =>
        Actinium.Capability.register(`${COLLECTION}.${action}`),
    );

    Actinium.Collection.register(
        COLLECTION,
        PLUGIN_SCHEMA.ACTIONS,
        PLUGIN_SCHEMA.SCHEMA,
    );
});

// Register Blueprints
Actinium.Hook.register('blueprint-defaults', blueprints => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        PLUGIN_BLUEPRINTS.forEach(item => blueprints.push(item));
    }
});

// Register Routes
Actinium.Hook.register('route-defaults', routes => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        PLUGIN_ROUTES.forEach(item => routes.push(item));
    }
});
