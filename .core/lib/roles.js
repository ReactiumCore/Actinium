const chalk = require('chalk');
const uuid = require('uuid/v4');
const _ = require('underscore');
const op = require('object-path');
const Capability = require('./capability');
const ActionSequence = require('action-sequence');

const useMasterKey = true;
const noop = () => Promise.resolve();

const Roles = { User: {} };

Roles.get = search => {
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

Roles.load = (options = { useMasterKey }) => {
    return ActionSequence({
        actions: {
            fetch: () => Actinium.Cloud.run('roles', {}, { useMasterKey }),
            hook: () => Actinium.Hook.run('roles', Roles.get()),
        },
    });
};

Roles.User.get = search => {
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

Roles.can = Capability.Role.can;

Roles.capabilities = Capability.Role.get;

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

Roles.remove = (role, options = { useMasterKey }) =>
    ActionSequence({
        actions: {
            remove: () => Actinium.Cloud.run('role-remove', { role }, options),
            hook: () => Actinium.Hook.run('role-removed', role, Roles.get()),
        },
    });

Actinium.User.isRole = Roles.User.is;

module.exports = Roles;
