const op = require('object-path');
const { CloudRunOptions } = require(`${ACTINIUM_DIR}/lib/utils`);

const COLLECTION = '_User';

const PLUGIN = {
    ID: 'Users',
    description: 'Users plugin used to manage users.',
    name: 'Users Plugin',
    order: 0,
    version: {
        actinium: '>=3.0.5',
        plugin: '0.0.1',
    },
    meta: {
        builtIn: true,
    },
};

const afterFind = async req => {
    const { objects = [] } = req;

    for (let i = 0; i < objects.length; i++) {
        let user = objects[i];

        const roles = Actinium.Roles.User.get(user.id);
        const capabilities = Actinium.Capability.User.get(user.id);

        await Actinium.Hook.run('user-fetch', user);

        user.set('roles', roles);
        user.set('capabilities', capabilities);
        objects[i] = user;
    }

    return Promise.resolve(objects);
};

const beforeLogin = async req => {
    const { object: user } = req;
    const roles = Actinium.Roles.User.get(user.id);

    if (op.has(roles, 'banned')) {
        throw new Error('Access denied, you have been banned.');
        return;
    }

    await Actinium.Hook.run('user.before.login', user);
};

const findCache = req => {};

const find = async req => {
    let { objectId, username, email, page = 1, limit = 1000 } = req.params;

    const qry = new Parse.Query(COLLECTION);

    if (objectId) {
        qry.equalTo('objectId', objectId);
    }

    if (username) {
        qry.equalTo('username', username);
    }

    if (email) {
        qry.equalTo('email', email);
    }

    const options = CloudRunOptions(req);

    if (objectId || username || email) {
        await Actinium.Hook.run('user.before.find', qry);
        const user = await qry.first(options);
        return user ? Promise.resolve(user.toJSON()) : Promise.resolve({});
    } else {
        limit = Math.min(limit, 10000);
        const skip = page * limit - limit;
        qry.limit(limit);
        qry.skip(skip);

        await Actinium.Hook.run('user.before.find', qry);

        return qry.find(options);
    }
};

const save = async req => {
    const options = CloudRunOptions(req);
    const { role, ...params } = req.params;
    const user = await new Parse.Object(COLLECTION).save(params, options);

    try {
        if (role) {
            await Parse.Cloud.run(
                'role-user-add',
                { user: user.id, role },
                options,
            ).catch(console.log);

            return Promise.resolve(user);
        }
    } catch (err) {
        return Promise.resolve(err);
    }
};

const validate = req => ({ valid: !!op.get(req, 'user') });

const afterSave = async req => {
    let acl = req.object.getACL();
    if (!acl) {
        const roles = Actinium.Roles.get();

        acl = new Parse.ACL(req.object);

        const expectedRoles = ['super-admin', 'administrator'];
        expectedRoles
            .filter(role => op.has(roles, role))
            .forEach(role => {
                acl.setRoleWriteAccess(role, true);
            });

        req.object.setACL(acl);

        await Actinium.Hook.run('user.after.save', req);

        req.object.save(null, { useMasterKey: true });
    }
};

const beforeSave = async req => {
    await Actinium.Hook.run('user.before.save', req);

    // New user only
    if (req.object.isNew()) {
        const { confirm, password } = req.object.toJSON();

        req.object.unset('confirm');

        if (confirm !== password) {
            throw new Error('passwords do not match');
        }
    }
};

Actinium.Plugin.register(PLUGIN, true);

Actinium.Cloud.afterFind(COLLECTION, afterFind);

Actinium.Cloud.afterSave(COLLECTION, afterSave);

Actinium.Cloud.beforeLogin(beforeLogin);

Actinium.Cloud.beforeSave(COLLECTION, beforeSave);

Actinium.Cloud.define(PLUGIN.ID, 'user-find', find);

Actinium.Cloud.define(PLUGIN.ID, 'user-save', save);

Actinium.Cloud.define(PLUGIN.ID, 'session-validate', validate);
