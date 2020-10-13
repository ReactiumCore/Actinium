const SDK = {};
const PLUGIN = require('./info');

const _ = require('underscore');
const op = require('object-path');
const slugify = require('slugify');

SDK.Blueprint = {};

SDK.Helper = {};

SDK.Helper.validate = (url, requiredParams) => {
    // if (op.get(url, 'pending') !== true) return false;
    // if (op.get(url, 'delete') === true) return false;

    requiredParams = requiredParams || ['blueprint', 'meta.type', 'route'];
    const count = requiredParams.length;
    return requiredParams.filter(key => op.has(url, key)).length === count;
};

SDK.Helper.routeObject = ({ contentId, url, user }) => {
    const urlObj = new Actinium.Object('Route');

    if (contentId) op.set(url, 'meta.contentId', contentId);
    if (isNaN(op.get(url, 'objectId'))) {
        urlObj.set('objectId', op.get(url, 'objectId'));
    }

    const meta = op.get(url, 'meta', {});
    if (!op.get(meta, 'app')) op.set(meta, 'app', 'site');

    urlObj.set('blueprint', SDK.Blueprint.slug(op.get(url, 'blueprint', '')));
    urlObj.set('route', SDK.Helper.urlFormat(op.get(url, 'route')));
    urlObj.set('meta', meta);
    urlObj.set('user', user);

    return urlObj;
};

SDK.Helper.urlFormat = url => {
    url = String(url)
        .toLowerCase()
        .split('/')
        .map(str => slugify(str))
        .join('/');

    return String(url).substr(0, 1) === '/' ? url : `/${url}`;
};

SDK.attach = async (params, options) => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return [];
    let { blueprint, content, contentId, collection, type } = params;

    options = options || { useMasterKey: true };

    // Fetch content object
    // prettier-ignore
    content = !content && contentId && collection
        ? await new Actinium.Query(collection)
            .equalTo('objectId', contentId)
            .first(options)
        : content;

    if (!content) return [];

    // Look at routes that don't have meta.contentId value set
    const rel = content.relation('urls');
    const qry = rel.query().notEqualTo('meta.contentId', contentId);
    const count = await qry.count(options);

    if (count < 1) return [];

    let routes = await qry
        .skip(0)
        .limit(count)
        .find(options);

    type = op.get(content.get('type') || {}, 'machineName');

    blueprint = SDK.Blueprint.slug(blueprint || collection);

    // Update content.meta object
    // Update content.blueprint string
    routes = routes.map(route => {
        const meta = route.get('meta');

        let app = op.get(meta, 'app', 'site');
        op.set(meta, 'app', app);
        op.set(meta, 'contentId', contentId);
        op.set(meta, 'collection', collection);
        op.set(meta, 'type', type);
        op.del(meta, 'blueprint');

        route.set('meta', meta);
        route.set('blueprint', blueprint);
        return route;
    });

    const attached =
        routes.length > 0 ? await Actinium.Object.saveAll(routes, options) : [];

    /**
     * @api {Hook} url-attached url-attached
     * @apiGroup Hooks
     * @apiName url-attached
     * @apiParam {Array} attached The Array of url Route objects attached
     * @apiParam {Object} params The request.params object
     * @apiParam {Object} options The options object
     * @apiDescription Triggered after url Route objects have been attached to a Content object as a result of calliing Actinium.URL.attach() function.
     */
    await Actinium.Hook.run('url-attached', attached, params, options);

    return attached;
};

SDK.create = async ({ content = {}, urls, user, ...params }, options) => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return [];
    if (!urls || !Array.isArray(urls)) return [];

    // 1.0 - Get the urls Array
    urls = urls
        .filter(url => SDK.Helper.validate(url))
        .map(url =>
            SDK.Helper.routeObject({
                contentId: op.get(content, 'id'),
                url,
                user,
            }),
        );

    // 2.0 - Create Route items
    const addURLS =
        urls.length > 0 ? await Actinium.Object.saveAll(urls, options) : [];

    // 3.0 - Add routes to relation

    if (urls.length > 0) {
        const rel = content.relation('urls');
        addURLS.forEach(route => {
            rel.add(route);
        });
    }

    /**
     * @api {Hook} url-created url-created
     * @apiGroup Hooks
     * @apiName url-created
     * @apiParam {Object} params The request.params object
     * @apiParam {Object} options The options object
     * @apiDescription Triggered after url Route objects have been created as a result of calling the Actinium.URL.create() function.
     */
    // 4.0 - Run hook
    await Actinium.Hook.run('url-created', addURLS, params, options);

    // 5.0 - Return created url Route objects
    return addURLS;
};

