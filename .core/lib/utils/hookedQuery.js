const _ = require('underscore');
const op = require('object-path');

module.exports = async (params, options, collection, queryHook, outputHook) => {
    options = options || { useMasterKey: true };

    let {
        limit = 100,
        order = 'ascending',
        orderBy = 'name',
        outputType = 'JSON',
        page = -1,
    } = params;

    order = ['ascending', 'descending'].includes(order) ? order : 'descending';

    let resp = { count: 0, page: 1, pages: 1, limit, results: {} };

    // 1.0 - Initialize query
    let qry = new Actinium.Query(collection);

    // 1.1 - Default query params
    if (op.get(params, 'objectId')) {
        qry.containedIn('objectId', _.flatten([params.objectId]));
    }

    // 1.2 - Default sort
    qry[order](orderBy);

    // 1.3 - Run hook: queryHook
    await Actinium.Hook.run(queryHook, qry, params, options);

    // 2.0 - Get count
    let count = 0;
    if (page > 0) count = await qry.count(options);
    op.set(resp, 'count', count);

    let skip = page < 1 ? 0 : page * limit - limit;

    // 3.0 - Execute query
    let results = await qry
        .skip(skip)
        .limit(limit)
        .find(options);

    // 3.1 - Process results
    while (results.length > 0) {
        results.forEach(item =>
            op.set(
                resp,
                ['results', item.id],
                outputType === 'JSON' ? item.toJSON() : item,
            ),
        );

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

    // 4.0 - Pagination info
    const pages = Math.ceil(count / limit);
    op.set(resp, 'pages', pages);

    page = Math.max(page, 1);
    op.set(resp, 'page', page);

    const next = page + 1;
    if (next <= pages) op.set(resp, 'next', next);

    const prev = page - 1;
    if (prev > 0) op.set(resp, 'prev', prev);

    // 5.0 - Run hook: outputHook
    await Actinium.Hook.run(outputHook, resp, params, options);

    // 6.0 - Return response
    return resp;
};
