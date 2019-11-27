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

const normalizeCapability = (capabilityObj = {}) => ({
    // administrator and super admin are always added to allowed
    allowed: _.uniq(
        op
            .get(capabilityObj, 'allowed', [])
            .concat('administrator', 'super-admin'),
    ),

    // banned is always exclued. super-admin may not be excluded, administrator may.
    excluded: _.uniq(
        op.get(capabilityObj, 'excluded', []).concat('banned'),
    ).filter(role => role !== 'super-admin'),
});

const Capability = {
    defaults: {
        'user.admin': {
            exclude: ['user'],
        },
        'user.view': {
            allowed: ['moderator'],
        },
        'user.ban': {
            allowed: ['moderator'],
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
    perms = normalizeCapability(perms);

    sort.push({
        group,
        ...perms,
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
    if (typeof capability === 'string') {
        return normalizeCapability(op.get(capabilities, [capability]));
    } else {
        return Object.keys(capabilities).sort();
    }
};

Capability.roles = capability => {
    if (typeof capability !== 'string')
        throw 'Capability.roles() required string parameter capability.';

    const capObj = Capability.get(capability);
    const allowed = capObj.allowed.filter(r => !capObj.excluded.includes(r));

    return _.chain(allowed)
        .uniq()
        .compact()
        .value()
        .sort();
};

Capability.Role.can = (role, capability) => {
    role = role ? role : 'anonymous';
    const roles = Capability.roles(capability);
    return roles.includes(role);
};

Capability.Role.get = role => {
    return Capability.get().reduce((arr, capability) => {
        if (Capability.Role.can(role, capability)) arr.push(capability);
        return arr;
    }, []);
};

Capability.User.can = (cap, user) => {
    if (typeof user === 'object') {
        // parse user object
        user = op.get(user, 'id', user);
        // json user object
        user = typeof user === 'object' ? op.get(user, 'objectId', user) : user;
        // request object
        user = typeof user === 'object' ? op.get(user, 'user.id', user) : user;
    }

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
        const caps = Capability.get().filter(cap =>
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
        if (op.has(capabilities, [group])) {
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

        capabilities[group] = normalizeCapability({ allowed, excluded });
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

/**
 * Tests
 */
Actinium.Harness.test('Capability.get()', async assert => {
    assert(
        Array.isArray(Capability.get()),
        'Capability.get() with no args returns list of capabilities.',
    );
    let cap = Capability.get('lkjasdf;lk');
    assert(
        op.has(cap, 'allowed') && op.has(cap, 'excluded'),
        'Capability.get() with any capability will return allowed and excluded role names.',
    );
    assert(
        op.get(cap, 'allowed').includes('super-admin') &&
            op.get(cap, 'allowed').includes('administrator'),
        'Capability.get() allowed always includes super-admin and administrator.',
    );
    assert(
        op.get(cap, 'excluded').includes('banned') &&
            !op.get(cap, 'excluded').includes('super-admin'),
        'Capability.get() allowed always excludes banned, and never excludes super-admin.',
    );
});

Actinium.Harness.test('Capability.Role.can()', async assert => {
    assert(
        Capability.Role.can('super-admin', 'anyrandomcap'),
        'Capability.Role.can() will return true whenever super-admin is checked.',
    );
    assert(
        !Capability.Role.can('banned', 'anyrandomcap'),
        'Capability.Role.can() will return false whenever banned is checked.',
    );
});

Actinium.Harness.test(
    'Capability.Role.get()',
    async assert => {
        assert.equal(
            Capability.Role.get('banned').length,
            0,
            'Capability.Role.get(banned) should return no capabilities',
        );

        assert(
            Capability.Role.get('super-admin').includes(
                'BannedSetAllowedButWontWork',
            ),
            'Capability.Role.get(super-admin) should include BannedSetAllowedButWontWork cap even though it was not explicitly set at register.',
        );

        assert(
            !Capability.Role.get('administrator').includes(
                'BannedSetAllowedButWontWork',
            ),
            'Capability.Role.get(administrator) should not include BannedSetAllowedButWontWork.',
        );
    },
    async () => {
        await Capability.register('BannedSetAllowedButWontWork', {
            allowed: ['banned'],
            excluded: ['administrator'],
        });
    },
    async () => {
        await Capability.unregister('BannedSetAllowedButWontWork');
    },
);

Actinium.Harness.test(
    'Capability.User.can()',
    async assert => {
        const query = new Parse.Query('_User');
        query.equalTo('username', 'test-user');
        const user = await query.first({ useMasterKey: true });

        // user id
        assert.equal(
            Capability.User.can('test-user-cap', user.id),
            true,
            'Capability.User.can() id should be permitted.',
        );
        // user username
        assert.equal(
            Capability.User.can('test-user-cap', user.get('username')),
            true,
            'Capability.User.can() username should be permitted.',
        );
        // user parse object
        assert.equal(
            Capability.User.can('test-user-cap', { user }),
            true,
            'Capability.User.can() parse request should be permitted.',
        );
        // user json object
        assert.equal(
            Capability.User.can('test-user-cap', user.toJSON()),
            true,
            'Capability.User.can() JSON user should be permitted.',
        );
        // some other cap
        assert.equal(
            Capability.User.can('random', user.toJSON()),
            false,
            'Capability.User.can() should be declined for capability that does not exist for non super-admin user.',
        );
    },

    async () => {
        const query = new Parse.Query('_User');
        query.equalTo('username', 'test-user');
        let user = await query.first({ useMasterKey: true });
        if (!user) {
            user = new Parse.User();
            user.set('username', 'test-user');
            user.set('password', ';lajksdf;lajsdf');
            user.set('confirm', ';lajksdf;lajsdf');
            user.set('email', 'email@example.com');

            await user.save(null, { useMasterKey: true });
        }

        await Actinium.Roles.User.add(user.id, 'user', { useMasterKey: true });
        await Capability.register('test-user-cap', {
            allowed: ['user'],
        });
    },
    async () => {
        const query = new Parse.Query('_User');
        query.equalTo('username', 'test-user');
        const user = await query.first({ useMasterKey: true });

        if (user) {
            await user.destroy({ useMasterKey: true });
        }
        await Capability.unregister('test-user-cap');
    },
);

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
