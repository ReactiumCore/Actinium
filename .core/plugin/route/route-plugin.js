const _ = require('underscore');
const op = require('object-path');
const ParseNode = require('parse/node');
const { CloudRunOptions } = require(`${ACTINIUM_DIR}/lib/utils`);
const DEFAULTS = require('./defaults');
const COLLECTION = 'Route';

const PLUGIN = {
    ID: COLLECTION,
    description: 'Plugin responsible for managing front-end dynamic routing.',
    name: 'Route Plugin',
    order: 100,
    version: {
        actinium: '>=3.0.5',
        plugin: '0.0.1',
    },
    meta: {
        group: 'core',
        builtIn: true,
    },
};

Actinium.Plugin.register(PLUGIN, true);

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

Actinium.Collection.register(COLLECTION, {
    create: false,
    retrieve: true,
    update: false,
    delete: false,
    addField: false,
});

Actinium.Cloud.define(PLUGIN.ID, 'route-generate', async req => {
    if (Actinium.Cache.get('route-generating')) return;
    Actinium.Cache.get(
        'route-generating',
        true,
        Actinium.Enums.cache.dataLoading,
    );

    const options = CloudRunOptions(req);

    await Actinium.Hook.run('route-defaults', DEFAULTS);

    let { routes = [] } = await Actinium.Cloud.run('routes', {}, options);

    routes = _.indexBy(routes, 'route');

    const initialRoutes = [];
    const defaultRoutes = DEFAULTS.filter(
        ({ route }) => !op.has(routes, route),
    ).reduce((defaults, item) => {
        const { route } = item;
        defaults[route] = item;
        return defaults;
    }, {});

    for (let routeData of Object.values(defaultRoutes)) {
        const route = new Parse.Object(COLLECTION);
        Object.entries(routeData).forEach(([key, value]) => {
            route.set(key, value);
        });

        initialRoutes.push(route);
    }

    // Save initial routes
    await Parse.Object.saveAll(initialRoutes, options);

    return Promise.resolve();
});

Actinium.Cloud.define(PLUGIN.ID, 'route-create', async req => {
    const {
        route: routePath,
        blueprintId,
        capabilities = [],
        meta = {},
    } = req.params;
    const options = CloudRunOptions(req);

    if (!routePath) throw 'route required in route-create';
    if (!blueprintId) throw 'blueprintId required in route-create';

    const route = new Parse.Object(COLLECTION);
    route.set('route', routePath);
    route.set('blueprint', blueprintId);
    route.set('capabilities', capabilities);
    route.set('meta', meta);

    return route.save(null, options);
});

const mapRoutes = (routes = []) =>
    routes.map(item => {
        if (op.has(item, 'id')) {
            return item.toJSON();
        } else {
            return item;
        }
    });

Actinium.Cloud.define(PLUGIN.ID, 'route-retrieve', async req => {
    const { route } = req.params;
    const options = CloudRunOptions(req);
    const query = new Parse.Query(COLLECTION);

    if (!route) {
        throw 'route is a required parameter';
    }

    query.equalTo('route', route);
    query.descending('updatedAt');
    query.limit(1);

    let routes = await query.find(options);
    routes = mapRoutes(routes);
    routes = op.get(routes, 0);

    await Actinium.Hook.run('route-retrieve', routes);

    return Promise.resolve(routes);
});

Actinium.Cloud.define(PLUGIN.ID, 'routes', async req => {
    let pages = 0,
        total = 0;

    let { page = 0, limit = 1000 } = req.params;

    page = Math.max(page, 0);
    limit = Math.min(limit, 1000);
    let cacheKey = ['routes', page, limit, 'routes'];

    let routes = page < 1 ? Actinium.Cache.get(cacheKey, []) : [];

    if (routes.length < 1) {
        const skip = page > 0 ? page * limit - limit : 0;
        const query = new Parse.Query(COLLECTION);
        const options = CloudRunOptions(req);

        // Pagination
        total = await query.count(options);

        // Find
        query.skip(skip);
        query.limit(limit);

        let results = await query.find(options);

        while (results.length > 0) {
            routes = routes.concat(results);

            if (page < 1) {
                query.skip(routes.length);
                results = await query.find(options);
            } else {
                break;
            }
        }
        routes = mapRoutes(routes);

        Actinium.Cache.set(cacheKey, routes, 20000);
    } else {
        total = routes.length;
    }

    pages = Math.ceil(total / limit);

    const list = {
        timestamp: Date.now(),
        limit,
        page,
        pages,
        total,
        routes,
    };

    await Actinium.Hook.run('route-list', list);

    return Promise.resolve(list);
});

