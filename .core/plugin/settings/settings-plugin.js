const _ = require('underscore');
const op = require('object-path');
const slugify = require('slugify');
const {
    CloudRunOptions,
    CloudCapOptions,
    CloudHasCapabilities,
} = require(`${ACTINIUM_DIR}/lib/utils`);

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
 | ---- | --- | ----- |
 | Setting.create | administrator,super-admin | Ability to create a new setting. |
 | Setting.retrieve | administrator,super-admin | Ability to retrieve any/all settings. |
 | Setting.update | administrator,super-admin | Ability to edit any existing setting. |
 | Setting.delete | administrator,super-admin | Ability to delete any existing setting. |
 | setting.${group}-get | administrator,super-admin | Ability to retrieve the setting with `group` setting group. e.g. setting.foo-get to allow get of setting group `foo` |
 | setting.${group}-set | administrator,super-admin | Ability to edit the setting with `group` setting group. e.g. setting.foo-set to allow edit of setting group `foo` |
 | setting.${group}-delete | administrator,super-admin | Ability to delete the setting with `group` setting group. e.g. setting.foo-delete to allow delete of setting group `foo` |
 */

const PLUGIN = {
    ID: 'Settings',
    description: 'Settings plugin used to manage application settings',
    name: 'Settings Plugin',
    order: 0,
    version: {
        actinium: '>=3.0.5',
        plugin: '0.0.1',
    },
    meta: {
        group: 'core',
        builtIn: true,
    },
};

const COLLECTION = 'Setting';

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
const list = async req => {
    let skip = 0;
    const output = {};
    const limit = 1000;
    const qry = new Actinium.Query(COLLECTION).skip(skip).limit(limit);

    let results = await qry.find({ useMasterKey: true });

    const fullAccess = CloudHasCapabilities(req, `${COLLECTION}.retrieve`);
    while (results.length > 0) {
        results.forEach(item => {
            const { key, value } = item.toJSON();
            if (
                key &&
                (fullAccess || CloudHasCapabilities(req, `setting.${key}-get`))
            ) {
                output[key] = op.get(value, 'value');
            }
        });

        skip += limit;
        qry.skip(skip);
        // result-set filtered by capability
        results = await qry.find({ useMasterKey: true });
    }

    Actinium.Cache.set('setting', output, Actinium.Enums.cache.dataLoading);

    return Promise.resolve(output);
};

/**
 * @api {Cloud} setting-set setting-set
 * @apiVersion 3.1.1
 * @apiGroup Cloud
 * @apiName setting-set
 * @apiDescription Create or update a setting object. Capabilities will be enforced.
 * @apiParam {String} key The unique setting key.
 * @apiParam {Mixed} value The setting value.
 * @apiParam {Boolean} [permissions] List of permissions to be applied to the setting.
 * @apiPermission `Setting.create`, `Setting.update` or `setting.${key}-set` capabilities.
 * @apiExample Example Usage:
Actinium.Cloud.run('setting-set', { key: 'site', value: {title: 'My Site', hostname: 'mysite.com'}, public: true});
 */
