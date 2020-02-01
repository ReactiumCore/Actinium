const chalk = require('chalk');
const _ = require('underscore');
const semver = require('semver');
const op = require('object-path');

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

const levelCheck = (level, match) => {
    level = semver.coerce(String(level));
    match = String(match);
    return isLevel(match) && semver.satisfies(level, match);
};

const userMeetsLevel = (userId, match) => {
    const roles = Actinium.Roles.User.get(userId);
    return levelCheck(_.max(Object.values(roles)), match);

    // return Object.values(roles).reduce(
    //     (hasLevel, level) => hasLevel || levelCheck(level, match),
    //     false,
    // );
};

const CloudRunOptions = (req, match = null) => {
    const { user, master } = req;
    const options = {};

    if (master) {
        options['useMasterKey'] = true;
    }

    if (user) {
        options['sessionToken'] = user.getSessionToken();

        const id =
            op.get(user, 'objectId') ||
            op.get(user, 'id') ||
            op.get(user, 'username');

        if (Actinium.Roles.User.is(id, 'super-admin')) {
            options['useMasterKey'] = true;
            return options;
        }

        if (match && isLevel(match)) {
            if (userMeetsLevel(id, match)) {
                options['useMasterKey'] = true;
                return options;
            }
        }
    }

    return options;
};

const CloudHasCapabilities = (req, capability, strict = true) => {
    const { master } = req;

    // if no capabilities specified, deny
    if (!capability) return false;

    if (master) return true;

    const capabilities = Array.isArray(capability) ? capability : [capability];

    // Check against existing capabilities
    const permitted = strict
        ? // all capabilities required for strict
          capabilities.reduce((hasCaps, cap) => {
              return !!(hasCaps && Actinium.Capability.User.can(cap, req));
          }, true)
        : // one capability required for non-strict
          capabilities.reduce((hasCaps, cap) => {
              return !!(hasCaps || Actinium.Capability.User.can(cap, req));
          }, false);

    return permitted;
};

const CloudCapOptions = (req, capability, strict = false, match = null) => {
    const options = CloudRunOptions(req, (match = null));
    if (options.useMasterKey) return options;

    if (CloudHasCapabilities(req, capability, strict))
        options.useMasterKey = true;

    return options;
};

const UserFromSession = async sessionToken => {
    const session = await new Parse.Query(Parse.Session)
        .equalTo('sessionToken', sessionToken)
        .include('user')
        .first({ useMasterKey: true });

    return session ? session.get('user') : null;
};

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

module.exports = {
    AclTargets,
    CloudRunOptions,
    CloudCapOptions,
    CloudHasCapabilities,
    UserFromSession,
    userMeetsLevel,
};
