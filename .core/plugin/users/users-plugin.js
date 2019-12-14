const _ = require('underscore');
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
        group: 'core',
        builtIn: true,
    },
};

const avatarTypes = {
    jpeg: 'jpg',
    jpg: 'jpg',
    png: 'png',
    gif: 'gif',
    svg: 'svg',
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

    await Actinium.Hook.run('user-before-login', user);
};

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
    let output;

    if (objectId || username || email) {
        await Actinium.Hook.run('user-before-find', qry);
        const user = await qry.first(options);
        output = (await user)
            ? Promise.resolve(user.toJSON())
            : Promise.resolve({});
    } else {
        limit = Math.min(limit, 10000);
        const skip = page * limit - limit;
        qry.limit(limit);
        qry.skip(skip);

        await Actinium.Hook.run('user-before-find', qry);

        output = await qry.find(options);
    }

    return output;
};

const save = async req => {
    const options = CloudRunOptions(req);
    const { role, ...params } = req.params;

    const userObj = new Parse.Object(COLLECTION);

    Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
            userObj.unset(key);
        } else {
            userObj.set(key, value);
        }
    });

    let user;
    try {
        user = await userObj.save(params, options);
    } catch (err) {
        throw new Error(err);
    }

    if (!user) {
        throw new Error('unable to save user');
    }

    try {
        if (role) {
            await Parse.Cloud.run(
                'role-user-add',
                { user: user.id, role },
                options,
            ).catch(console.log);
        }
    } catch (err) {
        console.log(err);
    }

    return Promise.resolve(user);
};

const validate = req => ({ valid: !!op.get(req, 'user') });

const afterSave = req => {
    Actinium.Hook.run('user-after-save', req);
};

const beforeSave = async req => {
    // New user only
    if (req.object.isNew()) {
        const { confirm, password } = req.object.toJSON();

        req.object.unset('confirm');

        if (confirm !== password) {
            throw new Error('passwords do not match');
        }
    }

    await Actinium.Hook.run('user-before-save', req);
};

const createAvatar = async req => {
    let avatar = req.object.get('avatar');

    if (!avatar) {
        return;
    }

    if (String(avatar).startsWith('data:image')) {
        let typeArr = avatar.split('data:image');
        typeArr.shift();

        typeArr = typeArr.join('').split(';base64');

        const ext = typeArr.shift().substr(1);
        let type = op.get(avatarTypes, ext, null);

        if (!type) {
            LOG('invalid avatar image type');
            return;
        }

        type = type.replace(/\W+/g, '');
        let fileObj;

        try {
            const fileName = `avatar.${type}`;
            avatar = avatar.split(';base64,').pop();

            fileObj = await new Actinium.File(`avatars/${fileName}`, {
                base64: avatar,
            }).save();
        } catch (err) {
            console.log(err);
            return;
        }

        if (fileObj) {
            req.object.set('avatar', fileObj.url());
        }
    }
};

const aclTargets = async req => {
    const { master, user } = req;

    if (!user && !master) throw new Error('Permission denied');

    let { cache, fresh, search } = req.params;
    search = search
        ? String(search)
              .toLowerCase()
              .trim()
        : search;

    const mapUser = user => {
        const fields = ['objectId', 'username', 'email', 'fname', 'lname'];
        return fields.reduce((u, field) => {
            const val = op.get(user, field);
            if (val) u[field] = val;
            return u;
        }, {});
    };

    const mapRole = role => {
        const fields = ['objectId', 'name', 'label'];
        return fields.reduce((r, field) => {
            const val = op.get(role, field);
            if (val) r[field] = val;
            return r;
        }, {});
    };

    const filterUsers = (users, search) =>
        users.filter(user => {
            const username = String(op.get(user, 'username')).toLowerCase();

            const email = String(op.get(user, 'email')).toLowerCase();

            const firstname = String(
                [op.get(user, 'fname'), op.get(user, 'lname')].join(' '),
            ).toLowerCase();

            const lastname = String(
                firstname
                    .split(' ')
                    .reverse()
                    .join(' '),
            );

            return Boolean(
                !search ||
                    username.startsWith(search) ||
                    email.startsWith(search) ||
                    firstname.startsWith(search) ||
                    lastname.startsWith(search),
            );
        });

    const filterRoles = (roles, search) =>
        roles.filter(role => {
            const name = String(op.get(role, 'name')).toLowerCase();
            const label = String(op.get(role, 'label')).toLowerCase();

            return Boolean(
                !search ||
                    String(name).startsWith(search) ||
                    String(label).startsWith(search),
            );
        });

    // Use cached
    const cached = Actinium.Cache.get('acl-targets');
    if (cached && !fresh) {
        return {
            roles: filterRoles(cached.roles, search),
            users: filterUsers(cached.users, search),
        };
    }

    // Fetch fresh
    let roles = _.sortBy(
        Object.values(Actinium.Cache.get('roles', {})),
        'level',
    )
        .map(role => mapRole(role))
        .reverse();

    let qry;
    const options = CloudRunOptions(req);

    if (search) {
        // Filter roles
        roles = filterRoles(roles);

        // Create user queries
        const regex = new RegExp(search, 'gi');
        const fields = ['username', 'email', 'fname', 'lname'];
        const queries = fields.map(fld =>
            new Parse.Query('_User').matches(fld, regex),
        );

        qry = Parse.Query.or(...queries);
    } else {
        qry = new Parse.Query('_User');
    }

    qry.ascending('fname');
    qry.addAscending('lname');
    qry.addAscending('username');
    qry.limit(1000);

    let users = [];
    let results = await qry.find(options);

    while (results.length > 0) {
        results = results.map(item => mapUser(item.toJSON()));
        users = users.concat(results);

        if (results.length === 1000) {
            qry.skip(users.length);
            results = await qry.find(options);
        } else {
            results = [];
        }
    }

    if (cache === true && !search) {
        Actinium.Cache.set('acl-targets', { roles, users });
    }

    return {
        roles,
        users,
    };
};

