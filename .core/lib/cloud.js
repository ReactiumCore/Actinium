import path from 'path';
import chalk from 'chalk';
import { globbySync as globby } from '../lib/globby-patch.js';

const Cloud = { ...Parse.Cloud };

Cloud.info = () => {
    BOOT('');
    BOOT(chalk.cyan('Loading Cloud functions')); 

    CLOUD_FUNCTIONS.forEach(({ name }) => {
        if (!name) return;
        BOOT(chalk.cyan('  Cloud'), chalk.cyan('→'), chalk.magenta(name));
    });
};

Cloud.init = async () => {
    const output = [];
    const files = globby(ENV.GLOB_CLOUD);

    // Load cloud functions
    global.CLOUD_FUNCTIONS = await Promise.all(
        files.map((item) => {
            const p = path.normalize(item);
            const name = String(path.basename(item)).split('.').shift();

            output.push({ name, path: p });

            return import(p);
        }),
    );

    return output;
};

Cloud.define = (plugin, name, callback) => {
    if (!plugin || !name || !callback) {
        throw new Error(
            `Cloud.define(plugin, name, callback) all parameters required: ${
                (!!plugin, !!name, !!callback)
            }`,
        );
    }

    Parse.Cloud.define(name, (req) =>
        Actinium.Plugin.gate({ req, ID: plugin, name, callback }),
    );
    CLOUD_FUNCTIONS.push({ name });
};

export default Cloud;
