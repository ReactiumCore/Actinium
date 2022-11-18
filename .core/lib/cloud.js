import path from 'path';
import chalk from 'chalk';
import { globbySync as globby } from 'globby';

const Cloud = { ...Parse.Cloud };

Cloud.info = () =>
    CLOUD_FUNCTIONS.forEach(({ name }) =>
        BOOT(chalk.cyan('  Cloud'), chalk.cyan('→'), chalk.magenta(name)),
    );

Cloud.init = async () => {
    const output = [];
    const files = globby(ENV.GLOB_CLOUD);

    // Load cloud functions
    global.CLOUD_FUNCTIONS = await Promise.all(
        files.map((item) => {
            const p = path.normalize(item);
            const name = String(path.basename(item)).split('.').shift();

            output.push({ name });

            return import(p);
        }),
    );
    return output;
};

Cloud.define = (plugin, name, callback) => {
    Parse.Cloud.define(name, (req) =>
        Actinium.Plugin.gate({ req, ID: plugin, name, callback }),
    );
    CLOUD_FUNCTIONS.push({ name });
};

export default Cloud;
