const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const _ = require('underscore');
const semver = require('semver');
const semverValidRange = require('semver/ranges/valid');
const op = require('object-path');
const globby = require('globby').sync;
const appdir = path.normalize(`${APP_DIR}`);
const coredir = path.normalize(`${BASE_DIR}/.core`);
const npmdir = path.normalize(`${BASE_DIR}/node_modules`);

const exp = {};
const blacklist = [];
const COLLECTION = 'Plugin';

const loader = p => {
    const plugin = require(path.normalize(p));

    const ID = op.get(plugin, 'ID');
    if (ID) {
        exp[ID] = plugin;
        return plugin;
    }
};

const _isValid = (plugin = {}, strict = false) => {
    const { ID } = plugin;
    if (!ID || blacklist.includes(ID)) {
        return false;
    }

    // Validate if the plugin exists
    if (!plugin) {
        return false;
    }

    // Validate Actinium version
    const actiniumVer = op.get(ACTINIUM_CONFIG, 'version');
    const versionRange = op.get(plugin, 'version.actinium', `>=${actiniumVer}`);
    if (versionRange && semverValidRange(versionRange)) {
        if (!semver.satisfies(actiniumVer, versionRange)) {
            return false;
        }
    }

    // Validate if the plugin is active
    if (strict === true && Plugable.isActive(ID) !== true) {
        return false;
    }

    return true;
};

const Plugable = {};

Plugable.schema = async () => {
    const schema = new Parse.Schema(COLLECTION);
    let isSchema;

    try {
        isSchema = await schema.get({ useMasterKey: true });
    } catch (err) {
        schema.addBoolean('active');
        schema.addNumber('order');
        schema.addObject('meta');
        schema.addString('description');
        schema.addString('ID');
        schema.addString('name');
        schema.addString('version');

        return schema.save(null, { useMasterKey: true });
    }

    return Promise.resolve(isSchema);
};

Plugable.capabilities = [
    {
        capability: 'Plugin.create',
        roles: {},
    },
    {
        capability: 'Plugin.retrieve',
        roles: {
            allowed: ['anonymous'],
        },
    },
    {
        capability: 'Plugin.update',
        roles: {},
    },
    {
        capability: 'Plugin.delete',
        roles: {},
    },
    {
        capability: 'Plugin.addField',
        roles: {},
    },
    {
        capability: 'plugin-ui.view',
        roles: {
            allowed: ['super-admin', 'administrator'],
        },
    },
    {
        capability: 'plugins.activate',
        roles: {
            allowed: ['super-admin', 'administrator'],
        },
    },
];

Plugable.exports = key => op.get(exp, key);

Plugable.register = (plugin, active = false) => {
    const callerFileName = Actinium.Utils.getCallerFile();
    const ID = op.get(plugin, 'ID');
    plugin['active'] = active;

    // Validate plugin ID
    if (!ID || blacklist.includes(ID)) {
        return;
    }

    const meta = op.get(plugin, 'meta', {}) || {};
    const version = op.get(plugin, 'version', {}) || {};

    // Core plugins
    if (
        callerFileName &&
        !/^[.]{2}/.test(path.relative(coredir, callerFileName))
    ) {
        op.set(meta, 'builtIn', true);
        if (!op.get(meta, 'group')) op.set(meta, 'group', 'core');

        // core plugin are always valid for this version of actinium
        op.set(version, 'actinium', `>=${ACTINIUM_CONFIG.version}`);

        // core plugins that have no version information follow actinium core versioning
        const pluginVersion = op.get(version, 'plugin');
        if (!pluginVersion || !semver.valid(pluginVersion))
            op.set(version, 'plugin', ACTINIUM_CONFIG.version);
    }

    op.set(plugin, 'meta', meta);
    op.set(plugin, 'version', version);

    if (_isValid(plugin)) Actinium.Cache.set(`plugins.${ID}`, plugin);
};