const set = async req => {
    const { params = {} } = req;
    const { key = '', value, public: publicSetting = false } = params;
    const [group, ...settingPath] = key.split('.');
    if (!group) return;

    const strict = false;

    // permission to create new or update this setting
    if (
        !CloudHasCapabilities(
            req,
            [
                `${COLLECTION}.create`,
                `${COLLECTION}.update`,
                `setting.${group}-set`,
            ],
            strict,
        )
    )
        return Promise.reject('Permission denied.');

    if (!isValid(value)) {
        return Promise.reject('invalid setting type: ' + typeof value);
    }

    const masterOptions = Actinium.Utils.MasterOptions();

    Actinium.Cache.del(`setting.${group}`);

    let obj = await new Actinium.Query(COLLECTION)
        .equalTo('key', group)
        .first(masterOptions);
    obj = obj || new Actinium.Object(COLLECTION);

    let objValue;
    if (settingPath.length) {
        objValue = op.get(obj.get('value'), 'value', {});
        op.set(objValue, settingPath, value);
    } else {
        objValue = value;
    }

    obj.set('key', group);
    obj.set('value', { value: objValue });

    const permissions = op.get(params, 'permissions', [
        {
            permission: 'read',
            type: 'public',
            allow: false,
        },
        {
            permission: 'write',
            type: 'public',
            allow: false,
        },
    ]);

    const groupACL = await Actinium.Utils.CloudACL(
        permissions,
        `setting.${group}-get`, // read
        `setting.${group}-set`, // write
        obj.getACL(),
    );

    obj.setACL(groupACL);

    const setting = await obj.save(null, masterOptions);

    Actinium.Cache.set(
        `setting.${key}`,
        objValue,
        Actinium.Enums.cache.dataLoading,
    );

    const result = op.get(setting.get('value'), 'value');
    if (settingPath.length) {
        return op.get(result, settingPath);
    }

    return result;
};

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
const del = async req => {
    const { key = '' } = req.params;
    const [group, ...settingPath] = key.split('.');

    // delete only for top-level groups, otherwise set
    if (settingPath.length) {
        op.del(req, 'params.value');
        return set(req);
    }

    const strict = false;

    // permission to create new or update this setting
    if (
        !CloudHasCapabilities(
            req,
            [`${COLLECTION}.delete`, `setting.${group}-delete`],
            strict,
        )
    )
        return Promise.reject('Permission denied.');

    const opts = CloudCapOptions(
        req,
        [`${COLLECTION}.delete`, `setting.${group}-delete`],
        strict,
    );

    let obj = await new Actinium.Query(COLLECTION)
        .equalTo('key', group)
        .first(opts);

    return obj ? obj.destroy(opts) : Promise.resolve();
};

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
const get = async req => {
    const { key = '' } = req.params;
    const [group, ...settingPath] = key.split('.');
    if (!group) return;

    const strict = false;

    if (
        !CloudHasCapabilities(
            req,
            [`${COLLECTION}.retrieve`, `setting.${group}-get`],
            false,
        )
    )
        return Promise.reject('Permission denied.');

    const cached = Actinium.Cache.get(`setting.${key}`);

    if (typeof cached !== 'undefined') {
        return cached;
    }

    let obj = await new Actinium.Query(COLLECTION)
        .equalTo('key', group)
        .first(
            CloudCapOptions(
                req,
                [`${COLLECTION}.retrieve`, `setting.${group}-get`],
                false,
            ),
        );
    obj = obj ? obj.toJSON() : {};

    const result = op.get(obj, 'value.value');
    if (settingPath.length) return op.get(result, settingPath);

    Actinium.Cache.set(
        `setting.${key}`,
        result,
        Actinium.Enums.cache.dataLoading,
    );

    return result;
};

const isValid = value => {
    const checks = [
        'isEmpty',
        'isBoolean',
        'isNumber',
        'isString',
        'isDate',
        'isArray',
        'isObject',
    ];

    return checks.reduce((status, func) => _[func](value) || status, false);
};

const afterSave = req => {
    const { key, value } = req.object.toJSON();
    Actinium.Cache.set(`setting.${key}`, op.get(value, 'value'));
};

const afterDel = req => {
    const { key = '' } = req.object.toJSON();

    Actinium.Cache.del(`setting.${key}`);
    Actinium.Capability.unregister(`setting.${key}-set`);
    Actinium.Capability.unregister(`setting.${key}-get`);
    Actinium.Capability.unregister(`setting.${key}-delete`);
    Actinium.Hook.run('setting-unset', key);
};

const beforeSave = async req => {
    const { key, value } = req.object.toJSON();

    if (req.original) {
        const { value: previous } = req.original.toJSON();

        if (!_.isEqual(previous, value)) {
            Actinium.Hook.run('setting-change', key, value, previous);
        }
    }

    Actinium.Cache.set(`setting.${key}`, op.get(value, 'value'));
    Actinium.Hook.run('setting-set', key, value);
};

const registerBlueprints = (reg = true) => ({ ID }) => {
    if (ID && ID !== PLUGIN.ID) return;
    const PLUGIN_BLUEPRINTS = require('./blueprints');
    if (reg === true)
        PLUGIN_BLUEPRINTS.forEach(bp => Actinium.Blueprint.register(bp.ID, bp));
    else PLUGIN_BLUEPRINTS.forEach(bp => Actinium.Blueprint.unregister(bp.ID));
};

