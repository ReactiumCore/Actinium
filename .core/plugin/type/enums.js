const UNINSTALLED_NAMESPACE = '9f85eb4d-777b-4213-b039-fced11c2dbae';
const ID_NAMESPACE = ENV.CONTENT_NAMESPACE || UNINSTALLED_NAMESPACE;
const PLUGIN_BLUEPRINTS = require('./blueprints');
const PLUGIN_ROUTES = require('./routes');
const PLUGIN = {
    ID: 'Type',
    name: 'Content Types',
    description: 'Manage your content types',
    meta: {
        builtIn: true,
        group: 'core',
        namespace: ID_NAMESPACE,
    },
};

module.exports = {
    UNINSTALLED_NAMESPACE,
    PLUGIN_BLUEPRINTS,
    PLUGIN_ROUTES,
    PLUGIN,
};
