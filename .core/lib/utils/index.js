const chalk = require('chalk');
const op = require('object-path');
const _ = require('underscore');
const semver = require('semver');

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
    return Object.values(roles).reduce(
        (hasLevel, level) => hasLevel || levelCheck(level, match),
        false,
    );
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
              return !!(hasCaps && Actinium.Capability.User.can(cap, req.user));
          }, true)
        : // one capability required for non-strict
          capabilities.reduce((hasCaps, cap) => {
              return !!(hasCaps || Actinium.Capability.User.can(cap, req.user));
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

module.exports = {
    CloudRunOptions,
    CloudCapOptions,
    CloudHasCapabilities,
    UserFromSession,
    userMeetsLevel,
};
