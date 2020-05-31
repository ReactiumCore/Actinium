const _ = require('underscore');
const op = require('object-path');

module.exports = async (params, options, collection) => {
    const outputType = op.get(params, 'outputType', 'JSON');

    op.del(params, 'outputType');

    let obj = await new Actinium.Object(collection).save(params, options);

    return obj ? (outputType === 'JSON' ? obj.toJSON() : obj) : null;
};
