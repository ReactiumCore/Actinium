const op = require('object-path');

module.exports = async (params, options, collection, queryHook, outputHook) => {
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
    await Actinium.Hook.run(queryHook, qry, params, options);

    // 3.0 - Execute query
    let resp = await qry.first(options);

    // 4.0 - Serialize response
    if (resp) resp = outputType === 'JSON' ? resp.toJSON() : resp;

    // 5.0 - Run hook: outputHook
    await Actinium.Hook.run(outputHook, resp, params, options);

    // 6.0 - Return response
    return resp;
};
