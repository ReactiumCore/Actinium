/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */

const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const _ = require('underscore');
const semver = require('semver');
const op = require('object-path');
const slugify = require('slugify');
const prettier = require('prettier');
const camelcase = require('camelcase');
const GENERATOR = require('./generator');
const mod = path.dirname(require.main.filename);
const { error, message } = require(`${mod}/lib/messenger`);

const beforeBoolean = val =>
    Boolean(
        String(val)
            .trim()
            .toLowerCase() === 'y',
    );

const parseArray = val =>
    _.compact(
        String(val)
            .toLowerCase()
            .replace(/\,/g, ', ')
            .replace(/\s\s+/g, ' ')
            .split(', ')
            .map(str => slugify(str)),
    );

const parseDest = (val, props) => {
    const { cwd } = props;

    val = path.normalize(val);
    val = String(val).replace(/^\/app\/|^app\/|^app/i, `${cwd}/src/app/`);
    val = String(val).replace(
        /^\/plugin\/|^plugin\/|^plugin/i,
        `${cwd}/.core/plugin/`,
    );
    val = String(val).replace(/^~\/|^\/cwd\/|^cwd\/|^cwd$/i, `${cwd}/`);

    return path.normalize(val);
};

const parseID = ID => slugify(String(ID).toLowerCase());

const NAME = 'plugin';

const DESC = 'The description of the command';

const CANCELED = 'Action canceled!';

const HELP = () =>
    console.log(`
Example:
  $ arcli plugin -h
`);

const FLAGS = [
    'actiniumVersion',
    'activate',
    'builtIn',
    'cloud',
    'description',
    'destination',
    'name',
    'overwrite',
    'pluginVersion',
    'sdk',
];

const FLAGS_TO_PARAMS = ({ opt = {} }) =>
    FLAGS.reduce((obj, key) => {
        let val = opt[key];
        val = typeof val === 'function' ? undefined : val;

        if (val) obj[key] = val;

        return obj;
    }, {});

const PREFLIGHT = ({ params, props }) => {
    if (op.get(params, 'overwrite') === false) {
        message(CANCELED);
        process.exit();
    }

    message('A new Plugin will be created from the following:');

    // Transform the preflight object instead of the params object
    const preflight = { ...params };
    if (preflight.overwrite === '') op.del(preflight, 'overwrite');

    console.log(
        prettier.format(JSON.stringify(preflight), {
            parser: 'json-stringify',
        }),
    );
};

const INPUT_ID = ({ params, props }) =>
    new Promise(resolve => {
        const { prompt } = props;
        prompt.override = params;
        prompt.get(
            [
                {
                    description: chalk.white('Plugin ID:'),
                    message: 'ID is a required parameter',
                    name: 'ID',
                    required: true,
                },
            ],
            (err, input = {}) => {
                if (err) process.exit();
                resolve(CONFORM({ input, props }));
            },
        );
    });

const INPUT_DEST = ({ params, props }) =>
    new Promise(resolve => {
        const { prompt } = props;
        const ID = parseID(params.ID);

        prompt.override = params;
        prompt.get(
            [
                {
                    name: 'destination',
                    default: parseDest(path.join('app/', ID), props),
                    description: chalk.white('Destination:'),
                    message: 'Enter destination path',
                    required: true,
                },
            ],
            (err, input = {}) => {
                if (err) process.exit();
                resolve(CONFORM({ input, props }));
            },
        );
    });

const INPUT_OVERWRITE = ({ params, props }) =>
    new Promise(resolve => {
        const { prompt } = props;
        prompt.override = params;
        prompt.get(
            [
                {
                    name: 'overwrite',
                    required: true,
                    pattern: /^y|n|Y|N/,
                    message: '',
                    description: `${chalk.white(
                        'Overwrite existing plugin?',
                    )} ${chalk.cyan('(Y/N):')}`,
                    ask: () => {
                        try {
                            const destination = op.get(
                                params,
                                'destination',
                                prompt.history('destination').value,
                            );
                            return fs.existsSync(parseDest(destination, props));
                        } catch (err) {
                            return false;
                        }
                    },
                    before: beforeBoolean,
                },
            ],
            (err, input = {}) => {
                if (err) process.exit();

                if (input.overwrite === false) {
                    message(CANCELED);
                    process.exit();
                    return;
                }
                resolve(true);
            },
        );
    });

