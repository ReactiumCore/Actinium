const PLUGIN_BLUEPRINTS = require('./blueprints');
const PLUGIN_ROUTES = require('./routes');

const PLUGIN = {
    ID: 'Type',
    name: 'Content Types',
    meta: {
        builtIn: true,
        group: 'core',
    },
};

Actinium.Plugin.register(PLUGIN, true);

// Register Blueprints
Actinium.Hook.register(
    'blueprint-defaults',
    blueprints => {
        PLUGIN_BLUEPRINTS.forEach(item => blueprints.push(item));
    },
    -1000,
);

// Register Routes
Actinium.Hook.register('route-defaults', routes => {
    PLUGIN_ROUTES.forEach(item => routes.push(item));
});
