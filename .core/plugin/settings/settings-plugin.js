const _ = require('underscore');
const op = require('object-path');
const slugify = require('slugify');
const {
    CloudRunOptions,
    CloudCapOptions,
    CloudHasCapabilities,
} = require(`${ACTINIUM_DIR}/lib/utils`);

const COLLECTION = 'Setting';

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
        const ops = ['set', 'get', 'delete'];
        for (let op of ops) {
            const capability = `setting.${key}-${op}`;
            const perms = { allowed: [], excluded: [] };
            await Actinium.Hook.run('setting-capability', perms, key, op);
            Actinium.Capability.register(capability, perms);
        }
    },
    Actinium.Enums.priority.highest,
);

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

    Actinium.Cache.set('settings', output);

    return Promise.resolve(output);
};

const set = async req => {
    const { key, value, public = false } = req.params;
    const strict = false;

    // permission to create new or update this setting
    if (
        !CloudHasCapabilities(
            req,
            [
                `${COLLECTION}.create`,
                `${COLLECTION}.update`,
                `setting.${key}-set`,
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

    let obj = await new Parse.Query(COLLECTION).equalTo('key', key).first(opts);

    obj = obj || new Parse.Object(COLLECTION);

    if (value) {
        obj.set('key', key);
        obj.set('value', { value });
    } else {
        obj.unset(key);
    }

    const setting = await obj.save(null, opts);

    // Make setting publicly readable
    if (public) {
        await Actinium.Cloud.run(
            'capability-edit',
            {
                group: `setting.${key}-get`,
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
                group: `setting.${key}-get`,
            },
            CloudRunOptions(req),
        );
        await Actinium.Cloud.run(
            'capability-edit',
            {
                group: `setting.${key}-get`,
                perms: {
                    allowed: allowed.filter(role => role !== 'anonymous'),
                },
            },
            CloudRunOptions(req),
        );
    }

    return setting;
};

const del = async req => {
    const { key } = req.params;
    const strict = false;

    // permission to create new or update this setting
    if (
        !CloudHasCapabilities(
            req,
            [`${COLLECTION}.delete`, `setting.${key}-delete`],
            strict,
        )
    )
        return Promise.reject('Permission denied.');

    const opts = CloudCapOptions(
        req,
        [`${COLLECTION}.delete`, `setting.${key}-delete`],
        strict,
    )(req);
    let obj = await new Parse.Query(COLLECTION).equalTo('key', key).first(opts);

    return obj ? obj.destroy(opts) : Promise.resolve();
};

const get = (async = async req => {
    const { key } = req.params;
    const strict = false;

    if (
        !CloudHasCapabilities(
            req,
            [`${COLLECTION}.retrieve`, `setting.${key}-get`],
            false,
        )
    )
        return Promise.reject('Permission denied.');

    let obj = await new Parse.Query(COLLECTION)
        .equalTo('key', key)
        .first(
            CloudCapOptions(
                req,
                [`${COLLECTION}.retrieve`, `setting.${key}-get`],
                false,
            ),
        );
    obj = obj ? obj.toJSON() : {};
    return Promise.resolve(op.get(obj, 'value'));
});

const isValid = ({ value }) => {
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
    const { key, value } = req.object.toJSON();

    const old = await new Parse.Query(COLLECTION)
        .equalTo('key', key)
        .first(CloudRunOptions(req));

    Actinium.Cache.set(`setting.${key}`, op.get(value, 'value'));

    // lock down all settings, and enforce by capability
    const acl = await settingsACL();
    req.object.setACL(acl);

    if (old) {
        const { value: previous } = old.toJSON();

        if (!_.isEqual(previous, value)) {
            Actinium.Hook.run('setting-change', key, value, previous);
        }
    } else {
        Actinium.Hook.run('setting-set', key, value);
    }
};

const afterDel = req => {
    const { key, value } = req.object.toJSON();

    Actinium.Cache.del(`setting.${key}`);
    Actinium.Hook.run('setting-unset', key, value);
    Actinium.Capability.unregister(`setting.${key}-set`);
    Actinium.Capability.unregister(`setting.${key}-get`);
    Actinium.Capability.unregister(`setting.${key}-delete`);
};

Actinium.Plugin.register(PLUGIN, true);

Actinium.Cloud.define(PLUGIN.ID, 'settings', list);
Actinium.Cloud.define(PLUGIN.ID, 'setting-get', get);
Actinium.Cloud.define(PLUGIN.ID, 'setting-set', set);
Actinium.Cloud.define(PLUGIN.ID, 'setting-unset', del);

Actinium.Cloud.beforeSave(COLLECTION, beforeSave);
Actinium.Cloud.afterDelete(COLLECTION, afterDel);
