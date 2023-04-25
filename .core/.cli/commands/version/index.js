import chalk from 'chalk';
import op from 'object-path';
import actiniumConfig from '../../../actinium-config.js';

const NAME = 'version';
const DESC = 'The current Actinium Core version';

const ACTION = async () => {
    console.log(chalk.cyan('Actinium:'));

    console.log(
        ' ',
        'Version:',
        chalk.magenta(op.get(actiniumConfig, 'version')),
    );

    console.log(
        ' ',
        'Semver: ',
        chalk.magenta(op.get(actiniumConfig, 'semver')),
    );
    console.log('');
};

const COMMAND = ({ program, props }) =>
    program
        .command(NAME)
        .description(DESC)
        .action((opt) => ACTION({ opt, props }));

export { COMMAND, NAME };
