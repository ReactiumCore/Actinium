const os = require('os');
const path = require('path');
const op = require('object-path');
const FSFilesAdapter = require('@parse/fs-files-adapter');
const fs = require('fs-extra');

const PLUGIN = {
    ID: 'FSFileAdapter',
    name: 'Actinium File Adapter plugin.',
    description:
        'Actinium file adapter plugin, used to allow files to be stored on the filesystem.',
    order: 0,
    version: {
        actinium: '>=3.1.2',
        plugin: '0.0.1',
    },
    meta: {
        group: 'FilesAdapter',
        builtIn: true,
    },
};

FSFilesAdapter.prototype._getLocalFilePath = function(filename) {
    const applicationDir = this._getApplicationDir();
    const filePath = path.resolve(applicationDir, filename);
    fs.ensureDirSync(path.dirname(filePath));

    return filePath;
};

Actinium.FilesAdapter.register(PLUGIN, async (config, env) => {
    let filesSubDirectory = await Actinium.Setting.get(
        'FSFileAdapter.filesSubDirectory',
        op.get(
            config,
            'filesSubDirectory',
            op.get(env, 'PARSE_FS_FILES_SUB_DIRECTORY', 'uploads'),
        ),
    );

    filesSubDirectory = path.normalize(filesSubDirectory);
    if (filesSubDirectory[0] === path.sep) {
        filesSubDirectory = path.relative(BASE_DIR, filesSubDirectory);
    }

    return new FSFilesAdapter({
        filesSubDirectory,
    });
});
