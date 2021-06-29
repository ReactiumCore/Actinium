const chalk = require('chalk');
const _ = require('underscore');

const CONFIRM = (props, options) => {
    options = _.isObject(options) ? options : {};

    const defaults = {
        message: 'Proceed',
        name: 'confirm',
        default: false,
        when: () => true,
        ...options,
    };

    return props.inquirer.prompt([
        {
            ...defaults,
            type: 'confirm',
            prefix: arcli.prefix,
            suffix: chalk.magenta(': '),
        },
    ]);
};

module.exports = CONFIRM;
