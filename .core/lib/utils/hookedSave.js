const _ = require('underscore');
const op = require('object-path');
const slugify = require('./slugify');

const slug = str =>
    slugify(
        String(str)
            .toLowerCase()
            .replace(/_/g, '-'),
    );

const SDK = Actinium => async (params, options, collection) => {
    const outputType = op.get(params, 'outputType', 'JSON');

    op.del(params, 'outputType');

    let errors = {};

    let obj = new Actinium.Object(collection);

    await Actinium.Hook.run(
        slug(collection + '-before-save'),
        obj,
        params,
        errors,
    );

    if (Object.keys(errors).length > 0) {
        throw new Error(Object.values(errors).join(', '));
    }

    obj = await obj.save(params, options);

    await Actinium.Hook.run(slug(collection + '-save'), obj, params);

    return obj ? (outputType === 'JSON' ? obj.toJSON() : obj) : null;
};

module.exports = SDK;
