const { chalk, op } = arcli; 

const TOGGLES = (props, params) =>
    props.inquirer.prompt(
        [
            {
                default: false,
                type: 'confirm',
                name: 'builtIn',
                prefix: arcli.prefix,
                suffix: chalk.magenta(': '),
                message: 'Uninstallable?',
                when: answers => !op.get(answers, 'builtIn'),
            },
            {
                default: false,
                type: 'confirm',
                name: 'activate',
                prefix: arcli.prefix,
                suffix: chalk.magenta(': '),
                message: 'Activate on install?',
                when: answers => !op.get(answers, 'activate'),
            },
        ],
        params,
    );

export default TOGGLES;