Plugable.addMetaAsset = (ID, filePath, assetObjectPath = 'admin.assetURL') => {
    if (
        typeof assetObjectPath !== 'string' ||
        !/[a-zA-Z_\-.]+/.test(assetObjectPath)
    ) {
        throw new Error(
            'Invalid asset URL type "assetObjectPath". Must be a string or object path (relative to plugin.meta.assets)',
        );
    }

    const objectPath = `meta.assets.${assetObjectPath}`;
    const installAsset = async (pluginObj, obj) => {
        if (ID !== pluginObj.ID) return;

        const metaAsset = {
            ID,
            filePath,
            objectPath,
            targetPath: `plugins/${ID}`,
            targetFileName: path.basename(filePath),
        };

        await Actinium.Hook.run('add-meta-asset', metaAsset);

        let url;
        const file = await Actinium.File.create(
            metaAsset.filePath,
            metaAsset.targetPath,
            metaAsset.targetFileName,
        );

        url = String(file.url()).replace(
            `${ENV.SERVER_URI}${ENV.PARSE_MOUNT}`,
            '',
        );

        const plugin = Actinium.Cache.get(`plugins.${ID}`);
        op.set(plugin, metaAsset.objectPath, url);
        obj.set('meta', op.get(plugin, 'meta'));
    };

    const installMissingAsset = async (pluginObj, obj, existing) => {
        if (ID !== pluginObj.ID) return;

        const missingAsset =
            // Plugin is saved and active
            op.get(existing, 'active', false) === true &&
            // asset path is not set on existing
            !op.has(existing, objectPath);

        const proxy = Actinium.FilesAdapter.getProxy();
        if (missingAsset === true) {
            await installAsset(pluginObj, obj);
        }
    };

    Actinium.Hook.register('plugin-before-save', async (data, obj, existing) =>
        installMissingAsset(data, obj, existing),
    );
    Actinium.Hook.register('activate', async (data, req) =>
        installAsset(data, req.object),
    );
    Actinium.Hook.register('update', async (data, req) =>
        installAsset(data, req.object),
    );
};

Plugable.addLogo = (ID, filePath, app = 'admin') => {
    if (typeof app !== 'string') app = 'admin';
    Plugable.addMetaAsset(ID, filePath, `${app}.logo`);
};

Plugable.addScript = (ID, filePath, app = 'admin') => {
    if (typeof app !== 'string') app = 'admin';
    Plugable.addMetaAsset(ID, filePath, `${app}.script`);
};

Plugable.addStylesheet = (ID, filePath, app = 'admin') => {
    if (typeof app !== 'string') app = 'admin';
    Plugable.addMetaAsset(ID, filePath, `${app}.style`);
};

Plugable.init = () => {
    Plugable.capabilities.forEach(({ capability, roles }) =>
        Actinium.Capability.register(
            capability,
            roles,
            Actinium.Enums.priority.highest,
        ),
    );

    Actinium.Collection.register('Plugin', {
        create: false,
        retrieve: false,
        update: false,
        delete: false,
        addField: false,
    });

    return globby(ENV.GLOB_PLUGINS).map(item => loader(item));
};

Plugable.load = async () => {
    Actinium.pluginsLoaded = false;
    await Plugable.schema();

    const pluginCache = _.sortBy(
        Object.values(Actinium.Cache.get('plugins', {})),
        'order',
    );

    BOOT('');
    BOOT(chalk.cyan('Loaded plugins...'));

    const loaded = _.indexBy(
        (
            await new Parse.Query(COLLECTION).find(
                Actinium.Utils.MasterOptions(),
            )
        ).map(Actinium.Utils.serialize),
        'ID',
    );

    const objects = [];
    for (const cached of pluginCache) {
        const { ID, version } = cached;
        const versionInfo =
            op.get(cached, 'meta.builtIn') === true
                ? 'core'
                : op.get(cached, 'version.plugin');

        const existing = op.get(loaded, ID, {});

        // active if existing is active, or if doesn't exist and default plugin setting loaded from file is active.
        const active =
            op.get(existing, 'active', op.get(cached, 'active', false)) ===
            true;

        // Set new active state as early as reasonable for Actinium.Plugin.isActive() usage
        Actinium.Cache.set(`plugins.${ID}.active`, active);

        BOOT(
            chalk.cyan('  Plugin') +
                (active ? chalk.green('↑') : chalk.yellow('↓')),
            chalk.cyan('→'),
            chalk.magenta(ID),
            chalk.bold.white(versionInfo && `(${versionInfo})`),
        );

        let objData = {
            ...existing,
            ...cached,
            active,
            meta: {
                ...op.get(existing, 'meta', {}),
                ...op.get(cached, 'meta', {}),
            },
            version: op.get(version, 'plugin'),
        };

        const { objectId, ACL, createdAt, updatedAt, ...merged } = objData;

        const obj = new Parse.Object(COLLECTION);
        if (objectId) obj.id = objectId;
        Object.entries(merged).forEach(([key, value]) => obj.set(key, value));

        await Actinium.Hook.run(
            'plugin-before-save',
            objData,
            obj,
            existing,
            cached,
        );
        objects.push(obj);
    }

    const plugins = {};

    for (const obj of objects) {
        try {
            const saved = await obj.save(null, Actinium.Utils.MasterOptions());
            const item = Actinium.Utils.serialize(saved);
            plugins[item.ID] = item;
            Actinium.Cache.set(`plugins.${item.ID}`, item);

            await Actinium.Hook.run('plugin-load', plugins[item.ID]);
        } catch (error) {
            ERROR(`Error loading plugin ${obj.get('ID')}`, error);
        }
    }

    Actinium.pluginsLoaded = true;

    return Promise.resolve(plugins);
};

