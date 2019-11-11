const chalk = require('chalk');
const uuid = require('uuid/v4');
const _ = require('underscore');
const semver = require('semver');
const op = require('object-path');
const ActionSequence = require('action-sequence');
const Hook = require('./hook');

const COLLECTION = 'Capability';

const noop = () => Promise.resolve();

let sort = [];
let unreg = [];

const isLevel = match => {
    match = String(match);
    return (
        match.includes('>') ||
        match.includes('=') ||
        match.includes('<') ||
        match.includes('~') ||
        match.includes(' ')
    );
};

const levelCheck = (can, level, match) => {
    level = semver.coerce(String(level));
    match = String(match);
    if (can !== true && semver.satisfies(level, match)) {
        can = true;
    }
    return can;
};

const Capability = {
    _obj: {},
    _groups: {},
    defaults: {
        'user.admin': {
            exclude: ['user'],
        },
        'user.view': {
            allowed: ['moderator'],
        },
        'user.create': {
            allowed: [],
        },
        'user.edit': {
            allowed: [],
        },
        'user.delete': {
            allowed: [],
        },
        'user.ban': {
            allowed: ['moderator'],
        },
        'plugin.view': {
            allowed: [],
        },
        'plugin.activate': {
            allowed: [],
            required: true,
        },
        'plugin.deactivate': {
            allowed: [],
            required: true,
        },
        'plugin.uninstall': {
            allowed: [],
            required: true,
        },
    },
    Role: {},
    User: {},
};

Capability.register = (
    group = 'global',
    perms = {
        allowed: [],
        excluded: [],
    },
    order = 100,
) => {
    sort.push({
        group,
        allowed: perms.allowed,
        excluded: perms.excluded,
        order,
    });

    if (Actinium.started === true) {
        _addCapability(group, perms);
    }
};

Capability.unregister = group => {
    unreg.push(group);
    unreg = _.compact(_.uniq(unreg));

    if (Actinium.started === true) {
        _removeCapability(group);
    }
};

Capability.get = capability => {
    if (capability) {
        return op.get(Capability._obj, capability);
    } else {
        return _.flatten(
            Object.keys(Capability._obj).map(group => {
                return Object.keys(Capability._obj[group]).map(cap => {
                    return `${group}.${cap}`;
                });
            }),
        ).sort();
    }
};

Capability.roles = capability => {
    const excluded = op.get(Capability._obj, `${capability}.excluded`, []);
    return _.chain(
        op
            .get(Capability._obj, `${capability}.allowed`, [])
            .filter(r => !excluded.includes(r)),
    )
        .uniq()
        .compact()
        .value()
        .sort();
};

Capability.Role.can = (role, capability) => {
    if (role === 'banned') return false;

    const roles = Capability.roles(capability);
    return roles.includes(role) || roles.includes('anonymous');
};

Capability.Role.get = role => {
    return Object.keys(Capability._groups).reduce((arr, capability) => {
        if (Capability.Role.can(role, capability)) arr.push(capability);
        return arr;
    }, []);
};

Capability.User.can = (cap, user) => {
    user = op.get(user, 'user.id', user);

    const roleObj = Actinium.Roles.User.get(user);
    const roles = Object.keys(roleObj);
    const group = op.get(Capability._obj, cap, {});
    let { allowed = [], excluded = [] } = group;

    // Strict cases:

    // If the user is banned... get outta here!
    if (roles.includes('banned')) {
        return false;
    }

    // no roles exist yet, or capability allows anonymous access
    if (roles.length < 1 || allowed.includes('anonymous')) {
        return true;
    }

    // If the user is a super-admin they get all capabilities
    if (roles.includes('super-admin')) {
        return true;
    }

    // If the user is an administrator and they are not excluded from a capability
    if (
        roles.includes('administrator') &&
        !excluded.includes('administrator')
    ) {
        return true;
    }

    // Fluid cases:
    const level = _.max(Object.values(roleObj)) || 0;
    let can = false;
    if (allowed.length > 0) {
        can = _.intersection(roles, allowed).length > 0;

        // Check levels
        if (!can) {
            allowed.forEach(match => {
                if (isLevel(match)) {
                    can = levelCheck(can, level, match);
                }
            });
        }
    } else {
        can = true;
    }

    if (excluded.length > 0) {
        can = _.intersection(roles, excluded).length > 0 ? false : can;

        // Check levels
        if (can) {
            excluded.forEach(match => {
                if (isLevel(match)) {
                    can = levelCheck(can, level, match);
                }
            });
        }
    }

    return can;
};

Capability.User.get = user => {
    const roles = Actinium.Roles.User.get(user);
    return Object.keys(roles).reduce((arr, role) => {
        const caps = Object.keys(Capability._groups).filter(cap =>
            Capability.Role.can(role, cap),
        );
        return arr.concat(caps);
    }, []);
};

const _loadedCapabilities = async () => {
    const query = new Parse.Query(COLLECTION);
    const groups = {};
    const results = await query.find({ useMasterKey: true });

    for (let result of results) {
        const allowedList = [];
        const excludedList = [];

        const { group } = result.toJSON();
        groups[group] = result;

        const allowed = await result
            .get('allowed')
            .query()
            .find({ useMasterKey: true });
        const excluded = await result
            .get('excluded')
            .query()
            .find({ useMasterKey: true });

        allowed.forEach(role => {
            const { name } = role.toJSON();
            allowedList.push(name);
        });
        excluded.forEach(role => {
            const { name } = role.toJSON();
            excludedList.push(name);
        });
        result.set('allowedList', allowedList);
        result.set('excludedList', excludedList);
    }

    return groups;
};

