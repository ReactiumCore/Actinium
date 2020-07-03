const op = require('object-path');
const chalk = require('chalk');

const PLUGIN = {
    ID: 'TEST-MAILER',
    description: 'Test current mailer plugin.',
    name: 'Test Mailer Plugin',
    order: 100,
    version: {
        actinium: '>=3.0.5',
        plugin: '0.0.1',
    },
};

Actinium.Plugin.register(PLUGIN);

Actinium.Hook.register('start', () => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        Actinium.Hook.register('warning', () => {
            if (Actinium.Plugin.isActive(PLUGIN.ID)) {
                WARN('');
                WARN(
                    chalk.cyan.bold('Warning:'),
                    'The',
                    chalk.bold('sample-mailer'),
                    'is active.',
                );
                WARN(' ', 'If you do not need it, deactivate or remove it!');
                WARN(' ', chalk.magenta(__dirname));
            }

            return Promise.resolve();
        });
    }

    return Promise.resolve();
});

Actinium.Cloud.define(PLUGIN.ID, 'sendmail-test', async req => {
    const sendMessage = Actinium.Plugin.exports('MAILER.sendMessage');
    return sendMessage({
        to: 'john@reactium.io',
        from: 'john@reactium.io',
        subject: 'This is a test.',
        text: 'This is a test message.',
    });
});

module.exports = PLUGIN;