const saveRoutes = async () => {
    const PLUGIN_ROUTES = require('./routes');
    for (const route of PLUGIN_ROUTES) {
        await Actinium.Route.save(route);
    }
};

Actinium.Plugin.register(PLUGIN, true);

Actinium.Capability.register(
    `${COLLECTION}.create`,
    {},
    Actinium.Enums.priority.highest,
);
Actinium.Capability.register(
    `${COLLECTION}.retrieve`,
    {},
    Actinium.Enums.priority.highest,
);
Actinium.Capability.register(
    `${COLLECTION}.update`,
    {},
    Actinium.Enums.priority.highest,
);
Actinium.Capability.register(
    `${COLLECTION}.delete`,
    {},
    Actinium.Enums.priority.highest,
);
Actinium.Capability.register(
    `${COLLECTION}.addField`,
    {},
    Actinium.Enums.priority.highest,
);

Actinium.Capability.register(
    'settings-ui.view',
    {},
    Actinium.Enums.priority.highest,
);

Actinium.Capability.register('setting.profile-get', {
    allowed: ['anonymous', 'user', 'contributor', 'moderator'],
});

// All operations on settings are privileged
Actinium.Collection.register(
    COLLECTION,
    {
        create: false,
        retrieve: false,
        update: false,
        delete: false,
        addField: false,
    },
    {
        key: {
            type: 'String',
        },
        value: {
            type: 'Object',
        },
    },
    ['key'],
);

Actinium.Hook.register(
    'settings-acl-roles',
    async context => {
        context.roles = ['administrator', 'super-admin'];
    },
    Actinium.Enums.priority.highest,
);

// Start: Blueprints
Actinium.Hook.register('start', registerBlueprints(true));

// Activate: Blueprints - Update blueprints on plugin activation
Actinium.Hook.register('activate', registerBlueprints(true));

// Active: Routes - Update routes on plugin activation
Actinium.Hook.register('activate', async ({ ID }) => {
    if (ID === PLUGIN.ID) {
        await saveRoutes();
    }
});

// Deactivate: Blueprints
Actinium.Hook.register('deactivate', registerBlueprints(false));

// Deactivate: Routes - Remove routes on deactivation
Actinium.Hook.register('deactivate', async ({ ID }) => {
    if (ID === PLUGIN.ID) {
        const PLUGIN_ROUTES = require('./routes');
        for (const route of PLUGIN_ROUTES) {
            await Actinium.Route.delete(route);
        }
    }
});

// Update routes on startup
Actinium.Hook.register('start', async () => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        await saveRoutes();
    }
});

// Update routes on plugin update
Actinium.Hook.register('update', async ({ ID }) => {
    if (ID === PLUGIN.ID) {
        await saveRoutes();
    }
});

// Running hook
Actinium.Hook.register('running', async () => {
    Actinium.Pulse.define(
        'settings-sync',
        {
            schedule: op.get(ENV, 'SETTINGS_SYNC_SCHEDULE', '* * * * *'),
        },
        async () => {
            const prevSettings = Actinium.Cache.get('setting');
            const settings = await Actinium.Setting.load();
            Actinium.Hook.run('settings-sync', settings, prevSettings);
        },
    );
});

Actinium.Cloud.define(PLUGIN.ID, 'settings', list);
Actinium.Cloud.define(PLUGIN.ID, 'setting-get', get);
Actinium.Cloud.define(PLUGIN.ID, 'setting-set', set);
Actinium.Cloud.define(PLUGIN.ID, 'setting-save', set);
Actinium.Cloud.define(PLUGIN.ID, 'setting-unset', del);
Actinium.Cloud.define(PLUGIN.ID, 'setting-del', del);
Actinium.Cloud.define(PLUGIN.ID, 'setting-rm', del);

Actinium.Cloud.afterDelete(COLLECTION, afterDel);
Actinium.Cloud.afterSave(COLLECTION, afterSave);
Actinium.Cloud.beforeSave(COLLECTION, beforeSave);
