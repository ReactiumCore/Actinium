const _ = require('underscore');
const ENUMS = require('./enums');
const op = require('object-path');
const COLLECTION = ENUMS.COLLECTION;

const create = ({ type = 'delete', collection, object, user }, options) => {
    if (!collection) return new Error('collection is a required parameter');
    if (!object) return new Error('object is a required parameter');

    if (typeof object.toJSON === 'function') object = object.toJSON();

    const ACL = op.get(object, 'ACL');

    return new Parse.Object(COLLECTION).save(
        { ACL, type, collection, object, user },
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
        qry.equalTo('object.objectId', params.object);
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

/**
 * @api {Asynchronus} Actinium.Recycle Recycle
 * @apiVersion 3.1.7
 * @apiName Recycle
 * @apiGroup Actinium
 * @apiDescription Recycle allows you to temporarily store a `Parse.Object` and is useful for archiving and creating revisions of collection data.
 */

/**
 * @api {Asynchronus} Actinium.Recycle.archive(params,options) Recycle.archive()
 * @apiVersion 3.1.7
 * @apiGroup Actinium
 * @apiName Recycle.archive
 * @apiDescription Move a `Parse.Object` to the `Recycle` collection and mark it as an `archve` type.
 * @apiParam {Object} params Parameters object.
 * @apiParam {String} params.collection The Parse.Object type.
 * @apiParam {Object} params.object The Parse.Object data.
 * @apiParam {Parse.User} [params.user] The Parse.User object.
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
Actinium.Recycle.purge({ collect: '_User' });
 */

/**
 * @api {Asynchronus} Actinium.Recycle.restore(params,options) Recycle.restore()
 * @apiVersion 3.1.7
 * @apiGroup Actinium
 * @apiName Recycle.restore
 * @apiDescription Restore a `Parse.Object` to it's original collection.
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
 * @apiDescription Move a `Parse.Object` to the `Recycle` collection and mark it as a `revision` type.
 * @apiParam {Object} params Parameters object.
 * @apiParam {String} params.collection The Parse.Object type.
 * @apiParam {Object} params.object The Parse.Object data.
 * @apiParam {Parse.User} [params.user] The Parse.User object.
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
 * @apiDescription Move a `Parse.Object` to the `Recycle` collection and mark it as a `delete` type.
 * @apiParam {Object} params Parameters object.
 * @apiParam {String} params.collection The Parse.Object type.
 * @apiParam {Object} params.object The Parse.Object data.
 * @apiParam {Parse.User} [params.user] The Parse.User object.
 * @apiParam {Object} options Parse options object.
 * @apiExample Example Usage:
Actinium.Recycle.trash({
  collection: 'SomeCollection',
  object: SomeObject,
});
 */