Plugable.get = ID =>
    ID
        ? Actinium.Cache.get(`plugins.${ID}`)
        : Actinium.Cache.get('plugins', {});

Plugable.isActive = ID => Actinium.Cache.get(`plugins.${ID}.active`, false);

Plugable.isValid = (ID, strict = false) => {
    const plugin = Plugable.get(ID);
    return _isValid(plugin, strict);
};

Plugable.gate = async ({ req, ID, name, callback }) => {
    if (Plugable.isValid(ID, true) !== true) {
        return Promise.reject(`Plugin: ${ID} is not active.`);
    }

    return callback(req);
};

Plugable.deactivate = ID =>
    Parse.Cloud.run(
        'plugin-deactivate',
        { plugin: ID },
        { useMasterKey: true },
    );

Plugable.activate = ID =>
    Parse.Cloud.run('plugin-activate', { plugin: ID }, { useMasterKey: true });

Plugable.updateHookHelper = (pluginId, migrations = {}) => {
    const versions = Object.keys(migrations).sort((a, b) => {
        if (semver.gt(semver.coerce(a), semver.coerce(b))) return 1;
        if (semver.gt(semver.coerce(b), semver.coerce(a))) return -1;
        return 0;
    });

    return async (current, req, old) => {
        if (pluginId === current.ID) {
            const newVer = semver.coerce(op.get(current, 'version'));
            const oldVer = semver.coerce(op.get(old, 'version'));

            for (const version of versions) {
                const spec = migrations[version];
                const test = op.get(spec, 'test', () =>
                    semver.gt(version, oldVer),
                );
                const migration = op.get(spec, 'migration', () => {});
                if (typeof test === 'function') {
                    const runnable = await test(newVer, oldVer, current);
                    if (runnable) {
                        await migration(current, req, old);
                    }
                }
            }
        }
    };
};

module.exports = Plugable;

/**
 * @api {Object} Actinium.Plugin Plugin
 * @apiVersion 3.0.5
 * @apiGroup Actinium
 * @apiName Plugin
 * @apiDescription Define plugins that extend Actinium functionality.
 */

/**
 * @api {Function} Actinium.Plugin.register(Plugin,active) Plugin.register()
 * @apiVersion 3.0.5
 * @apiGroup Actinium
 * @apiName Plugin.register
 * @apiDescription Register a plugin object.
 *
 * @apiParam {Object} Plugin The plugin object to register.
 * @apiParam {Active} [active=false] The default active state of plugin.
 * @apiParam (Plugin) {String} id Unique identifier for the plugin. If the ID has already been defined, it will be overwritten with the current plugin object.
 * @apiParam (Plugin) {String} [description] Summary of the plugin used when displaying the plugin list. The description can use markdown formatting.
 * @apiParam (Plugin) {String} [name] Common name for the plugin used when displaying the plugin list.
 * @apiParam (Plugin) {Number} [order=100] The sort order of the plugin used when establishing the initial loading order of the plugins.
 * @apiParam (Plugin) {Object} version Version information of the plugin.
 * @apiParam (Plugin) {String} .actinium The [semver](https://www.npmjs.com/package/semver#ranges) range of Actinium the plugin can work with.
 * @apiParam (Plugin) {String} .plugin The version of the plugin.
 * @apiExample Example Usage:
 * Actinium.Plugin.register({
 *    ID: 'TEST-PLUGIN',
 *    description: 'This is my plugin to test if this shit works',
 *    name: 'My Awesome Test Plugin',
 *    order: 100,
 *    version: {
 *        actinium: '>=3.0.5',
 *        plugin: '0.0.1',
 *    },
 * });
 */

