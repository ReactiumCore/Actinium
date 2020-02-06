const chalk = require('chalk');
const _ = require('underscore');
const semver = require('semver');
const op = require('object-path');

const AclTargets = async req => {
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
    const options = Actinium.Utils.CloudRunOptions(req);

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

/**
 * @api {Asynchronous} Utils.CloudACL(permissions,readCapability,writeCapability,existingACL) Utils.CloudACL()
 * @apiDescription Generate or augment a Parse.ACL object.
 * @apiParam {Array} permissions list of permissions to apply, when empty array, indicates public read, privileged write
 * @apiParam {String} [readCapability] If provided, will allow read for any roles that have this capability.
 * @apiParam {String} [writeCapability] If provided, will allow write for any roles that have this capability.
 * @apiParam {Parse.ACL} [existingACL] If provided, will be the starting point for the returned ACL, otherwise, returns
 fresh ACL object.
 * @apiParam (permission) {String} permission "read" or "write"
 * @apiParam (permission) {String} type "role", "user", or "public"
 * @apiParam (permission) {String} [objectId] Required if permission type is "user". The objectId of the user.
 * @apiParam (permission) {String} [name] Required if permission type is "role". The name of the role.
 * @apiParam (permission) {Boolean} [allowed=true] Access to true or false, default true.
 * @apiName CloudACL
 * @apiGroup Actinium
 */
const CloudACL = async (perms = [], readCap, writeCap, groupACL) => {
    if (!groupACL || !(groupACL instanceof Parse.ACL)) {
        groupACL = new Parse.ACL(groupACL);
    }

    if (perms.length < 1) {
        groupACL.setPublicReadAccess(true);
        groupACL.setPublicWriteAccess(false);
    }

    const aclTargets = await AclTargets({
        master: true,
        params: { fresh: true },
    });

    const allRoles = _.indexBy(aclTargets.roles, 'name');

    let readRoles = [];
    if (readCap) {
        readRoles = _.compact(
            Actinium.Capability.roles(readCap).map(name =>
                op.get(allRoles, name),
            ),
        );
    }

    let writeRoles = [];
    if (writeCap) {
        writeRoles = _.compact(
            Actinium.Capability.roles(writeCap).map(name =>
                op.get(allRoles, name),
            ),
        );
    }

    const permission = _.groupBy(perms, 'permission');
    const writePerms = _.groupBy(op.get(permission, 'write', []), 'type');
    const readPerms = _.groupBy(op.get(permission, 'read', []), 'type');

    // public read
    op.get(readPerms, 'public', []).forEach(publicAccess => {
        const allowed = op.has(publicAccess, 'allow')
            ? !!publicAccess.allow
            : true;
        groupACL.setPublicReadAccess(allowed);
    });

    // role read
    op.get(readPerms, 'role', [])
        .concat(readRoles)
        .forEach(roleObj => {
            if (op.has(roleObj, 'name')) {
                const allowed = op.has(roleObj, 'allow')
                    ? !!roleObj.allow
                    : true;
                const role = roleObj.name;
                if (role === 'anonymous') groupACL.setPublicReadAccess(allowed);
                else groupACL.setRoleReadAccess(role, allowed);
            }
        });

    // user read
    op.get(readPerms, 'user', []).forEach(userObj => {
        if (op.has(userObj, 'objectId')) {
            const allowed = op.has(userObj, 'allow') ? !!userObj.allow : true;
            groupACL.setReadAccess(userObj.objectId, allowed);
        }
    });

    // public write
    op.get(readPerms, 'public', []).forEach(publicAccess => {
        const allowed = op.has(publicAccess, 'allow')
            ? !!publicAccess.allow
            : true;
        groupACL.setPublicWriteAccess(allowed);
    });

    // role write
    op.get(writePerms, 'role', [])
        .concat(writeRoles)
        .forEach(roleObj => {
            if (op.has(roleObj, 'name')) {
                const allowed = op.has(roleObj, 'allow')
                    ? !!roleObj.allow
                    : true;
                const role = roleObj.name;

                if (role === 'anonymous')
                    groupACL.setPublicWriteAccess(allowed);
                else groupACL.setRoleWriteAccess(role, allowed);
            }
        });

    // user write
    op.get(writePerms, 'user', []).forEach(userObj => {
        if (op.has(userObj, 'objectId')) {
            const allowed = op.has(userObj, 'allow') ? !!userObj.allow : true;
            groupACL.setWriteAccess(userObj.objectId, allowed);
        }
    });

    return groupACL;
};

module.exports = {
    AclTargets,
    CloudACL,
};
