const chalk = require('chalk');

const SDK = Actinium => {
    const exp = {};

    exp.init = (app, opt = {}) => {
        Object.entries(opt).forEach(([key, value]) => {
            app.set(key, value);
            DEBUG(
                chalk.cyan('  Express'),
                `${key}`,
                chalk.cyan('→'),
                chalk.magenta(value),
            );
        });
    };

    return exp;
};

module.exports = SDK;
