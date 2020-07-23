const _ = require('underscore');
const op = require('object-path');
const serialize = require('./serialize');

/**
 * @apiDefine HookedQuery
 * @apiParam {Object} params Request params
 * @apiParam {Object} options Parse options for request
 * @apiParam {String} collection Parse collection name
 * @apiParam {String} [queryHook='hooked-query-query'] hook name to be invoked before running query
 * @apiParam {String} [outputHook='hooked-query-output'] hook name to be invoked before returning results
 * @apiParam {String} [resultsKey='results'] property where list of results will be found
 * @apiParam {String} [resultsKey='object'] 'object' to get results as an object, indexed by objectId, 'array' to get results as array of objects
 * @apiParam {Object} [req] Parse cloud request object, optional.
 * @apiParam (params) {String} [order=ascending] list order
 * @apiParam (params) {String} [limit=100] number of items per page
 * @apiParam (params) {String} [page=-1] current page, if < 0, all pages will be loaded
 * @apiParam (params) {String} [orderBy=name] field to order by
 * @apiParam (params) {String} [outputType=JSON]
 */

module.exports = async (
    params = {},
    options = {},
    collection,
    queryHook = 'hooked-query-query',
    outputHook = 'hooked-query-output',
    resultsKey = 'results',
    resultsAs = 'OBJECT',
    req,
) => {
    let {
        limit = 100,
        order = 'ascending',
        orderBy = 'name',
        outputType = 'JSON',
        page = -1,
    } = params;

    resultsAs = String(resultsAs).toUpperCase();
    outputType = String(outputType).toUpperCase();
    order = ['ascending', 'descending'].includes(order) ? order : 'descending';

    let resp = { count: 0, page: 1, pages: 1, limit, [resultsKey]: [] };

    // 1.0 - Initialize query
    let qry = new Actinium.Query(collection);

    // 1.1 - Default query params
    if (op.get(params, 'objectId')) {
        qry.containedIn('objectId', _.flatten([params.objectId]));
    }

    // 1.2 - Default sort
    qry[order](orderBy);

    // 1.3 - Run hook: queryHook
    await Actinium.Hook.run(queryHook, qry, params, options, collection, req);

    // 1.3.5 - Standardized Query Params
    const queryWhitelist = [
        'containedBy',
        'containedIn',
        'contains',
        'containsAll',
        'containsAllStartingWith',
        'descending',
        'doesNotExist',
        'endsWith',
        'equalTo',
        'exclude',
        'greaterThan',
        'greaterThanOrEqualTo',
        'include',
        'includeAll',
        'lessThan',
        'lessThanOrEqualTo',
        'matches',
        'notContainedIn',
        'notEqualTo',
        'select',
        'startsWith',
    ];
    const queryParams = _.compact(
        Array.from(op.get(params, 'queryParams', [])),
    );
    if (queryParams.length > 0) {
        queryParams.forEach(({ method, params = [] }) => {
            if (queryWhitelist.includes(method)) {
                qry[method](...params);
            }
        });
    }

    // 2.0 - Get count
    let count = await qry.count(options);

    let skip = page < 1 ? 0 : page * limit - limit;

    // 3.0 - Execute query
    let results = await qry
        .skip(skip)
        .limit(limit)
        .find(options);

    // 3.1 - Process results
    while (results.length > 0) {
        op.set(resp, [resultsKey], _.flatten([resp[resultsKey], results]));

        // 3.2 - Get next page if page < 1
        if (page < 1) {
            skip += limit;
            results = await qry
                .skip(skip)
                .limit(limit)
                .find(options);
        } else {
            results = [];
        }
    }

    op.set(
        resp,
        resultsKey,
        resultsAs === 'OBJECT'
            ? _.indexBy(resp.results, 'id')
            : resp[resultsKey],
    );

    // 4.0 - Pagination info
    op.set(resp, 'count', count);

    const pages = Math.ceil(count / limit);
    op.set(resp, 'pages', pages);

    page = Math.max(page, 1);
    op.set(resp, 'page', page);

    const next = page + 1;
    if (next <= pages) op.set(resp, 'next', next);

    const prev = page - 1;
    if (prev > 0) op.set(resp, 'prev', prev);

    // 5.0 - Run hook: outputHook
    await Actinium.Hook.run(
        outputHook,
        resp,
        params,
        options,
        collection,
        resultsKey,
        resultsAs,
        req,
    );

    // 6.0 - Process toJSON
    if (outputType === 'JSON') {
        const results = resp[resultsKey];
        Object.entries(results).forEach(([id, item]) =>
            op.set(results, id, serialize(item)),
        );
    }

    // 7.0 - Return response
    return resp;
};
