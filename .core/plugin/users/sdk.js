const _ = require('underscore');
const ENUMS = require('./enums');
const moment = require('moment');
const op = require('object-path');
const slugify = require('slugify');
const serialize = require(`${ACTINIUM_DIR}/lib/utils/serialize`);

const COLLECTION = '_User';
const COLLECTION_ROLE = '_Role';

const User = {};

/**
 * @api {Object} Actinium.User User
 * @apiGroup Actinium
 * @apiVersion 3.0.3
 * @apiDescription Set of functions to interact with the User collection.
 */

/**
 * @api {Asyncronous} Actinium.User.save(params,options) User.save()
 * @apiGroup Actinium
 * @apiName User.save
 * @apiDescription Save a `Parse.User` object.
 * @apiParam {Object} params Key value pairs to apply to the `Parse.User` object.

 _Note:_ Any additional key value pairs will be added to the user object as a new column.

 * @apiParam {Object} options Parse cloud options object.
 * @apiParam (params) {String} username The unique username used when signing in.
 * @apiParam (params) {String} email The email address to associate with the user account.
 * @apiParam (params) {String} password The password used when signing in.
 * @apiParam (params) {String} [role] The `Parse.Role` name to add the user to.
 * @apiParam (hooks) {Hook} user-before-save Mutate the `Parse.User` object before save is complete.

```
Actinium.Hook.run('user-before-save', req[object:Parse.User])
```
 * @apiParam (hooks) {Hook} user-after-save Take action after the `Parse.User` object has been saved.
```
Actinium.Hook.run('user-after-save', req[object:Parse.User])
```
 */
User.save = async (params, options) => {
    // Get the role
    const role = op.get(params, 'role');

    // Remove role from params
    op.del(params, 'role');

    // Create the user object
    const userObj = new Parse.Object(COLLECTION);

    // Apply parameters to the userObj
    Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
            userObj.unset(key);
        } else {
            userObj.set(key, value);
        }
    });

    // Save the user
    let user;
    try {
        user = await userObj.save(params, options);
    } catch (err) {
        throw new Error(err);
    }

    // Handle error
    if (!user) {
        throw new Error('unable to save user');
    }

    // Apply the role
    try {
        if (role) {
            await Parse.Cloud.run(
                'role-user-add',
                { user: user.id, role },
                options,
            ).catch(console.log);
        }
    } catch (err) {
        console.log(err);
    }

    Actinium.Cache.del('users');

    return Promise.resolve(serialize(user));
};

/**
 * @api {Asyncronous} Actinium.User.list(params,options) User.list()
 * @apiGroup Actinium
 * @apiName User.list
 * @apiDescription Retrieve a list of `Parse.User` objects.
 * @apiParam {Object} params Query parameters.
 * @apiParam {Object} options Parse cloud options object.
 * @apiParam (params) {String} [role] Filter the results to the specified `Parse.Role` name.
 * @apiParam (params) {String} [search] Search using logical `or`. The query will RegExp compare to the default fields: `username`, `email`, `fname`, `lname`.

_Note:_ You can add or remove fields via the `user-search-fields` hook.
 * @apiParam (params) {Mixed} [objectId] `{String|Array}` Search for a specific objectId or array of objectIds.

 _Note:_ If `search` is specified, this value is ignored.
 * @apiParam (params) {Mixed} [email] `{String|Array}` Search for a specific email address or array of email addresses.

 _Note:_ If `search` is specified, this value is ignored.
 * @apiParam (params) {Mixed} [username] `{String|Array}` Search for a specific username or array of usernames.

 _Note:_ If `search` is specified, this value is ignored.
 * @apiParam (params) {Boolean} [optimize=false] If the count of the results is less than or equal to 1000, all objects will be returned. The page number will be set to 1 and the number of pages will also be 1.
 * @apiParam (params) {Boolean} [refresh=false] By default the results are cached for 90 seconds. You can flush the cache with this parameter.
 * @apiParam (params) {String} [indexBy] Index the results by the specified field and return them as an Object.
 * @apiParam (params) {String} [order] Order the results `ascending` or `descending`.
 * @apiParam (params) {String} [orderBy='username'] Order the results by the specified field.
 * @apiParam (params) {Number} [page=1] The page number of results to return.
 * @apiParam (params) {Number} [limit=20] The number of results to return per page.

 * @apiParam (hooks) {Hook} user-list-search-fields Mutate the fields used when searching or exact match lookups.
```
Actinium.Hook.register('user-list-search-fields', fields:Array, params, options)
```
 * @apiParam (hooks) {Hook} user-list-query Mutate the `Parse.Query` object.

```
Actinium.Hook.register('user-list-query', query:Parse.Query, params, options)
```
 * @apiParam (hooks) {Hook} user-list-response Mutate the response object before it is returned.

```
Actinium.Hook.register('user-list-response', response:Object, params, options)
```
 */
