const op = require('object-path');
const chalk = require('chalk');
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

const PLUGIN = {
    ID: 'MAILGUN',
    description: 'Mailgun mailer plugin.',
    name: 'Mailgun mailer plugin.',
    order: 0,
    version: {
        actinium: '>=3.0.5',
        plugin: '0.0.1',
    },
    meta: {
        group: 'mail',
    },
};

Actinium.Plugin.register(PLUGIN);

const getSettings = async () => {
    return Actinium.Setting.get('mailgun', {
        api_key: op.get(ENV, 'MAILGUN_API_KEY'),
        domain: op.get(ENV, 'MAILGUN_DOMAIN'),
        proxy: op.get(ENV, 'MAILGUN_PROXY'),
    });
};

Actinium.Hook.register('start', async () => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        const settings = await getSettings();
        const api_key = op.get(settings, 'api_key');
        const domain = op.get(settings, 'domain');
        const proxy = op.get(settings, 'proxy');

        Actinium.Hook.unregister(
            Actinium.Plugin.exports('MAILER.warningHookId'),
        );

        Actinium.Hook.register('warning', () => {
            if (!api_key || !domain) {
                LOG('');
                !api_key &&
                    LOG(
                        chalk.magenta.bold('Warning:'),
                        chalk.cyan(
                            'mailgun.api_key setting or ENV.MAILGUN_API_KEY',
                        ),
                        'is not set!',
                        chalk.bold('mailer plugin'),
                        'will default to',
                        chalk.bold('sendmail behavior.'),
                    );
                !domain &&
                    LOG(
                        chalk.magenta.bold('Warning:'),
                        chalk.cyan(
                            'mailgun.domain setting or ENV.MAILGUN_DOMAIN',
                        ),
                        'is not set!',
                        chalk.bold('mailer plugin'),
                        'will default to',
                        chalk.bold('sendmail behavior.'),
                    );
            }

            return Promise.resolve();
        });

        Actinium.Hook.register(
            'mailer-transport',
            async context => {
                LOG('');
                LOG(chalk.magenta.bold('MAILGUN Transport'));

                if (api_key && domain) {
                    const transportOptions = {
                        auth: {
                            api_key,
                            domain,
                        },
                    };

                    if (proxy) op.set(transportOptions, 'proxy', proxy);
                    context.transport = nodemailer.createTransport(
                        mg(transportOptions),
                    );
                }

                return Promise.resolve();
            },
            1,
        );
    }
    return Promise.resolve();
});

module.exports = PLUGIN;
