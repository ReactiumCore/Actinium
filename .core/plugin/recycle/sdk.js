const _ = require('underscore');
const ENUMS = require('./enums');
const op = require('object-path');
const COLLECTION = ENUMS.COLLECTION;

const create = ({ type = 'delete', collection, object, user }, options) => {
    if (!collection) return new Error('collection is a required parameter');
    if (!object) return new Error('object is a required parameter');

    if (typeof object.toJSON === 'function') object = object.toJSON();

    let ACL = op.get(object, 'ACL', {});
    if (ACL && !(ACL instanceof Actinium.ACL)) ACL = new Actinium.ACL(ACL);

    return new Actinium.Object(COLLECTION).save(
        { ACL, type, collection, object, user },
        options,
    );
};

const purge = async (params, options) => {
    const { results = [] } = await retrieve(params, options);
    const objs = results.map(({ objectId }) =>
        new Actinium.Object(COLLECTION).set('objectId', objectId),
    );
    return Actinium.Object.destroyAll(objs);
};

const restore = async (params, options) => {
    let items = op.get(params, 'items');

    if (!items) {
        const list = await retrieve(params, options);
        items = op.get(list, 'results', []);
    }

    if (items.length < 1) return;

    const { collection, object } = items[0];

    if (!collection || !object) return;

    delete object.objectId;
    if (op.get(object, 'ACL')) {
        object.ACL = new Actinium.ACL(object.ACL);
    }

    Object.entries(object).forEach(([key, value]) => {
        // restore pointer
        if (
            typeof value === 'object' &&
            'className' in value &&
            'objectId' in value
        ) {
            object[key].__type = 'Pointer';
        }
    });

    return new Actinium.Object(collection).save(object, options);
};

const restoreAll = async (params, options) => {
    const { results = [] } = await retrieveAll(params, options);

    if (results.length < 1) return [];

    return Promise.all(
        results.map(item => restore({ items: [item] }, options)),
    );
};

const retrieveAll = async (params = {}, options) => {
    let results = [];
    let page = op.get(params, 'page', 1);

    let list = await retrieve(params, options);
    const { pages } = list;

    results = results.concat(list.results);

    while (page < pages) {
        page += 1;
        op.set(params, 'page', page);
        list = await retrieve(params, options);
        results = results.concat(list.results);
    }

    return { count: results.length, page: 1, pages: 1, results };
};

const retrieve = async (params, options) => {
    const page = Math.max(op.get(params, 'page', 1), 1);
    const limit = Math.min(op.get(params, 'limit', 1000), 1000);
    const skip = page * limit - limit;
    const qry = new Actinium.Query(COLLECTION).descending('createdAt');

    if (op.has(params, 'type')) {
        qry.containedIn('type', _.flatten([params.type]));
    }

    if (op.has(params, 'collection')) {
        qry.containedIn('collection', _.flatten([params.collection]));
    }

    if (op.has(params, 'objectId')) {
        qry.equalTo('object.objectId', params.objectId);
    }

    /**
     * @api {Hook} recycle-query recycle-query
     * @apiGroup Hooks
     * @apiName recycle-query
     * @apiParam {Query} query The Actinium.Query object
     * @apiParam {Object} params The request.params object
     * @apiParam {Object} options The options object
     * @apiDescription Triggered before the query is executed as a result of calling the Actinium.Recycle.retrieve function.
     */
    await Actinium.Hook.run('recycle-query', qry, params, options);

    const count = await qry.count(options);
    const pages = Math.ceil(count / limit);
    const next = page + 1 <= pages ? page + 1 : null;
    const prev = page - 1 > 0 && page <= pages ? page - 1 : null;

    const results = await qry
        .limit(limit)
        .skip(skip)
        .find(options);

    return {
        count,
        next,
        page,
        pages,
        prev,
        results: results.map(item => item.toJSON()),
    };
};

const Recycle = { ...ENUMS, purge, restore, restoreAll, retrieve, retrieveAll };

Recycle.archive = (params, options) =>
    create({ type: 'archive', ...params }, options);

Recycle.revision = (params, options) =>
    create({ type: 'revision', ...params }, options);

Recycle.trash = create;

module.exports = Recycle;

/**
 * @api {Asynchronus} Actinium.Recycle Recycle
 * @apiVersion 3.1.7
 * @apiName Recycle
 * @apiGroup Actinium
 * @apiDescription Recycle allows you to temporarily store a `Actinium.Object` and is useful for archiving and creating revisions of collection data.
 */

