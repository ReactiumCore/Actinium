require('./globals');

const http = require('http');
const chalk = require('chalk');
const op = require('object-path');
const express = require('express');
const config = require('./actinium-config');
const { ParseServer } = require('parse-server');

Actinium.ready = false;
Actinium.started = false;
Actinium.server = null;
Actinium.version = op.get(config, 'version', '3.1.1');
Actinium.Schema = Parse.Schema;
Actinium.Enums = require('./lib/enums');
Actinium.User = {};
Actinium.Exp = require('./lib/express-settings');
Actinium.Blueprint = require('./lib/blueprint');
Actinium.Cache = require('./lib/cache');
Actinium.FilesAdapter = require('./lib/files-adapter');
Actinium.File = require('./lib/file');
Actinium.Setting = require('./lib/setting');
Actinium.Roles = require('./lib/roles');
Actinium.Cloud = require('./lib/cloud');
Actinium.Hook = require('./lib/hook');
Actinium.Plugin = require('./lib/plugable');
Actinium.Warnings = require('./lib/warnings');
Actinium.Middleware = require('./lib/middleware');
Actinium.Pulse = require('./lib/pulse');
Actinium.Capability = require('./lib/capability');
Actinium.Collection = require('./lib/collection');

Actinium.init = async options => {
    console.log('');

    LOG(chalk.cyan('Version'), chalk.magenta(config.version));
    LOG('');
    LOG(chalk.cyan('Initializing...'));

    const app = Actinium.app || express();
    Actinium.app = app;

    // Initialize express settings
    Actinium.Exp.init(app, options);

    // Initialize Middlewares
    await Actinium.Middleware.init(app);

    // Initialize Plugins
    Actinium.Plugin.init();

    // Log cloud function info
    Actinium.Cloud.info();

    Actinium.ready = true;

    // Run init Hook
    await Actinium.Hook.run('init', app, options);

    LOG(' ', chalk.cyan('Initialized!'));

    return Promise.resolve(Actinium.app);
};

Actinium.start = options =>
    new Promise(async (resolve, reject) => {
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

            LOG('');
            LOG(chalk.cyan('Starting...'));

            Actinium.server = !Actinium.server
                ? http.createServer(Actinium.app)
                : Actinium.server;

            Actinium.server.listen(PORT, async err => {
                if (err) {
                    LOG(err);
                    reject(err);
                } else {
                    LOG(
                        chalk.cyan('  Started'),
                        'on port:',
                        chalk.magenta(PORT),
                    );

                    if (!ENV.NO_PARSE && ENV.LIVE_QUERY_SERVER) {
                        LOG(chalk.cyan('Starting Live Query Server...'));
                        ParseServer.createLiveQueryServer(Actinium.server);
                    }

                    Actinium.started = true;

                    // Load Settings
                    await Actinium.Setting.load();

                    // Load Plugins
                    await Actinium.Plugin.load();

                    // Load File Adapter
                    await Actinium.FilesAdapter.update();

                    // Init blueprints
                    await Actinium.Blueprint.init();

                    // Load User Roles
                    await Actinium.Roles.load();

                    // Load Capability
                    await Actinium.Capability.load();

                    // Load Collection Schemas
                    await Actinium.Collection.load();

                    // Run start-up hook
                    await Actinium.Hook.run('start');

                    // Run warnings hook
                    await Actinium.Warnings.run();

                    LOG('');

                    resolve(Actinium.server);
                }
            });
        } catch (err) {
            // Catch startup errors
            LOG(chalk.magenta('Actinium startup error.'));
            console.error(err);
            reject(err);
        }
    });

module.exports = Actinium;