/**
  * @api {Function} Plugin.addMetaAsset(ID,filePath,assetObjectPath) Plugin.addMetaAsset()
  * @apiVersion 3.5.5
  * @apiGroup Actinium
  * @apiName Plugin.addMetaAsset
  * @apiDescription Register an asset to the Parse file API and store the URL in
   your plugin meta object. Example usage, for providing a browser js script, a
  css file, or a plugin manager logo image. This is generally called after you
  have called `Actinium.Plugin.register()` to register your plugin, and the
  assets will be added to your plugin on plugin `activation` hook.

  Before your asset is stored, and the URL created, you will have an opportunity
  to change the targetFileName, when the `add-meta-asset` hook is called. For
  example the S3 file adapter plugin automatically adds the plugin version or
  Actinium version to asset filename (and URL) so that the correct asset is
  cached in your S3 bucket.
  *
  * @apiParam {String} id Unique identifier for the plugin provided to `Actinium.Plugin.register()`
  * @apiParam {String} filePath Full path to file asset to attach to the plugin.
  * @apiParam {String} [assetObjectPath=assetURL] string (object path relative to plugin.meta) to store in plugin meta the file URL for the asset. e.g. by default your file URL will be found at `plugin.meta.assets.admin.assetURL` object path.
  * @apiExample example-plugin.js
  // A plugin object, see Actinium.Plugin.register() for more information.
  const PLUGIN = {
    ID: 'Example',
    name: 'Example Plugin',
    description: 'A generic plugin',
    version: {
        plugin: 0.0.1,
        actinium: 3.1.6,
    },
  };

  Actinium.Plugin.register(PLUGIN);

  // all these execute on `activation` hook of your plugin
  // addLogo uses addMetaAsset with assetObjectPath='logoURL'
  Actinium.Plugin.addLogo(
      PLUGIN.ID,
      path.resolve(__dirname, 'plugin-assets/reset-logo.svg'),
  );
  // addLogo uses addMetaAsset with assetObjectPath='scriptURL'
  Actinium.Plugin.addScript(
      PLUGIN.ID,
      path.resolve(__dirname, 'plugin-assets/reset.js'),
  );
  // addLogo uses addMetaAsset with assetObjectPath='styleURL'
  Actinium.Plugin.addStylesheet(
      PLUGIN.ID,
      path.resolve(__dirname, 'plugin-assets/reset-plugin.css'),
  );
  Actinium.Plugin.addMetaAsset(PLUGIN.ID, 'plugin-assets/worker.js', 'webworkerURL');
 * @apiExample add-meta-asset-hook-example.js
const path = require('path');

// The full object passed to the `add-meta-asset` is:
// {
//     ID, // the plugin id
//     filePath, // the path to the file to be attached
//     objectPath, // the meta object path to store the URL (default 'meta.assetURL', 'meta.scriptURL', 'meta.style.URL', 'meta.logoURL')
//     targetPath, // the target file URI (default plugins/PLUGIN.ID)
//     targetFileName, // the target file name (default basename of filePath)
//}
Actinium.Hook.register('add-meta-asset', async metaAsset => {
    const parsedFilename = path.parse(metaAsset.targetFileName);
    // get plugin object
    const plugin = Actinium.Cache.get(`plugins.${metaAsset.ID}`);
    const version = op.get(plugin, 'version');
    const { name, ext } = parsedFilename;

    // put the plugin version in the target filename
    metaAsset.targetFileName = `${name}-${version}${ext}`;
});
 */

