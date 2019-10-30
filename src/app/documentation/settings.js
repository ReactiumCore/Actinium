/**
 * @api {Object} Actinium.Setting Setting
 * @apiVersion 3.1.1
 * @apiName Setting
 * @apiGroup Actinium
 * @apiDescription Manage application setting key/value pairs.
 Actinium settings are provided to you can manage your running configuration for your application.
 By default, each setting is securely stored so that only users that should have access to a setting
 are permitted to set, get, or delete settings on the site.

 The following capabilities can be assigned to your roles for settings:

 | Capability | Default Roles | Description |
 | :---- | :-- | -----: |
 | Setting.create | administrator,super-admin | Ability to create a new setting. |
 | Setting.retrieve | administrator,super-admin | Ability to retrieve any/all settings. |
 | Setting.update | administrator,super-admin | Ability to edit any existing setting. |
 | Setting.delete | administrator,super-admin | Ability to delete any existing setting. |
 | setting.${key}-get | administrator,super-admin | Ability to retrieve the setting with `key`. e.g. setting.foo-get to allow get of setting `foo` |
 | setting.${key}-set | administrator,super-admin | Ability to edit the setting with `key`. e.g. setting.foo-set to allow edit of setting `foo` |
 | setting.${key}-delete | administrator,super-admin | Ability to delete the setting with `key`. e.g. setting.foo-delete to allow delete of setting `foo` |
 */

/**
 * @api {Function} Actinium.Setting.set(key,value) Setting.set()
 * @apiVersion 3.1.1
 * @apiGroup Actinium
 * @apiName Setting.set
 * @apiDescription Create or update a setting value. Returns a `{Promise}`.
 * @apiParam {String} key The unique setting key.
 * @apiParam {Mixed} [value] The setting value. If the value is an object, you can use dot notation to set a specific portion of the setting.
 * @apiParam {Parse.ACL} [ACL] The Parse ACL object to apply to the setting.
 * @apiExample Example Usage:
Actinium.Setting.set('site', { title: 'My Awesome Site', hostname: 'mysite.com' });
 */

/**
 * @api {Function} Actinium.Setting.unset(key) Setting.unset()
 * @apiVersion 3.1.1
 * @apiGroup Actinium
 * @apiName Setting.unset
 * @apiDescription Unset a setting value. Returns a `{Promise}`.
 * @apiParam {String} key The unique setting key.
 * @apiExample Example Usage:
Actinium.Setting.unset('site.title');
 */

/**
 * @api {Function} Actinium.Setting.get(key,default) Setting.get()
 * @apiVersion 3.1.1
 * @apiGroup Actinium
 * @apiName Setting.get
 * @apiDescription Get a setting value.
 * @apiParam {String} key The unique setting key. If the value is an object, you can use dot notation to get a specific portion of the setting.
 * @apiParam {Mixed} default The default value if the key has not been set.
 * @apiExample Example Usage:
Actinium.Setting.get('site.hostname');
 */

/**
 * @api {Cloud} settings settings
 * @apiVersion 3.1.1
 * @apiGroup Cloud
 * @apiName settings
 * @apiDescription Retrieves the list of settings. Capabilities will be enforced.
 * @apiPermission `Setting.retrieve` or individual `setting.${key}-get` permissions.
 * @apiExample Example Usage:
Actinium.Cloud.run('settings');
 */

/**
 * @api {Cloud} setting-get setting-get
 * @apiVersion 3.1.1
 * @apiGroup Cloud
 * @apiName setting-get
 * @apiDescription Retrieves a specifc setting object. Capabilities will be enforced.
 * @apiParam {String} key The unique setting key.
 * @apiPermission `Setting.retrieve` or `setting.${key}-get` capabilities.
 * @apiExample Example Usage:
Actinium.Cloud.run('setting-get', { key: 'site'});
 */

/**
 * @api {Cloud} setting-set setting-set
 * @apiVersion 3.1.1
 * @apiGroup Cloud
 * @apiName setting-set
 * @apiDescription Create or update a setting object. Capabilities will be enforced.
 * @apiParam {String} key The unique setting key.
 * @apiParam {Mixed} value The setting value.
 * @apiParam {Boolean} [public] When true, the setting will be made publicly readable, otherwise reads will be restricted.
 * @apiPermission `Setting.create`, `Setting.update` or `setting.${key}-set` capabilities.
 * @apiExample Example Usage:
Actinium.Cloud.run('setting-set', { key: 'site', value: {title: 'My Site', hostname: 'mysite.com'}, public: true});
 */

/**
 * @api {Cloud} setting-unset setting-unset
 * @apiVersion 3.1.1
 * @apiGroup Cloud
 * @apiName setting-unset
 * @apiDescription Unsets a setting value. Capabilities will be enforced.
 * @apiParam {String} key The unique setting key.
 * @apiPermission `Setting.delete` or `setting.${key}-delete` capabilities.
 * @apiExample Example Usage:
Actinium.Cloud.run('setting-unset', { key: 'site' });
 */
