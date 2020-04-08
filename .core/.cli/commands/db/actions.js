const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('underscore');
const op = require('object-path');

module.exports = spinner => {
    const message = text => {
        if (spinner) {
            spinner.text = text;
        }
    };

    let cwd;
    let env;
    let fname;
    let pkg;

    return {
        init: ({ params, props }) => {
            fname =
                op.get(params, 'remote', false) === true
                    ? 'env.remote.json'
                    : 'env.json';

            cwd = op.get(props, 'cwd');
            env = path.normalize(
                _.compact([cwd, 'src', fname])
                    .join('/')
                    .replace(/\\/g, '/')
                    .replace(/\//g, path.sep),
            );
        },
        env: ({ params, props }) => {
            message(`Fetching ${chalk.cyan(fname)}...`);
            pkg = require(env);
        },
        update: ({ action, params, props }) => {
            message(`Updating ${chalk.cyan(fname)}...`);
            const { url } = params;

            op.set(pkg, 'DATABASE_URI', url);

            if (op.get(params, 'dev')) {
                fname = 'env.dev.json';
                env = path.normalize(
                    _.compact([cwd, 'src', fname])
                        .join('/')
                        .replace(/\\/g, '/')
                        .replace(/\//g, path.sep),
                );
            }

            fs.writeJsonSync(env, pkg);
        },
    };
};
