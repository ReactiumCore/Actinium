const op = require('object-path');
const {
    CloudHasCapabilities,
    CloudCapOptions,
    CloudRunOptions,
} = require(`${ACTINIUM_DIR}/lib/utils`);

const COLLECTION = 'Plugin';

const toggle = req => {
    const { plugin: ID, active = false } = req.params;

    if (!ID) {
        return Promise.reject('plugin is a required paramter');
    }

    const options = CloudCapOptions(
        req,
        ['plugin.view', 'plugin.activate', 'plugin.deactivate'],
        true,
    );

    return new Parse.Query(COLLECTION)
        .equalTo('ID', ID)
        .first(options)
        .then(plugin =>
            plugin ? plugin.set('active', active).save(null, options) : null,
        )
        .then(plugin => (plugin ? plugin.toJSON() : null));
};

const del = req => {
    const { plugin: ID, active = false } = req.params;

    if (!ID) {
        return Promise.reject('plugin is a required paramter');
    }

    const options = CloudCapOptions(req, ['plugin.uninstall']);

    return new Parse.Query(COLLECTION)
        .equalTo('ID', ID)
        .first(options)
        .then(plugin => (plugin ? plugin.destroy(options) : null))
        .then(plugin => (plugin ? plugin.toJSON() : null));
};

const mapPlugins = (plugins = []) =>
    plugins.map(item => {
        if (op.has(item, 'id')) {
            return item.toJSON();
        } else {
            return item;
        }
    });

Parse.Cloud.define('plugins', async req => {
    if (!CloudHasCapabilities(req, ['Plugin.retrieve']))
        throw new Error('Permission denied.');

    let pages = 0,
        total = 0;

    let { page = 0, limit = 1000 } = req.params;

    page = Math.max(page, 0);
    limit = Math.min(limit, 1000);

    const skip = page > 0 ? page * limit - limit : 0;
    const query = new Parse.Query(COLLECTION);
    const options = CloudCapOptions(req, ['Plugin.retrieve']);

    // Pagination
    total = await query.count(options);

    // Find
    query.skip(skip);
    query.limit(limit);

    let plugins = [];
    let results = await query.find(options);
    while (results.length > 0) {
        plugins = plugins.concat(results);

        if (page < 1) {
            query.skip(plugins.length);
            results = await query.find(options);
        } else {
            break;
        }
    }
    plugins = mapPlugins(plugins);

    pages = Math.ceil(total / limit);

    const list = {
        timestamp: Date.now(),
        limit,
        page,
        pages,
        total,
        plugins,
    };

    await Actinium.Hook.run('plugins-list', list);

    return list;
});

Parse.Cloud.define('plugin-activate', req => {
    op.set(req, 'params.active', true);
    return toggle(req);
});

Parse.Cloud.define('plugin-deactivate', req => {
    op.set(req, 'params.active', false);
    return toggle(req);
});

Parse.Cloud.define('plugin-uninstall', del);

Parse.Cloud.beforeDelete(COLLECTION, async req => {
    const obj = req.object.toJSON();

    if (op.get(obj, 'meta.builtIn', false) === true) {
        return Promise.reject(`Cannot delete or deactivate built in plugins`);
    }

    await Actinium.Hook.run('beforeDelete-plugin', req);

    if (op.has(obj, 'ID')) {
        await Actinium.Plugin.deactivate(obj.ID);
    }
});

Parse.Cloud.beforeSave(COLLECTION, async req => {
    await Actinium.Hook.run('beforeSave-plugin', req);

    const obj = req.object.toJSON();
    const { active, version } = obj;

    // Restrict the object schema
    const keys = [
        'ID',
        'active',
        'description',
        'name',
        'order',
        'version',
        'bundle',
        'meta',
    ];

    Object.keys(obj).forEach(key => {
        if (!keys.includes(key)) {
            req.object.unset(key);
        }
    });

    if (req.object.isNew()) {
        await Actinium.Hook.run('install', obj);
        if (active) {
            await Actinium.Hook.run('activate', obj);
        }
    } else {
        let old = await new Parse.Query(COLLECTION)
            .equalTo('ID', obj.ID)
            .first({ useMasterKey: true });

        old = old.toJSON();

        const { active: prev, version: prevVer } = old;

        Actinium.Cache.set(`plugins.${obj.ID}`, obj);

        if (active === true && version !== prevVer) {
            await Actinium.Hook.run('update', obj, old);
        }

        if (active !== prev && active === true) {
            await Actinium.Hook.run('activate', obj);
        }

        if (active !== prev && active === false) {
            await Actinium.Hook.run('deactivate', obj);
        }
    }

    return Promise.resolve();
});

Parse.Cloud.afterDelete(COLLECTION, async req => {
    const obj = req.object.toJSON();

    if (op.has(obj, 'ID')) {
        await Actinium.Hook.run('uninstall', obj);

        Actinium.Cache.del(`plugins.${obj.ID}`);
    }

    await Actinium.Hook.run('afterDelete-plugin', req);
});

Parse.Cloud.afterSave(COLLECTION, req => Actinium.Hook.run('afterSave', req));
