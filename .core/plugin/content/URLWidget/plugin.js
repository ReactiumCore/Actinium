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

// Actinium.Hook.register(
//     'content-saved',
//     async (content, typeObj, isNew, params, options) => {
//         if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
//         if (!op.get(params, 'urls')) return;
//
//         // get routes
//         const contentId = op.get(content, 'objectId');
//         const routes = await Actinium.Cloud.run('urls', { contentId }, options);
//         console.log(routes);
//     },
// );

Actinium.Hook.register(
    'content-before-save',
    async (content, type, isNew, params, options) => {
        if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
        if (!op.get(params, 'urls')) return;

        // 0.0 - Helpers
        const validate = (url, reqParams) => {
            reqParams = reqParams || ['route', 'meta.type', 'meta.blueprint'];
            const count = reqParams.length;
            return reqParams.filter(key => op.get(url, key)).length === count;
        };

        const routeObj = url => {
            const blueprint = op.get(url, 'meta.blueprint');
            op.del(url, 'meta.blueprint');

            const urlObj = new Actinium.Object('Route');

            if (!isNew) op.set(url, 'meta.contentId', content.id);
            if (isNaN(op.get(url, 'objectId'))) {
                urlObj.set('objectId', op.get(url, 'objectId'));
            }

            urlObj.set('user', op.get(params, 'user'));
            urlObj.set('route', op.get(url, 'route'));
            urlObj.set('meta', op.get(url, 'meta'));
            urlObj.set('blueprint', blueprint);

            return urlObj;
        };

        // 0.1 - Get the urls from params and remove them from the object so
        //       they aren't accidently applied to the object.
        const urls = op.get(params, 'urls');

        op.del(params, 'urls');

        // 1.0 - Get the relation
        const rel = content.relation('urls');

        //op.set(params, 'forceUpdate', true);

        // 2.0 - Create Route items
        let addURLS = await Actinium.Object.saveAll(
            _.compact(
                Object.values(urls)
                    .filter(
                        url =>
                            url.pending === true &&
                            !isNaN(url.objectId) &&
                            validate(url) === true,
                    )
                    .map(url => routeObj(url)),
            ),
            options,
        );

        // console.log(addURLS);

        // 2.1 - Add routes to relation
        addURLS.forEach(route => rel.add(route));

        // 3.0 - Update Route Items
        const updURLS = await Actinium.Object.saveAll(
            _.compact(
                Object.values(urls)
                    .filter(
                        url =>
                            url.pending === true &&
                            isNaN(url.objectId) &&
                            validate(url) === true,
                    )
                    .map(routeObj),
            ),
            options,
        );

        // 3.1 - Add routes to relation
        updURLS.forEach(route => rel.add(route));

        // 4.0 - Delete Route items
        const delURLS = await Actinium.Object.fetchAll(
            Object.values(urls)
                .filter(url => url.pending === true && url.delete === true)
                .map(url =>
                    new Actinium.Object('Route').set('objectId', url.objectId),
                ),
            options,
        );
        if (delURLS.length > 0) {
            await Actinium.Object.destroyAll(delURLS, options);
        }
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

    const result = qry.first(options);

    return result ? result.toJSON() : null;
});

Actinium.Cloud.define(PLUGIN.ID, 'urls', async req => {
    const options = CloudMasterOptions(req);
    let {
        contentId,
        limit = 100,
        order = 'descending',
        orderBy = 'route',
        page = -1,
        route,
    } = req.params;

    order = ['ascending', 'descending'].includes(order) ? order : 'descending';

    let skip = page < 1 ? 0 : page * limit - limit;

    const qry = new Actinium.Query('Route');

    if (contentId) {
        qry.equalTo('meta.contentId', contentId);
    } else {
        if (route) qry.equalTo('route', route);
    }

    let count = 0;

    if (page > 0) {
        count = await qry.count(options);
    }

    qry.limit(limit).skip(skip);
    qry[order](orderBy);

    let output = [];
    let results = await qry.find(options);

    while (results.length > 0) {
        results = results.map(item => item.toJSON());
        output = _.chain([output, results])
            .flatten()
            .sortBy('route')
            .value()
            .reverse();

        if (page < 1) {
            skip += limit;
            count = output.length;
            results = await qry.skip(skip).find(options);
        } else {
            results = [];
        }
    }

    const pages = Math.ceil(count / limit);

    let next = Math.min(page + 1, pages + 1);
    let prev = Math.max(page - 1, 0);

    const pagination = {
        page: page < 1 ? 1 : page,
        pages,
        count,
        limit,
        next: next > pages ? undefined : next,
        prev: prev < 1 ? undefined : prev,
    };

    return {
        ...pagination,
        results: _.indexBy(output, 'objectId'),
    };
});
