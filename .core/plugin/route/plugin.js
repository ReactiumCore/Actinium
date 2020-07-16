const chalk = require('chalk');
const op = require('object-path');
const _ = require('underscore');
const PLUGIN = require('./info');
const COLLECTION = PLUGIN.ID;

/**
 * ----------------------------------------------------------------------------
 * Extend Actinium SDK
 * ----------------------------------------------------------------------------
 */
const PLUGIN_SDK = require('./sdk');
Actinium['Route'] = op.get(Actinium, 'Route', PLUGIN_SDK);

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
const PLUGIN_ROUTES = require('./routes');
const saveRoutes = async () => {
    for (const route of PLUGIN_ROUTES) {
        await Actinium.Route.save(route);
    }
};

// Update routes on startup
Actinium.Hook.register('start', async () => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        await saveRoutes();
    }
});

// Update routes on plugin activation
Actinium.Hook.register('activate', async ({ ID }) => {
    if (ID === PLUGIN.ID) {
        await saveRoutes();
    }
});

// Update routes on plugin update
Actinium.Hook.register('update', async ({ ID }) => {
    if (ID === PLUGIN.ID) {
        await saveRoutes();
    }
});

// Remove routes on deactivation
Actinium.Hook.register('deactivate', async ({ ID }) => {
    if (ID === PLUGIN.ID) {
        for (const route of PLUGIN_ROUTES) {
            await Actinium.Route.delete(route);
        }
    }
});

Actinium.Hook.register('schema', async ({ ID }) => {
    if (ID !== PLUGIN.ID) return;

    const PLUGIN_SCHEMA = require('./schema');
    PLUGIN_SCHEMA.forEach(item => {
        const { actions = {}, collection, schema = {} } = item;
        if (!collection) return;

        Actinium.Collection.register(collection, actions, schema);
    });

    Actinium.Capability.register(
        `${COLLECTION}.create`,
        {
            allowed: ['contributor', 'administrator', 'super-admin'],
            excluded: ['banned'],
        },
        1000,
    );

    Actinium.Capability.register(
        `${COLLECTION}.retrieve`,
        {
            allowed: ['contributor', 'administrator', 'super-admin'],
            excluded: ['banned'],
        },
        1000,
    );

    Actinium.Capability.register(
        `${COLLECTION}.update`,
        {
            allowed: ['contributor', 'administrator', 'super-admin'],
            excluded: ['banned'],
        },
        1000,
    );

    Actinium.Capability.register(
        `${COLLECTION}.delete`,
        {
            allowed: ['contributor', 'administrator', 'super-admin'],
            excluded: ['banned'],
        },
        1000,
    );

    Actinium.Capability.register(
        `${COLLECTION}.addField`,
        {
            allowed: ['administrator', 'super-admin'],
            excluded: ['banned'],
        },
        1000,
    );
});

/**
 * ----------------------------------------------------------------------------
 * Cloud Functions
 * ----------------------------------------------------------------------------
 */
[
    { cloud: 'route-save', sdk: 'save' },
    { cloud: 'route-retrieve', sdk: 'retrieve' },
    { cloud: 'routes', sdk: 'list' },
    { cloud: 'route-delete', sdk: 'delete' },
].forEach(({ cloud, sdk }) => {
    Actinium.Cloud.define(PLUGIN.ID, cloud, async req => {
        return op.get(PLUGIN_SDK, sdk, Promise.resolve)(
            req.params,
            Actinium.Utils.CloudRunOptions(req),
            req,
        );
    });
});

Actinium.Hook.register('route-save', async req => {
    const route = req.object.toJSON();

    if (!route.route) throw 'route required.';
    if (req.object.isNew()) {
        const routeObj = PLUGIN_SDK.retrieve({ route: route.route });
        if (routeObj) {
            req.object.id = routeObj.objectId;
        }
    }

    if (!route.blueprint) throw 'blueprint required.';
});

