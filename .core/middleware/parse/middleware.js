import op from 'object-path';
import express from 'express';
import Hook from '../../lib/hook.js';
import { ParseServer } from 'parse-server';
import ParseDashboard from 'parse-dashboard';
import FileAdapter from '../../lib/files-adapter.js';

const parseConfig = (hook) => {
    const config = {
        appId: ENV.APP_ID,
        appName: ENV.APP_NAME,
        masterKey: ENV.MASTER_KEY,
        enforcePrivateUsers: false,
        sessionLength: 31536000000,
        databaseURI: ENV.DATABASE_URI,
        allowExpiredAuthDataToken: true,
        cloud: ACTINIUM_DIR + '/cloud.cjs',
        serverURL: ENV.SERVER_URI + ENV.PARSE_MOUNT,
        directAccess: ENV.PARSE_FILES_DIRECT_ACCESS,
        preserveFileName: ENV.PARSE_PRESERVE_FILENAME,
        publicServerURL: ENV.PUBLIC_SERVER_URI + ENV.PARSE_MOUNT,
        allowClientClassCreation: ENV.PARSE_ALLOW_CLIENT_CLASS_CREATION,
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

    if (hook) Hook.runSync(hook, config);

    return config;
};

Actinium.Middleware.register('parse', async (app) => {
    if (ENV.NO_PARSE !== true) {
        const server = new ParseServer(parseConfig('parse-server-config'));

        const routerServer = express.Router();
        routerServer.use(ENV.PARSE_MOUNT, server.app);

        app.use(routerServer);

        await server.start();
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

        Hook.runSync('parse-dashboard-config', dashboardConfig);

        const dashboard = new ParseDashboard(dashboardConfig, {
            allowInsecureHTTP: ENV.PARSE_DASHBOARD_ALLOW_INSECURE_HTTP,
        });

        app.use(ENV.PARSE_DASHBOARD_MOUNT, dashboard);
    }

    return Promise.resolve();
});
