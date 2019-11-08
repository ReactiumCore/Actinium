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
 | :---- | :-- | -----: |
 | Setting.create | administrator,super-admin | Ability to create a new setting. |
 | Setting.retrieve | administrator,super-admin | Ability to retrieve any/all settings. |
 | Setting.update | administrator,super-admin | Ability to edit any existing setting. |
 | Setting.delete | administrator,super-admin | Ability to delete any existing setting. |
 | setting.${group}-get | administrator,super-admin | Ability to retrieve the setting with `group` setting group. e.g. setting.foo-get to allow get of setting group `foo` |
 | setting.${group}-set | administrator,super-admin | Ability to edit the setting with `group` setting group. e.g. setting.foo-set to allow edit of setting group `foo` |
 | setting.${group}-delete | administrator,super-admin | Ability to delete the setting with `group` setting group. e.g. setting.foo-delete to allow delete of setting group `foo` |
 */

const COLLECTION = 'Setting';

const BLUEPRINT = {
    sections: {
        sidebar: {
            zones: ['admin-sidebar'],
            meta: {},
        },
        main: {
            zones: ['admin-header', 'settings-groups', 'settings-actions'],
            meta: {},
        },
    },
    meta: {
        builtIn: true,
    },
    ID: 'Settings',
    description: 'Settings blueprint',
    className: 'Blueprint',
};

const ROUTE = {
    route: '/admin/settings',
    blueprint: BLUEPRINT.ID,
    meta: {
        builtIn: true,
    },
    capabilities: ['settings-ui.view'],
};

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
        builtIn: true,
    },
};

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

// All operations on settings are privileged
Actinium.Collection.register(COLLECTION, {
    create: false,
    retrieve: false,
    update: false,
    delete: false,
    addField: false,
});

Actinium.Hook.register(
    'settings-acl-roles',
    async context => {
        context.roles = ['administrator', 'super-admin'];
    },
    Actinium.Enums.priority.highest,
);

Actinium.Hook.register(
    'setting-set',
    async key => {
        const [group] = key.split('.');

        const ops = ['set', 'get', 'delete'];
        for (let op of ops) {
            const capability = `setting.${group}-${op}`;
            const perms = { allowed: [], excluded: [] };
            await Actinium.Hook.run('setting-capability', perms, key, op);
            Actinium.Capability.register(capability, perms);
        }
    },
    Actinium.Enums.priority.highest,
);

Actinium.Hook.register('blueprint-defaults', async blueprints => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        if (!blueprints.find(({ ID }) => ID === BLUEPRINT.ID)) {
            blueprints.push(BLUEPRINT);
        }
    }
});

Actinium.Hook.register('route-defaults', async routes => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        if (!routes.find(({ route }) => route === ROUTE.route)) {
            routes.push(ROUTE);
        }
    }
});

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
    const qry = new Parse.Query(COLLECTION).skip(skip).limit(limit);

    // result-set filtered by capability
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

    Actinium.Cache.set('setting', output);

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
 * @apiParam {Boolean} [public] When true, the setting will be made publicly readable, otherwise reads will be restricted.
 * @apiPermission `Setting.create`, `Setting.update` or `setting.${key}-set` capabilities.
 * @apiExample Example Usage:
Actinium.Cloud.run('setting-set', { key: 'site', value: {title: 'My Site', hostname: 'mysite.com'}, public: true});
 */
const set = async req => {
    const { key = '', value, public: publicSetting = false } = req.params;
    const [group, ...settingPath] = key.split('.');
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

    const opts = CloudCapOptions(
        req,
        [`${COLLECTION}.create`, `${COLLECTION}.update`, `setting.${key}-set`],
        strict,
    );

    let obj = await new Parse.Query(COLLECTION)
        .equalTo('key', group)
        .first(opts);
    obj = obj || new Parse.Object(COLLECTION);

    let objValue;
    if (settingPath.length) {
        objValue = op.get(obj.get('value'), 'value', {});
        op.set(objValue, settingPath, value);
    } else {
        objValue = value;
    }

    obj.set('key', group);
    obj.set('value', { value: objValue });

    const setting = await obj.save(null, opts);
    // Make setting publicly readable
    if (publicSetting) {
        await Actinium.Cloud.run(
            'capability-edit',
            {
                group: `setting.${group}-get`,
                perms: {
                    allowed: ['anonymous'],
                },
            },
            CloudRunOptions(req),
        );
        // Remove public read
    } else {
        const { allowed = [] } = await Actinium.Cloud.run(
            'capability-get',
            {
                group: `setting.${group}-get`,
            },
            CloudRunOptions(req),
        );
        await Actinium.Cloud.run(
            'capability-edit',
            {
                group: `setting.${group}-get`,
                perms: {
                    allowed: allowed.filter(role => role !== 'anonymous'),
                },
            },
            CloudRunOptions(req),
        );
    }

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

    let obj = await new Parse.Query(COLLECTION)
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

    let obj = await new Parse.Query(COLLECTION)
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

const beforeSave = async req => {
    const { key: group, value } = req.object.toJSON();

    const old = await new Parse.Query(COLLECTION)
        .equalTo('key', group)
        .first(CloudRunOptions(req));

    Actinium.Cache.set(`setting.${group}`, op.get(value, 'value'));

    // lock down all settings, and enforce by capability
    const acl = await settingsACL();
    req.object.setACL(acl);

    if (old) {
        const { value: previous } = old.toJSON();

        if (!_.isEqual(previous, value)) {
            Actinium.Hook.run('setting-change', group, value, previous);
        }
    } else {
        Actinium.Hook.run('setting-set', group, value);
    }
};

const settingsACL = async () => {
    const acl = new Parse.ACL();
    const { roles = [] } = await Actinium.Hook.run('settings-acl-roles');

    acl.setPublicReadAccess(false);
    acl.setPublicWriteAccess(false);

    roles.forEach(role => {
        acl.setRoleReadAccess(role, true);
        acl.setRoleWriteAccess(role, true);
    });

    await Actinium.Hook.run('settings-acl', acl);
    return acl;
};

const afterDel = req => {
    const { key = '' } = req.object.toJSON();

    Actinium.Capability.unregister(`setting.${key}-set`);
    Actinium.Capability.unregister(`setting.${key}-get`);
    Actinium.Capability.unregister(`setting.${key}-delete`);
    Actinium.Cache.del(`setting.${key}`);
    Actinium.Hook.run('setting-unset', key);
};

Actinium.Plugin.register(PLUGIN, true);

Actinium.Cloud.define(PLUGIN.ID, 'settings', list);
Actinium.Cloud.define(PLUGIN.ID, 'setting-get', get);
Actinium.Cloud.define(PLUGIN.ID, 'setting-set', set);
Actinium.Cloud.define(PLUGIN.ID, 'setting-save', set);
Actinium.Cloud.define(PLUGIN.ID, 'setting-unset', del);
Actinium.Cloud.define(PLUGIN.ID, 'setting-del', del);
Actinium.Cloud.define(PLUGIN.ID, 'setting-rm', del);

Actinium.Cloud.beforeSave(COLLECTION, beforeSave);
Actinium.Cloud.afterDelete(COLLECTION, afterDel);
