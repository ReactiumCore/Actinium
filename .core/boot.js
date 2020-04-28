const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const assert = require('assert');

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
        } catch (err) {
            console.error(err);
        }
        return { ...env, ...process.env };
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
    const pattern = /^[A-Za-z0-9_-]+$/;
    assert(pattern.test(value), 'invalid value for ACTINIUM_ENV_ID');
}

module.exports = boot;
