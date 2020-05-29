const _ = require('underscore');
const op = require('object-path');

const {
    CloudHasCapabilities,
    CloudMasterOptions,
    CloudRunOptions,
} = require(`${ACTINIUM_DIR}/lib/utils`);

const PLUGIN = {
    ID: 'URLWidget',
    name: 'URL Widget',
};

Actinium.Plugin.register(PLUGIN, true);

Actinium.Hook.register('content-schema-field-types', fieldTypes => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
    fieldTypes['URLS'] = { type: 'Relation', targetClass: 'Route' };
});

// content-retrieve hook
Actinium.Hook.register(
    'content-retrieve',
    async (contentObj, params, options) => {
        const collection = op.get(contentObj, 'type.collection');
        const content = await new Actinium.Object(collection)
            .set('objectId', contentObj.objectId)
            .fetch(options);

        if (!content) return;

        // Look at routes that don't have meta.contentId value set
        const rel = content.relation('urls');
        const qry = rel.query();
        const count = await qry.count({ useMasterKey: true });

        let routes = await qry
            .skip(0)
            .limit(count)
            .find(options);

        op.set(
            contentObj,
            'urls',
            _.indexBy(
                routes.map(route => route.toJSON()),
                'objectId',
            ),
        );
    },
);

// content-saved hook
Actinium.Hook.register(
    'content-saved',
    async (contentObj, typeObj, isNew, params, options) => {
        if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;

        // Fetch content object
        const content = await new Actinium.Object(typeObj.collection)
            .set('objectId', contentObj.objectId)
            .fetch({ useMasterKey: true });

        if (!content) return;

        // Look at routes that don't have meta.contentId value set
        const rel = content.relation('urls');
        const qry = rel.query();
        const count = await qry.count({ useMasterKey: true });

        if (count < 1) return;

        let routes = await qry
            .skip(0)
            .limit(count)
            .find(options);

        routes = routes.map(route => {
            const meta = route.get('meta');
            op.set(meta, 'contentId', content.id);
            route.set('meta', meta);
            return route;
        });

        routes = await Actinium.Object.saveAll(routes, { useMasterKey: true });

        if (routes.length > 0) {
            op.set(
                contentObj,
                'urls',
                _.indexBy(
                    routes.map(route => route.toJSON()),
                    'objectId',
                ),
            );
        }
    },
);

// content-before-save hook
Actinium.Hook.register(
    'content-before-save',
    async (content, type, isNew, params, options) => {
        if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
        if (!op.get(params, 'urls')) return;

        // 0.0 - Helpers
        const validate = (url, reqParams) => {
            if (op.get(url, 'pending') !== true) return false;
            if (op.get(url, 'delete') === true) return false;

            reqParams = reqParams || ['blueprint', 'meta.type', 'route'];
            const count = reqParams.length;
            return reqParams.filter(key => op.has(url, key)).length === count;
        };

        const routeObj = url => {
            const urlObj = new Actinium.Object('Route');

            if (!isNew) op.set(url, 'meta.contentId', content.id);
            if (isNaN(op.get(url, 'objectId'))) {
                urlObj.set('objectId', op.get(url, 'objectId'));
            }

            urlObj.set('blueprint', op.get(url, 'blueprint'));
            urlObj.set('user', op.get(params, 'user'));
            urlObj.set('route', op.get(url, 'route'));
            urlObj.set('meta', op.get(url, 'meta'));

            return urlObj;
        };

        // 0.1 - Get the urls from params and remove them from the object so
        //       they aren't accidently applied to the object.
        const urls = op.get(params, 'urls');

        // 1.0 - Get the relation
        const rel = content.relation('urls');

        // 2.0 - Create Route items
        const addURLS = await Actinium.Object.saveAll(
            _.compact(
                Object.values(urls)
                    .filter(url => validate(url))
                    .map(url => routeObj(url)),
            ),
            options,
        );

        // 2.1 - Add routes to relation
        addURLS.forEach(route => rel.add(route));

        // 3.0 - Get deleted Route items
        const delURLS = await Actinium.Object.fetchAll(
            Object.values(urls)
                .filter(url => url.pending === true && url.delete === true)
                .map(url =>
                    new Actinium.Object('Route').set('objectId', url.objectId),
                ),
            options,
        );

        // 3.1 - Delete from Route collection
        if (delURLS.length > 0) {
            await Actinium.Object.destroyAll(delURLS, options);
        }

        if (addURLS.length > 0) {
            op.set(params, 'forceUpdate', true);
        }

        op.del(params, 'urls');
    },
);

