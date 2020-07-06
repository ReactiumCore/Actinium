const op = require('object-path');
const chalk = require('chalk');
const nodemailer = require('nodemailer');

const PLUGIN = {
    ID: 'MAILER',
    description: 'Mailer plugin.',
    name: 'Mailer Plugin',
    order: 0,
};

Actinium.Plugin.register(PLUGIN, true);

const getSettings = async () => {
    return Actinium.Setting.get('mailer', {
        sendmail: true,
        path: op.get(ENV, 'SENDMAIL_BIN', '/usr/sbin/sendmail'),
        newline: op.get(ENV, 'SENDMAIL_NEWLINE_STYLE', 'unix'),
    });
};

Actinium.Hook.register(
    'mailer-transport',
    async context => {
        const settings = await getSettings();
        context.transport = nodemailer.createTransport(settings);

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
