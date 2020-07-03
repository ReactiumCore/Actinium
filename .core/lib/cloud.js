const path = require('path');
const chalk = require('chalk');
const globby = require('globby').sync;

const Cloud = { ...Parse.Cloud };

Cloud.info = () =>
    CLOUD_FUNCTIONS.forEach(({ name }) =>
        BOOT(chalk.cyan('  Cloud'), chalk.cyan('→'), chalk.magenta(name)),
    );

Cloud.init = () => {
    // Load cloud functions
    global.CLOUD_FUNCTIONS = globby(ENV.GLOB_CLOUD).map(item => {
        const p = path.normalize(item);
        const name = String(path.basename(item))
            .split('.')
            .shift();

        require(p);
        return { name };
    });
};

Cloud.define = (plugin, name, callback) => {
    Parse.Cloud.define(name, req =>
        Actinium.Plugin.gate({ req, ID: plugin, name, callback }),
    );
    CLOUD_FUNCTIONS.push({ name });
};

module.exports = Cloud;
