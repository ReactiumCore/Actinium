const chalk = require('chalk');
const CONFIRM = require('./confirm');
const { parseCaps } = require('./parsers');

const ROUTE = ({ inquirer }, params = {}, count = 0) => {
    count += 1;
    const prefix = arcli.prefix;
    const validate = val => !!val;
    const suffix = chalk.magenta(': ');

    console.log('');
    console.log(arcli.prefix, '------------------------------');
    // prettier-ignore
    console.log(arcli.prefix, chalk.bold('Route'), chalk.bold.magenta(count));
    console.log(arcli.prefix, '------------------------------');

    return inquirer.prompt(
        [
            {
                prefix,
                suffix,
                validate,
                name: 'route',
                message: 'Route',
                type: 'input',
            },
            {
                prefix,
                suffix,
                validate,
                type: 'input',
                name: 'blueprint',
                message: 'Blueprint',
            },
            {
                prefix,
                suffix,
                type: 'input',
                name: 'capabilities',
                message: 'Capabilities',
                filter: input => JSON.stringify(parseCaps(input)),
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
                message: 'Add another route?',
            },
        ],
        params,
    );
};

const ROUTES = async (props, params) => {
    const { confirm = params.routes } = await CONFIRM(props, {
        message: 'Routes?',
        when: !params.routes,
    });
    if (!confirm) return {};

    const routes = [];

    let route = await ROUTE(props, { builtIn: params.builtIn }, 0);

    let { more } = route;
    delete route.more;

    routes.push(route);

    while (more === true) {
        route = await ROUTE(
            props,
            {
                input: more,
                builtIn: params.builtIn,
            },
            routes.length,
        );
        more = route.more;
        delete route.more;

        routes.push(route);
    }

    return { routes };
};

module.exports = ROUTES;
