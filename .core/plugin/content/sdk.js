const _ = require('underscore');
const ENUMS = require('./enums');
const op = require('object-path');

class Content {
    constructor() {}

    async fetch(params, options, count) {
        let {
            limit = 1000,
            order = 'descending',
            orderBy = 'updatedAt',
            page = 1,
        } = params;

        limit = Math.min(limit, 1000);
        const index = limit * page - limit;

        const qry = new Parse.Query(ENUMS.COLLECTION);

        count = count || (await qry.count(options));

        // sort
        if (String(order).toLowerCase() === 'ascending') {
            qry.ascending(orderBy);
        } else {
            qry.descending(orderBy);
        }

        const pages = Math.ceil(count / limit);
        const prev = page > 1 ? page - 1 : undefined;
        const next = page < pages ? page + 1 : undefined;

        qry.limit(limit);
        qry.skip(index);

        await Actinium.Hook.run('content-fetch-query', qry, params);

        const content = await qry.find(options);
        const results = content.reduce((items, item) => {
            items[item.id] = item.toJSON();
            return items;
        }, {});

        await Actinium.Hook.run('content-fetch', results, params);

        const pagination = {
            index,
            limit,
            page,
            pages,
            next,
            prev,
            count: content.length,
            total: count,
        };

        return { results, pagination };
    }
}

module.exports = new Content();

/**
 * @api {Asynchronous} Content.fetch(params,options) Content.fetch
 * @apiVersion 3.1.3
 * @apiGroup Actinium
 * @apiName Content.fetch
 * @apiDescription Retrieves a paginated list of `Content` objects.
 * @apiParam {Object} params The query configuration.
 * @apiParam {Number} [.limit=1000] Number of results to return per page.
 * @apiParam {String} [.order='descending'] The sort order of the results `ascending` or `descending`.
 * @apiParam {String} [.orderBy='updatedAt'] The sort field.
 * @apiParam {Number} [.page=1] The page of results to return.
 * @apiParam {Object} [options] Parse query options.
 * @apiExample Example usage:
const content = Actinium.Content.fetch({
    limit: 1000,
    order: 'ascending',
    orderBy: 'updatedAt',
    page: 1,
});
 */
