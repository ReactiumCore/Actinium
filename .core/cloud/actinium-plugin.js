const op = require('object-path');

const SDK = Actinium => {
    const {
        CloudHasCapabilities,
        CloudCapOptions,
    } = require(`${ACTINIUM_DIR}/lib/utils`);

    const semver = require('semver');
    const COLLECTION = 'Plugin';
    const path = require('path');

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
                plugin
                    ? plugin.set('active', active).save(null, options)
                    : null,
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
            return Promise.reject(
                'Cannot delete or deactivate built in plugins',
            );
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
            'meta',
        ];

        Object.keys(obj).forEach(key => {
            if (!keys.includes(key)) {
                req.object.unset(key);
            }
        });

        if (req.object.isNew()) {
            await Actinium.Hook.run('install', obj, req);
            if (active) {
                Actinium.Cache.set(`plugins.${obj.ID}.active`, true);
                await Actinium.Hook.run('schema', obj, req);
                await Actinium.Hook.run('activate', obj, req);
            }
        } else {
            let old = await new Parse.Query(COLLECTION)
                .equalTo('ID', obj.ID)
                .first({ useMasterKey: true });

            old = old.toJSON();

            const { active: prev } = old;
            const prevVer = op.get(old, 'version') || version;

            if (active === true) {
                if (semver.gt(semver.coerce(version), semver.coerce(prevVer))) {
                    await Actinium.Hook.run('update', obj, req, old);
                }
                if (semver.lt(semver.coerce(version), semver.coerce(prevVer))) {
                    WARN(
                        `Plugin ${obj.ID} new version ${version} is less than previous version ${prevVer}!`,
                    );
                }
            }

            if (active === true && active !== prev) {
                Actinium.Cache.set(`plugins.${obj.ID}.active`, true);
                await Actinium.Hook.run('schema', obj, req);
                await Actinium.Hook.run('activate', obj, req);
            }

            if (active === false && active !== prev) {
                Actinium.Cache.set(`plugins.${obj.ID}.active`, false);
                await Actinium.Hook.run('deactivate', obj, req);
            }

            Actinium.Cache.set(`plugins.${obj.ID}`, req.object.toJSON());
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

    Parse.Cloud.afterSave(COLLECTION, async req => {
        await Actinium.Hook.run('afterSave', req);
    });

    Actinium.Hook.register(
        'add-meta-asset',
        async metaAsset => {
            const parsedFilename = path.parse(metaAsset.targetFileName);
            const plugin = Actinium.Cache.get(`plugins.${metaAsset.ID}`);
            const appVer = op.get(ACTINIUM_CONFIG, 'version');
            const version = op.get(plugin, 'version.plugin', appVer);
            const { name, ext } = parsedFilename;
            metaAsset.targetFileName = `${name}-${version}${ext}`;
        },
        Actinium.Enums.priority.highest,
    );
};

module.exports = SDK;

/**
 * @api {Cloud} plugin-activate plugin-activate
 * @apiVersion 3.0.5
 * @apiGroup Cloud
 * @apiName plugin-activate
 * @apiDescription Activate a plugin

The `activate` hook will be run when a plugin is activated.

 * @apiParam {String} plugin The ID of the plugin to activate.
 * @apiExample Example Usage:
Actinium.Cloud.run('plugin-activate', { plugin: 'TEST-PLUGIN' });

// Returns the Plugin object on success
 */

/**
 * @api {Cloud} plugin-deactivate plugin-deactivate
 * @apiVersion 3.0.5
 * @apiGroup Cloud
 * @apiName plugin-deactivate
 * @apiDescription Deactivate a plugin.

The `deactivate` hook will be run when a plugin is deactivated.

 * @apiParam {String} plugin The ID of the plugin to deactivate.
 * @apiExample Example Usage:
Actinium.Cloud.run('plugin-deactivate', { plugin: 'TEST-PLUGIN' });

// Returns the Plugin object on success
 */

/**
 * @api {Cloud} plugin-uninstall plugin-uninstall
 * @apiVersion 3.0.5
 * @apiGroup Cloud
 * @apiName plugin-uninstall
 * @apiDescription Uninstall a plugin.

The `deactivate` and `uninstall` hooks will be run when a plugin is uninstalled.

_If the server restarts, the plugin will be installed again unless you remove it from the server by either._


 * @apiParam {String} plugin The ID of the plugin to uninstall.
 * @apiExample Example Usage:
Actinium.Cloud.run('plugin-deactivate', { plugin: 'TEST-PLUGIN' });

// Returns the Plugin object on success
 */

/**
 * @api {Cloud} plugins plugins
 * @apiVersion 3.0.5
 * @apiGroup Cloud
 * @apiName plugins
 * @apiDescription Retrieves the list of plugins.
 * @apiExample Example Usage:
Actinium.Cloud.run('plugins');
 */
