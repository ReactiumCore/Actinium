const path = require('path');
const chalk = require('chalk');
const _ = require('underscore');
const semver = require('semver');
const op = require('object-path');
const globby = require('globby').sync;
const appdir = path.normalize(`${APP_DIR}`);
const coredir = path.normalize(`${BASE_DIR}/.core`);
const npmdir = path.normalize(`${BASE_DIR}/node_modules`);
const config = require(`${BASE_DIR}/.core/actinium-config`);

const exp = {};
const blacklist = [];
const COLLECTION = 'Plugin';

const loader = p => {
    const plugin = require(path.normalize(p));
    const { ID, version } = plugin;

    // Validate plugin ID
    if (!ID || blacklist.includes(ID)) {
        return;
    }

    // Validate Actinium version
    const appVer = op.get(config, 'version');
    const ver = op.get(version, 'actinium', appVer);
    if (!semver.satisfies(appVer, ver)) {
        return;
    }

    exp[ID] = plugin;

    return plugin;
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
];

Plugable.exports = key => op.get(exp, key);

Plugable.register = (plugin, active = false) => {
    const ID = op.get(plugin, 'ID');
    plugin['active'] = active;

    if (ID) {
        Actinium.Cache.set(`plugins.${ID}`, plugin);
    }
};

Plugable.addMetaAsset = (ID, filePath, assetURLType = 'assetURL') => {
    if (
        typeof assetURLType !== 'string' ||
        !/[a-zA-Z_\-.]+/.test(assetURLType)
    ) {
        throw new Error(
            `Invalid asset URL type "assetURLType". Must be a string or object path (relative to plugin.meta)`,
        );
    }

    Actinium.Hook.register('activate', async (pluginObj, req) => {
        if (ID !== pluginObj.ID) return;
        const metaAsset = {
            ID,
            filePath,
            objectPath: `meta.${assetURLType}`,
            targetPath: `plugins/${ID}`,
            targetFileName: path.basename(filePath),
        };

        await Actinium.Hook.run('add-meta-asset', metaAsset);

        const file = await Actinium.File.create(
            metaAsset.filePath,
            metaAsset.targetPath,
            metaAsset.targetFileName,
        );

        const plugin = Actinium.Cache.get(`plugins.${ID}`);
        op.set(plugin, metaAsset.objectPath, file.url());
        req.object.set('meta', op.get(plugin, 'meta'));
    });
};

Plugable.addLogo = (ID, filePath) => {
    Plugable.addMetaAsset(ID, filePath, 'logoURL');
};

Plugable.addScript = (ID, filePath) => {
    Plugable.addMetaAsset(ID, filePath, 'scriptURL');
};

Plugable.addStylesheet = (ID, filePath) => {
    Plugable.addMetaAsset(ID, filePath, 'styleURL');
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
    await Plugable.schema();

    const pluginCache = _.sortBy(
        Object.values(Actinium.Cache.get('plugins', {})),
        'order',
    );

    LOG('');
    LOG(chalk.cyan('Loaded plugins...'));

    const objects = [];
    for (let i = 0; i < pluginCache.length; i++) {
        const plugin = pluginCache[i];

        const { ID, version } = plugin;
        LOG(chalk.cyan('  Plugin'), chalk.cyan('→'), chalk.magenta(ID));

        let obj = await new Parse.Query(COLLECTION)
            .equalTo('ID', ID)
            .first({ useMasterKey: true });

        if (!obj) {
            const objData = {
                active: false,
                ...plugin,
                version: op.get(version, 'plugin', '0.0.1'),
            };

            obj = new Parse.Object(COLLECTION);
            Object.keys(objData).forEach(key => obj.set(key, objData[key]));
        } else {
            obj.set('version', op.get(version, 'plugin'));
        }

        objects.push(obj);
    }

    let plugins = await Parse.Object.saveAll(objects, { useMasterKey: true });

    plugins = plugins
        .map(plugin => plugin.toJSON())
        .reduce((plugs, item) => {
            plugs[item.ID] = item;
            return plugs;
        }, {});

    Actinium.Cache.set('plugins', plugins);

    return Promise.resolve(plugins);
};

Plugable.get = ID =>
    ID
        ? Actinium.Cache.get(`plugins.${ID}`)
        : Actinium.Cache.get('plugins', {});

Plugable.isActive = ID => Actinium.Cache.get(`plugins.${ID}.active`, false);

Plugable.isValid = (ID, strict = false) => {
    if (blacklist.includes(ID)) {
        return false;
    }

    const plugin = Plugable.get(ID);

    // Validate if the plugin exists
    if (!plugin) {
        return false;
    }

    // Validate Actinium version
    const versionRange = op.get(plugin, 'version.actinium');
    if (versionRange) {
        const actiniumVer = op.get(config, 'version', '>=3.0.5');
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
  * @api {Function} Plugin.addMetaAsset(ID,filePath,assetURLType) Plugin.addMetaAsset()
  * @apiVersion 3.1.6
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
  * @apiParam {String} [assetURLType=assetURL] string (object path relative to plugin.meta) to store in plugin meta the file URL for the asset. e.g. by default your file URL will be found at `plugin.meta.assetURL` object path.
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
  // addLogo uses addMetaAsset with assetURLType='logoURL'
  Actinium.Plugin.addLogo(
      PLUGIN.ID,
      path.resolve(__dirname, 'plugin-assets/reset-logo.svg'),
  );
  // addLogo uses addMetaAsset with assetURLType='scriptURL'
  Actinium.Plugin.addScript(
      PLUGIN.ID,
      path.resolve(__dirname, 'plugin-assets/reset.js'),
  );
  // addLogo uses addMetaAsset with assetURLType='styleURL'
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
 * @api {Function} Plugin.addLogo(ID,filePath) Plugin.addLogo()
 * @apiVersion 3.1.6
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
 */

/**
 * @api {Function} Plugin.addScript(ID,filePath) Plugin.addScript()
 * @apiVersion 3.1.6
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
 */

/**
 * @api {Function} Plugin.addStylesheet(ID,filePath) Plugin.addStylesheet()
 * @apiVersion 3.1.6
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
