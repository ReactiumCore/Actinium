const middleware = [];
const path = require('path');
const op = require('object-path');
const express = require('express');
const { ParseServer } = require('parse-server');
const ParseDashboard = require('parse-dashboard');

const parseConfig = () => {
    const config = {
        appId: ENV.APP_ID,
        appName: ENV.APP_NAME,
        masterKey: ENV.MASTER_KEY,
        sessionLength: 31536000000,
        databaseURI: ENV.DATABASE_URI,
        cloud: ACTINIUM_DIR + '/cloud.js',
        serverURL: ENV.SERVER_URI + ENV.PARSE_MOUNT,
        allowClientClassCreation: ENV.PARSE_ALLOW_CLIENT_CLASS_CREATION,
    };

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
        config.logLevel = ENV.LOG_LEVEL;
    }

    return config;
};

Actinium.Middleware.register('parse', app => {
    if (ENV.NO_PARSE !== true) {
        let fileConfig = {};
        if (ENV.S3_ACCESS_KEY && ENV.S3_SECRET_KEY) {
            const S3Adapter = require('@parse/s3-files-adapter');
            const AWS = require('aws-sdk');

            //Configure Digital Ocean Spaces EndPoint
            let s3overrides = {};
            if (ENV.SPACES_ENDPOINT) {
                s3overrides.endpoint = new AWS.Endpoint(ENV.SPACES_ENDPOINT);
            }

            const s3Options = {
                bucket: ENV.S3_BUCKET,
                region: ENV.S3_REGION,
                baseUrl: ENV.S3_BASE_URL,
                s3overrides: {
                    accessKeyId: ENV.S3_ACCESS_KEY,
                    secretAccessKey: ENV.S3_SECRET_KEY,
                    ...s3overrides,
                },
            };

            fileConfig = {
                filesAdapter: new S3Adapter(s3Options),
            };
        }

        // Parse config
        const config = {
            ...parseConfig(),
            ...fileConfig,
        };

        const server = new ParseServer(config);

        const routerServer = express.Router();
        routerServer.use(ENV.PARSE_MOUNT, server);

        app.use(routerServer);
    }

    if (ENV.PARSE_DASHBOARD === true && !ENV.NO_PARSE) {
        const pconf = parseConfig();
        delete pconf.sessionLength;
        delete pconf.databaseURI;
        delete pconf.cloud;

        const dashboardConfig = {
            trustProxy: 1,
            users: ENV.PARSE_DASHBOARD_USERS,
            apps: [{ ...pconf }],
        };

        const dashboard = new ParseDashboard(dashboardConfig, {
            allowInsecureHTTP: ENV.PARSE_DASHBOARD_ALLOW_INSECURE_HTTP,
        });

        app.use(ENV.PARSE_DASHBOARD_MOUNT, dashboard);
    }

    return Promise.resolve();
});
