const Plugin = require('./plugable');
const Hook = require('./hook');
const {
    GridFSBucketAdapter,
} = require('parse-server/lib/Adapters/Files/GridFSBucketAdapter');
const op = require('object-path');

class FilesAdapterProxy {
    constructor(config) {
        this.config = { ...config };
        this._set();
    }

    _set(adapter) {
        if (!adapter) {
            this._adapter = new GridFSBucketAdapter(this.config.databaseURI);
        } else this._adapter = adapter;
    }

    _get() {
        return this._adapter;
    }

    // createFile(filename: string, data, contentType: string): Promise {}
    createFile(...params) {
        return this._get().createFile(...params);
    }

    // deleteFile(filename: string): Promise {}
    deleteFile(...params) {
        return this._get().deleteFile(...params);
    }

    // getFileData(filename: string): Promise<any> {}
    getFileData(...params) {
        return this._get().getFileData(...params);
    }

    // getFileLocation(config: Config, filename: string): string {}
    getFileLocation(...params) {
        return this._get().getFileLocation(...params);
    }

    // validateFilename(filename: string): ?Parse.Error {}
    validateFilename(...params) {
        return this._get().validateFilename(...params);
    }

    // handleFileStream(filename: string, res: any, req: any, contentType: string): Promise
    handleFileStream(...params) {
        if ('handleFileStream' in this._get())
            return this._get().handleFileStream(...params);
        return Promise.resolve();
    }

    handleShutdown(...params) {
        if ('handleShutdown' in this._get())
            return this._get().handleShutdown(...params);
        return Promise.resolve();
    }
}

const plugins = {};
let proxy;

const FilesAdapter = {};
FilesAdapter.getProxy = config => {
    if (proxy) return proxy;
    proxy = new FilesAdapterProxy(config);
    return proxy;
};

FilesAdapter.update = async () => {
    const { adapter } = await Hook.run(
        'files-adapter',
        FilesAdapter.config,
        ENV,
    );

    proxy._set(adapter);
};

/**
 * @api {Function} FilesAdapter.register(plugin,installer,order) FilesAdapter.register()
 * @apiDescription Register a Parse FilesAdapter plugin to handle file operations. Ideally, at most only one FilesAdapter plugin
 * should be active at a time. If multiple FilesAdapter plugins are enabled, the plugin with the highest `order` will determine
 * the running FilesAdapter.
 * @apiParam {Object} Plugin Plugin object taken by `Actinium.Plugin.register()`.
 * @apiParam {Function} installer Async function that takes Actinium startup config and environment as arguments, and returns
 * a promise for a Parse FilesAdapter object.
 * @apiParam {Number} [order] The order in which active FilesAdapters will decide on which is in play.
 * @apiVersion 3.1.6
 * @apiGroup Actinium
 * @apiName FilesAdapter.register
 */
FilesAdapter.register = (plugin, installer, order) => {
    const hookId = Hook.register(
        'files-adapter',
        async (config, env, context) => {
            if (Plugin.isActive(plugin.ID)) {
                context.adapter = await installer(config, env);
            }
        },
        order,
    );

    op.set(plugins, plugin.ID, hookId);

    return Plugin.register(plugin);
};

Hook.register('activate', async ({ ID }) => {
    if (ID in plugins) {
        FilesAdapter.update();
    }
});

Hook.register('deactivate', async ({ ID }) => {
    if (ID in plugins) {
        FilesAdapter.update();
    }
});

module.exports = FilesAdapter;