const INPUT_CONFIRM = ({ params, props }) =>
    new Promise(resolve => {
        const { prompt } = props;
        prompt.override = params;
        prompt.get(
            [
                {
                    name: 'confirmed',
                    description: `${chalk.white('Proceed?')} ${chalk.cyan(
                        '(Y/N):',
                    )}`,
                    type: 'string',
                    required: true,
                    pattern: /^y|n|Y|N/,
                    message: ' ',
                    before: beforeBoolean,
                },
            ],
            (err, input = {}) => {
                if (err) process.exit();

                const confirmed = op.get(input, 'confirmed', false);

                if (confirmed !== true) {
                    message(CANCELED);
                    process.exit();
                    return;
                } else {
                    resolve(err || confirmed === false ? false : true);
                }
            },
        );
    });

const INPUT_META = ({ params, props }) =>
    new Promise(resolve => {
        const { prompt } = props;
        prompt.override = params;
        prompt.get(
            [
                {
                    name: 'name',
                    default: `${params.ID} Plugin`,
                    description: chalk.white('Plugin Name:'),
                    required: true,
                    type: 'string',
                },
                {
                    name: 'description',
                    description: chalk.white('Description:'),
                    type: 'string',
                },
                {
                    name: 'pluginVersion',
                    default: '1.0.0',
                    description: chalk.white('Plugin Version:'),
                    required: true,
                    type: 'string',
                },
                {
                    name: 'actiniumVersion',
                    default: '>=3.2.6',
                    description: chalk.white('Actinium Version:'),
                    required: true,
                    type: 'string',
                },
                {
                    name: 'builtIn',
                    default: 'N',
                    description: `${chalk.white('Built-in?')} ${chalk.cyan(
                        '(Y/N):',
                    )}`,
                    pattern: /^y|n|Y|N/,
                    before: beforeBoolean,
                    type: 'string',
                },
                {
                    name: 'activate',
                    default: 'N',
                    description: `${chalk.white('Activated?')} ${chalk.cyan(
                        '(Y/N):',
                    )}`,
                    pattern: /^y|n|Y|N/,
                    before: beforeBoolean,
                    type: 'string',
                },
                {
                    name: 'sdk',
                    default: params.ID,
                    description: chalk.white('SDK:'),
                    type: 'string',
                },
                {
                    name: 'cloud',
                    description: chalk.white('Cloud Functions:'),
                    type: 'string',
                },
            ],
            (err, input) => {
                if (err) process.exit();
                resolve(CONFORM({ input, props }));
            },
        );
    });

const INPUT_BLUEPRINTS = ({ params, props }) =>
    new Promise(resolve => {
        let blueprint = op.get(params, 'blueprint', false);
        let { blueprints = [], ID } = params;
        const { prompt } = props;

        ID = String(ID).toLowerCase();

        prompt.override = params;
        prompt.get(
            [
                {
                    name: 'add',
                    default: 'N',
                    description: `${chalk.white('Blueprints?')} ${chalk.cyan(
                        '(Y/N):',
                    )}`,
                    pattern: /^y|n|Y|N/,
                    before: beforeBoolean,
                    type: 'string',
                    ask: () => blueprint !== true,
                },
                {
                    name: 'blueprint.ID',
                    default:
                        blueprints.length > 0 ? undefined : `${ID}-blueprint`,
                    description: chalk.white('   ID:'),
                    type: 'string',
                    ask: () => blueprint === true,
                    before: val => String(slugify(val)).toLowerCase(),
                },
                {
                    name: 'blueprint.className',
                    default:
                        blueprints.length > 0 ? undefined : `blueprint-${ID}`,
                    description: chalk.white('   className:'),
                    type: 'string',
                    ask: () => blueprint === true,
                },
                {
                    name: 'blueprint.description',
                    default:
                        blueprints.length > 0
                            ? undefined
                            : `${camelcase(ID, {
                                  pascalCase: true,
                              })} Blueprint`,
                    description: chalk.white('   Description:'),
                    type: 'string',
                    ask: () => blueprint === true,
                },
                {
                    name: 'blueprint.admin',
                    default: 'N',
                    description: `${chalk.white('   Admin?')} ${chalk.cyan(
                        '(Y/N):',
                    )}`,
                    pattern: /^y|n|Y|N/,
                    before: beforeBoolean,
                    type: 'string',
                    ask: () => blueprint === true,
                },
                {
                    name: 'blueprint.builtIn',
                    default: params.builtIn === true ? 'Y' : 'N',
                    description: `${chalk.white('   Built-in?')} ${chalk.cyan(
                        '(Y/N):',
                    )}`,
                    pattern: /^y|n|Y|N/,
                    before: beforeBoolean,
                    type: 'string',
                    ask: () => blueprint === true,
                },
                {
                    name: 'blueprint.add',
                    default: 'N',
                    description: ` ${chalk.cyan('+')} ${chalk.white(
                        'Add Another Blueprint?',
                    )} ${chalk.cyan('(Y/N):')}`,
                    pattern: /^y|n|Y|N/,
                    before: beforeBoolean,
                    type: 'string',
                    ask: () => blueprint === true,
                },
            ],
            (err, input = {}) => {
                if (err) process.exit();

                if (op.get(input, 'add') === true) {
                    resolve({ blueprint: true });
                    return;
                }

                if (op.get(params, 'blueprint') === true) {
                    input = Object.keys(input).reduce((obj, key) => {
                        const val = input[key];
                        op.set(obj, key, val);
                        return obj;
                    }, {});

                    const bp = op.get(input, 'blueprint', {});
                    const { blueprints } = params;
                    const { add, ID } = bp;

                    op.set(bp, 'zone', String(ID).toLowerCase() + '-content');

                    op.del(bp, 'add');

                    blueprints.push(bp);

                    resolve({ blueprint: add, blueprints });
                    return;
                }

                resolve({});
            },
        );
    });