const normalizeCapability = cap => ({
    allowed: _.uniq(
        op.get(cap, 'allowed', []).concat('administrator', 'super-admin'),
    ),
    excluded: _.uniq(op.get(cap, 'excluded', []).concat('banned')),
});

Capability.load = async () => {
    if (Actinium.Cache.get('capabilities.loaded')) return;

    LOG('');
    LOG(chalk.cyan('Loading capabilities...'));
    await Actinium.Hook.run('capability-loading');

    // Merge defaults with parse loaded
    Capability._obj = Object.entries(Capability.defaults).reduce(
        (_obj, [group, defaultCap]) => {
            const cap = normalizeCapability(defaultCap);

            op.set(_obj, group, cap);
            Capability._groups[group] = cap;
            return _obj;
        },
        {},
    );

    // Register new or changed
    for (let cap of _.sortBy(sort, 'order')) {
        const { group } = cap;
        const oldCapability = op.get(Capability._obj, group);
        const newCapability = normalizeCapability(cap);

        op.set(Capability._obj, group, newCapability);
        Capability._groups[group] = newCapability;

        if (hook) {
            await Actinium.Hook.run(
                'capability-updated',
                group,
                newCapability,
                oldCapability,
            );
        }
    }

    // unregisters
    for (let group of unreg) {
        const cap = op.get(Capability._obj, group);
        if (cap && !op.get(cap, 'required', false)) {
            op.del(Capability._obj, group);
            delete Capability._groups[group];
            await Actinium.Hook.run('capability-unregistered', group);
        }
    }

    const loaded = await _loadedCapabilities();

    Capability._obj = Object.values(loaded).reduce((_obj, result) => {
        const {
            group,
            allowedList: allowed = [],
            excludedList: excluded = [],
        } = result.toJSON();
        const cap = normalizeCapability({ allowed, excluded });
        op.set(_obj, group, cap);
        Capability._groups[group] = cap;
        return _obj;
    }, Capability._obj);

    let query = new Parse.Query('_Role');
    const roleObjects = await query.find({ useMasterKey: true });
    const roles = roleObjects.reduce((roles, role) => {
        roles[role.get('name')] = role;
        return roles;
    }, {});

    // saveAll
    const objects = Object.entries(Capability._groups).map(([group, cap]) => {
        let obj = new Parse.Object(COLLECTION);
        if (group in loaded) {
            obj = loaded[group];
        }
        obj.set('group', group);
        const allowed = obj.relation('allowed');
        const excluded = obj.relation('excluded');

        cap.allowed.forEach(role => role in roles && allowed.add(roles[role]));
        cap.excluded.forEach(
            role => role in roles && excluded.add(roles[role]),
        );

        obj.unset('allowedList');
        obj.unset('excludedList');

        return obj;
    });

    await Parse.Object.saveAll(objects, { useMasterKey: true });
    await Actinium.Hook.run('capability-loaded');

    LOG(chalk.cyan('  Loaded.'));
    LOG('');

    Actinium.Cache.set(
        'capabilities.loaded',
        true,
        Actinium.Enums.cache.dataLoading,
        Capability.load,
    );

    sort = [];
    unreg = [];
};

const _getRoles = async () => {
    const roleQuery = new Parse.Query('_Role');
    const roleObjects = await roleQuery.find({ useMasterKey: true });
    return roleObjects.reduce((roles, role) => {
        roles[role.get('name')] = role;
        return roles;
    }, {});
};

const _addCapability = async (group, cap) => {
    const { allowed = [], excluded = [] } = cap;
    const capability = normalizeCapability(cap);

    op.set(Capability._obj, group, capability);
    Capability._groups[group] = capability;

    Actinium.Hook.run('capability-updated', group, capability);

    const roles = await _getRoles();
    const query = new Parse.Query(COLLECTION);
    query.equalTo('group', group);
    let obj = await query.first({ useMasterKey: true });
    if (!obj) obj = new Parse.Object(COLLECTION);
    obj.set('group', group);

    const allowedRel = obj.relation('allowed');
    const currentlyAllowed = await allowedRel
        .query()
        .find({ useMasterKey: true });
    const excludedRel = obj.relation('excluded');
    const currentlyExcluded = await excludedRel
        .query()
        .find({ useMasterKey: true });

    // remove no longer allowed
    currentlyAllowed
        .filter(
            roleObj =>
                !capability.allowed.find(role => role === roleObj.get('name')),
        )
        .forEach(roleObj => allowedRel.remove(roleObj));
    // add newly allowed
    capability.allowed.forEach(
        role => role in roles && allowedRel.add(roles[role]),
    );

    // remove no longer excluded
    currentlyExcluded
        .filter(
            roleObj =>
                !capability.excluded.find(role => role === roleObj.get('name')),
        )
        .forEach(roleObj => excludedRel.remove(roleObj));
    // add newly excluded
    capability.excluded.forEach(
        role => role in roles && excludedRel.add(roles[role]),
    );

    obj.save(null, { useMasterKey: true });
};

const _removeCapability = async group => {
    const query = new Parse.Query(COLLECTION);
    query.equalTo('group', group);
    Actinium.Hook.run('capability-updated', group);

    const capability = await query.first({ useMasterKey: true });
    if (capability) await capability.destroy({ useMasterKey: true });
    op.del(Capability._obj, group);
    delete Capability._groups[group];
};

Actinium.User.can = Capability.User.can;
Actinium.User.capabilities = Capability.User.get;

module.exports = Capability;
