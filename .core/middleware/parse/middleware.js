const op = require('object-path');
const express = require('express');
const { ParseServer } = require('parse-server');
const ParseDashboard = require('parse-dashboard');

module.exports = Actinium => {
    const FileAdapter = require(ACTINIUM_DIR + '/lib/files-adapter')(Actinium);

    const parseConfig = () => {
        const config = {
            appId: Actinium.options.APP_ID,
            appName: Actinium.options.APP_NAME,
            masterKey: Actinium.options.MASTER_KEY,
            sessionLength: 31536000000,
            databaseURI: Actinium.options.DATABASE_URI,
            cloud: ACTINIUM_DIR + '/cloud.js',
            serverURL:
                Actinium.options.SERVER_URI + Actinium.options.PARSE_MOUNT,
            publicServerURL:
                Actinium.options.PUBLIC_SERVER_URI +
                Actinium.options.PARSE_MOUNT,
            allowClientClassCreation:
                Actinium.options.PARSE_ALLOW_CLIENT_CLASS_CREATION,
            preserveFileName: Actinium.options.PARSE_PRESERVE_FILENAME,
            directAccess: Actinium.options.PARSE_FILES_DIRECT_ACCESS,
        };

        config.filesAdapter = FileAdapter.getProxy(config);

        // rest api key
        if (op.has(Actinium.options, 'REST_API_KEY')) {
            config['restAPIKey'] = Actinium.options.REST_API_KEY;
        }

        // client key
        if (op.has(Actinium.options, 'CLIENT_KEY')) {
            config['clientKey'] = Actinium.options.CLIENT_KEY;
        }

        // javascript key
        if (op.has(Actinium.options, 'JAVASCRIPT_KEY')) {
            config['javascriptKey'] = Actinium.options.JAVASCRIPT_KEY;
        }

        // dotNet key
        if (op.has(Actinium.options, 'DOTNET_KEY')) {
            config['dotNetKey'] = Actinium.options.DOTNET_KEY;
        }

        // live query server settings
        if (Actinium.options.LIVE_QUERY_SETTINGS) {
            config['liveQuery'] = Actinium.options.LIVE_QUERY_SETTINGS;
        }

        // Logging
        if (Actinium.options.LOG !== true) {
            config.loggerAdapter = null;
        }

        if (Actinium.options.LOG_LEVEL) {
            config.logLevel = Actinium.options.PARSE_LOG_LEVEL;
        }

        return config;
    };

    Actinium.Middleware.register('parse', app => {
        if (Actinium.options.NO_PARSE !== true) {
            const server = new ParseServer(parseConfig());

            const routerServer = express.Router();
            routerServer.use(Actinium.options.PARSE_MOUNT, server);

            app.use(routerServer);
        }

        if (
            Actinium.options.PARSE_DASHBOARD === true &&
            !Actinium.options.NO_PARSE
        ) {
            const {
                appId,
                appName,
                masterKey,
                sessionLength,
                serverURL,
                publicServerURL,
            } = parseConfig();

            const dashboardConfig = {
                trustProxy: 1,
                users: Actinium.options.PARSE_DASHBOARD_USERS,
                apps: [
                    {
                        appId,
                        appName,
                        masterKey,
                        sessionLength,
                        serverURL,
                        publicServerURL,
                    },
                ],
            };

            const dashboard = new ParseDashboard(dashboardConfig, {
                allowInsecureHTTP:
                    Actinium.options.PARSE_DASHBOARD_ALLOW_INSECURE_HTTP,
            });

            app.use(Actinium.options.PARSE_DASHBOARD_MOUNT, dashboard);
        }

        return Promise.resolve();
    });
};
