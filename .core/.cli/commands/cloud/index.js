/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */

const chalk = require('chalk');
const generator = require('./generator');
const prettier = require('prettier');
const fs = require('fs-extra');
const path = require('path');
const slugify = require('slugify');
const mod = path.dirname(require.main.filename);
const { error, message } = require(`${mod}/lib/messenger`);

const beforeBoolean = val => {
    return String(val).toLowerCase() === 'y';
};

const formatDefinitions = val => {
    if (val === '' || !val) {
        return [];
    }
    return String(val)
        .replace(/\s+/g, ' ')
        .replace(/,/g, '')
        .split(' ');
};

const formatDestination = (val, props) => {
    const { cwd } = props;

    val = path.normalize(val);
    val = String(val).replace(/^~\/|^\/cwd\/|^cwd\/|^cwd$/i, `${cwd}/`);
    val = String(val).replace(
        /^\/cloud\/|^cloud\/|^cloud/i,
        `${cwd}/src/app/cloud/`,
    );

    return path.normalize(val);
};

const overwritable = prompt => {
    let overwrite;

    try {
        overwrite =
            prompt.override['overwrite'] || prompt.history('overwrite').value;
    } catch (err) {
        overwrite = true;
    }

    overwrite = overwrite === '' ? true : overwrite;

    return overwrite;
};

const collectable = prompt => {
    let collection;

    try {
        collection =
            prompt.override['collection'] || prompt.history('collection').value;
    } catch (err) {
        collection = false;
    }

    collection = collection === '' ? false : collection;

    return collection;
};

/**
 * NAME String
 * @description Constant defined as the command name. Value passed to the commander.command() function.
 * @example $ arcli cloud
 * @see https://www.npmjs.com/package/commander#command-specific-options
 * @since 2.0.0
 */
const NAME = 'cloud';

/**
 * DESC String
 * @description Constant defined as the command description. Value passed to
 * the commander.desc() function. This string is also used in the --help flag output.
 * @see https://www.npmjs.com/package/commander#automated---help
 * @since 2.0.0
 */
const DESC = 'Actinium: Create a new Parse.Cloud function file.';

/**
 * CANCELED String
 * @description Message sent when the command is canceled
 * @since 2.0.0
 */
const CANCELED = 'Action canceled!';

/**
 * confirm({ props:Object, params:Object }) Function
 * @description Prompts the user to confirm the operation
 * @since 2.0.0
 */
const CONFIRM = ({ props, params }) => {
    const { prompt } = props;

    return new Promise((resolve, reject) => {
        prompt.get(
            {
                properties: {
                    confirmed: {
                        description: `${chalk.white('Proceed?')} ${chalk.cyan(
                            '(Y/N):',
                        )}`,
                        type: 'string',
                        required: true,
                        pattern: /^y|n|Y|N/,
                        message: ` `,
                        before: beforeBoolean,
                    },
                },
            },
            (error, input) => {
                let confirmed;

                try {
                    confirmed = input.confirmed;
                } catch (err) {
                    confirmed = false;
                }

                if (error || confirmed === false) {
                    reject(error);
                } else {
                    resolve(confirmed);
                }
            },
        );
    });
};

/**
 * conform(input:Object) Function
 * @description Reduces the input object.
 * @param input Object The key value pairs to reduce.
 * @since 2.0.0
 */
const CONFORM = ({ input, props }) => {
    const { cwd } = props;

    let output = {};

    Object.entries(input).forEach(([key, val]) => {
        switch (key) {
            case 'definitions':
                output[key] = formatDefinitions(val);
                break;

            case 'destination':
                val = formatDestination(val, props);
                val += path.extname(val) !== '.js' ? '.js' : '';
                output[key] = val;
                break;

            default:
                output[key] = val === '' || !val ? undefined : val;
                break;
        }
    });

    return output;
};

/**
 * HELP Function
 * @description Function called in the commander.on('--help', callback) callback.
 * @see https://www.npmjs.com/package/commander#automated---help
 * @since 2.0.0
 */
const HELP = () => {
    console.log('');
    console.log('Example:');
    console.log('');
    console.log(
        '  arcli cloud --name user --collection _User --definitions "userSave userFetch"',
    );
    console.log('');
};

/**
 * SCHEMA Function
 * @description used to describe the input for the prompt function.
 * @see https://www.npmjs.com/package/prompt
 * @since 2.0.0
 */
