const chalk = require('chalk');
const uuid = require('uuid/v4');
const _ = require('underscore');
const op = require('object-path');
const ActionSequence = require('action-sequence');
const Hook = require('./hook');

const COLLECTION = 'Capability';

const noop = () => Promise.resolve();

let sort = [];
let unreg = [];

const capabilities = {};

const Capability = {
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
            required: true,
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
        return _addCapability(group, perms);
    }
};

Capability.unregister = group => {
    unreg.push(group);
    unreg = _.compact(_.uniq(unreg));

    if (Actinium.started === true) {
        return _removeCapability(group);
    }
};

Capability.get = capability => {
    if (capability) {
        return op.get(capabilities, [capability]);
    } else {
        return Object.keys(capabilities).sort();
    }
};

Capability.roles = capability => {
    // banned is always excluded
    const excluded = _.uniq(
        op.get(capabilities, [capability, 'excluded'], []).concat(['banned']),
    );

    const allowed = op
        .get(capabilities, [capability, 'allowed'], [])
        // administrator can be excluded
        .concat(['administrator'])
        .filter(r => !excluded.includes(r))
        // super-admin may not
        .concat(['super-admin']);

    return _.chain(allowed)
        .uniq()
        .compact()
        .value()
        .sort();
};

Capability.Role.can = (role, capability) => {
    const roles = Capability.roles(capability);
    return roles.includes(role) || roles.includes('anonymous');
};

Capability.Role.get = role => {
    return Object.keys(capabilities).reduce((arr, capability) => {
        if (Capability.Role.can(role, capability)) arr.push(capability);
        return arr;
    }, []);
};

Capability.User.can = (cap, user) => {
    user = op.get(user, 'user.id', user);

    const roleObj = Actinium.Roles.User.get(user);
    const roles = Object.keys(roleObj);

    // no roles exist yet, or capability allows anonymous access
    if (roles.length < 1) {
        roles.push['anonymous'];
    }

    if (_.intersection(roles, Capability.roles(cap)).length > 0) return true;

    return false;
};

Capability.User.get = user => {
    const roles = Actinium.Roles.User.get(user);
    return Object.keys(roles).reduce((arr, role) => {
        const caps = Object.keys(capabilities).filter(cap =>
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

    if (Actinium.started !== true) {
        LOG('');
        LOG(chalk.cyan('Loading capabilities...'));
    }

    await Actinium.Hook.run('capability-loading');

    // Merge defaults with parse loaded
    Object.entries(Capability.defaults).forEach(([group, defaultCap]) => {
        const cap = normalizeCapability(defaultCap);
        capabilities[group] = cap;
    });

    // Register new or changed
    for (let cap of _.sortBy(sort, 'order')) {
        const { group } = cap;
        const oldCapability = capabilities[group];
        const newCapability = normalizeCapability(cap);

        capabilities[group] = newCapability;

        await Actinium.Hook.run(
            'capability-updated',
            group,
            newCapability,
            oldCapability,
        );
    }

    // unregisters
    for (let group of unreg) {
        const cap = capabilities[group];
        if (cap && !op.get(cap, 'required', false)) {
            delete capabilities[group];
            await Actinium.Hook.run('capability-unregistered', group);
        }
    }

    const loaded = await _loadedCapabilities();

    Object.values(loaded).forEach(result => {
        const {
            group,
            allowedList: allowed = [],
            excludedList: excluded = [],
        } = result.toJSON();

        const cap = normalizeCapability({ allowed, excluded });
        capabilities[group] = cap;
    });

    let query = new Parse.Query('_Role');
    const roleObjects = await query.find({ useMasterKey: true });
    const roles = roleObjects.reduce((roles, role) => {
        roles[role.get('name')] = role;
        return roles;
    }, {});

    // saveAll
    const objects = Object.entries(capabilities).map(([group, cap]) => {
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

    if (Actinium.started !== true) {
        LOG(chalk.cyan('  Loaded.'));
        LOG('');
    }

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

    capabilities[group] = capability;

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

    await obj.save(null, { useMasterKey: true });
    return Actinium.Hook.run('capability-updated', group, capability);
};

const _removeCapability = async group => {
    const query = new Parse.Query(COLLECTION);
    query.equalTo('group', group);

    const capability = await query.first({ useMasterKey: true });

    if (capability && group in capabilities) {
        delete capabilities[group];
        await capability.destroy({ useMasterKey: true });
    }

    return Actinium.Hook.run('capability-updated', group);
};

Actinium.User.can = Capability.User.can;
Actinium.User.capabilities = Capability.User.get;

module.exports = Capability;

Actinium.Harness.test(
    'Capability.roles()',
    async assert => {
        const adminRoles = Capability.roles('TestCapability.Foo');
        assert(
            ['super-admin', 'administrator'].filter(role =>
                adminRoles.find(r => r === role),
            ).length === 2,
            'Capability.roles() should include super-admin and administrator (if administrator isnt explicitly denied)',
        );

        const noBannedRoles = Capability.roles('TestCapability.Foo');
        assert(
            !noBannedRoles.find(role => role === 'banned'),
            'Capability.roles() should never included banned, no matter what.',
        );
        assert(
            noBannedRoles.find(role => role === 'contributor'),
            'Capability.roles() missing role.',
        );
    },
    async () => {
        await Actinium.Capability.register('TestCapability.Foo', {
            allowed: ['contributor', 'banned'],
        });
    },
    async () => {
        await Actinium.Capability.unregister('TestCapability.Foo');
    },
);