Actinium.Cloud.define(PLUGIN.ID, 'route-update', async req => {
    const {
        objectId,
        route,
        blueprintId,
        capabilities,
        meta = {},
    } = req.params;
    const options = CloudRunOptions(req);

    let routeObj;
    if (objectId) {
        routeObj = new Parse.Object(COLLECTION);
        routeObj.id = objectId;
    } else if (route) {
        const query = new Parse.Query(COLLECTION);
        query.equalTo('route', route);
        routeObj = await query.first(options);
    } else {
        throw 'missing objectId or ID in route-update';
    }

    if (!routeObj) throw 'route not found in route-update';
    await routeObj.fetch(options);

    if (blueprintId) {
        routeObj.set('blueprint', blueprintId);
    }

    if (capabilities && Array.isArray(capabilities))
        routeObj.set('capabilities', capabilities);
    if (meta) routeObj.set('meta', meta);

    return routeObj.save(null, options);
});

Actinium.Cloud.define(PLUGIN.ID, 'route-delete', async req => {
    const { objectId, route } = req.params;
    const options = CloudRunOptions(req);

    let routeObj;
    if (objectId) {
        routeObj = new Parse.Object(COLLECTION);
        routeObj.id = objectId;
    } else if (route) {
        const query = new Parse.Query(COLLECTION);
        query.equalTo('route', route);
        routeObj = await query.first(options);
    } else {
        throw 'missing objectId or route parameters in route-delete';
    }

    if (!routeObj) throw 'route not found in route-delete';
    return routeObj.destroy(options);
});

const beforeSave = async req => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;

    const route = req.object.toJSON();

    Object.keys(route).forEach(key => {
        switch (key) {
            case 'objectId':
            case 'route':
            case 'blueprint':
            case 'capabilities':
            case 'ACL':
            case 'meta':
                break;
            default:
                req.object.unset(key);
        }
    });

    if (!route.route) throw 'route required.';
    if (req.object.isNew()) {
        const query = new Parse.Query(COLLECTION);
        query.equalTo('route', route.route);
        routeObj = await query.first({ useMasterKey: true });
        if (routeObj) throw 'route must be unique';
    }

    if (!route.blueprint) throw 'blueprint required.';

    return Promise.resolve();
};

const beforeDelete = async req => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
    const route = req.object.toJSON();

    if (op.get(route, 'meta.builtIn')) {
        throw 'Deleting built-in route not permitted.';
    }

    return Promise.resolve();
};

const updateRouteCache = async req => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        Actinium.Cache.del('routes');
        const options = CloudRunOptions(req);
        await Actinium.Cloud.run('routes', {}, options);
    }

    return Promise.resolve();
};

Actinium.Hook.register('start', async () => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        return Actinium.Cloud.run('route-generate', null, {
            useMasterKey: true,
        });
    }
});

Actinium.Hook.register('activate', ({ ID }) =>
    ID == PLUGIN.ID
        ? Actinium.Cloud.run('route-generate', null, { useMasterKey: true })
        : null,
);

Actinium.Hook.register('afterSave-route', updateRouteCache, -100000);

Actinium.Hook.register('afterDelete-route', updateRouteCache, -100000);

Actinium.Cloud.afterSave(COLLECTION, req =>
    Actinium.Hook.run('afterSave-route', req),
);

Actinium.Cloud.afterDelete(COLLECTION, req =>
    Actinium.Hook.run('afterDelete-route', req),
);

Actinium.Cloud.beforeSave(COLLECTION, beforeSave);
Actinium.Cloud.beforeDelete(COLLECTION, beforeDelete);
