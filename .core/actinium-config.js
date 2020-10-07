/**
 * Use liberally for additional core configuration.
 * @type {Object}
 */
module.exports = {
    version: '3.6.1',
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
                add: {
                    local: 'npm run docs && nodemon',
                },
                remove: ['local'],
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
                {
                    overwrite: false,
                    version: '>=3.5.5',
                    destination: '/.npmrc',
                    source: '/tmp/update/.npmrc',
                },
                {
                    overwrite: true,
                    version: '>=3.6.1',
                    destination: '/nodemon.json',
                    source: '/tmp/update/nodemon.json',
                },
            ],
            remove: [],
        },
    },
};
