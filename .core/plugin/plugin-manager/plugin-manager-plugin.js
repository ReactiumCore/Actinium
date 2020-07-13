const PLUGIN_ROUTES = require('./routes');
const PLUGIN_BLUEPRINTS = require('./blueprints');

Actinium.Hook.register('start', async () => {
    // Register Blueprints
    PLUGIN_BLUEPRINTS.forEach(bp => Actinium.Blueprint.register(bp.ID, bp));

    // Save Routes
    for (const route of PLUGIN_ROUTES) {
        await Actinium.Route.save(route);
    }
});
