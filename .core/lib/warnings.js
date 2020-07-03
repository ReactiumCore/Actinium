const chalk = require('chalk');
const _ = require('underscore');
const op = require('object-path');

module.exports = {
    run: (...params) => {
        if (!ENV.NO_PARSE) {
            if (
                ENV.MASTER_KEY === 'VVipSwUXCp7p08vMDREITClNWG9oUSxBl2gDWL0Ffo'
            ) {
                WARN('');
                WARN(
                    chalk.cyan.bold('Warning:'),
                    "Looks like you're using the default Master Key:",
                );
                WARN(
                    ' ',
                    chalk.cyan('ENV.MASTER_KEY'),
                    chalk.cyan('→'),
                    chalk.magenta(ENV.MASTER_KEY),
                );
                WARN(' ', 'You should definitely change that bruh!');
            }

            const dashboardUser =
                _.findWhere(ENV.PARSE_DASHBOARD_USERS, { user: 'admin' }) || {};

            const user = op.get(dashboardUser, 'user');
            const pass = op.get(dashboardUser, 'pass');
            if (pass === 'admin') {
                WARN('');
                WARN(
                    chalk.cyan.bold('Warning:'),
                    "Ehh, you haven't changed the default Parse Dashboard User:",
                );
                WARN(
                    ' ',
                    chalk.cyan('ENV.PARSE_DASHBOARD_USERS'),
                    chalk.cyan('→'),
                    chalk.cyan('{'),
                    `user: '${chalk.magenta(user)}'`,
                    `pass: '${chalk.magenta(pass)}'`,
                    chalk.cyan('}'),
                );
                WARN(' ', 'You should do that now, yo!');
            }
        }

        if (!ENV.NO_PULSE) {
            const warned = [];
            _.sortBy(Actinium.Pulse.definitions, 'order')
                .filter(({ warn }) => Boolean(!!warn))
                .forEach(({ id, warn }) => {
                    if (warned.includes(id)) {
                        return;
                    }

                    WARN('');
                    WARN(
                        chalk.cyan.bold('Warning:'),
                        'Duplicate Pulse definition',
                    );
                    WARN(
                        ' ',
                        chalk.cyan('Pulse'),
                        chalk.cyan('→'),
                        chalk.magenta(id),
                    );
                    warned.push(id);
                });
        }

        return Actinium.Hook.run('warning');
    },
};