/**
 * @api {Asynchronus} Actinium.Recycle.archive(params,options) Recycle.archive()
 * @apiVersion 3.1.7
 * @apiGroup Actinium
 * @apiName Recycle.archive
 * @apiDescription Move a `Actinium.Object` to the `Recycle` collection and mark it as an `archve` type.
 * @apiParam {Object} params Parameters object.
 * @apiParam {String} params.collection The Actinium.Object type.
 * @apiParam {Object} params.object The Actinium.Object data.
 * @apiParam {Actinium.User} [params.user] The Actinium.User object.
 * @apiParam {Object} options Parse options object.
 * @apiExample Example Usage:
Actinium.Recycle.archive({
  collection: '_User',
  object: MyUserObject,
});
 */

/**
 * @api {Asynchronus} Actinium.Recycle.purge(params,options) Recycle.purge()
 * @apiVersion 3.1.7
 * @apiGroup Actinium
 * @apiName Recycle.purge
 * @apiDescription Clear the `Recycle` collection.
 * @apiParam {Object} params Parameters object.
 * @apiParam {String} [params.collection] Purge specific collection objects.
 * @apiParam {String} [params.objectId] Delete a specific collection object.
 * @apiParam {String} [params.type] Delete a specific type of Recycle objects. Valid options: `archive`, `delete`, `revision`.
 * @apiParam {Object} options Parse options object.
 * @apiExample Example Usage:
Actinium.Recycle.purge({ collection: '_User' });
 */

/**
 * @api {Asynchronus} Actinium.Recycle.restore(params,options) Recycle.restore()
 * @apiVersion 3.1.7
 * @apiGroup Actinium
 * @apiName Recycle.restore
 * @apiDescription Restore a `Actinium.Object` to it's original collection.
 * @apiParam {Object} params Parameters object.
 * @apiParam {String} [params.collection] Restore the most recent specified collection object.
 * @apiParam {String} [params.objectId] Restore a specific collection object.
 * @apiParam {Object} options Parse options object.
 * @apiExample Example Usage:
Actinium.Recycle.restore({ object: 'atlk2wat88' });
 */

/**
 * @api {Asynchronus} Actinium.Recycle.retrieve(params,options) Recycle.retrieve()
 * @apiVersion 3.1.7
 * @apiGroup Actinium
 * @apiName Recycle.retrieve
 * @apiDescription Retrieve a paginated list of `Recycle` objects.
 * @apiParam {Object} params Parameters object.
 * @apiParam {String} [params.collection] Retrieve specific collection objects.
 * @apiParam {Number} [params.page=1] The results page to return.
 * @apiParam {Number} [params.limit=1000] The number of results to return per page.
 * @apiParam {String} [params.objectId] Retrieve a specific Recycle object.
 * @apiParam {String} [params.type] Retrieve a specific type of Recycle objects. Valid options: `archive`, `delete`, `revision`.
 * @apiParam {Object} options Parse options object.
 * @apiExample Example Usage:
Actinium.Recycle.retrieve({ collection: '_User' });
 */

/**
 * @api {Asynchronus} Actinium.Recycle.revision(params,options) Recycle.revision()
 * @apiVersion 3.1.7
 * @apiGroup Actinium
 * @apiName Recycle.revision
 * @apiDescription Move a `Actinium.Object` to the `Recycle` collection and mark it as a `revision` type.
 * @apiParam {Object} params Parameters object.
 * @apiParam {String} params.collection The Actinium.Object type.
 * @apiParam {Object} params.object The Actinium.Object data.
 * @apiParam {Actinium.User} [params.user] The Actinium.User object.
 * @apiParam {Object} options Parse options object.
 * @apiExample Example Usage:
Actinium.Recycle.revision({
  collection: 'SomeCollection',
  object: SomeObject,
});
 */

/**
 * @api {Asynchronus} Actinium.Recycle.trash(params,options) Recycle.trash()
 * @apiVersion 3.1.7
 * @apiGroup Actinium
 * @apiName Recycle.trash
 * @apiDescription Move a `Actinium.Object` to the `Recycle` collection and mark it as a `delete` type.
 * @apiParam {Object} params Parameters object.
 * @apiParam {String} params.collection The Actinium.Object type.
 * @apiParam {Object} params.object The Actinium.Object data.
 * @apiParam {Actinium.User} [params.user] The Actinium.User object.
 * @apiParam {Object} options Parse options object.
 * @apiExample Example Usage:
Actinium.Recycle.trash({
  collection: 'SomeCollection',
  object: SomeObject,
});
 */
