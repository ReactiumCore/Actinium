const _ = require('underscore');
const ENUMS = require('./enums');
const op = require('object-path');

const {
    CloudHasCapabilities,
    CloudRunOptions,
} = require(`${ACTINIUM_DIR}/lib/utils`);

const PLUGIN = require('./meta');
const PLUGIN_SDK = require('./sdk');
const PLUGIN_ROUTES = require('./routes');
const PLUGIN_SCHEMA = require('./schema');
const PLUGIN_BLUEPRINTS = require('./blueprints');

const { COLLECTION } = ENUMS;

// Create SDK Singleton
Actinium[COLLECTION] = op.get(Actinium, COLLECTION, PLUGIN_SDK);

// Register Plugin
Actinium.Plugin.register(PLUGIN, true);

/**
 * @api {Cloud} content content
 * @apiVersion 3.1.3
 * @apiGroup Cloud
 * @apiName content
 * @apiDescription Retrieves a paginated list of `Content` objects.

Permission: `Content.retrieve` _(use the **content.capabilities.retrieve** setting to change)_
 * @apiParam {Number} [limit=1000] Number of results to return per page.
 * @apiParam {String} [order='descending'] The sort order of the results `ascending` or `descending`.
 * @apiParam {String} [orderBy='updatedAt'] The sort field.
 * @apiParam {Number} [page=1] The page of results to return.
 * @apiExample Example usage:
const content = await Actinium.Cloud.run('content', {
    limit: 1000,
    order: 'ascending',
    orderBy: 'updatedAt',
    page: 1,
});
 */
Actinium.Cloud.define(PLUGIN.ID, 'content', req => {
    const cap = Actinium.Setting.get('content.capabilities.retrieve', [
        'Content.retrieve',
    ]);

    if (!CloudHasCapabilities(req, cap))
        return Promise.reject(ENUMS.ERRORS.PERMISSION);

    const options = CloudRunOptions(req);

    return Actinium.Content.fetch(req.params, options);
});
