/**
  * @api {Cloud} blueprint-create blueprint-create
  * @apiVersion 3.1.2
  * @apiGroup Cloud
  * @apiName blueprint-create
  * @apiParam {String} ID The name of the blueprint.
  * @apiParam {String} description The description of the blueprint.
  * @apiParam {Object} sections object containing 1 or more sections, each with 1 or more zones.
  * @apiParam {Object} meta free-form metadata object
  * @apiDescription Create a new blueprint for use in a front-end application.
  * @apiExample Example Usage:
Actinium.Cloud.run('blueprint-create', {
        ID: 'MyBlueprint',
        description: 'Blueprint with a top, left, right, center, and bottom section.',
        sections: {
            top: {
                zones: ['top'],
                meta: {},
            },
            right: {
                zones: ['right'],
                meta: {},
            },
            left: {
                zones: ['left'],
                meta: {},
            },
            center: {
                zones: ['center'],
                meta: {},
            },
            bottom: {
                zones: ['bottom'],
                meta: {},
            },
        },
        meta: {
            foo: 'bar',
        },
    },
);
  */

/**
* @api {Cloud} blueprint-retrieve blueprint-retrieve
* @apiVersion 3.1.2
* @apiGroup Cloud
* @apiName blueprint-retrieve
* @apiParam {String} ID The name of an existing blueprint.
* @apiParam {Number} limit=1000 Limit of blueprints to return
* @apiParam {Number} skip=0 Number of blueprints to skip
* @apiDescription Retrieve list of blueprints.
* @apiExample Example Usage:
// get a specific blueprint
Actinium.Cloud.run('blueprint-retrieve', { ID: 'MyBlueprint'});

// get list of blueprints, limit to 1000
Actinium.Cloud.run('blueprint-retrieve', { limit: 1000 });
*/

/**
* @api {Cloud} blueprint-update blueprint-update
* @apiVersion 3.1.2
* @apiGroup Cloud
* @apiName blueprint-update
* @apiParam {String} [objectId] the object id of the existing blueprint
* @apiParam {String} ID The name of the existing blueprint.
* @apiParam {String} description The description of the blueprint.
* @apiParam {Object} sections object containing 1 or more sections, each with 1 or more zones.
* @apiParam {Object} meta free-form metadata object
* @apiDescription Create a new blueprint for use in a front-end application.
* @apiExample Example Usage:
Actinium.Cloud.run('blueprint-update', {
      ID: 'MyBlueprint',
      description: 'Blueprint with a top, left, right, center, and bottom section.',
      sections: {
          top: {
              zones: ['top'],
              meta: {},
          },
          right: {
              zones: ['right'],
              meta: {},
          },
          left: {
              zones: ['left'],
              meta: {},
          },
          center: {
              zones: ['center'],
              meta: {},
          },
          bottom: {
              zones: ['bottom'],
              meta: {},
          },
      },
      meta: {
          foo: 'bar',
      },
  },
);

/**
* @api {Cloud} blueprint-delete blueprint-delete
* @apiVersion 3.1.2
* @apiGroup Cloud
* @apiName blueprint-delete
* @apiParam {String} [objectId] the object id of the existing blueprint
* @apiParam {String} ID The name of the existing blueprint.
* @apiDescription Delete existing blueprint. Built-in blueprints can not be deleted by default.
* @apiExample Example Usage:
Actinium.Cloud.run('blueprint-delete', {
    ID: 'MyBlueprint',
});
*/

/**
 * @api {Cloud} blueprint-generate blueprint-generate
 * @apiVersion 3.1.2
 * @apiGroup Cloud
 * @apiName blueprint-generate
 * @apiDescription Generate the default Blueprint objects.
 * @apiExample Example Usage:
 Actinium.Cloud.run('blueprint-generate');
 */
