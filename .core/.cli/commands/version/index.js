const chalk = require('chalk');
const path = require('path');
const op = require('object-path');

const NAME = 'version';
const DESC = 'The current Actinium Core version';

const ACTION = ({ opt, props }) => {
    const configPath = path.normalize(
        path.join(props.cwd, '/.core', 'actinium-config'),
    );
    const actiniumConfig = require(configPath);
    console.log(
        chalk.cyan('Actinium:'),
        chalk.magenta(op.get(actiniumConfig, 'version')),
    );
    console.log('');
};

const COMMAND = ({ program, props }) =>
    program
        .command(NAME)
        .description(DESC)
        .action(opt => ACTION({ opt, props }));

module.exports = {
    COMMAND,
    NAME,
};
