const chalk = require('chalk');
const op = require('object-path');

const CloudRunOptions = req => {
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
        if (Actinium.Roles.User.is(id, 'super-admin'))
            options['useMasterKey'] = true;
    }

    return options;
};

const CloudHasCapabilities = (req, capability, strict = true) => {
    const { master } = req;
    if (master) return true;

    const userCaps = req.user
        ? // get all caps associated with user
          Actinium.Capability.User.get(req.user.id)
        : // treat non-user as anonymous role
          Actinium.Capability.Role.get('anonymous');

    // if no capabilities specified, deny
    if (!capability) return false;

    const capabilities = Array.isArray(capability) ? capability : [capability];

    const permitted = strict
        ? // all capabilities required for strict
          capabilities.reduce(
              (hasCaps, cap) => !!(hasCaps && userCaps.find(uc => uc === cap)),
              true,
          )
        : // one capability required for non-strict
          capabilities.reduce(
              (hasCaps, cap) => !!(hasCaps || userCaps.find(uc => uc === cap)),
              false,
          );

    return permitted;
};

const CloudCapOptions = (req, capability, strict = false) => {
    const options = CloudRunOptions(req);
    if (options.useMasterKey) return options;

    if (CloudHasCapabilities(req, capability, strict))
        options.useMasterKey = true;

    return options;
};

module.exports = {
    CloudRunOptions,
    CloudCapOptions,
    CloudHasCapabilities,
};