const SCHEMA = ({ props }) => {
    const { cwd, prompt } = props;

    return {
        properties: {
            destination: {
                required: true,
                description: `${chalk.white('Destination')} ~ ${chalk.cyan(
                    'cloud/DIR/FILE.js',
                )}  :`,
                message: `Enter file path. Example: ${chalk.cyan(
                    'cloud/user/index.js',
                )}`,
            },
            overwrite: {
                required: true,
                pattern: /^y|n|Y|N/,
                message: '',
                description: `${chalk.white(
                    'Overwrite existing cloud file?',
                )} ${chalk.cyan('(Y/N):')}`,
                ask: () => {
                    try {
                        let destination =
                            prompt.override['destination'] ||
                            prompt.history('destination').value;
                        return fs.existsSync(
                            formatDestination(destination, props),
                        );
                    } catch (err) {
                        return false;
                    }
                },
                before: beforeBoolean,
            },
            definitions: {
                description: chalk.white('Definitions:'),
                message: `Specify the name[s] of Parse.Cloud.define() definitions. Example: ${chalk.cyan(
                    'userSave userFetch contentSave',
                )}`,
                ask: () => overwritable(prompt),
            },
            collection: {
                description: chalk.white('Collection:'),
                ask: () => overwritable(prompt),
            },
            beforeSave: {
                description: `${chalk.white('Before Save?')} ${chalk.cyan(
                    '(Y/N):',
                )}`,
                type: 'string',
                pattern: /^y|n|Y|N/,
                before: beforeBoolean,
                ask: () => collectable(prompt),
            },
            afterSave: {
                description: `${chalk.white('After Save?')} ${chalk.cyan(
                    '(Y/N):',
                )}`,
                type: 'string',
                pattern: /^y|n|Y|N/,
                before: beforeBoolean,
                ask: () => collectable(prompt),
            },
            beforeDelete: {
                description: `${chalk.white('Before Delete?')} ${chalk.cyan(
                    '(Y/N):',
                )}`,
                type: 'string',
                pattern: /^y|n|Y|N/,
                before: beforeBoolean,
                ask: () => collectable(prompt),
            },
            afterDelete: {
                description: `${chalk.white('After Delete?')} ${chalk.cyan(
                    '(Y/N):',
                )}`,
                type: 'string',
                pattern: /^y|n|Y|N/,
                before: beforeBoolean,
                ask: () => collectable(prompt),
            },
            beforeFind: {
                description: `${chalk.white('Before Find?')} ${chalk.cyan(
                    '(Y/N):',
                )}`,
                type: 'string',
                pattern: /^y|n|Y|N/,
                before: beforeBoolean,
                ask: () => collectable(prompt),
            },
        },
    };
};

/**
 * ACTION Function
 * @description Function used as the commander.action() callback.
 * @see https://www.npmjs.com/package/commander
 * @param opt Object The commander options passed into the function.
 * @param props Object The CLI props passed from the calling class `orcli.js`.
 * @since 2.0.0
 */
const ACTION = ({ opt, props }) => {
    const { cwd, prompt } = props;

    const schema = SCHEMA({ props });
    const ovr = Object.keys(schema.properties).reduce((obj, key) => {
        const val = opt[key];
        obj[key] = typeof val === 'function' ? undefined : val;
        return obj;
    }, {});

    prompt.override = ovr;
    prompt.start();
    prompt.get(schema, (err, input) => {
        // Keep this conditional as the first line in this function.
        // Why? because you will get a js error if you try to set or use anything related to the input object.
        if (err) {
            prompt.stop();
            error(`${NAME} ${err.message}`);
            return;
        }

        const params = CONFORM({ input, props });
        const { overwrite } = params;

        // Exit if overwrite or confirm !== true
        if (typeof overwrite === 'boolean' && !overwrite) {
            prompt.stop();
            message(CANCELED);
            return;
        }

        message(
            `A new Parse.Cloud file will be created with the following options:`,
        );
        const preflight = { ...params };

        console.log(
            prettier.format(JSON.stringify(preflight), {
                parser: 'json-stringify',
            }),
        );

        CONFIRM({ props, params })
            .then(() => {
                console.log('');

                generator({ params, props }).then(success => {
                    console.log('');
                });
            })
            .then(() => prompt.stop())
            .catch(err => {
                prompt.stop();
                message(CANCELED);
            });
    });
};

/**
 * COMMAND Function
 * @description Function that executes program.command()
 */
const COMMAND = ({ program, props }) =>
    program
        .command(NAME)
        .description(DESC)
        .action(opt => ACTION({ opt, props }))
        .option(
            '-d, --destination [destination]',
            'Cloud function parent directory.',
        )
        .option(
            '-o, --overwrite [overwrite]',
            'Overwrite existing cloud function.',
        )
        .option(
            '-c, --collection [collection]',
            'Database collection for before/after hooks. Example: _User',
        )
        .option(
            '--definitions [definitions]',
            'Parse.Cloud.define() definitions. Example: "userSave userDelete"',
        )
        .option(
            '--beforeFind [beforeFind]',
            'Include beforeFind definition. Only applicable if --collection is specified.',
        )
        .option(
            '--beforeDelete [beforeDelete]',
            'Include beforeDelete definition. Only applicable if --collection is specified.',
        )
        .option(
            '--beforeSave [beforeSave]',
            'Include beforeSave definition. Only applicable if --collection is specified.',
        )
        .option(
            '--afterDelete [afterDelete]',
            'Include afterDelete definition. Only applicable if --collection is specified.',
        )
        .option(
            '--afterSave [afterSave]',
            'Include afterSave definition. Only applicable if --collection is specified.',
        )
        .on('--help', HELP);

/**
 * Module Constructor
 * @description Internal constructor of the module that is being exported.
 * @param program Class Commander.program reference.
 * @param props Object The CLI props passed from the calling class `arcli.js`.
 * @since 2.0.0
 */
module.exports = {
    ACTION,
    CONFIRM,
    CONFORM,
    COMMAND,
    NAME,
};
