import { createDoc } from 'apidoc';

export default (spinner) => {
    const { _, chalk, globby, op, path } = arcli;

    const message = (text) => {
        if (spinner) {
            spinner.text = text;
        }
    };

    return {
        create: async ({ action, params }) => {
            message(`Creating ${chalk.cyan('docs')}...`);

            let { src, dest } = params;

            src = _.flatten(
                src.map((search) => {
                    if (search === 'node_modules/@atomic-reactor') {
                        const globRoot = path
                            .resolve(process.cwd(), search)
                            .replace(/\\/g, '/');

                        const globs = [
                            `${globRoot}/**/src/*.js`,
                            `${globRoot}/**/lib/*.js`,
                            `!${globRoot}/**/node_modules/**/*`,
                            `!${globRoot}/cli/**/*`,
                            `!${globRoot}/reactium-sdk-core/**/*`,
                        ];

                        return _.uniq(
                            globby(globs).map((fn) =>
                                path.dirname(fn).replace(globRoot, ''),
                            ),
                        ).map((p) => `${search}${p}`);
                    }
                    return search;
                }),
            );

            dest = String(dest).replace(/ /gi, '').split(',');
            dest = _.flatten([dest]);

            dest.forEach((d) => {
                createDoc({
                    src,
                    dest: d,
                    lineEnding: '\n',
                    debug: false,
                    verbose: op.get(params, 'verbose', false) === true,
                    silent: op.get(params, 'verbose', false) === false,
                });
            });

            return Promise.resolve({ action, status: 200 });
        },
    };
};