const INPUT_COLLECTIONS = ({ params, props }) =>
    new Promise(resolve => {
        let { collection, collections = [], ID } = params;
        const { prompt } = props;

        prompt.override = params;
        prompt.get(
            [
                {
                    name: 'add',
                    default: 'N',
                    description: `${chalk.white('Collection?')} ${chalk.cyan(
                        '(Y/N):',
                    )}`,
                    pattern: /^y|n|Y|N/,
                    before: beforeBoolean,
                    type: 'string',
                    ask: () => collection !== true,
                },
                {
                    name: 'collection.ID',
                    default: collections.length > 0 ? undefined : ID,
                    description: chalk.white('   ID:'),
                    type: 'string',
                    ask: () => collection === true,
                    conform: val => camelcase(val, { pascalCase: true }),
                },
                {
                    name: 'collection.addField',
                    default: 'N',
                    description: `${chalk.white(
                        '   CLP addField?',
                    )} ${chalk.cyan('(Y/N):')}`,
                    pattern: /^y|n|Y|N/,
                    before: beforeBoolean,
                    type: 'string',
                    ask: () => collection === true,
                },
                {
                    name: 'collection.create',
                    default: 'N',
                    description: `${chalk.white('   CLP create?')} ${chalk.cyan(
                        '(Y/N):',
                    )}`,
                    pattern: /^y|n|Y|N/,
                    before: beforeBoolean,
                    type: 'string',
                    ask: () => collection === true,
                },
                {
                    name: 'collection.delete',
                    default: 'N',
                    description: `${chalk.white('   CLP delete?')} ${chalk.cyan(
                        '(Y/N):',
                    )}`,
                    pattern: /^y|n|Y|N/,
                    before: beforeBoolean,
                    type: 'string',
                    ask: () => collection === true,
                },
                {
                    name: 'collection.retrieve',
                    default: 'N',
                    description: `${chalk.white(
                        '   CLP retrieve?',
                    )} ${chalk.cyan('(Y/N):')}`,
                    pattern: /^y|n|Y|N/,
                    before: beforeBoolean,
                    type: 'string',
                    ask: () => collection === true,
                },
                {
                    name: 'collection.update',
                    default: 'N',
                    description: `${chalk.white('   CLP update?')} ${chalk.cyan(
                        '(Y/N):',
                    )}`,
                    pattern: /^y|n|Y|N/,
                    before: beforeBoolean,
                    type: 'string',
                    ask: () => collection === true,
                },
                {
                    name: 'collection.afterDelete',
                    default: 'N',
                    description: `${chalk.white(
                        '   afterDelete hook?',
                    )} ${chalk.cyan('(Y/N):')}`,
                    pattern: /^y|n|Y|N/,
                    before: beforeBoolean,
                    type: 'string',
                    ask: () => collection === true,
                },
                {
                    name: 'collection.afterFind',
                    default: 'N',
                    description: `${chalk.white(
                        '   afterFind hook?',
                    )} ${chalk.cyan('(Y/N):')}`,
                    pattern: /^y|n|Y|N/,
                    before: beforeBoolean,
                    type: 'string',
                    ask: () => collection === true,
                },
                {
                    name: 'collection.afterSave',
                    default: 'N',
                    description: `${chalk.white(
                        '   afterSave hook?',
                    )} ${chalk.cyan('(Y/N):')}`,
                    pattern: /^y|n|Y|N/,
                    before: beforeBoolean,
                    type: 'string',
                    ask: () => collection === true,
                },
                {
                    name: 'collection.beforeDelete',
                    default: 'N',
                    description: `${chalk.white(
                        '   beforeDelete hook?',
                    )} ${chalk.cyan('(Y/N):')}`,
                    pattern: /^y|n|Y|N/,
                    before: beforeBoolean,
                    type: 'string',
                    ask: () => collection === true,
                },
                {
                    name: 'collection.beforeSave',
                    default: 'N',
                    description: `${chalk.white(
                        '   beforeSave hook?',
                    )} ${chalk.cyan('(Y/N):')}`,
                    pattern: /^y|n|Y|N/,
                    before: beforeBoolean,
                    type: 'string',
                    ask: () => collection === true,
                },
                {
                    name: 'collection.add',
                    default: 'N',
                    description: ` ${chalk.cyan('+')} ${chalk.white(
                        'Add Another Collection?',
                    )} ${chalk.cyan('(Y/N):')}`,
                    pattern: /^y|n|Y|N/,
                    before: beforeBoolean,
                    type: 'string',
                    ask: () => collection === true,
                },
            ],
            (err, input = {}) => {
                if (err) process.exit();

                if (op.get(input, 'add') === true) {
                    resolve({ collection: true });
                    return;
                }

                if (op.get(params, 'collection') === true) {
                    input = Object.keys(input).reduce((obj, key) => {
                        const val = input[key];
                        op.set(obj, key, val);
                        return obj;
                    }, {});

                    const { collection } = input;
                    const { collections } = params;
                    const { add, id } = collection;

                    const hooks = [
                        'afterDelete',
                        'afterFind',
                        'afterSave',
                        'beforeDelete',
                        'beforeSave',
                    ];

                    hooks.forEach((key, i) => {
                        if (op.get(collection, key) === true) {
                            op.push(params, key, {
                                collection: ID,
                                hook: String(ID).toLowerCase(),
                            });
                        }
                    });

                    const dels = _.flatten(['add'], hooks);
                    dels.forEach(key => op.del(collection, key));

                    collections.push(collection);

                    resolve({ collection: add, collections });
                    return;
                }

                resolve({});
            },
        );
    });

