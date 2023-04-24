import './globals.js';
import http from 'node:http';
import https from 'node:https';
import chalk from 'chalk';
import op from 'object-path';
import express from 'express';
import config from './actinium-config.js';
import { ParseServer } from 'parse-server';
import ActiniumHook from './lib/hook.js';
import ActiniumObject from './lib/ParseObject/index.js';
import ActiniumUser from './lib/user.js';
import ActiniumHarness from './lib/harness.js';
import ActiniumEnums from './lib/enums.js';
import ActiniumExp from './lib/express-settings.js';
import ActiniumCache from './lib/cache.js';
import ActiniumFileAdapter from './lib/files-adapter.js';
import ActiniumFile from './lib/file.js';
import ActiniumPlugin from './lib/plugable.js';
import ActiniumSetting from './lib/setting.js';
import ActiniumRoles from './lib/roles.js';
import ActiniumCloud from './lib/cloud.js';
import ActiniumCapabilities from './lib/capability.js';
import ActiniumWarnings from './lib/warnings.js';
import ActiniumMiddleware from './lib/middleware.js';
import ActiniumPulse from './lib/pulse.js';
import ActiniumCollection from './lib/collection.js';
import * as ActiniumUtils from './lib/utils/index.js';
import ActiniumType from './lib/type/index.js';

process.on('unhandledRejection', (reason, p) => {
    ERROR('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

Actinium = { ...Parse };

Actinium.init = async (options) => {
    BOOT('');
    BOOT(chalk.cyan('Version'), chalk.magenta(config.version));
    BOOT('');
    BOOT(chalk.cyan('Initializing...'));

    Actinium.ready = false;
    Actinium.started = false;
    Actinium.server = null;
    Actinium.version = op.get(config, 'version');
    Actinium.Utils = ActiniumUtils;
    Actinium.Hook = ActiniumHook;
    Actinium.Object = ActiniumObject;
    Actinium.User = ActiniumUser;
    Actinium.Harness = ActiniumHarness;
    Actinium.Enums = ActiniumEnums;
    Actinium.Exp = ActiniumExp;
    Actinium.Cache = ActiniumCache;
    Actinium.FilesAdapter = ActiniumFileAdapter;
    Actinium.File = ActiniumFile;
    Actinium.Setting = ActiniumSetting;
    Actinium.Roles = ActiniumRoles;
    Actinium.Cloud = ActiniumCloud;
    await Actinium.Cloud.init(); 
    
    Actinium.Plugin = ActiniumPlugin;
    Actinium.Warnings = ActiniumWarnings;
    Actinium.Middleware = ActiniumMiddleware;
    Actinium.Pulse = ActiniumPulse;
    Actinium.Collection = ActiniumCollection;
    Actinium.Type = ActiniumType;

    Actinium.Capability = ActiniumCapabilities();

    // Cross Alias functions
    Actinium.User.isRole = Actinium.Roles.User.is;
    Actinium.User.can = Actinium.Capability.User.can;
    Actinium.User.capabilities = Actinium.Capability.User.get;
    Actinium.Roles.can = Actinium.Capability.Role.can;
    Actinium.Roles.capabilities = Actinium.Capability.Role.get;

    const app = Actinium.app || express();
    Actinium.app = app;

    // Initialize express settings
    Actinium.Exp.init(app, options);

    // Initialize Middlewares
    await Actinium.Middleware.init(app);

    // Initialize Plugins
    await Actinium.Plugin.init();

    // Initialize FileAdapter
    await Actinium.FilesAdapter.init();

    // Initialize Settings
    Actinium.Setting.init();

    // Initialize Type
    Actinium.Type.init();

    Actinium.ready = true;

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

Actinium.start = (options) =>
    new Promise(async (resolve, reject) => {
        if (PORT < 1024) {
            if (process.platform === 'win32') {
                reject(
                    `PORT ${PORT} is not allowed on windows. Choose something >= 1024.`,
                );
                return;
            }

            if (!process.getuid || process.getuid() !== 0) {
                reject(
                    `Node must be started with root user to allow PORT ${PORT}.`,
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

            Actinium.server.listen(PORT, async (err) => {
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
                        chalk.magenta(PORT),
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

                    // Log cloud function info
                    Actinium.Cloud.info();

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

export default Actinium;
