const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const assert = require('assert');
const op = require('object-path');

const DEFAULT_PORT = 9000;

const ensurePortEnvironment = env => {
    const file = environmentFile();

    // PORT is special case
    // Allow PORT_VAR to specify where to find PORT information
    const PORT_VAR = op.get(process.env, 'PORT_VAR', op.get(env, 'PORT_VAR'));

    let PORT;
    if (PORT_VAR) {
        // if PORT_VAR is specified, it must be found in either the
        // environment, or the environment file.
        PORT = op.get(process.env, [PORT_VAR], op.get(env, [PORT_VAR]));
    } else {
        PORT = op.get(
            // check for process.env first
            // 1. process.env.APP_PORT
            // 2. process.env.PORT
            process.env,
            'APP_PORT',
            op.get(
                process.env,
                'PORT',

                // check for env file second
                // 3. env.APP_PORT
                // 4. env.PORT
                op.get(env, 'APP_PORT', op.get(env, 'PORT', DEFAULT_PORT)),
            ),
        );
    }

    PORT = parseInt(PORT);

    if (isNaN(PORT) || PORT < 1) {
        // console.error is appropriate this early in the bootup process.
        if (PORT_VAR) {
            throw new Error(
                `No port environment variable found matching ${chalk.magenta(
                    'PORT_VAR',
                )}\n` +
                    `- ${chalk.cyan('PORTVAR')}: ${chalk.magenta(PORT_VAR)}\n` +
                    `- ${chalk.cyan('1.')} process.env ${chalk.magenta(
                        PORT_VAR,
                    )}: ${op.get(process.env, [PORT_VAR])}\n` +
                    `- ${chalk.cyan('2.')} ${file} ${chalk.magenta(
                        PORT_VAR,
                    )}: ${op.get(env, [PORT_VAR])}`,
            );
        } else {
            throw new Error(
                `No ${chalk.cyan('APP_PORT')} or ${chalk.cyan(
                    'PORT',
                )} variables found in ${chalk.cyan(
                    'process.env',
                )} or ${chalk.cyan('env')} file.\n` +
                    `- ${chalk.cyan('1.')} process.env ${chalk.magenta(
                        'APP_PORT',
                    )}: ${op.get(process.env, 'APP_PORT')}\n` +
                    `- ${chalk.cyan('2.')} process.env ${chalk.magenta(
                        'PORT',
                    )}: ${op.get(process.env, 'PORT')}\n` +
                    `- ${chalk.cyan('3.')} ${file} ${chalk.magenta(
                        'APP_PORT',
                    )}: ${op.get(env, 'APP_PORT')}\n` +
                    `- ${chalk.cyan('4.')} ${file} ${chalk.magenta(
                        'PORT',
                    )}: ${op.get(env, 'PORT')}`,
            );
        }
    }

    // Cleanup env object
    op.del(env, 'PORT');
    op.del(env, 'APP_PORT');

    return PORT;
};

// Sanitize SERVER_URI
const getServerURI = (env, PORT) => {
    const SERVER_URI = op.get(
        process.env,
        'SERVER_URI',
        op.get(env, 'SERVER_URI', `http://localhost:${DEFAULT_PORT}`),
    );

    if (PORT !== DEFAULT_PORT) {
        const url = new URL(SERVER_URI);

        // lazy port configuration for SERVER_URI
        if (Number(url.port) === DEFAULT_PORT) {
            return `${url.protocol || 'http'}//${url.hostname ||
                'localhost'}:${PORT}`;
        }
    }

    return SERVER_URI;
};

const getPublicServerURI = (env, SERVER_URI) => {
    const PUBLIC_SERVER_URI = op.get(
        process.env,
        'PUBLIC_SERVER_URI',
        op.get(env, 'PUBLIC_SERVER_URI', SERVER_URI),
    );

    return PUBLIC_SERVER_URI;
};

/**
 * Reads application configuration variables
 */
const boot = {
    get environment() {
        const file = environmentFile();
        let env = {
            ENV_WARNING: false,
        };

        try {
            const ENV_WARNING = envDev();

            env = {
                ...env,
                ...JSON.parse(fs.readFileSync(file, 'utf8')),
                ENV_WARNING,
            };

            const PORT = ensurePortEnvironment(env);
            const SERVER_URI = getServerURI(env, PORT);
            const PUBLIC_SERVER_URI = getPublicServerURI(env, SERVER_URI);

            return {
                ...env,
                ...process.env,
                PORT,
                SERVER_URI,
                PUBLIC_SERVER_URI,
            };
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    },
};

const envDev = () => {
    // Check for env.dev.json file
    const filePath = path.normalize(`${SRC_DIR}/env.dev.json`);

    // Exit if found
    if (fs.existsSync(filePath)) return false;

    // Get the template file
    const templatePath = path.normalize(
        `${BASE_DIR}/.core/plugin/env/env.dev.json`,
    );

    // Copy to src
    fs.copySync(templatePath, filePath);
    return true;
};

function environmentFile() {
    const envFile = process.env.ACTINIUM_ENV_FILE;
    const envId = process.env.ACTINIUM_ENV_ID;

    if (envFile) {
        return envFile;
    } else if (envId) {
        validateReactorEnvId(envId);
        return `${SRC_DIR}/env.${envId}.json`;
    } else {
        return `${SRC_DIR}/env.json`;
    }
}

function validateReactorEnvId(value) {
    const pattern = /^[.A-Za-z0-9_-]+$/;
    assert(pattern.test(value), 'invalid value for ACTINIUM_ENV_ID');
}

module.exports = boot;
