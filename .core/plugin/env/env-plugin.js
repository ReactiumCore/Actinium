const path = require('path');
const chalk = require('chalk');

Actinium.Hook.register(
    'warning',
    () => {
        if (ENV.ENV_WARNING !== true) return;

        const filePath = path.normalize(`${SRC_DIR}/env.dev.json`);

        LOG('');
        LOG(
            chalk.cyan.bold('Warning:'),
            'The default',
            chalk.magenta('env.dev.json'),
            'file has been created at:',
        );
        LOG(' ', chalk.cyan(filePath));
        LOG('');
        LOG(' ', chalk.cyan.bold('Update the database connection string:'));
        LOG(
            ' ',
            chalk.cyan.bold('$'),
            chalk.magenta.bold('arcli'),
            'db -d -u',
            chalk.cyan("'mongo://YOUR.CONNECTION.STRING'"),
        );
    },
    1000000000,
);
