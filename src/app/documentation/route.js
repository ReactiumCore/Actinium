/**
  * @api {Cloud} route-create route-create
  * @apiVersion 3.1.2
  * @apiGroup Cloud
  * @apiName route-create
  * @apiParam {String} route The route string.
  * @apiParam {String} blueprintId The name of the associated blueprint.
  * @apiParam {Array} [capabilities=[]] Array of capabilities (object-path format)
  * @apiParam {Object} meta free-form metadata object
  * @apiDescription Create a new route for use in a front-end application.
  * @apiExample Example Usage:
Actinium.Cloud.run('route-create', {
        route: '/hello-world',
        blueprintId: 'Simple',
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
* @api {Cloud} route-update route-update
* @apiVersion 3.1.2
* @apiGroup Cloud
* @apiName route-update
* @apiParam {String} [objectId] the object id of the existing route
* @apiParam {String} route The existing route string.
* @apiParam {String} [blueprintId] The name of the associated blueprint.
* @apiParam {Array} [capabilities] Array of capabilities (object-path format)
* @apiParam {Object} [meta] free-form metadata object
* @apiDescription Create a new route for use in a front-end application.
* @apiExample Example Usage:
Actinium.Cloud.run('route-update', {
      route: '/hello-world',
      blueprintId: 'Simple',
      capabilities: ['admin-ui.view'],
      meta: {
          foo: 'bar',
      },
  },
);

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

/**
 * @api {Cloud} route-generate route-generate
 * @apiVersion 3.1.2
 * @apiGroup Cloud
 * @apiName route-generate
 * @apiDescription Generate the default Route objects.
 * @apiExample Example Usage:
Actinium.Cloud.run('route-generate');
 */