Actinium.Hook.register('route-delete', async req => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
    const route = req.object.toJSON();

    if (op.get(route, 'meta.builtIn')) {
        throw 'Deleting built-in route not permitted.';
    }
});

// if possible, add permission to these results
Actinium.Hook.register('route-list-output', async (...params) => {
    const [{ routes = [] }, , , , , , req] = params;

    routes.forEach(route => {
        const capabilities = route.get('capabilities');
        if (!Array.isArray(capabilities) || capabilities.length < 1)
            route.set('permitted', true);
        else if (req) {
            route.set(
                'permitted',
                Actinium.Utils.CloudHasCapabilities(req, capabilities, false),
            );
        }
    });
});

/**
 * ----------------------------------------------------------------------------
 * Cloud Hooks
 * ----------------------------------------------------------------------------
 */
[
    {
        func: 'beforeSave',
        hook: 'beforeSave-route',
    },
    {
        func: 'beforeDelete',
        hook: 'beforeDelete-route',
    },
    {
        func: 'afterSave',
        hook: 'afterSave-route',
    },
].forEach(({ func, hook }) => {
    Actinium.Cloud[func](COLLECTION, async req => {
        await Actinium.Hook.run(hook, req);
    });
});

module.exports = PLUGIN;

/**
  * @api {Cloud} route-save route-save
  * @apiVersion 3.5.5
  * @apiGroup Cloud
  * @apiName route-save
  * @apiParam {String} route The route string.
  * @apiParam {String} blueprint The blueprint id of the associated blueprint.
  * @apiParam {Array} [capabilities=[]] Array of capabilities (object-path format)
  * @apiParam {Object} meta free-form metadata object
  * @apiDescription Create a new route for use in a front-end application.
  * @apiExample Example Usage:
Actinium.Cloud.run('route-save', {
        route: '/hello-world',
        blueprint: 'Simple',
        capabilities: ['admin-ui.view'],
        meta: {
            foo: 'bar',
        },
    },
);
  */

/**
* @api {Cloud} routes routes
* @apiVersion 3.1.2
* @apiGroup Cloud
* @apiName route
* @apiParam {Number} [limit=1000] Limit of routes to return.
* @apiParam {Number} [page=0] The results page to return. If value is less than 1, all routes are returned.
* @apiParam {String} route The name of an existing route.
* @apiDescription Retrieve list of routes. Routes are access controlled by user capabilities.
* @apiExample Example Usage:
// Get first page of routes
Actinium.Cloud.run('routes', { page: 1 });

// Get all routes
Actinium.Cloud.run('routes');
*/

/**
* @api {Cloud} route-retrieve route-retrieve
* @apiVersion 3.1.2
* @apiGroup Cloud
* @apiName route-retrieve
* @apiParam {String} route The name of an existing route.
* @apiDescription Retrieve the specified route.
* @apiExample Example Usage:
// Get the /hello-world route
Actinium.Cloud.run('route-retrieve', { route: '/hello-world'});
*/

/**
* @api {Cloud} routes routes
* @apiVersion 3.1.2
* @apiGroup Cloud
* @apiName route
* @apiParam {Number} [limit=1000] Limit number of routes to return.
* @apiParam {Number} [page=0] The results page to return. If page is less than 1, all routes are returned.
* @apiDescription Retrieve list of routes. Routes are access controlled by user capabilities.
* @apiExample Example Usage:
// Get first page of routes
Actinium.Cloud.run('routes', { page: 1 });

// Get all routes
Actinium.Cloud.run('routes');
*/

/**
* @api {Cloud} route-delete route-delete
* @apiVersion 3.1.2
* @apiGroup Cloud
* @apiName route-delete
* @apiParam {String} [objectId] the object id of the existing route
* @apiParam {String} route The the existing route string.
* @apiDescription Delete existing route. Built-in routes can not be deleted by default.
* @apiExample Example Usage:
Actinium.Cloud.run('route-delete', {
    route: '/hello-world',
});
*/
