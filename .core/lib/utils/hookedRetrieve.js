const op = require('object-path');
const serialize = require('./serialize');

const SDK = Actinium => async (
    params,
    options,
    collection,
    queryHook = 'hooked-retrieve-query',
    outputHook = 'hooked-retrieve-output',
) => {
    const {
        order = 'descending',
        orderBy = 'updatedAt',
        outputType = 'JSON',
    } = params;

    // 1.0 - Initialize query
    let qry = new Actinium.Query(collection);

    // 1.1 - Default search params
    if (op.get(params, 'objectId')) qry.equalTo('objectId', params.objectId);

    // 1.2 - Default sort
    qry[order](orderBy);

    // 2.0 - Run hook: queryHook
    await Actinium.Hook.run(queryHook, qry, params, options, collection);

    // 3.0 - Execute query
    let resp = await qry.first(options);

    // 4.0 - Serialize response
    if (resp) resp = outputType === 'JSON' ? serialize(resp) : resp;

    // 5.0 - Run hook: outputHook
    await Actinium.Hook.run(outputHook, resp, params, options, collection);

    // 6.0 - Return response
    return resp;
};

module.exports = SDK;

/**
 * @apiDefine HookedRetrieve
 * @apiParam {Object} params Request params
 * @apiParam {Object} options Parse options for request
 * @apiParam (params) {String} [objectId] specific objectId for query
 * @apiParam (params) {String} [order=descending] list order
 * @apiParam (params) {String} [orderBy=updatedAt] field to order by
 * @apiParam (params) {String} [outputType=JSON]
 */
