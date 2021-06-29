const chalk = require('chalk');
const op = require('object-path');
const CONFIRM = require('./confirm');
const { parseDest, parseID } = require('./parsers');

const CHOICES = id => [
    {
        name: 'App',
        value: `app/${id}`,
    },
    {
        name: 'Core',
        value: `core/${id}`,
    },
    {
        name: 'Actinium Modules',
        value: `plugin/${id}`,
    },
    {
        name: 'Custom',
        value: 'custom',
    },
];

const DEST = async (props, params) => {
    const prefix = arcli.prefix;
    const suffix = chalk.magenta(': ');
    const id = parseID(params.ID);
    const choices = CHOICES(id);

    const input = await props.inquirer.prompt(
        [
            {
                prefix,
                suffix,
                choices,
                type: 'list',
                name: 'destination',
                message: 'Destination',
                filter: input => parseDest(input),
                when: answers => !op.get(answers, 'destination'),
            },
            {
                prefix,
                suffix,
                type: 'input',
                name: 'custom',
                default: `app/${id}`,
                message: 'Input Destination',
                validate: (input, answers) => {
                    if (String(input).length > 0) {
                        answers.destination = input;
                        return true;
                    }
                    return 'Destination is a required parameter';
                },
                when: answers => op.get(answers, 'destination') === 'custom',
            },
        ],
        params,
    );

    const isEmpty = arcli.isEmpty(input.destination);

    if (!isEmpty) {
        const { confirm } = await CONFIRM(props, {
            message:
                'The destination directory is not empty.\n          Overwrite?',
        });
        input.overwrite = confirm;
    }

    return input;
};

module.exports = DEST;