User.list = async (params, options) => {
    let page = Math.max(op.get(params, 'page', 1), 1);
    let limit = Math.min(op.get(params, 'limit', 20), 1000);
    const role = op.get(params, 'role');
    const search = op.get(params, 'search');
    const optimize = op.get(params, 'optimize', false);
    const refresh = op.get(params, 'refresh', false);
    const indexBy = op.get(params, 'indexBy');
    const orderBy = op.get(params, 'orderBy', 'username');
    const orders = ['ascending', 'descending'];
    let order = op.get(params, 'order', 'ascending');
    order = !orders.includes(order) ? 'ascending' : order;

    let qry = new Parse.Query(COLLECTION);

    const roleObj = role
        ? await new Parse.Query(COLLECTION_ROLE).equalTo('name', role).first()
        : undefined;

    let fields = ['username', 'email', 'fname', 'lname'];
    await Actinium.Hook.run('user-list-search-fields', fields, params, options);

    if (search) {
        const regex = new RegExp(search, 'gi');
        const queries = fields.map(fld => {
            const nqry = roleObj
                ? roleObj.relation('users').query()
                : new Parse.Query(COLLECTION);

            return nqry.matches(fld, regex);
        });

        qry = Parse.Query.or(...queries);
    }

    if (!search) {
        if (roleObj) {
            qry = roleObj.relation('users').query();
        }

        fields.forEach(fld => {
            const val = op.get(params, fld);
            if (val) qry.containedIn(fld, _.flatten([val]));
        });
    }

    const count = await qry.count(options);

    if (optimize && count <= 1000) {
        page = 1;
        limit = 1000;
    }

    const cacheKey = [
        'users',
        Buffer.from(
            _.compact([
                limit,
                page,
                order,
                orderBy,
                indexBy,
                role,
                search,
                _.compact(fields.map(fld => op.get(params, fld))).join('_'),
            ]).join('_'),
        ).toString('base64'),
    ];

    let response = Actinium.Cache.get(cacheKey);
    if (response && !refresh) {
        await Actinium.Hook.run(
            'user-list-response',
            response,
            params,
            options,
        );
        return response;
    }

    const skip = page * limit - limit;

    qry[order](orderBy)
        .limit(limit)
        .skip(skip);

    await Actinium.Hook.run('user-list-query', qry, params, options);

    const pages = Math.ceil(count / limit);
    const next = page + 1 <= pages ? page + 1 : null;
    const prev = page - 1 > 0 && page <= pages ? page - 1 : null;
    const results = await qry.find(options);

    response = {
        count,
        next,
        page,
        pages,
        prev,
        limit,
        order,
        orderBy,
        indexBy,
        search,
        results: results.map(item => serialize(item)),
    };

    await Actinium.Hook.run('user-list-response', response, params, options);

    if (indexBy) {
        op.set(response, 'results', _.indexBy(response.results, indexBy));
    }

    Actinium.Cache.set(cacheKey, response, ENUMS.CACHE);

    return response;
};

module.exports = User;
