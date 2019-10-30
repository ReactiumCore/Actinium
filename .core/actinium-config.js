const { version } = require('../package');

/**
 * Use liberally for additional core configuration.
 * @type {Object}
 */
module.exports = {
    version,
    semver: '^3.0.0',
    update: {
        package: {
            dependencies: {
                remove: [],
            },
            devDependencies: {
                remove: [],
            },
            scripts: {
                add: {},
                remove: [],
            },
        },
        files: {
            add: [
                {
                    overwrite: true,
                    version: '<=3.0.0',
                    destination: '/src/index.js',
                    source: '/tmp/update/src/index.js',
                },
                {
                    overwrite: false,
                    version: '>=3.0.1',
                    destination: '/src/index.js',
                    source: '/tmp/update/src/index.js',
                },
                {
                    overwrite: false,
                    version: '>=3.0.1',
                    destination: '/src/app/docs.js',
                    source: '/tmp/update/src/app/docs.js',
                },
            ],
            remove: [],
        },
    },
};
