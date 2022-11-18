import _ from 'underscore';
import op from 'object-path';

export default async (params, options, collection) => {
    const outputType = op.get(params, 'outputType', 'JSON');

    op.del(params, 'outputType');

    let obj = await new Actinium.Object(collection).save(params, options);

    return obj ? (outputType === 'JSON' ? obj.toJSON() : obj) : null;
};
