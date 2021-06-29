const chalk = require('chalk');
const CONFIRM = require('./confirm');

const BLUEPRINT = async ({ inquirer }, params = {}, count = 0) => {
    count += 1;
    const prefix = arcli.prefix;
    const validate = val => !!val;
    const suffix = chalk.magenta(': ');

    console.log('');
    console.log(arcli.prefix, '------------------------------');
    // prettier-ignore
    console.log(arcli.prefix, chalk.bold('Blueprint'), chalk.bold.magenta(count));
    console.log(arcli.prefix, '------------------------------');

    return inquirer.prompt(
        [
            {
                prefix,
                suffix,
                validate,
                name: 'ID',
                message: 'ID',
                type: 'input',
            },
            {
                prefix,
                suffix,
                validate,
                type: 'input',
                name: 'description',
                message: 'Description',
            },
            {
                prefix,
                suffix,
                validate,
                type: 'input',
                name: 'zone',
                message: 'Zone',
            },
            {
                prefix,
                suffix,
                validate,
                type: 'input',
                name: 'className',
                message: 'className',
            },
            {
                prefix,
                suffix,
                default: false,
                type: 'confirm',
                name: 'admin',
                message: 'Admin?',
            },
            {
                prefix,
                suffix,
                default: false,
                type: 'confirm',
                name: 'more',
                message: 'Add another blueprint?',
            },
        ],
        params,
    );
};

const BLUEPRINTS = async (props, params) => {
    const { confirm = params.blueprints } = await CONFIRM(props, {
        message: 'Blueprints?',
        when: !params.blueprints,
    });
    if (!confirm) return {};

    const blueprints = [];

    let blueprint = await BLUEPRINT(props, { builtIn: params.builtIn }, 0);

    let { more } = blueprint;
    delete blueprint.more;

    blueprints.push(blueprint);

    while (more === true) {
        blueprint = await BLUEPRINT(
            props,
            {
                input: more,
                builtIn: params.builtIn,
            },
            blueprints.length,
        );
        more = blueprint.more;
        delete blueprint.more;

        blueprints.push(blueprint);
    }

    return { blueprints };
};

module.exports = BLUEPRINTS;