/**
 * @api {Function} Plugin.addLogo(ID,filePath,app) Plugin.addLogo()
 * @apiVersion 3.5.5
 * @apiGroup Actinium
 * @apiName Plugin.addLogo
 * @apiDescription Register a logo image for your plugin at plugin activation.
 This calls Plugin.addMetaAsset() with assetURL of `logoURL`. See `Plugin.addMetaAsset()`
 for more information.
 Actinium admin (a Reactium instance) will automatically load logoURLs found for active
 actinium plugins. This logo image will represent your plugin in the plugin manager.
 *
 * @apiParam {String} id Unique identifier for the plugin provided to `Actinium.Plugin.register()`
 * @apiParam {String} filePath Full path to file asset to attach to the plugin.
 * @apiParam {String} [app=admin] the application prefix for the asset object path
 */

/**
 * @api {Function} Plugin.addScript(ID,filePath,app) Plugin.addScript()
 * @apiVersion 3.5.5
 * @apiGroup Actinium
 * @apiName Plugin.addScript
 * @apiDescription Register a front-end Reactium plugin script asset for your plugin.
 This calls Plugin.addMetaAsset() with assetURL of `scriptURL`. See `Plugin.addMetaAsset()`
 for more information.
 Actinium admin (a Reactium instance) will automatically load scriptURLs found for active
 actinium plugins. In this way, you can publish plugin code to the Actinium admin.
 *
 * @apiParam {String} id Unique identifier for the plugin provided to `Actinium.Plugin.register()`
 * @apiParam {String} filePath Full path to file asset to attach to the plugin.
 * @apiParam {String} [app=admin] the application prefix for the asset object path
 */

/**
 * @api {Function} Plugin.addStylesheet(ID,filePath,app) Plugin.addStylesheet()
 * @apiVersion 3.5.5
 * @apiGroup Actinium
 * @apiName Plugin.addStylesheet
 * @apiDescription Register a front-end Reactium plugin script asset for your plugin.
 This calls Plugin.addMetaAsset() with assetURL of `styleURL`. See `Plugin.addMetaAsset()`
 for more information.
 Actinium admin (a Reactium instance) will automatically load styleURLs found for active
 actinium plugins. In this way, you can publish styles for your plugin to be used when
 your plugin is active in the Actinium admin.
 *
 * @apiParam {String} id Unique identifier for the plugin provided to `Actinium.Plugin.register()`
 * @apiParam {String} filePath Full path to file asset to attach to the plugin.
 * @apiParam {String} [app=admin] the application prefix for the asset object path
 */

/**
 * @api {Function} Actinium.Plugin.get() Plugin.get()
 * @apiVersion 3.0.5
 * @apiGroup Actinium
 * @apiName Plugin.get
 * @apiDescription Get the list of plugins.
 *
 * @apiParam {String} [id] Retrieves only the specified plugin.
 *
 * @apiExample Example Usage: All
Actinium.Plugin.get();

// Returns {Array}
[
    {
        ID: 'TEST-PLUGIN',
        description: 'This is my plugin to test if this shit works',
        name: 'My Awesome Test Plugin',
        order: 100,
        version: {
            actinium: '>=3.0.5',
            plugin: '0.0.1',
        },
    }
 ]
  * @apiExample Example Usage: Single
Actinium.Plugin.get('TEST-PLUGIN');

// Returns {Object}
{
    ID: 'TEST-PLUGIN',
    description: 'This is my plugin to test if this shit works',
    name: 'My Awesome Test Plugin',
    order: 100,
    version: {
        actinium: '>=3.0.5',
        plugin: '0.0.1',
    },
}
 */

/**
 * @api {Function} Actinium.Plugin.isActive(ID) Plugin.isActive()
 * @apiVersion 3.0.5
 * @apiGroup Actinium
 * @apiName Plugin.isActive
 * @apiDescription Determine if a plugin is active.
 *
 * @apiParam {String} id The ID of the plugin.
 *
 * @apiExample Example Usage:
Actinium.Plugin.isActive('TEST-PLUGIN');

// Returns {Boolean}
 */

