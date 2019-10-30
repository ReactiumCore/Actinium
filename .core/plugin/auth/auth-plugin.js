const PLUGIN = require('./meta');
const PLUGIN_ROUTES = require('./routes');
const PLUGIN_BLUEPRINTS = require('./blueprints');
const resetRequest = require('./utils/resetRequest');
const resetPassword = require('./utils/resetPassword');

const TokenSchema = {
    value: { type: 'String' },
    expireAt: { type: 'Date' },
    user: { type: 'Pointer', targetClass: '_User' },
};

Actinium.Plugin.register(PLUGIN, true);

Actinium.Hook.register('activate', async ({ ID }) => {
    if (ID !== PLUGIN.ID) {
        return;
    }

    const actions = {
        addField: false,
        create: false,
        delete: false,
        retrieve: false,
        update: false,
    };

    Object.keys(actions).forEach(action =>
        Actinium.Capability.register(`Token.${action}`),
    );

    Actinium.Collection.register('Token', actions, TokenSchema);
});

Actinium.Hook.register('blueprint-defaults', blueprints => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        PLUGIN_BLUEPRINTS.forEach(item => blueprints.push(item));
    }
});

Actinium.Hook.register('route-defaults', routes => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        PLUGIN_ROUTES.forEach(item => routes.push(item));
    }
});

Actinium.Cloud.define(PLUGIN.ID, 'password-reset', resetPassword);

Actinium.Cloud.define(PLUGIN.ID, 'password-reset-request', resetRequest);

Actinium.User.resetRequest = email =>
    Actinium.Cloud.run(
        'password-reset-request',
        { email },
        { useMasterKey: true },
    );

Actinium.User.resetPassword = token =>
    Actinium.Cloud.run('password-reset', { token }, { useMasterKey: true });
