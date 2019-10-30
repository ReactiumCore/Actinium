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
};

Actinium.Plugin.register(PLUGIN);

let host, domain, user, pass;

Actinium.Hook.register('start', () => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        Actinium.Hook.unregister(
            Actinium.Plugin.exports('MAILER.warningHookId'),
        );

        Actinium.Hook.register('warning', () => {
            const settingsFile = op.get(ENV, 'SMTP_MAILER_SETTINGS_FILE');
            if (settingsFile && fs.existsSync(settingsFile)) {
                try {
                    const settings = JSON.parse(
                        fs.readFileSync(settingsFile, 'utf8'),
                    );

                    host = op.get(settings, 'host');
                    port = op.get(settings, 'port');
                    user = op.get(settings, 'user');
                    pass = op.get(settings, 'pass');
                } catch (error) {
                    LOG('');
                    LOG(
                        chalk.magenta.bold('Warning'),
                        chalk.cyan('ENV.SMTP_MAILER_SETTINGS_FILE'),
                        'invalid or does not contain valid JSON settings (host, domain, user, pass)!',
                    );
                }
            } else {
                host = op.get(ENV, 'SMTP_MAILER_HOST');
                port = op.get(ENV, 'SMTP_MAILER_PORT');
                user = op.get(ENV, 'SMTP_MAILER_USER');
                pass = op.get(ENV, 'SMTP_MAILER_PASS');
            }

            if (!(host && port && user && pass)) {
                LOG('');
                !host &&
                    LOG(
                        chalk.magenta.bold('Warning'),
                        chalk.cyan('ENV.SMTP_MAILER_HOST'),
                        'is not set!',
                    );
                !port &&
                    LOG(
                        chalk.magenta.bold('Warning'),
                        chalk.cyan('ENV.SMTP_MAILER_PORT'),
                        'is not set!',
                    );
                !user &&
                    LOG(
                        chalk.magenta.bold('Warning'),
                        chalk.cyan('ENV.SMTP_MAILER_USER'),
                        'is not set!',
                    );
                !pass &&
                    LOG(
                        chalk.magenta.bold('Warning'),
                        chalk.cyan('ENV.SMTP_MAILER_PASS'),
                        'is not set!',
                    );
            }

            return Promise.resolve();
        });

        Actinium.Hook.register(
            'mailer-transport',
            async context => {
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
