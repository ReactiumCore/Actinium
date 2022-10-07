require('./globals');

const chalk = require('chalk');
const op = require('object-path');
const express = require('express');
const config = require('./actinium-config');

class Actinium {
    constructor(initialOptions = {}) {
        this.__app = null;
        this.__options = { ...ENV, ...initialOptions };
        this.__ready = false;
        this.__started = false;
        this.__server = null;

        Object.entries(Parse).forEach(([k, v]) => {
            this[k] = v;
        });

        this.Utils = require('./lib/utils')(this);
        this.Hook = require('./lib/hook')(this);
        this.Object = require('./lib/ParseObject')(this);
        this.User = require('./lib/user')(this);
        this.Harness = require('./lib/harness')(this);
        this.Enums = require('./lib/enums');
        this.Exp = require('./lib/express-settings')(this);
        this.Cache = require('./lib/cache');
        this.FilesAdapter = require('./lib/files-adapter')(this);
        this.File = require('./lib/file')(this);
        this.Setting = require('./lib/setting')(this);
        this.Roles = require('./lib/roles')(this);
        this.Cloud = require('./lib/cloud')(this);
        this.Plugin = require('./lib/plugable')(this);
        this.Warnings = require('./lib/warnings')(this);
        this.Middleware = require('./lib/middleware')(this);
        this.Pulse = require('./lib/pulse')(this);
        this.Capability = require('./lib/capability')(this);
        this.Collection = require('./lib/collection')(this);
        this.Type = require('./lib/type')(this);
    }

    get options() {
        return this.__options;
    }

    get setOption() {
        return (key, value) => {
            op.set(this.__options, key, value);
            return this;
        };
    }

    get setOptions() {
        return (value = {}, merge) => {
            const obj = merge !== false ? { ...this.options, ...value } : value;
            this.__options = obj;
            return this;
        };
    }

    get ready() {
        return this.__ready;
    }

    get setReady() {
        return () => {
            this.__ready = true;
            return this;
        };
    }

    get started() {
        return this.__started;
    }

    get setStarted() {
        return () => {
            this.__started = true;
            return this;
        };
    }

    get server() {
        return this.__server;
    }

    get setServer() {
        return value => {
            this.__server = value;
            return this;
        };
    }

    get app() {
        return this.__app;
    }

    get setApp() {
        return value => {
            this.__app = value;
            return this;
        };
    }

    get init() {
        return async (options = {}) => {
            BOOT('');
            BOOT(chalk.cyan('Version'), chalk.magenta(config.version));
            BOOT('');
            BOOT(chalk.cyan('Initializing...'));

            if (this.app === null) {
                const exp = express();
                this.setApp(exp);
            }

            const app = this.app;

            // // Initialize express settings
            this.Exp.init(app, options);

            // // Initialize Middlewares
            await this.Middleware.init(app);

            // // Initialize Plugins
            this.Plugin.init();

            this.setReady();

            // // Log cloud function info
            this.Cloud.info();

            // // Run init Hook
            await this.Hook.run('init', app, options);

            // Run live-query-classnames hook
            await this.Hook.run(
                'live-query-classnames',
                op.get(this.options.LIVE_QUERY_SETTINGS, 'classNames', []),
            );

            BOOT(' ');
            BOOT(' ', chalk.cyan('Initialized!'));
            BOOT(' ');

            return Promise.resolve(app);
        };
    }

