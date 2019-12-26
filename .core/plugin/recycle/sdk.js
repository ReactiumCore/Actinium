const _ = require('underscore');
const ENUMS = require('./enums');
const op = require('object-path');
const COLLECTION = ENUMS.COLLECTION;

const create = ({ type = 'delete', collection, object, user }, options) => {
    if (!collection) return new Error('collection is a required parameter');
    if (!object) return new Error('object is a required parameter');

    if (typeof object.toJSON === 'function') object = object.toJSON();

    return new Parse.Object(COLLECTION).save(
        { type, collection, object, user },
        options,
    );
};

const purge = async (params, options) => {
    const { results = [] } = await retrieve(params, options);
    const objs = results.map(({ objectId }) =>
        new Parse.Object(COLLECTION).set('objectId', objectId),
    );
    return Parse.Object.destroyAll(objs);
};

const restore = async (params, options) => {
    const { results = [] } = await retrieve(params, options);

    if (results.length < 1) return;

    const { collection, object } = results[0];

    if (!collection || !object) return;

    delete object.objectId;

    return new Parse.Object(collection).save(object, options);
};

const retrieve = async (params, options) => {
    const page = Math.max(op.get(params, 'page', 1), 1);
    const limit = Math.min(op.get(params, 'limit', 1000), 1000);
    const skip = page * limit - limit;
    const qry = new Parse.Query(COLLECTION)
        .descending('createdAt')
        .limit(limit)
        .skip(skip);

    if (op.has(params, 'type')) {
        qry.containedIn('type', _.flatten([params.type]));
    }

    if (op.has(params, 'collection')) {
        qry.containedIn('collection', _.flatten([params.collection]));
    }

    if (op.has(params, 'objectId')) {
        qry.containedIn('objectId', _.flatten([params.objectId]));
    }

    if (op.has(params, 'object')) {
        qry.equalTo('object', params.object);
    }

    const count = await qry.count(options);
    const pages = Math.ceil(count / limit);
    const next = page + 1 <= pages ? page + 1 : null;
    const prev = page - 1 > 0 ? page + 1 : null;
    const results = await qry.find(options);

    return {
        count,
        next,
        page,
        pages,
        prev,
        results: results.map(item => item.toJSON()),
    };
};

const Recycle = { ...ENUMS, purge, restore, retrieve };

Recycle.archive = (params, options) =>
    create({ type: 'archive', ...params }, options);

Recycle.revision = (params, options) =>
    create({ type: 'revision', ...params }, options);

Recycle.trash = create;

module.exports = Recycle;
