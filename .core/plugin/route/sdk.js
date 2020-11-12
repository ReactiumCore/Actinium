const chalk = require('chalk');
const op = require('object-path');
const PLUGIN = require('./info');
const COLLECTION = PLUGIN.ID;

const Route = {};

// preserve potentially unprivileged options from cloud function
const _optionPair = (options, req) => {
    const masterOptions = Actinium.Utils.MasterOptions();
    if (!options && !req) options = masterOptions;
    return { masterOptions, options };
};

Route.retrieve = async (params, opts, req) => {
    const { masterOptions, options } = _optionPair(opts, req);
    const { route: routePath, objectId } = params;
    const query = new Parse.Query(COLLECTION);

    if (!routePath && !objectId) {
        throw 'route or objectId is a required parameter';
    }

    if (objectId) query.equalTo('objectId', objectId);
    if (routePath) query.equalTo('route', routePath);

    await Actinium.Hook.run('route-before-retrieve', query, params);
    const route = await query.first(options);
    const routeObj = Actinium.Utils.serialize(route);
    await Actinium.Hook.run('route-retrieve', routeObj);
    return routeObj;
};

Route.save = async (params, opts, req) => {
    const { masterOptions, options } = _optionPair(opts, req);

    const {
        route: routePath,
        blueprint,
        capabilities = [],
        meta = {},
        order = 100,
    } = params;

    if (!routePath) throw 'route required in route-create';
    if (!blueprint) throw 'blueprint required in route-create';

    let routeObj = await Route.retrieve(params);
    const route = new Parse.Object(COLLECTION);
    if (routeObj) route.id = routeObj.objectId;
    route.set('route', routePath);
    route.set('blueprint', blueprint);
    route.set('capabilities', capabilities);
    route.set('meta', meta);
    route.set('order', order);

    await Actinium.Hook.run('route-before-save', route, params, options);
    await route.save(null, options);
    routeObj = Actinium.Utils.serialize(route);
    await Actinium.Hook.run('route-saved', routeObj, params, options);

    return routeObj;
};

Route.list = async (params, opts, req) => {
    const { options } = _optionPair(opts, req);
    return Actinium.Utils.hookedQuery(
        params,
        options,
        COLLECTION,
        'route-list-query',
        'route-list-output',
        'routes',
        'array',
        req,
    );
};

Route.delete = async (params, opts, req) => {
    const { options } = _optionPair(opts, req);

    let routeObj = await Route.retrieve(params, options);
    if (routeObj) {
        const route = new Parse.Object(COLLECTION);
        route.id = routeObj.objectId;
        return route.destroy(options);
    }
};

module.exports = Route;