const INPUT_ROUTES = ({ params, props }) =>
    new Promise(resolve => {
        let { blueprints, route, routes = [] } = params;
        const { prompt } = props;

        const blueprint = blueprints.length < 1 ? undefined : blueprints[0].ID;
        const admin = blueprint ? op.get(blueprint, 'admin', false) : 'N';

        prompt.override = params;
        prompt.get(
            [
                {
                    name: 'add',
                    default: 'N',
                    description: `${chalk.white('Routes?')} ${chalk.cyan(
                        '(Y/N):',
                    )}`,
                    pattern: /^y|n|Y|N/,
                    before: beforeBoolean,
                    type: 'string',
                    ask: () => route !== true,
                },
                {
                    name: 'route.route',
                    description: chalk.white('   Route:'),
                    type: 'string',
                    ask: () => route === true,
                    conform: val => slugify(val, { lower: true }),
                },
                {
                    name: 'route.blueprint',
                    default: blueprint,
                    description: chalk.white('   Blueprint:'),
                    type: 'string',
                    ask: () => route === true,
                },
                {
                    name: 'route.capabilities',
                    description: chalk.white('   Capabilities:'),
                    type: 'string',
                    ask: () => route === true,
                    conform: val => parseArray(val),
                },
                {
                    name: 'route.admin',
                    default: admin === true ? 'Y' : 'N',
                    description: `${chalk.white('   Admin?')} ${chalk.cyan(
                        '(Y/N):',
                    )}`,
                    pattern: /^y|n|Y|N/,
                    before: beforeBoolean,
                    type: 'string',
                    ask: () => route === true,
                },
                {
                    name: 'route.builtIn',
                    default: params.builtIn === true ? 'Y' : 'N',
                    description: `${chalk.white('   Built-in?')} ${chalk.cyan(
                        '(Y/N):',
                    )}`,
                    pattern: /^y|n|Y|N/,
                    before: beforeBoolean,
                    type: 'string',
                    ask: () => route === true,
                },
                {
                    name: 'route.add',
                    default: 'N',
                    description: ` ${chalk.cyan('+')} ${chalk.white(
                        'Add Another Route?',
                    )} ${chalk.cyan('(Y/N):')}`,
                    pattern: /^y|n|Y|N/,
                    before: beforeBoolean,
                    type: 'string',
                    ask: () => route === true,
                },
            ],
            (err, input = {}) => {
                if (err) process.exit();

                if (op.get(input, 'add') === true) {
                    resolve({ route: true });
                    return;
                }

                if (op.get(params, 'route') === true) {
                    input = Object.keys(input).reduce((obj, key) => {
                        const val = input[key];
                        op.set(obj, key, val);
                        return obj;
                    }, {});

                    const { route } = input;
                    const { routes } = params;
                    const { add } = route;

                    op.del(route, 'add');

                    route.capabilities = JSON.stringify(
                        _.flatten([op.get(route, 'capabilities')]),
                    );

                    routes.push(route);

                    resolve({ route: add, routes });
                    return;
                }

                resolve({});
            },
        );
    });

