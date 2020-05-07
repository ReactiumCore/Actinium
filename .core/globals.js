const path = require('path');
const chalk = require('chalk');
const moment = require('moment');
const op = require('object-path');

const stringToBoolean = val => {
    if (typeof val === 'string') {
        switch (String(val).toLowerCase()) {
            case 'true':
                return true;

            case 'false':
                return false;
        }
    }

    return val;
};

const stringToObject = val => (typeof val === 'string' ? JSON.parse(val) : val);

global.Actinium = {};
global.BASE_DIR = path.normalize(path.resolve(path.join(__dirname, '..')));
global.SRC_DIR = path.normalize(path.resolve(path.join(BASE_DIR, 'src')));
global.APP_DIR = path.normalize(path.resolve(path.join(SRC_DIR, 'app')));
global.ENV = require(`${BASE_DIR}/.core/boot`).environment;
global.PORT = ENV.APP_PORT || ENV.PORT;
global.ACTINIUM_DIR = __dirname;
global.CLOUD_FUNCTIONS = [];

const defaults = {
    glob: {
        cloud: [
            `${ACTINIUM_DIR}/cloud/**/*.js`,
            `${BASE_DIR}/node_modules/**/actinium/*cloud.js`,
            `${BASE_DIR}/actinium_modules/**/*cloud.js`,
            `${APP_DIR}/cloud/**/*.js`, // deprecated 3.1.8
            `${APP_DIR}/**/*cloud.js`, // since 3.1.8
        ],
        plugins: [
            `${ACTINIUM_DIR}/plugin/**/*.js`,
            `${BASE_DIR}/node_modules/**/actinium/*plugin.js`,
            `${BASE_DIR}/actinium_modules/**/*plugin.js`,
            `${APP_DIR}/**/*plugin.js`,
            `!${ACTINIUM_DIR}/plugin/**/assets/**/*.js`,
            `!${ACTINIUM_DIR}/plugin/**/plugin-assets/**/*.js`,
        ],
        middleware: [
            `${ACTINIUM_DIR}/middleware/**/*.js`,
            `${ACTINIUM_DIR}/**/*middleware.js`,
            `${BASE_DIR}/node_modules/**/actinium/*middleware.js`,
            `${BASE_DIR}/actinium_modules/**/*middleware.js`,
            `${APP_DIR}/**/*middleware.js`,
        ],
    },
    express: {
        views: APP_DIR + '/view',
        'view engine': 'ejs',
        'x-powered-by': false,
    },
    settings: {},
    static: path.normalize(`${process.cwd()}/public`),
};

ENV.LOG = stringToBoolean(op.get(ENV, 'LOG', true));
ENV.LOG_LEVEL = stringToBoolean(op.get(ENV, 'LOG_LEVEL', 'error'));
ENV.PARSE_DASHBOARD_USERS = stringToObject(
    op.get(ENV, 'PARSE_DASHBOARD_USERS', []),
);
ENV.LIVE_QUERY_SERVER = stringToBoolean(
    op.get(ENV, 'LIVE_QUERY_SERVER', false),
);
ENV.LIVE_QUERY_SETTINGS = stringToObject(op.get(ENV, 'LIVE_QUERY_SETTINGS'));
ENV.PARSE_DASHBOARD_ALLOW_INSECURE_HTTP = stringToBoolean(
    op.get(ENV, 'PARSE_DASHBOARD_ALLOW_INSECURE_HTTP', true),
);
ENV.NO_PARSE = stringToBoolean(op.get(ENV, 'NO_PARSE', false));
ENV.NO_DOCS = stringToBoolean(op.get(ENV, 'NO_DOCS', false));
ENV.EXPRESS_OPTIONS = stringToObject(
    op.get(ENV, 'EXPRESS_OPTIONS', defaults.express),
);
ENV.GLOB_CLOUD = stringToObject(op.get(ENV, 'GLOB_CLOUD', defaults.glob.cloud));
ENV.GLOB_PLUGINS = stringToObject(
    op.get(ENV, 'GLOB_PLUGINS', defaults.glob.plugins),
);
ENV.GLOB_MIDDLEWARE = stringToObject(
    op.get(ENV, 'GLOB_MIDDLEWARE', defaults.glob.middleware),
);
ENV.SETTINGS = stringToObject(op.get(ENV, 'SETTINGS', defaults.settings));
ENV.ROLES = stringToObject(op.get(ENV, 'ROLES', defaults.roles));
ENV.STATIC_PATH = op.get(ENV, 'STATIC_PATH', defaults.static);
ENV.PARSE_PRESERVE_FILENAME = stringToBoolean(
    op.get(ENV, 'PARSE_PRESERVE_FILENAME', true),
);
ENV.PARSE_FILES_DIRECT_ACCESS = stringToBoolean(
    op.get(ENV, 'PARSE_FILES_DIRECT_ACCESS', true),
);

ENV.RUN_TEST = stringToBoolean(op.get(ENV, 'RUN_TEST', true));

ENV.ACTINIUM_MOUNT = ENV.PARSE_MOUNT;

global.LOG = (...args) => {
    if (!ENV.LOG) {
        return;
    }
    const time = `[${chalk.magenta(moment().format('HH:mm:ss'))}]`;
    const name = `[${chalk.cyan(String(ENV.APP_NAME))}]`;
    console.log(time, name, ...args);
};
