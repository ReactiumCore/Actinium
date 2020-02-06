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
};

/**
 * @api {Function} Utils.CloudRunOptions(req,match) Utils.CloudRunOptions
 * @apiDescription Provides Parse query options appropriate for the cloud request.
 If user is logged in, will escalate to master key if the user is of role
 `super-admin`. Otherwise, user session token is passed along.
 * @apiParam {Object} request Parse Cloud function request object.
 * @apiParam {String} [match] semver-style query on the user's level. If satisfied
 escalates the query to master key user.
 * @apiName Utils.CloudRunOptions
 * @apiGroup Actinium
 */
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

/**
 * @api {Function} Utils.OptionsAddMaster(options) Utils.OptionsAddMaster
 * @apiDescription Creates or updates a Parse request options object to useMasterKey:true
 * @apiParam {Object} [options] options object to add master to, if applicable
 * @apiName Utils.OptionsAddMaster
 * @apiGroup Actinium
 */
const OptionsAddMaster = (options = {}) => {
    options['useMasterKey'] = true;
    return options;
};

/**
 * @api {Function} Utils.CloudMasterOptions(req) Utils.CloudMasterOptions
 * @apiDescription Provides Parse query options appropriate for the cloud request,
 with guaranteed escalated privileges to master key usage. Use with extreme caution.
 * @apiParam {Object} request Parse Cloud function request object.
 * @apiName Utils.CloudMasterOptions
 * @apiGroup Actinium
 */
const CloudMasterOptions = req => {
    return OptionsAddMaster(CloudRunOptions(req));
};

/**
 * @api {Function} Utils.CloudHasCapabilities(req,capabilities,strict) Utils.CloudHasCapabilities
 * @apiDescription Given a Parse Cloud request option, will determine if
 the request should have certain capabilities. Returns true if capabilities are
 permitted.
 * @apiParam {Object} request Parse Cloud function request object.
 * @apiParam {Array} capabilities List of capability to check.
 * @apiParam {Boolean} [strict=true] if true, all capabilities must be allowed, otherwise
 at least one must be allowed
 * @apiName Utils.CloudHasCapabilities
 * @apiGroup Actinium
 */
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

/**
 * @api {Function} Utils.CloudCapOptions(req,capabilities,strict,match) Utils.CloudCapOptions
 * @apiDescription Given a Parse Cloud request option, will determine if
 the request should have certain capabilities. Returns true if capabilities are
 permitted. Like `Utils.CloudRunOptions()`, but with additional escalation based
 on permitted capabilities.
 * @apiParam {Object} request Parse Cloud function request object.
 * @apiParam {Array} capabilities List of capability to check.
 * @apiParam {Boolean} [strict=true] if true, all capabilities must be allowed,
 otherwise at least one must be allowed to escalate permission to use master key.
 * @apiParam {String} [match] semver-style query on the user's level. If satisfied
 escalates the query to master key user.
 * @apiName Utils.CloudCapOptions
 * @apiGroup Actinium
 * @apiExample Usage
Actinium.Cloud.define('MyPlugin', 'do-something-privileged', async req => {
    const options = Actinium.Utils.CloudCapOptions(req, [
       'can-do',
       'can-do-everything',
      ],
      false,
      '>1000'
    );

    // query will succeed if:
    // 1. ACL/CLP is satisfied by logged in user session token
    // 2. user is a super-admin
    // 3. user has either "can-do" or "can-do-everything" capabilities
    // 4. user's "level" is greater than 1000
    const query = new Parse.Query('MySecrets');
    return query.find(options);
})
 */
const CloudCapOptions = (req, capability, strict = false, match = null) => {
    const options = CloudRunOptions(req, (match = null));
    if (options.useMasterKey) return options;

    if (CloudHasCapabilities(req, capability, strict))
        options.useMasterKey = true;

    return options;
};

/**
 * @api {Asynchronous} Utils.UserFromSession(sessionToken) Utils.UserFromSession
 * @apiDescription Given a session token, will return a promise for the user
 logged into that session.
 * @apiParam {String} sessionToken the Parse session token
 * @apiName Utils.UserFromSession
 * @apiGroup Actinium
 */
const UserFromSession = async sessionToken => {
    const session = await new Parse.Query(Parse.Session)
        .equalTo('sessionToken', sessionToken)
        .include('user')
        .first({ useMasterKey: true });

    return session ? session.get('user') : null;
};

module.exports = {
    isLevel,
    levelCheck,
    userMeetsLevel,
    CloudRunOptions,
    OptionsAddMaster,
    CloudMasterOptions,
    CloudHasCapabilities,
    CloudCapOptions,
    UserFromSession,
};