const ACTION = async ({ opt, props }) => {
    let input = {};
    let params = FLAGS_TO_PARAMS({ opt });

    const arrays = [
        'afterDelete',
        'afterFind',
        'afterSave',
        'beforeDelete',
        'beforeSave',
        'blueprints',
        'collections',
        'routes',
    ];

    arrays.forEach(key => op.set(params, key, []));

    const { prompt } = props;

    input = await INPUT_ID({ params, props });
    params = { ...params, ...input };

    input = await INPUT_DEST({ params, props });
    params = { ...params, ...input };

    await INPUT_OVERWRITE({ params, props });

    input = await INPUT_META({ params, props });
    params = { ...params, ...input };

    input = await INPUT_COLLECTIONS({ params, props });
    params = { ...params, ...input };

    while (op.get(input, 'collection') === true) {
        input = await INPUT_COLLECTIONS({ params, props });
        params = { ...params, ...input };
    }

    input = await INPUT_BLUEPRINTS({ params, props });
    params = { ...params, ...input };

    while (op.get(input, 'blueprint') === true) {
        input = await INPUT_BLUEPRINTS({ params, props });
        params = { ...params, ...input };
    }

    input = await INPUT_ROUTES({ params, props });
    params = { ...params, ...input };

    while (op.get(input, 'route') === true) {
        input = await INPUT_ROUTES({ params, props });
        params = { ...params, ...input };
    }

    op.del(params, 'blueprint');
    op.del(params, 'collection');
    op.del(params, 'route');

    // cull empty arrays
    arrays.push('cloud');
    arrays.forEach(key => {
        if (op.get(params, key, []).length < 1) op.del(params, key);
    });

    await PREFLIGHT({ params, props });

    await INPUT_CONFIRM({ params, props });

    await GENERATOR({ params, props });

    process.exit();
};

const CONFORM = ({ input, props }) =>
    Object.keys(input).reduce((obj, key) => {
        let val = input[key];

        switch (key) {
            case 'ID':
                val = slugify(String(val));
                val = camelcase(val, { pascalCase: true });
                op.set(obj, key, val);
                break;

            case 'destination':
                val = parseDest(val, props);
                op.set(obj, key, val);
                break;

            case 'actiniumVersion':
            case 'pluginVersion':
                key = String(key).replace(/version/gi, '');
                op.set(obj, ['version', key], val);
                break;

            case 'cloud':
                val =
                    typeof val === 'string'
                        ? parseArray(val).map(item =>
                              String(item).toLowerCase(),
                          )
                        : val;

                op.set(obj, key, val);
                break;

            default:
                op.set(obj, key, val);
                break;
        }
        return obj;
    }, {});

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
            '-a, --actiniumVersion [actiniumVersion]',
            'Actinium semver that the plugin works with.',
        )
        .option(
            '-c, --cloud [cloud]',
            'Comma separated list of cloud functions.',
        )
        .option(
            '-d, --destination [destination]',
            'Plugin destination directory.',
        )
        .option('-i, --ID [ID]', 'Plugin ID.')
        .option('-n, --name [name]', 'Plugin name displayed in the Admin UI.')
        .option('-o, --overwrite [overwrite]', 'Overwrite existing plugin.')
        .option('-p, --pluginVersion [pluginVersion]', 'Plugin version number.')
        .option('-s, --sdk [sdk]', 'Add a domain to the Actinium SDK.')
        .option('--activate [activate]', 'Activate the plugin by default.')
        .option(
            '--builtIn [builtIn]',
            'Wheter the plugin is a built-in and can be un-installed.',
        )
        .option('--description [description]', 'Plugin description.')
        .on('--help', HELP);

/**
 * Module Constructor
 * @description Internal constructor of the module that is being exported.
 * @param program Class Commander.program reference.
 * @param props Object The CLI props passed from the calling class `arcli.js`.
 * @since 2.0.0
 */
module.exports = {
    COMMAND,
    NAME,
};
