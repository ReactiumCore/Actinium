const path = require('path');
const chalk = require('chalk');
const moment = require('moment');
const op = require('object-path');
const fs = require('fs-extra');
const Enums = require('./lib/enums');
const Registry = require('./lib/utils/registry');
const ACTINIUM_CONFIG = require('./actinium-config');

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

const globbyPath = pathString =>
    pathString.split(/[\\\/]/g).join(path.posix.sep);

global.Actinium = {};
global.ACTINIUM_CONFIG = ACTINIUM_CONFIG;
global.BASE_DIR = path.normalize(path.resolve(path.join(__dirname, '..')));
global.SRC_DIR = path.normalize(path.resolve(path.join(BASE_DIR, 'src')));
global.APP_DIR = path.normalize(path.resolve(path.join(SRC_DIR, 'app')));
global.ENV = require(`${BASE_DIR}/.core/boot`).environment;
global.PORT = ENV.PORT;
global.ACTINIUM_DIR = __dirname;
global.CLOUD_FUNCTIONS = [];
global.FEATURES = new Registry('Features');

const defaults = {
    glob: {
        cloud: [
            `${globbyPath(ACTINIUM_DIR)}/cloud/**/*.js`,
            `${globbyPath(BASE_DIR)}/node_modules/**/actinium/*cloud.js`,
            `${globbyPath(BASE_DIR)}/actinium_modules/**/*cloud.js`,
            `${globbyPath(APP_DIR)}/cloud/**/*.js`, // deprecated 3.1.8
            `${globbyPath(APP_DIR)}/**/*cloud.js`, // since 3.1.8
        ],
        plugins: [
            `${globbyPath(ACTINIUM_DIR)}/plugin/**/*plugin.js`,
            `${globbyPath(BASE_DIR)}/node_modules/**/actinium/*plugin.js`,
            `${globbyPath(BASE_DIR)}/actinium_modules/**/*plugin.js`,
            `${globbyPath(APP_DIR)}/**/*plugin.js`,
            `!${globbyPath(ACTINIUM_DIR)}/plugin/**/assets/**/*.js`,
            `!${globbyPath(ACTINIUM_DIR)}/plugin/**/plugin-assets/**/*.js`,
        ],
        middleware: [
            `${globbyPath(ACTINIUM_DIR)}/middleware/**/*.js`,
            `${globbyPath(ACTINIUM_DIR)}/**/*middleware.js`,
            `${globbyPath(BASE_DIR)}/node_modules/**/actinium/*middleware.js`,
            `${globbyPath(BASE_DIR)}/actinium_modules/**/*middleware.js`,
            `${globbyPath(APP_DIR)}/**/*middleware.js`,
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

// Actinium and Parse Log Level
ENV.LOG = stringToBoolean(op.get(ENV, 'LOG', true));
let LOG_LEVEL = stringToBoolean(op.get(ENV, 'LOG_LEVEL', 'BOOT'));
// translate parse level to Actinium level
const levelMap = Object.entries(Enums.parseLogLevels).find(
    ([, parseLevel]) => LOG_LEVEL === parseLevel,
);
if (Array.isArray(levelMap)) {
    const [level] = levelMap;
    LOG_LEVEL = level;
}
ENV.LOG_LEVEL = LOG_LEVEL = op.has(Enums.logLevels, LOG_LEVEL)
    ? LOG_LEVEL
    : 'BOOT';
ENV.PARSE_LOG_LEVEL = op.get(Enums, ['parseLogLevels', LOG_LEVEL], 'error');

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

// TLS MODE
ENV.APP_TLS_CERT_FILE = op.get(ENV, 'APP_TLS_CERT_FILE');
ENV.APP_TLS_KEY_FILE = op.get(ENV, 'APP_TLS_KEY_FILE');
ENV.APP_TLS_KEY =
    ENV.APP_TLS_KEY_FILE &&
    fs.existsSync(ENV.APP_TLS_KEY_FILE) &&
    fs.readFileSync(ENV.APP_TLS_KEY_FILE);
ENV.APP_TLS_CERT =
    ENV.APP_TLS_CERT_FILE &&
    fs.existsSync(ENV.APP_TLS_CERT_FILE) &&
    fs.readFileSync(ENV.APP_TLS_CERT_FILE);
ENV.TLS_MODE = ENV.APP_TLS_KEY && ENV.APP_TLS_CERT;

ENV.RUN_TEST = stringToBoolean(op.get(ENV, 'RUN_TEST', true));

ENV.ACTINIUM_MOUNT = ENV.PARSE_MOUNT;

const LOG_THRESHOLD = op.get(Enums, ['logLevels', LOG_LEVEL], 0);
for (const [LEVEL, THRESHOLD] of Object.entries(Enums.logLevels)) {
    global[LEVEL] = (...args) => {
        if (!ENV.LOG || THRESHOLD > LOG_THRESHOLD) {
            return;
        }

        const _W = THRESHOLD <= Enums.logLevels.WARN;
        const _E = THRESHOLD <= Enums.logLevels.ERROR;
        let color = _W ? chalk.yellow.bold : chalk.cyan;
        color = _E ? chalk.red.bold : color;

        const time = `[${chalk.magenta(moment().format('HH:mm:ss'))}]`;
        let name = `${color(String(ENV.APP_NAME))}`;
        name = _E ? `%${name}%` : _W ? `!${name}!` : `[${name}]`;

        let logMethod = op.get(console, LEVEL, console.log);
        logMethod = typeof logMethod === 'function' ? logMethod : console.log;
        logMethod(time, name, ...args);
    };
}

global.LOG = global.BOOT;