Actinium.Plugin.register(PLUGIN, true);

Actinium.Cloud.afterFind(COLLECTION, afterFind);

Actinium.Cloud.afterSave(COLLECTION, afterSave);

Actinium.Cloud.beforeLogin(beforeLogin);

Actinium.Cloud.beforeSave(COLLECTION, beforeSave);

Actinium.Cloud.define(PLUGIN.ID, 'user-find', find);

Actinium.Cloud.define(PLUGIN.ID, 'user-save', save);

Actinium.Cloud.define(PLUGIN.ID, 'session-validate', validate);

Actinium.Cloud.define(PLUGIN.ID, 'acl-targets', aclTargets);

// Hooks
Actinium.Hook.register('start', () => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
    return Actinium.Cloud.run(
        'acl-targets',
        { cache: true },
        { useMasterKey: true },
    );
});

Actinium.Hook.register(
    'user-before-save',
    req => {
        if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
        return createAvatar(req);
    },
    0,
);

Actinium.Hook.register(
    'user-after-save',
    async req => {
        if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
        Actinium.Cloud.run(
            'acl-targets',
            { cache: true },
            { useMasterKey: true },
        );
    },
    0,
);

Actinium.Hook.register(
    'user-after-save',
    async req => {
        if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;

        // set acl value
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

            return req.object.save(null, { useMasterKey: true });
        }
    },
    0,
);

/**
 * @api {Cloud} user-find user-find
 * @apiVersion 3.0.5
 * @apiGroup Cloud
 * @apiName user-find
 * @apiDescription Find a user. Triggers the `user-before-find` hook.
 * @apiParam {String} objectId Search by the objectId field.
 * @apiParam {String} username Search by the username field.
 * @apiParam {String} email Search by the email field.
 * @apiParam {Number} [page=1] The results page.
 * @apiParam {Number} [limit=1000] The number of results per page.
 * @apiExample Example usage:
Actinium.Cloud.run('user-find', { objectId: 'HrIE319Ddx' });
 */

/**
 * @api {Cloud} user-save user-save
 * @apiVersion 3.0.5
 * @apiGroup Cloud
 * @apiName user-save
 * @apiDescription Save a `Parse.User` object. If the user does not exist, it will be created. The following parameters are default. You can supply additional parameters that will alter the User collection. Triggers the `user-before-save` and `user-after-save` hooks.
 * @apiParam {String} objectId The unique objectId. Required when updating a user.
 * @apiParam {String} username The unique username.
 * @apiParam {String} email The unique email address.
 * @apiParam {String} password The user password used when signing in.
 * @apiParam {String} [role] The user role. Used when determining access to certain features.
 * @apiParam {String} [fname] The user's first name.
 * @apiParam {String} [lname] The user's last name.
 * @apiParam {String} [avatar] The url to the user's profile picture. If the avatar value is a base64 encoded string, a new Actinium.File object will be created and the Actinium.File.url() value will be used as the avatar url.
 * @apiExample Example usage:
Actinium.Cloud.run('user-save', {
    username: 'FalconPilot',
    email: 'hansoff@falcon.net',
    password: 'Gr33d0Sh0tF!rst',
    role: 'administrator',
    fname: 'Han',
    lname: 'Solo',
    avatar: 'https://media.giphy.com/media/3ornjSL2sBcPflIDiU/giphy.gif'
});
 */

/**
 * @api {Cloud} acl-targets acl-targets
 * @apiVersion 3.1.7
 * @apiGroup Cloud
 * @apiName acl-targets
 * @apiDescription Get a list of roles and users that can be used for deriving an ACL object.
 * @apiParam {String} search You can search by a multitude of things such as the role name, role label, username, user first name, user last name, and user email.
 * @apiParam {Boolean} [cache] Cache the results of the query. You cannot supply a search value. The master key is used when searching cached data so beware that you may get results that are outside of the user's level.
 * @apiParam {Boolean} [fresh] Force a search of the database instead of cached values.
 * @apiExample Example usage:
// Get all ACL targets and cache the results
Actinium.Cloud.run('acl-targets', { cache: true });

// Get a specific role
Actinium.Cloud.run('acl-targets', { search: 'super-admin' });

// Search a user from the database
Actinium.Cloud.run('acl-targets', { search: 'han', fresh: true });
 */