Actinium.Cloud.define(PLUGIN.ID, 'url-retrieve', async req => {
    // TODO: Lock this down to capability check
    const options = CloudRunOptions(req);

    const { contentId, objectId, route } = req.params;

    const qry = new Actinium.Query('Route');

    if (route) {
        qry.equalTo('route', route);
    } else if (objectId) {
        qry.equalTo('objectId', objectId);
    } else if (contentId) {
        qry.equalTo('meta.contentId', contentId);
    }

    let result = await qry.first(options);

    if (result) result = result.toJSON();

    /**
     * @api {Hook} url-retrieve url-retrieve
     * @apiDescription Called before the url-retrieve results are returned.
     * @apiParam {Object} Route the serialized Actinium.Route object
     * @apiParam {Object} params The request.params object
     * @apiParam {Object} options The request options object
     * @apiName url-retrieve
     * @apiGroup Hooks
     */
    await Actinium.Hook.run('urls-retrieve', result, params, options);

    return result;
});

Actinium.Cloud.define(PLUGIN.ID, 'urls', async req => {
    const options = op.get(req, 'params.options') || CloudMasterOptions(req);
    let {
        contentId,
        limit = 100,
        order = 'descending',
        orderBy = 'route',
        page = -1,
        route,
        collection,
    } = req.params;

    order = ['ascending', 'descending'].includes(order) ? order : 'descending';

    let qry;
    let skip = page < 1 ? 0 : page * limit - limit;

    if (contentId && collection) {
        const content = await new Actinium.Object(collection)
            .set('objectId', contentId)
            .fetch(options);
        qry = content.relation('urls').query();
    } else {
        qry = new Actinium.Query('Route');

        if (contentId) {
            qry.equalTo('meta.contentId', contentId);
        } else {
            if (route) qry.equalTo('route', route);
        }
    }

    let count = 0;

    if (page > 0) {
        count = await qry.count(options);
    }

    qry.limit(limit).skip(skip);
    qry[order](orderBy);

    /**
     * @api {Hook} urls-query urls-query
     * @apiDescription Called before the urls query is executed.
     * @apiParam {Object} query Actinium.Query object
     * @apiParam {Object} params The request.params object
     * @apiParam {Object} options The request options object
     * @apiName urls-query
     * @apiGroup Hooks
     */
    await Actinium.Hook.run('urls-query', qry, req.params, options);

    let output = [];
    let results = await qry.find(options);

    while (results.length > 0) {
        results = results.map(route => route.toJSON());
        output = _.chain([output, results])
            .flatten()
            .sortBy('route')
            .value()
            .reverse();

        if (page < 1) {
            skip += limit;
            count = output.length;
            qry.skip(skip);

            await Actinium.Hook.run('urls-query', qry, req.params, options);

            results = await qry.find(options);
        } else {
            results = [];
        }
    }

    const pages = Math.ceil(count / limit);
    page = page < 1 ? 1 : page;
    let next = Math.min(page + 1, pages + 1);
    let prev = Math.max(page - 1, 0);

    const pagination = {
        page,
        pages,
        count,
        limit,
        next: next > pages || next === 0 ? undefined : next,
        prev: prev < 1 ? undefined : prev,
    };

    const response = {
        ...pagination,
        results: _.indexBy(output, 'objectId'),
    };

    /**
     * @api {Hook} urls urls
     * @apiDescription Called before the urls response is returned.
     * @apiParam {Object} response Serialized response object
     * @apiParam {Object} params The request.params object
     * @apiParam {Object} options The request options object
     * @apiName urls
     * @apiGroup Hooks
     */
    await Actinium.Hook.run('urls', response, req.params, options);
    return response;
});
