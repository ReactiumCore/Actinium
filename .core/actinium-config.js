/**
 * Use liberally for additional core configuration.
 * @type {Object}
 */
module.exports = {
    version: '3.2.10',
    semver: '^3.0.0',
    update: {
        package: {
            dependencies: {
                remove: [],
            },
            devDependencies: {
                remove: ['@atomic-reactor/cli', 'camelcase'],
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
                    version: '>=3.2.5',
                    destination: '/actinium_modules/.gitkeep',
                    source: '/tmp/update/actinium_modules/.gitkeep',
                },
            ],
            remove: [],
        },
    },
};