    get start() {
        return (options = {}) =>
            new Promise(async (resolve, reject) => {
                // Skip all this if Actinium.start() has already been successfully run
                if (this.started === true && this.server !== null) {
                    resolve(this.server);
                    return;
                }

                const P = op.get(options, 'port', this.options.PORT);

                if (P < 1024) {
                    if (process.platform === 'win32') {
                        reject(
                            `PORT ${P} is not allowed on windows. Choose something >= 1024.`,
                        );
                        return;
                    }

                    if (!process.getuid || process.getuid() !== 0) {
                        reject(
                            `Node must be started with root user to allow PORT ${P}.`,
                        );
                        return;
                    }
                }

                try {
                    // Hold up.. make sure we're initialized
                    if (this.ready !== true) {
                        await this.init(options);
                    }

                    this.Pulse.info();

                    BOOT(chalk.cyan('Starting...'));

                    DEBUG({
                        TLS_MODE: this.options.TLS_MODE,
                        APP_TLS_CERT_FILE: this.options.APP_TLS_CERT_FILE,
                        APP_TLS_KEY_FILE: this.options.APP_TLS_KEY_FILE,
                        APP_TLS_CERT: this.options.APP_TLS_CERT,
                        APP_TLS_KEY: this.options.APP_TLS_KEY,
                    });

                    /*
                    this.server = !this.server
                        ? this.options.TLS_MODE
                            ? https.createServer(
                                  {
                                      cert: this.options.APP_TLS_CERT,
                                      key: this.options.APP_TLS_KEY,
                                  },
                                  this.app,
                              )
                            : http.createServer(this.app)
                        : this.server;

                    this.server.listen(P, async err => {
                        if (err) {
                            BOOT(err);
                            reject(err);
                        } else {
                            const tlsMsg = this.options.TLS_MODE
                                ? chalk.green('[TLS MODE]')
                                : chalk.yellow('[PLAIN TEXT]');

                            BOOT(
                                chalk.cyan('  Started'),
                                `in ${tlsMsg} on port:`,
                                chalk.magenta(P),
                            );

                            if (this.options.TLS_MODE) {
                                BOOT();
                            }

                            if (process.getuid && process.getuid() === 0) {
                                if (
                                    !this.options.ACTINIUM_RUN_AS ||
                                    !this.options.ACTINIUM_RUN_AS_GROUP
                                ) {
                                    ERROR(
                                        'You must specify by ACTINIUM_RUN_AS and ACTINIUM_RUN_AS_GROUP to start actinium as root user.',
                                    );
                                    process.exit(1);
                                }
                                try {
                                    process.initgroups(
                                        this.options.ACTINIUM_RUN_AS,
                                        this.options.ACTINIUM_RUN_AS_GROUP,
                                    );
                                } catch (error) {
                                    ERROR('Error lowering permissions.', error);
                                    process.exit(1);
                                }
                            }

                            if (!this.options.NO_PARSE && this.options.LIVE_QUERY_SERVER) {
                                BOOT(' ');
                                BOOT(
                                    chalk.cyan('Starting Live Query Server...'),
                                );
                                await ParseServer.createLiveQueryServer(
                                    this.server,
                                );
                                BOOT(
                                    ' ',
                                    chalk.cyan('Started'),
                                    'Live Query Server',
                                );
                            }

                            this.started = true;

                            // Load Settings
                            await this.Setting.load();

                            // Load Plugins
                            await this.Plugin.load();

                            // Load File Adapter
                            this.FilesAdapter.getProxy().bootMessage();

                            // Load User Roles
                            await this.Roles.load();

                            // Load Capability
                            await this.Capability.load(false, 'boot');

                            // Runtime schema initialization
                            await this.Hook.run('schema', {}, {});

                            // Load Collection Schemas
                            await this.Collection.load();

                            // Run start-up hook
                            await this.Hook.run('start');

                            // Run tests in local development
                            await this.Harness.run();

                            // Run warnings hook
                            await this.Warnings.run();

                            BOOT('');
                            BOOT('');
                            BOOT(
                                chalk.cyan.bold('Actinium'),
                                chalk.bold('bootstrap complete!'),
                            );
                            BOOT('');

                            this.running = true;
                            await this.Hook.run('running');

                            BOOT('');
                            resolve(this.server);
                        }
                    });
                    */
                } catch (err) {
                    // Catch startup errors
                    ERROR(chalk.magenta('Actinium startup error.'));
                    ERROR(err);
                    reject(err);
                }
            });
    }
}

Actinium.version = op.get(config, 'version');

process.on('unhandledRejection', (reason, p) => {
    ERROR('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

module.exports = Actinium;
