const path = require('path');
const chalk = require('chalk');
const _ = require('underscore');
const globby = require('globby').sync;

const SDK = Actinium => {
    const Cloud = { ...Parse.Cloud, FUNCTIONS: null };

    Cloud.info = () =>
        Cloud.FUNCTIONS.forEach(({ name }) =>
            BOOT(chalk.cyan('  Cloud'), chalk.cyan('→'), chalk.magenta(name)),
        );

    Cloud.init = () => {
        // Load cloud functions
        Cloud.FUNCTIONS = globby(Actinium.options.GLOB_CLOUD).map(item => {
            const p = path.normalize(item);
            const name = String(path.basename(item))
                .split('.')
                .shift();

            const r = require(p);

            if (_.isFunction(r)) r(Actinium);

            return { name };
        });
    };

    Cloud.define = (plugin, name, callback) => {
        Parse.Cloud.define(name, req =>
            Actinium.Plugin.gate({ req, ID: plugin, name, callback }),
        );
        Cloud.FUNCTIONS.push({ name });
    };

    return Cloud;
};

module.exports = SDK;
