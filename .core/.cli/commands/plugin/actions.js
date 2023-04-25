export default (spinner) => {
    // prettier-ignore
    const { _, chalk, fileURLToPath, fs, handlebars, normalizePath, op, path } = arcli;

    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    let destination;

    const message = (...text) => {
        if (spinner) {
            spinner.text = text.join(' ');
        }
    };

    const generateFile = (template, file, context) =>
        fs.writeFileSync(
            file,
            handlebars.compile(
                fs.readFileSync(
                    normalizePath(__dirname, 'template', template),
                    'utf-8',
                ),
            )(context),
        );

    return {
        init: ({ params, props }) => {
            destination = op.get(params, 'destination');
            fs.ensureDirSync(destination);
        },
        blueprint: ({ params }) => {
            if (!op.has(params, 'blueprints')) return;
            const file = normalizePath(destination, 'blueprints.js');
            message('Creating', chalk.cyan('blueprints'), 'file...');
            generateFile('blueprints.hbs', file, params);
        },
        schema: ({ params }) => {
            if (!op.has(params, 'collections')) return;
            const file = normalizePath(destination, 'schema.js');
            message('Creating', chalk.cyan('schema'), 'file...');
            generateFile('schema.hbs', file, params);
        },
        routes: ({ params }) => {
            if (!op.has(params, 'routes')) return;
            const file = normalizePath(destination, 'routes.js');
            message('Creating', chalk.cyan('routes'), 'file...');
            generateFile('routes.hbs', file, params);
        },
        sdk: ({ params }) => {
            if (!op.has(params, 'sdk')) return;
            const file = normalizePath(destination, 'sdk.js');
            message('Creating', chalk.cyan('sdk'), 'file...');
            generateFile('sdk.hbs', file, params);
        },
        package: ({ params }) => {
            const file = normalizePath(destination, 'package.json');
            message('Creating', chalk.cyan('package.json'), 'file...');
            generateFile('package.hbs', file, params);
        },
        plugin: ({ params }) => {
            const file = normalizePath(destination, 'plugin.js');
            message('Creating', chalk.cyan('plugin'), 'file...');
            generateFile('plugin.hbs', file, params);
        },
    };
};
