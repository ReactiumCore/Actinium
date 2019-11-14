const os = require('os');
const path = require('path');
const op = require('object-path');
const FSFilesAdapter = require('@parse/fs-files-adapter');

const PLUGIN = {
    ID: 'FSFileAdapter',
    name: 'Actinium File Adapter plugin.',
    description:
        'Actinium base file adapter plugin, used to allow runtime change of underlying Parse file adapter.',
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

Actinium.Plugin.register(PLUGIN);

Actinium.Hook.register('files-adapter', async (config, env, context) => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
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

        context.adapter = new FSFilesAdapter({
            filesSubDirectory,
        });
    }
});

Actinium.Hook.run('activate', async ({ ID }) => {
    if (ID === PLUGIN.ID) {
        Actinium.FilesAdapter.update();
    }
});

Actinium.Hook.run('deactivate', async ({ ID }) => {
    if (ID === PLUGIN.ID) {
        Actinium.FilesAdapter.update();
    }
});