SDK.delete = async ({ urls, ...params }, options) => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return [];
    if (!urls || !Array.isArray(urls) || urls.length < 1) return [];

    const routes = urls.map(url => {
        if (url.id) return url.get('route');
        else return op.get(url, 'route');
    });

    // find urls
    urls = await new Actinium.Query('Route')
        .containedIn('route', routes)
        .limit(1000)
        .find(options);

    /**
     * @api {Hook} url-before-delete url-before-delete
     * @apiGroup Hooks
     * @apiName url-before-delete
     * @apiParam {Array} urls The Array of url Route objects to delete
     * @apiParam {Object} params The request.params object
     * @apiParam {Object} options The options object
     * @apiDescription Triggered after urls have been deleted as a result of calling Actinium.URL.delete() function.
     */
    await Actinium.Hook.run('url-before-delete', urls, params, options);

    // 3.1 - Delete from Route collection
    const deleted =
        urls.length > 0
            ? await Actinium.Object.destroyAll(
                  urls,
                  Actinium.Utils.MasterOptions(),
              )
            : [];

    /**
     * @api {Hook} url-deleted url-deleted
     * @apiGroup Hooks
     * @apiName url-deleted
     * @apiParam {Array} urls The Array of url Route objects to delete
     * @apiParam {Array} deleted Array of deleted url Route objects
     * @apiParam {Object} params The request.params object
     * @apiParam {Object} options The options object
     * @apiDescription Triggered after urls have been deleted as a result of calling Actinium.URL.delete() function.
     */
    await Actinium.Hook.run('url-deleted', urls, deleted, params, options);

    return deleted;
};

SDK.list = async (params, options) => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;

    options = options || { useMasterKey: true };

    let {
        contentId,
        limit = 100,
        order = 'descending',
        orderBy = 'route',
        page = -1,
        route,
        collection,
        type,
    } = params;

    order = ['ascending', 'descending'].includes(order) ? order : 'descending';

    const defResponse = { count: 0, page: 1, pages: 1, limit, results: {} };

    let qry;
    let skip = page < 1 ? 0 : page * limit - limit;

    if (contentId && collection) {
        try {
            qry = new Actinium.Object(collection)
                .set('objectId', contentId)
                .relation('urls')
                .query();
        } catch (err) {
            await Actinium.Hook.run('urls', defResponse, params, options);
            return defResponse;
        }
    } else {
        qry = new Actinium.Query('Route');

        if (contentId) {
            qry.equalTo('meta.contentId', contentId);
        } else {
            if (route) qry.equalTo('route', route);
        }

        if (collection) {
            qry.equalTo('meta.collection', collection);
        }

        if (type) {
            qry.equalTo('meta.type', type);
        }
    }

    if (!qry) {
        await Actinium.Hook.run('urls', defResponse, params, options);
        return defResponse;
    }

    let count = 0;

    if (page > 0) {
        count = await qry.count(options);
    }

    qry.limit(limit).skip(skip);
    qry[order](orderBy);

    /**
     * @api {Hook} urls-query urls-query
     * @apiDescription Called before the urls query is executed.
     * @apiParam {Object} query Actinium.Query object
     * @apiParam {Object} params The request.params object
     * @apiParam {Object} options The request options object
     * @apiName urls-query
     * @apiGroup Hooks
     */
    await Actinium.Hook.run('urls-query', qry, params, options);

    let output = [];
    let results = await qry.find(options);

    while (results.length > 0) {
        results = results.map(route => route.toJSON());
        output = _.flatten([output, results]);

        if (page < 1) {
            skip += limit;
            count = output.length;
            qry.skip(skip);

            results = await qry.find(options);
        } else {
            results = [];
        }
    }

    const pages = Math.ceil(count / limit);
    page = Math.max(page, 1);
    let next = page + 1;
    let prev = page - 1;

    const pagination = {
        page,
        pages,
        count,
        limit,
        next: next > pages || next === 0 ? undefined : next,
        prev: prev < 1 ? undefined : prev,
    };

    const response = {
        ...pagination,
        results: _.indexBy(output, 'objectId'),
    };

    /**
     * @api {Hook} urls urls
     * @apiDescription Called before the urls response is returned.
     * @apiParam {Object} response Serialized response object
     * @apiParam {Object} params The request.params object
     * @apiParam {Object} options The request options object
     * @apiName urls
     * @apiGroup Hooks
     */
    await Actinium.Hook.run('urls', response, params, options);
    return response;
};

