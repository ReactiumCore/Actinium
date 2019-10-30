const op = require('object-path');
const chalk = require('chalk');
const nodemailer = require('nodemailer');

const PLUGIN = {
    ID: 'MAILER',
    description: 'Mailer plugin.',
    name: 'Mailer Plugin',
    order: 0,
    version: {
        actinium: '>=3.0.5',
        plugin: '0.0.1',
    },
};

Actinium.Plugin.register(PLUGIN, true);

PLUGIN.warningHookId = Actinium.Hook.register('warning', () => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        if (!op.get(ENV, 'SENDMAIL_BIN')) {
            LOG('');
            LOG(chalk.cyan.bold('Warning:'));
            LOG(
                ' ',
                chalk.cyan('ENV.SENDMAIL_BIN'),
                'is not set',
                chalk.bold('mailer plugin'),
                'will default to',
                chalk.bold('/usr/sbin/sendmail'),
            );
        }
    }

    return Promise.resolve();
});

Actinium.Hook.register(
    'mailer-transport',
    async context => {
        context.transport = nodemailer.createTransport({
            sendmail: true,
            newline: op.get(ENV, op.get('SENDMAIL_NEWLINE_STYLE'), 'unix'),
            path: op.get(ENV, 'SENDMAIL_BIN', '/usr/sbin/sendmail'),
        });

        return Promise.resolve();
    },
    0,
);

PLUGIN.sendMessage = async message => {
    const context = await Actinium.Hook.run('mailer-transport');
    const transport = op.get(context, 'transport');
    if (!transport) {
        return Promise.reject('No mailer transport.');
    }

    return new Promise((resolve, reject) => {
        transport.sendMail(message, (err, info) => {
            if (err) {
                reject(err);
            }
            resolve(info);
        });
    });
};

Actinium.Mail = {
    send: PLUGIN.sendMessage,
};

module.exports = PLUGIN;
