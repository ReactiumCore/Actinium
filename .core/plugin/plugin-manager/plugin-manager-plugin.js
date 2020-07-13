const PLUGIN_ROUTES = require('./routes');
const PLUGIN_BLUEPRINTS = require('./blueprints');
const registerBlueprints = (reg = true) => ({ ID }) => {
    if (reg === true)
        PLUGIN_BLUEPRINTS.forEach(bp => Actinium.Blueprint.register(bp.ID, bp));
    else PLUGIN_BLUEPRINTS.forEach(bp => Actinium.Blueprint.unregister(bp.ID));
};

// Start: Blueprints
Actinium.Hook.register('start', registerBlueprints(true));

// Register Routes
Actinium.Hook.register('route-defaults', routes => {
    PLUGIN_ROUTES.forEach(item => routes.push(item));
});
