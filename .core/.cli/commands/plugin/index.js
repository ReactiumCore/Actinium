/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */

import generator from './generator.js';

import DEST from './utils/dest.js';
import ROUTES from './utils/routes.js';
import CONFIRM from './utils/confirm.js';
import CONFORM from './utils/conform.js';
import TOGGLES from './utils/toggles.js';
import TEXTS from './utils/text-inputs.js';
import COLLECTIONS from './utils/collections.js';
import { parseArray } from './utils/parsers.js';

const { chalk, message, op } = arcli;

const NAME = 'plugin';
const CANCELED = 'Plugin canceled!';
const DESC = 'Create an Actinium plugin';

const HELP = () =>
    console.log(`
Example:
  $ arcli plugin -h
`);

const PREFLIGHT = ({ params, props }) => {
    const inputs = { ...params };
    if (inputs.cloud) {
        inputs.cloud = parseArray(inputs.cloud);
    }

    // prettier-ignore
    message('An Actinium Plugin will be created from the following configuration:');
    console.log(String(JSON.stringify(inputs, null, 2)).replace(/\\"/g, "'"));
};

const flags = [
    'ID',
    'actiniumVersion',
    'activate',
    'builtIn',
    'cloud',
    'collections',
    'description',
    'destination',
    'name',
    'pluginVersion',
    'routes',
    'sdk',
];

const PLUGINID = (props) =>
    props.inquirer.prompt([
        {
            name: 'ID',
            type: 'input',
            message: 'Plugin ID',
            prefix: arcli.prefix,
            suffix: chalk.magenta(': '),
        },
    ]);

const ACTION = async ({ opt, props }) => {
    let params = arcli.flagsToParams({ opt, flags });

    // Version
    params.version = {
        actinium: op.get(params, 'actiniumVersion'),
        plugin: op.get(params, 'pluginVersion'),
    };

    // inputs
    if (!params.ID) {
        const { ID } = await PLUGINID(props);
        params.ID = ID;
    }

    const { destination, overwrite } = await DEST(props, params);
    if (overwrite === false) return message(CANCELED);

    params.destination = destination;

    const { actinium, reactium, plugin, ...texts } = await TEXTS(props, params);
    Object.entries(texts).forEach(([key, val]) => (params[key] = val));
    params.version = { actinium, plugin, reactium };

    await TOGGLES(props, params).then((values) =>
        Object.entries(values).forEach(([key, val]) => (params[key] = val)),
    );

    // routes
    const { routes } = await ROUTES(props, params);
    params.routes = routes;

    // collections
    const {
        afterFind,
        afterSave,
        afterDelete,
        beforeSave,
        beforeDelete,
        collections,
    } = await COLLECTIONS(props, params);

    params.afterFind = afterFind;
    params.afterDelete = afterDelete;
    params.afterSave = afterSave;
    params.beforeDelete = beforeDelete;
    params.beforeSave = beforeSave;
    params.collections = collections;

    // preflight message
    PREFLIGHT({ params, props });

    // prep params object
    params = CONFORM(params, props);

    // confirm operation
    const { confirm } = await CONFIRM(props);
    if (!confirm) return message(CANCELED);

    // Execute
    // prettier-ignore
    return generator({ params, props }).catch(err => message(op.get(err, 'message', CANCELED)));
};

const COMMAND = ({ program, props }) =>
    program
        .command(NAME)
        .description(DESC)
        .action((opt) => ACTION({ opt, props }))
        .option(
            '-a, --actiniumVersion [actiniumVersion]',
            'Compatible Actinium semver.',
        )
        .option('-d, --dest [destination]', 'Plugin destination directory.')
        .option('-i, --ID [ID]', 'Plugin ID.')
        .option('-n, --name [name]', 'Plugin name displayed in the Admin UI.')
        .option('-o, --overwrite [overwrite]', 'Overwrite existing plugin.')
        .option('-p, --pluginVersion [pluginVersion]', 'Plugin version number.')
        .option('-s, --sdk [sdk]', 'Add a domain to the Actinium SDK.')
        .option('--activate [activate]', 'Activate the plugin by default.')
        .option('--builtIn [builtIn]', 'Disable uninstallation of the plugin.')
        .option('--cloud [cloud]', 'Include cloud functions.')
        .option('--collections [collections]', 'Include collections file.')
        .option('--description [description]', 'Plugin description.')
        .option('--routes [routes]', 'Include the routes file.')
        .on('--help', HELP);

export { COMMAND, NAME };
