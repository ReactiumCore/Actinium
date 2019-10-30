/**
 * @api {Object} Actinium.Middleware Middleware
 * @apiVersion 3.1.0
 * @apiName Middleware
 * @apiGroup Actinium
 * @apiDescription Create or replace Express middleware.
 */

/**
 * @api {Object} Actinium.Middleware.register(id,callback,order) Middleware.register()
 * @apiVersion 3.1.0
 * @apiGroup Actinium
 * @apiName Middleware.register
 * @apiDescription Register middleware to be executed when the app initializes.
 * @apiParam {String} id The uniq identifier for the middleware.
 * @apiParam {Function} callback The middleware function. Must return a `{Promise}`.
 * @apiParam {Number} [order=100] The sort index for the middleware. Used to prioritize certain middleware above others.
 * @apiExample Example Usage:
// Middleware to create a custom router handler for `/sample`

const express = require('express');

Actinium.Middleware.register(
    'sample',
    app => {
        const router = express.Router();
        router.get('/sample', (req, res) => {
            res.send('hello bruh!');
        });

        app.use(router);

        return Promise.resolve();
    },
    100000,
);
 */
/**
  * @api {Object} Actinium.Middleware.replace(id,callback) Middleware.replace()
  * @apiVersion 3.1.0
  * @apiGroup Actinium
  * @apiName Middleware.replace
  * @apiDescription Replace exsisting middleware.
  * @apiParam {String} id The uniq identifier for the middleware.
  * @apiParam {Function} callback The middleware function. Must return a `{Promise}`.
  * @apiExample Example Usage:
 // Replace the 'sample' middleware

const express = require('express');

Actinium.Middleware.replace(
    'sample',
    app => {
        const router = express.Router();
        router.get('/sample', (req, res) => {
            res.send('hello bro!');
        });

        app.use(router);

        return Promise.resolve();
    }
 );
  */

/**
 * @api {Object} Actinium.Middleware.unregister(id) Middleware.unregister()
 * @apiVersion 3.1.0
 * @apiGroup Actinium
 * @apiName Middleware.unregister
 * @apiDescription Unegister middleware. Used to disable a middleware from executing.
 * @apiExample Example Usage:
Actinium.Middleware.unregister('docs');
 */
