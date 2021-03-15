const chalk = require('chalk');
const uuid = require('uuid/v4');
const _ = require('underscore');
const op = require('object-path');
const Capability = require('./capability');
const ActionSequence = require('action-sequence');
const { CloudRunOptions } = require(`${ACTINIUM_DIR}/lib/utils`);

const useMasterKey = true;
const noop = () => Promise.resolve();

const COLLECTION = Parse.Role;

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
                .each(item => {
                    const { avatar, objectId, username } = item.toJSON();
                    users[objectId] = { avatar, objectId, username };
                }, options);

            await item
                .get('roles')
                .query()
                .each(item => {
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
        results = await addRoles(req, DEFAULTS);
    }

    results = await decorateRoles(results, opts);

    // 4. Get rest of roles
    while (results.length > 0) {
        output = output.concat(
            results.map(item => {
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
