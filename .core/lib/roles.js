import _ from 'underscore';
import op from 'object-path';
import ActionSequence from 'action-sequence';
import { CloudRunOptions } from './utils/options.js';

const useMasterKey = true;

const COLLECTION = Parse.Role;

const DEFAULTS = [
    {
        name: 'banned',
        label: 'Banned User',
        level: -1,
        acl: ['administrator', 'super-admin', 'moderator'],
    },
    {
        name: 'anonymous',
        label: 'Anonymous',
        level: 0,
    },
    {
        name: 'user',
        label: 'Standard User',
        level: 1,
    },
    {
        name: 'contributor',
        label: 'Contributor',
        level: 10,
        roles: ['user'],
        acl: ['administrator', 'super-admin'],
    },
    {
        name: 'moderator',
        label: 'Moderator',
        level: 100,
        roles: ['user', 'contributor'],
        acl: ['administrator', 'super-admin'],
    },
    {
        name: 'administrator',
        label: 'Administrator',
        level: 1000,
        roles: ['user', 'contributor', 'moderator'],
        acl: ['administrator', 'super-admin'],
    },
    {
        name: 'super-admin',
        label: 'Super Administrator',
        level: 10000,
        roles: ['user', 'contributor', 'moderator', 'administrator'],
        acl: ['super-admin'],
    },
];

const decorateRoles = async (objects = [], options) => {
    if (!options) throw new Error('options required');

    for (let i = 0; i < objects.length; i++) {
        let users = {};
        let roles = {};
        let item = objects[i];

        try {
            await item
                .get('users')
                .query()
                .each((item) => {
                    const { avatar, objectId, username } = item.toJSON();
                    users[objectId] = { avatar, objectId, username };
                }, options);

            await item
                .get('roles')
                .query()
                .each((item) => {
                    const { level, name, objectId, label } = item.toJSON();
                    roles[objectId] = { label, level, name, objectId };
                }, options);
        } catch (error) {
            // relations return undefined if not set
        }

        item.set('userList', users);
        item.set('roleList', roles);
        objects[i] = item;
    }

    return Promise.resolve(objects);
};

const Roles = { User: {} };

Roles.get = (search) => {
    return _.chain(
        Object.values(Actinium.Cache.get('roles', {})).filter(
            ({ name, level, objectId }) =>
                !search ||
                name === search ||
                level === search ||
                objectId === search,
        ),
    )
        .sortBy('level')
        .value()
        .reverse()
        .reduce((obj, item) => {
            const { name } = item;
            delete item.ACL;
            delete item.createdAt;
            delete item.updatedAt;
            obj[name] = item;
            return obj;
        }, {});
};

Roles.list = async (req, opts) => {
    // 0. Get options object
    let output = [];
    opts = opts || CloudRunOptions(req);

    // 1. Create query
    const qry = new Parse.Query(COLLECTION).skip(0).limit(1000);

    // 2. Get first page of roles
    let results = await qry.find(opts);

    // 3. If no roles create from defaults
    if (results.length < 1) {
        results = await Roles.init();
    }

    results = await decorateRoles(results, opts);

    // 4. Get rest of roles
    while (results.length > 0) {
        output = output.concat(
            results.map((item) => {
                item = item.toJSON();
                item['users'] = item.userList || {};
                item['roles'] = item.roleList || {};
                delete item.userList;
                delete item.roleList;
                return item;
            }),
        );
        qry.skip(Object.keys(output).length);
        results = await qry.find(opts);
    }

    // 5. Format output
    output = _.indexBy(output, 'name');

    // 6. Cache roles
    Actinium.Cache.set('roles', output);

    return Promise.resolve(output);
};

Roles.load = (options = { useMasterKey }) =>
    ActionSequence({
        actions: {
            fetch: () => Roles.list({}, options),
            hook: () => Actinium.Hook.run('roles', Roles.get()),
        },
    });

Roles.User.getMany = (users = []) => {
    const byUser = users.reduce((init, user) => {
        init[user.id || user.objectId] = { anonymous: 0 };
        return init;
    }, {});

    const allRoles = Object.values(Roles.get());
    allRoles.forEach((role) => {
        const { users = {}, name, level } = role;
        Object.values(users).forEach((user) => {
            const id = user.id || user.objectId;
            if (id in byUser) byUser[id][name] = level;
        });
    });

    return byUser;
};

Roles.User.get = (search) => {
    return _.chain(
        Object.values(Roles.get()).filter(({ users = {} }) => {
            return (
                _.findWhere(Object.values(users), { objectId: search }) ||
                _.findWhere(Object.values(users), { username: search })
            );
        }),
    )
        .sortBy('level')
        .value()
        .reverse()
        .reduce(
            (obj, { name, level }) => {
                obj[name] = level;
                return obj;
            },
            {
                // always include anonymous
                anonymous: 0,
            },
        );
};

Roles.User.add = (user, role = 'user', options = { useMasterKey }) =>
    Actinium.Cloud.run('role-user-add', { user, role }, options);

Roles.User.remove = (user, role = 'user', options = { useMasterKey }) =>
    Actinium.Cloud.run('role-user-remove', { user, role }, options);

Roles.User.is = (user, role) => {
    // All users are granted implicit anonymous role
    if (role === 'anonymous') return true;

    const roleObj = Actinium.Roles.User.get(user);

    if (isNaN(role)) {
        return op.has(roleObj, role);
    } else {
        const level = _.max(Object.values(roleObj)) || 0;
        return level >= role;
    }
};

Roles.create = (roleObj = {}, options = { useMasterKey }) => {
    const { label, level = 1, name, roles, acl } = roleObj;
    const roleArray = [
        {
            label,
            level,
            name,
            roles,
            acl,
        },
    ];

    return ActionSequence({
        actions: {
            create: () =>
                Actinium.Cloud.run('role-create', { roleArray }, options),
            hook: () => Actinium.Hook.run('role-created', role, Roles.get()),
        },
    });
};

Roles.defaultRoleACL = () => {
    const acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    acl.setPublicWriteAccess(true);
    return acl;
};

Roles.remove = (role, options = { useMasterKey }) =>
    ActionSequence({
        actions: {
            remove: () => Actinium.Cloud.run('role-remove', { role }, options),
            hook: () => Actinium.Hook.run('role-removed', role, Roles.get()),
        },
    });

Roles.init = () =>
    Parse.Object.saveAll(
        DEFAULTS.map(({ label, level, name }) =>
            new Parse.Role(name, Roles.defaultRoleACL())
                .set('label', label)
                .set('level', level),
        ),
        { useMasterKey: true },
    ).then((roles) => {
        roles = roles.map((role) => {
            const { name } = role.toJSON();
            const roleData = _.findWhere(ENV.ROLES, { name }) || {};

            if (op.has(roleData, 'roles')) {
                const related = roles.filter((r) =>
                    roleData.roles.includes(r.get('name')),
                );
                role.getRoles().add(related);
            }

            if (op.has(roleData, 'acl')) {
                const ACL = Roles.defaultRoleACL();
                roles.forEach((r) => {
                    if (roleData.acl.includes(r.get('name'))) {
                        ACL.setPublicWriteAccess(false);
                        ACL.setRoleWriteAccess(r, true);
                    }
                });
                role.setACL(ACL);
            }

            return role;
        });

        return Parse.Object.saveAll(roles, { useMasterKey: true });
    });

export default Roles;
