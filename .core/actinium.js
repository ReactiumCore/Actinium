require('./globals');

const http = require('http');
const https = require('https');
const chalk = require('chalk');
const op = require('object-path');
const express = require('express');
const config = require('./actinium-config');
const { ParseServer } = require('parse-server');

// Actinium = { ...Parse };
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
                    Actinium.server = !Actinium.server
                        ? ENV.TLS_MODE
                            ? https.createServer(
                                  {
                                      cert: ENV.APP_TLS_CERT,
                                      key: ENV.APP_TLS_KEY,
                                  },
                                  Actinium.app,
                              )
                            : http.createServer(Actinium.app)
                        : Actinium.server;

                    Actinium.server.listen(P, async err => {
                        if (err) {
                            BOOT(err);
                            reject(err);
                        } else {
                            const tlsMsg = ENV.TLS_MODE
                                ? chalk.green('[TLS MODE]')
                                : chalk.yellow('[PLAIN TEXT]');

                            BOOT(
                                chalk.cyan('  Started'),
                                `in ${tlsMsg} on port:`,
                                chalk.magenta(P),
                            );

                            if (ENV.TLS_MODE) {
                                BOOT();
                            }

                            if (process.getuid && process.getuid() === 0) {
                                if (
                                    !ENV.ACTINIUM_RUN_AS ||
                                    !ENV.ACTINIUM_RUN_AS_GROUP
                                ) {
                                    ERROR(
                                        'You must specify by ACTINIUM_RUN_AS and ACTINIUM_RUN_AS_GROUP to start actinium as root user.',
                                    );
                                    process.exit(1);
                                }
                                try {
                                    process.initgroups(
                                        ENV.ACTINIUM_RUN_AS,
                                        ENV.ACTINIUM_RUN_AS_GROUP,
                                    );
                                } catch (error) {
                                    ERROR('Error lowering permissions.', error);
                                    process.exit(1);
                                }
                            }

                            if (!ENV.NO_PARSE && ENV.LIVE_QUERY_SERVER) {
                                BOOT(' ');
                                BOOT(
                                    chalk.cyan('Starting Live Query Server...'),
                                );
                                await ParseServer.createLiveQueryServer(
                                    Actinium.server,
                                );
                                BOOT(
                                    ' ',
                                    chalk.cyan('Started'),
                                    'Live Query Server',
                                );
                            }

                            Actinium.started = true;

                            // Load Settings
                            await Actinium.Setting.load();

                            // Load Plugins
                            await Actinium.Plugin.load();

                            // Load File Adapter
                            Actinium.FilesAdapter.getProxy().bootMessage();

                            // Load User Roles
                            await Actinium.Roles.load();

                            // Load Capability
                            await Actinium.Capability.load(false, 'boot');

                            // Runtime schema initialization
                            await Actinium.Hook.run('schema', {}, {});

                            // Load Collection Schemas
                            await Actinium.Collection.load();

                            // Run start-up hook
                            await Actinium.Hook.run('start');

                            // Run tests in local development
                            await Actinium.Harness.run();

                            // Run warnings hook
                            await Actinium.Warnings.run();

                            BOOT('');
                            BOOT('');
                            BOOT(
                                chalk.cyan.bold('Actinium'),
                                chalk.bold('bootstrap complete!'),
                            );
                            BOOT('');

                            Actinium.running = true;
                            await Actinium.Hook.run('running');

                            BOOT('');
                            resolve(Actinium.server);
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
// Actinium.Object = require('./lib/ParseObject');
// Actinium.User = require('./lib/user');
// Actinium.Harness = require('./lib/harness');
// Actinium.Enums = require('./lib/enums');
// Actinium.Exp = require('./lib/express-settings');
// Actinium.Cache = require('./lib/cache');
// Actinium.FilesAdapter = require('./lib/files-adapter');
// Actinium.File = require('./lib/file');
// Actinium.Setting = require('./lib/setting');
// Actinium.Roles = require('./lib/roles');
// Actinium.Cloud = require('./lib/cloud');
// Actinium.Hook = require('./lib/hook');
// Actinium.Plugin = require('./lib/plugable');
// Actinium.Warnings = require('./lib/warnings');
// Actinium.Middleware = require('./lib/middleware');
// Actinium.Pulse = require('./lib/pulse');
// Actinium.Capability = require('./lib/capability');
// Actinium.Collection = require('./lib/collection');
// Actinium.Utils = require('./lib/utils');
// Actinium.Type = require('./lib/type');

/*
Actinium.init = async options => {
    BOOT('');
    BOOT(chalk.cyan('Version'), chalk.magenta(config.version));
    BOOT('');
    BOOT(chalk.cyan('Initializing...'));

    const app = Actinium.app || express();
    Actinium.app = app;

    // Initialize express settings
    Actinium.Exp.init(app, options);

    // Initialize Middlewares
    await Actinium.Middleware.init(app);

    // Initialize Plugins
    Actinium.Plugin.init();

    Actinium.ready = true;

    // Log cloud function info
    Actinium.Cloud.info();

    // Run init Hook
    await Actinium.Hook.run('init', app, options);

    // Run live-query-classnames hook
    await Actinium.Hook.run(
        'live-query-classnames',
        op.get(ENV.LIVE_QUERY_SETTINGS, 'classNames', []),
    );

    BOOT(' ');
    BOOT(' ', chalk.cyan('Initialized!'));
    BOOT(' ');

    return Promise.resolve(Actinium.app);
};
*/

/*
Actinium.start = (options = {}) =>
    new Promise(async (resolve, reject) => {
        const P = op.get(options, 'port', PORT);

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
            // Skip all this if Actinium.start() has already been successfully run
            if (Actinium.started === true && Actinium.server !== null) {
                resolve(Actinium.server);
                return;
            }

            // Hold up.. make sure we're initialized
            if (Actinium.ready !== true) {
                await Actinium.init(options);
            }

            Actinium.Pulse.info();

            BOOT(chalk.cyan('Starting...'));

            DEBUG({
                TLS_MODE: ENV.TLS_MODE,
                APP_TLS_CERT_FILE: ENV.APP_TLS_CERT_FILE,
                APP_TLS_KEY_FILE: ENV.APP_TLS_KEY_FILE,
                APP_TLS_CERT: ENV.APP_TLS_CERT,
                APP_TLS_KEY: ENV.APP_TLS_KEY,
            });

            Actinium.server = !Actinium.server
                ? ENV.TLS_MODE
                    ? https.createServer(
                          {
                              cert: ENV.APP_TLS_CERT,
                              key: ENV.APP_TLS_KEY,
                          },
                          Actinium.app,
                      )
                    : http.createServer(Actinium.app)
                : Actinium.server;

            Actinium.server.listen(P, async err => {
                if (err) {
                    BOOT(err);
                    reject(err);
                } else {
                    const tlsMsg = ENV.TLS_MODE
                        ? chalk.green('[TLS MODE]')
                        : chalk.yellow('[PLAIN TEXT]');

                    BOOT(
                        chalk.cyan('  Started'),
                        `in ${tlsMsg} on port:`,
                        chalk.magenta(P),
                    );

                    if (ENV.TLS_MODE) {
                        BOOT();
                    }

                    if (process.getuid && process.getuid() === 0) {
                        if (
                            !ENV.ACTINIUM_RUN_AS ||
                            !ENV.ACTINIUM_RUN_AS_GROUP
                        ) {
                            ERROR(
                                'You must specify by ACTINIUM_RUN_AS and ACTINIUM_RUN_AS_GROUP to start actinium as root user.',
                            );
                            process.exit(1);
                        }
                        try {
                            process.initgroups(
                                ENV.ACTINIUM_RUN_AS,
                                ENV.ACTINIUM_RUN_AS_GROUP,
                            );
                        } catch (error) {
                            ERROR('Error lowering permissions.', error);
                            process.exit(1);
                        }
                    }

                    if (!ENV.NO_PARSE && ENV.LIVE_QUERY_SERVER) {
                        BOOT(' ');
                        BOOT(chalk.cyan('Starting Live Query Server...'));
                        await ParseServer.createLiveQueryServer(
                            Actinium.server,
                        );
                        BOOT(' ', chalk.cyan('Started'), 'Live Query Server');
                    }

                    Actinium.started = true;

                    // Load Settings
                    await Actinium.Setting.load();

                    // Load Plugins
                    await Actinium.Plugin.load();

                    // Load File Adapter
                    Actinium.FilesAdapter.getProxy().bootMessage();

                    // Load User Roles
                    await Actinium.Roles.load();

                    // Load Capability
                    await Actinium.Capability.load(false, 'boot');

                    // Runtime schema initialization
                    await Actinium.Hook.run('schema', {}, {});

                    // Load Collection Schemas
                    await Actinium.Collection.load();

                    // Run start-up hook
                    await Actinium.Hook.run('start');

                    // Run tests in local development
                    await Actinium.Harness.run();

                    // Run warnings hook
                    await Actinium.Warnings.run();

                    BOOT('');
                    BOOT('');
                    BOOT(
                        chalk.cyan.bold('Actinium'),
                        chalk.bold('bootstrap complete!'),
                    );
                    BOOT('');

                    Actinium.running = true;
                    await Actinium.Hook.run('running');

                    BOOT('');
                    resolve(Actinium.server);
                }
            });
        } catch (err) {
            // Catch startup errors
            ERROR(chalk.magenta('Actinium startup error.'));
            ERROR(err);
            reject(err);
        }
    });
*/

process.on('unhandledRejection', (reason, p) => {
    ERROR('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

module.exports = Actinium;
