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
