const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('underscore');
const op = require('object-path');
const handlebars = require('handlebars').compile;

module.exports = spinner => {
    let cwd, destination;

    const message = (...text) => {
        if (spinner) {
            spinner.text = text.join(' ');
        }
    };

    const normalize = (...args) => path.normalize(path.join(...args));

    const generateFile = (template, file, context) =>
        fs.writeFileSync(
            file,
            handlebars(
                fs.readFileSync(
                    normalize(__dirname, 'template', template),
                    'utf-8',
                ),
            )(context),
        );

    return {
        init: ({ params, props }) => {
            cwd = op.get(props, 'cwd');
            destination = op.get(params, 'destination');
            fs.ensureDirSync(destination);
        },
        blueprint: ({ params }) => {
            if (!op.has(params, 'blueprints')) return;
            const file = normalize(destination, 'blueprints.js');
            message('Creating', chalk.cyan('blueprints'), 'file...');
            generateFile('blueprints.hbs', file, params);
        },
        schema: ({ params }) => {
            if (!op.has(params, 'collections')) return;
            const file = normalize(destination, 'schema.js');
            message('Creating', chalk.cyan('schema'), 'file...');
            generateFile('schema.hbs', file, params);
        },
        routes: ({ params }) => {
            if (!op.has(params, 'routes')) return;
            const file = normalize(destination, 'routes.js');
            message('Creating', chalk.cyan('routes'), 'file...');
            generateFile('routes.hbs', file, params);
        },
        sdk: ({ params }) => {
            if (!op.has(params, 'sdk')) return;
            const file = normalize(destination, 'sdk.js');
            message('Creating', chalk.cyan('sdk'), 'file...');
            generateFile('sdk.hbs', file, params);
        },
        package: ({ params }) => {
            const file = normalize(destination, 'package.json');
            message('Creating', chalk.cyan('package.json'), 'file...');
            generateFile('package.hbs', file, params);
        },
        plugin: ({ params }) => {
            const file = normalize(destination, 'plugin.js');
            message('Creating', chalk.cyan('plugin'), 'file...');
            generateFile('plugin.hbs', file, params);
        },
    };
};
