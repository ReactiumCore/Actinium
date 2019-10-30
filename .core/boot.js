const fs = require('fs');
const assert = require('assert');

/**
 * Reads application configuration variables
 */
const boot = {
    get environment() {
        const file = environmentFile();
        let env = {};
        try {
            env = JSON.parse(fs.readFileSync(file, 'utf8'));
        } catch (err) {
            console.error(err);
        }
        return Object.assign(env, process.env);
    },
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