SDK.restore = async (params, options) => {
    options = options || { useMasterKey };

    const restored = await Actinium.Recycle.restoreAll(params, options);

    /**
     * @api {Hook} urls-restored urls-restored
     * @apiGroup Hooks
     * @apiName urls-restored
     * @apiParam {Array} restored Array of url Route Objects.
     * @apiParam {Object} params The request.params object
     * @apiParam {Object} options The options object
     * @apiDescription Triggered when a url is restored as a result of calling the Actinium.URL.resotre() function.
     */
    await Actinium.Hook.run('urls-restored', restored, params, options);

    return restored;
};

SDK.retrieve = async (params, options) => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;

    let {
        contentId,
        objectId,
        order = 'descending',
        orderBy = 'route',
        route,
    } = params;

    order = ['ascending', 'descending'].includes(order) ? order : 'descending';

    const qry = new Actinium.Query('Route');

    qry[order](orderBy);

    if (route) {
        qry.equalTo('route', route);
    } else if (objectId) {
        qry.equalTo('objectId', objectId);
    } else if (contentId) {
        qry.equalTo('meta.contentId', contentId);
    }
    /**
     * @api {Hook} url-query url-query
     * @apiGroup Hooks
     * @apiName url-query
     * @apiParam {Query} query The Actinium.Query object
     * @apiParam {Object} params The request.params object
     * @apiParam {Object} options The options object
     * @apiDescription Triggered before the url query is executed as a result of calling Actinium.URL.retrieve() function
     */
    await Actinium.Hook.run('url-query', qry, params, options);

    let result = await qry.first(options);

    if (result) result = result.toJSON();

    /**
     * @api {Hook} url-retrieved url-retrieved
     * @apiGroup Hooks
     * @apiName url-retrieved
     * @apiParam {Object} route the serialized Actinium.Route object
     * @apiParam {Object} params The request.params object
     * @apiParam {Object} options The request options object
     * @apiDescription Triggered after the url query is executed as a result of calling Actinium.URL.retrieve() function
     */
    await Actinium.Hook.run('url-retrieved', result, params, options);

    return result;
};

SDK.trash = async (params, options) => {
    let { contentId, urls } = params;

    if (!urls && contentId) {
        const { results = {} } = await SDK.list({ contentId });
        urls = Object.values(results);
    }

    if (!urls) return [];

    // serialize urls
    urls = urls.map(url => {
        if (op.has(url, 'toJSON')) return url.toJSON();
        return url;
    });

    /**
     * @api {Hook} url-before-trashed url-before-trashed
     * @apiGroup Hooks
     * @apiName url-before-trashed
     * @apiParam {Array} urls Array of url Route Objects.
     * @apiParam {Object} params The request.params object
     * @apiParam {Object} options The options object
     * @apiDescription Triggered before a url is trashed as a result of calling Actinium.URL.trash() function.
     */
    await Actinium.Hook.run('url-before-trashed', urls, params, options);

    const trash = await Promise.all(
        urls.map(url => Actinium.Recycle.archive('Route', url)),
    );

    await SDK.delete({ urls });

    /**
     * @api {Hook} url-trashed url-trashed
     * @apiGroup Hooks
     * @apiName url-trashed
     * @apiParam {Array} urls Array of url Route Objects.
     * @apiParam {Array} trash Array of Recycle Objects.
     * @apiParam {Object} params The request.params object
     * @apiParam {Object} options The options object
     * @apiDescription Triggered after a url is trashed as a result of calling Actinium.URL.trash() function.
     */
    await Actinium.Hook.run('url-trashed', urls, trash, params, options);
};

SDK.Blueprint.slug = str => {
    str = String(str).toLowerCase();
    str = String(str).replace(/[^a-z0-9\-\_\s]/gi, '');
    str = String(str).replace(/\s+/, ' ');
    str = slugify(str);

    return str;
};

SDK.Blueprint.update = async (params, options) => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return [];
    let { blueprint, collection, contentId } = params;

    options = options || { useMasterKey: true };

    blueprint = SDK.Blueprint.slug(blueprint || collection);

    // Look at routes that don't have meta.contentId value set
    const qry = new Actinium.Query('Route')
        .equalTo('meta.contentId', contentId)
        .notEqualTo('blueprint', blueprint);

    const count = await qry.count(options);

    if (count < 1) return [];

    const routes = await qry
        .skip(0)
        .limit(count)
        .find(options);

    // Update content.blueprint string
    routes.forEach(route => route.set('blueprint', blueprint));

    const updated =
        routes.length > 0 ? await Actinium.Object.saveAll(routes, options) : [];

    return updated;
};

module.exports = SDK;
