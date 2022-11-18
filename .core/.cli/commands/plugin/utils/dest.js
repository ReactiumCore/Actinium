import CONFIRM from './confirm.js';
import { parseDest, parseID } from './parsers.js';

const { chalk, isEmpty, op, prefix } = arcli; 

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

    const empty = isEmpty(input.destination);

    if (!empty) {
        const { confirm } = await CONFIRM(props, {
            message:
                'The destination directory is not empty.\n          Overwrite?',
        });
        input.overwrite = confirm;
    }

    return input;
};

export default DEST;