/**
 * @api {Function} Actinium.Plugin.isValid(ID,strict) Plugin.isValid()
 * @apiVersion 3.0.5
 * @apiGroup Actinium
 * @apiName Plugin.isValid
 * @apiDescription Determine if a plugin is valid.
 *
 * @apiParam {String} id The ID of the plugin.
 * @apiParam {Boolean} [strict=false] If `true` the plugin must also be active.
 *
 * @apiExample Example Usage:
Actinium.Plugin.isValid('TEST-PLUGIN', true);

// Returns {Boolean}
 */

/**
 * @api {Function} Actinium.Plugin.deactivate(ID) Plugin.deactivate()
 * @apiVersion 3.0.5
 * @apiGroup Actinium
 * @apiName Plugin.deactivate
 * @apiDescription Programmatically deactivate a plugin.

 * @apiParam {String} id The ID of the plugin.
 * @apiParam (Returns) {Promise} plugin Returns a promise containing the deactivated plugin `{Object}`.
 * @apiExample Example Usage:
const myFunction = async () => {
    const plugin = await Actinium.Plugin.deactivate('TEST-PLUGIN');

    if (plugin) {
        console.log(plugin.ID, 'deactivated');
    }
};
 */

/**
 * @api {Function} Actinium.Plugin.activate(ID) Plugin.activate()
 * @apiVersion 3.0.5
 * @apiGroup Actinium
 * @apiName Plugin.activate
 * @apiDescription Programmatically activate a plugin.

 * @apiParam {String} id The ID of the plugin.
 * @apiParam (Returns) {Promise} plugin Returns a promise containing the activated plugin `{Object}`.
 * @apiExample Example Usage:
const myFunction = async () => {
    const plugin = await Actinium.Plugin.activate('TEST-PLUGIN');

    if (plugin) {
        console.log(plugin.ID, 'activated');
    }
};
 */

/**
  * @api {Function} Actinium.Plugin.updateHookHelper(ID,migrations) Plugin.updateHookHelper()
  * @apiVersion 3.6.2
  * @apiGroup Actinium
  * @apiDescription Helper for creating multiple update scripts and walking through
  * version appropriate updates for your plugin. For example, if you are running a
  * plugin Foo version 3.1.0, and startup Actinium with new plugin version 3.1.7, it
  * will be possible to run multiple update scripts in order appropriate for the new
  * version. By default, all the scripts will run that are newer than the old version
  * of the plugin, but you can specify your own test callback for abolute control.
  * @apiName Plugin.updateHookHelper
  * @apiParam {String} ID the plugin id.
  * @apiParam {Object} migrations object with key matching one version and value with an object containing a migration object
  * @apiParam (migration) {Asynchronous} [test] optional test function that will return a promise resolving to true or false, whether the migration function should be run or not respectively. By default it will run if the version of the migration script is newer than the old version of the plugin.
  * @apiParam (migration) {Asynchronous} migration migration function, given the same parameters as the update hook (plugin, request, oldPlugin)
  * @apiExample plugin.js
  const semver = require('semver');
  // if new version is 1.0.6 and old was 1.0.3, both 1.0.4, 1.0.5, and 1.0.6 updates will run by default
  // if new version is 1.0.6 and old was 1.0.5, only the 1.0.5 and 1.0.6 updates will run
  const migrations = {
      '1.0.6': {
          migration: async (plugin, req, oldPlugin) => {
              console.log('do things appropriate for upgrade from <1.0.6')
          }
      },
      '1.0.5': {
          migration: async (plugin, req, oldPlugin) => {
              console.log('do things appropriate for upgrade from <1.0.5')
          }
      },
     '1.0.4': {
         migration: async (plugin, req, oldPlugin) => {
             console.log('do things appropriate for upgrade from <1.0.4')
         }
     },
     '1.0.3': {
         test: (version, oldVersion) => version === '1.0.3' && semver.gt(oldVersion, '>=1.0.1'),
         migration: async (plugin, req, oldPlugin) => {
            console.log('this will only run for version 1.0.3, and only if upgrading from 1.0.1 or 1.0.2')
         }
     },
  };

  Actinium.Hook.register('update', Actinium.Plugin.updateHookHelper('MY_PLUGIN', migrations));
  *
  */
