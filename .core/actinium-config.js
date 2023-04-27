/**
 * Use liberally for additional core configuration.
 * @type {Object}
 */
export default {
    version: '5.1.2',
    semver: '^5.0.0',
    update: {
        package: {
            dependencies: {
                add: { 'parse-server': '^6.1.0-alpha.7' },
                remove: [],
            },
            devDependencies: {
                add: { clipboardy: '^2.3.0' },
                remove: ['@atomic-reactor/cli', 'camelcase'],
            },
            scripts: {
                add: {
                    'plugin:install': 'npx reactium install',
                },
                remove: [],
            },
            actiniumDependencies: {
                add: {
                    '@atomic-reactor/actinium-capability': '5.0.1',
                    '@atomic-reactor/actinium-component-manager': '5.0.1',
                    '@atomic-reactor/actinium-content': '5.1.1',
                    '@atomic-reactor/actinium-env': '5.0.1',
                    '@atomic-reactor/actinium-fs-adapter': '5.0.1',
                    '@atomic-reactor/actinium-io': '5.0.1',
                    '@atomic-reactor/actinium-mailer': '5.0.1',
                    '@atomic-reactor/actinium-plugin-manager': '5.0.1',
                    '@atomic-reactor/actinium-pulse': '5.0.1',
                    '@atomic-reactor/actinium-recycle': '5.0.1',
                    '@atomic-reactor/actinium-reset': '5.0.1',
                    '@atomic-reactor/actinium-roles': '5.0.1',
                    '@atomic-reactor/actinium-route': '5.0.1',
                    '@atomic-reactor/actinium-search': '5.0.1',
                    '@atomic-reactor/actinium-settings': '5.0.1',
                    '@atomic-reactor/actinium-taxonomy': '5.0.1',
                    '@atomic-reactor/actinium-type': '5.0.1',
                    '@atomic-reactor/actinium-users': '5.0.1',
                },
                remove: [
                    '@actinium-reactor/actinium-media',
                    '@atomic-reactor/actinium-blueprint',
                ],
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
