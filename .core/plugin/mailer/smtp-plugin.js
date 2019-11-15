const op = require('object-path');
const chalk = require('chalk');
const nodemailer = require('nodemailer');
const fs = require('fs');

const PLUGIN = {
    ID: 'SMTP-MAILER',
    description: 'SMTP mailer plugin.',
    name: 'SMTP mailer plugin.',
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

let host, domain, user, pass;

const getSettings = async () => {
    const defaults = {};
    const settingsFile = op.get(ENV, 'SMTP_MAILER_SETTINGS_FILE', false);
    if (settingsFile && fs.existsSync(settingsFile)) {
        try {
            const settings = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
            Object.entries(settings).forEach(([key, value]) => {
                op.set(defaults, key, value);
            });
        } catch (error) {
            LOG('');
            LOG(
                chalk.magenta.bold('Warning'),
                chalk.cyan('ENV.SMTP_MAILER_SETTINGS_FILE'),
                'invalid or does not contain valid JSON settings (host, domain, user, pass)!',
            );
        }
    } else {
        op.set(defaults, 'host', op.get(ENV, 'SMTP_MAILER_HOST'));
        op.set(defaults, 'port', op.get(ENV, 'SMTP_MAILER_PORT'));
        op.set(defaults, 'user', op.get(ENV, 'SMTP_MAILER_USER'));
        op.set(defaults, 'pass', op.get(ENV, 'SMTP_MAILER_PASS'));
    }

    return Actinium.Setting.get('smtp', defaults);
};

Actinium.Hook.register('start', async () => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        const settings = await getSettings();

        Actinium.Hook.unregister(
            Actinium.Plugin.exports('MAILER.warningHookId'),
        );

        Actinium.Hook.register('warning', () => {
            const { host, port, user, pass } = settings;
            if (!(host && port && user && pass)) {
                LOG('');
                !host &&
                    LOG(
                        chalk.magenta.bold('Warning'),
                        chalk.cyan('smtp.host setting or ENV.SMTP_MAILER_HOST'),
                        'is not set!',
                    );
                !port &&
                    LOG(
                        chalk.magenta.bold('Warning'),
                        chalk.cyan('smtp.port setting or ENV.SMTP_MAILER_PORT'),
                        'is not set!',
                    );
                !user &&
                    LOG(
                        chalk.magenta.bold('Warning'),
                        chalk.cyan('smtp.user setting or ENV.SMTP_MAILER_USER'),
                        'is not set!',
                    );
                !pass &&
                    LOG(
                        chalk.magenta.bold('Warning'),
                        chalk.cyan('smtp.pass setting or ENV.SMTP_MAILER_PASS'),
                        'is not set!',
                    );
            }

            return Promise.resolve();
        });

        Actinium.Hook.register(
            'mailer-transport',
            async context => {
                const { host, port, user, pass } = settings;

                LOG('');
                LOG(chalk.magenta.bold('SMTP-MAILER Transport'));
                if (host && port && user && pass) {
                    const transportOptions = {
                        host,
                        port,
                        auth: {
                            user,
                            pass,
                        },
                    };

                    context.transport = nodemailer.createTransport(
                        transportOptions,
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
