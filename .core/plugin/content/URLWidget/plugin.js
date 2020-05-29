const _ = require('underscore');

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

Actinium.Hook.register(
    'content-before-save',
    (content, type, isNew, params, options) => {
        if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
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
