/**
 * Use liberally for additional core configuration.
 * @type {Object}
 */
module.exports = {
    version: '3.7.13',
    semver: '^3.0.0',
    update: {
        package: {
            dependencies: {
                remove: [],
            },
            devDependencies: {
                add: { clipboardy: '^2.3.0' },
                remove: ['@atomic-reactor/cli', 'camelcase'],
            },
            scripts: {
                add: {
                    local: 'nodemon',
                    'plugin:install':
                        'npx -p @atomic-reactor/cli arcli install -s',
                },
                remove: ['local'],
            },
            actiniumDependencies: {
                add: {
                    '@atomic-reactor/actinium-block': '1.0.6',
                    '@atomic-reactor/actinium-blueprint': '1.0.7',
                    '@atomic-reactor/actinium-capability': '1.0.7',
                    '@atomic-reactor/actinium-component-manager': '1.0.7',
                    '@atomic-reactor/actinium-content': '1.0.20',
                    '@atomic-reactor/actinium-env': '1.0.7',
                    '@atomic-reactor/actinium-fs-adapter': '1.0.7',
                    '@atomic-reactor/actinium-io': '1.0.7',
                    '@atomic-reactor/actinium-mailer': '1.0.7',
                    '@atomic-reactor/actinium-media': '1.0.7',
                    '@atomic-reactor/actinium-plugin-manager': '1.0.7',
                    '@atomic-reactor/actinium-pulse': '1.0.7',
                    '@atomic-reactor/actinium-recycle': '1.0.7',
                    '@atomic-reactor/actinium-reset': '1.0.7',
                    '@atomic-reactor/actinium-roles': '1.0.7',
                    '@atomic-reactor/actinium-route': '1.0.7',
                    '@atomic-reactor/actinium-search': '1.0.7',
                    '@atomic-reactor/actinium-settings': '1.0.8',
                    '@atomic-reactor/actinium-shortcodes': '1.0.8',
                    '@atomic-reactor/actinium-syndicate': '1.0.7',
                    '@atomic-reactor/actinium-syndicate-client': '1.0.7',
                    '@atomic-reactor/actinium-taxonomy': '1.0.7',
                    '@atomic-reactor/actinium-type': '1.0.7',
                    '@atomic-reactor/actinium-users': '1.0.8',
                    '@atomic-reactor/actinium-wizard': '1.0.8',
                },
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
                    overwrite: true,
                    force: true,
                    version: '>=3.2.5',
                    destination: '/actinium_modules/.gitkeep',
                    source: '/tmp/update/actinium_modules/.gitkeep',
                },
                {
                    overwrite: true,
                    force: true,
                    version: '>=3.5.5',
                    destination: '/.npmrc',
                    source: '/tmp/update/.npmrc',
                },
                {
                    overwrite: true,
                    force: true,
                    version: '>=3.6.1',
                    destination: '/nodemon.json',
                    source: '/tmp/update/nodemon.json',
                },
                {
                    overwrite: true,
                    force: true,
                    version: '3.6.4',
                    destination: '/.gitignore',
                    source: '/tmp/update/.gitignore',
                },
                {
                    overwrite: true,
                    version: '>=3.6.6',
                    destination: '/Dockerfile',
                    source: '/tmp/update/Dockerfile',
                },
                {
                    overwrite: true,
                    version: '>=3.6.6',
                    destination: '/.dockerignore',
                    source: '/tmp/update/.dockerignore',
                },
            ],
            remove: [],
        },
    },
};
