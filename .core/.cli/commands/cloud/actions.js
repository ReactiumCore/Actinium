const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const op = require('object-path');
const zip = require('folder-zipper');
const homedir = require('os').homedir();
const handlebars = require('handlebars').compile;

module.exports = spinner => {
    const message = text => {
        if (spinner) {
            spinner.text = text;
        }
    };

    return {
        backup: ({ action, params, props }) => {
            const { cwd } = props;
            const { destination } = params;

            const name = destination.replace(cwd, '').replace(/\//g, '-');

            message(`backing up ${name} cloud function...`);

            const now = Date.now();
            const backupDir = path.join(
                homedir,
                '.arcl',
                cwd,
                '.BACKUP',
                'cloud',
            );
            const backupZip = path.normalize(`${backupDir}/${now}${name}.zip`);

            // Create the backup directory
            fs.ensureDirSync(backupDir);

            // Backup the component directory then empty the existing
            return zip(destination, backupZip).then(() => {
                return { action, status: 200 };
            });
        },

        create: ({ action, params, props }) => {
            const { cwd } = props;
            const { destination, overwrite } = params;

            const actionType = overwrite === true ? 'overwritting' : 'creating';

            message(`${actionType} cloud function...`);

            fs.ensureFileSync(destination);

            // Template content
            const template = path.normalize(`${__dirname}/template/cloud.hbs`);
            const content = handlebars(fs.readFileSync(template, 'utf-8'))(
                params,
            );

            return new Promise((resolve, reject) => {
                fs.writeFile(destination, content, error => {
                    if (error) {
                        reject(error.Error);
                    } else {
                        resolve({ action, status: 200 });
                    }
                });
            });
        },
    };
};
