const middleware = [];
const path = require('path');
const op = require('object-path');
const express = require('express');
const { ParseServer } = require('parse-server');
const ParseDashboard = require('parse-dashboard');
const FileAdapter = require(ACTINIUM_DIR + '/lib/files-adapter');

const parseConfig = () => {
    const config = {
        appId: ENV.APP_ID,
        appName: ENV.APP_NAME,
        masterKey: ENV.MASTER_KEY,
        sessionLength: 31536000000,
        databaseURI: ENV.DATABASE_URI,
        cloud: ACTINIUM_DIR + '/cloud.js',
        serverURL: ENV.SERVER_URI + ENV.PARSE_MOUNT,
        publicServerURL: ENV.PUBLIC_SERVER_URI + ENV.PARSE_MOUNT,
        allowClientClassCreation: ENV.PARSE_ALLOW_CLIENT_CLASS_CREATION,
        preserveFileName: ENV.PARSE_PRESERVE_FILENAME,
        directAccess: ENV.PARSE_FILES_DIRECT_ACCESS,
    };

    config.filesAdapter = FileAdapter.getProxy(config);

    // rest api key
    if (op.has(ENV, 'REST_API_KEY')) {
        config['restAPIKey'] = ENV.REST_API_KEY;
    }

    // client key
    if (op.has(ENV, 'CLIENT_KEY')) {
        config['clientKey'] = ENV.CLIENT_KEY;
    }

    // javascript key
    if (op.has(ENV, 'JAVASCRIPT_KEY')) {
        config['javascriptKey'] = ENV.JAVASCRIPT_KEY;
    }

    // dotNet key
    if (op.has(ENV, 'DOTNET_KEY')) {
        config['dotNetKey'] = ENV.DOTNET_KEY;
    }

    // live query server settings
    if (ENV.LIVE_QUERY_SETTINGS) {
        config['liveQuery'] = ENV.LIVE_QUERY_SETTINGS;
    }

    // Logging
    if (ENV.LOG !== true) {
        config.loggerAdapter = null;
    }

    if (ENV.LOG_LEVEL) {
        config.logLevel = ENV.PARSE_LOG_LEVEL;
    }

    return config;
};

Actinium.Middleware.register('parse', app => {
    if (ENV.NO_PARSE !== true) {
        const server = new ParseServer(parseConfig());

        const routerServer = express.Router();
        routerServer.use(ENV.PARSE_MOUNT, server);

        app.use(routerServer);
    }

    if (ENV.PARSE_DASHBOARD === true && !ENV.NO_PARSE) {
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
            users: ENV.PARSE_DASHBOARD_USERS,
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
            allowInsecureHTTP: ENV.PARSE_DASHBOARD_ALLOW_INSECURE_HTTP,
        });

        app.use(ENV.PARSE_DASHBOARD_MOUNT, dashboard);
    }

    return Promise.resolve();
});
