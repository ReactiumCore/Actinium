import chalk from 'chalk';
import Hook from './hook.js';
import op from 'object-path';
import Enums from './enums.js';
import { pluginRegister } from './plugable.js';
import { GridFSBucketAdapter } from 'parse-server/lib/Adapters/Files/GridFSBucketAdapter.js';

class FilesAdapterProxy {
    constructor(config) {
        this.config = { ...config };
        this._defaultAdapter();
        this.ID = 'GridFSBucketAdapter';
    }

    _defaultAdapter() {
        this._adapter = new GridFSBucketAdapter(this.config.databaseURI);
        this._adapter.validateFilename = this._validateFilenameDefault;
    }

    async _set(adapter, ID = 'GridFSBucketAdapter') {
        this.ID = ID;
        if (!adapter || ID === 'GridFSBucketAdapter') {
            this._defaultAdapter();
        } else this._adapter = adapter;

        this.bootMessage();
    }

    _get() {
        return this._adapter;
    }

    bootMessage() {
        if (Actinium.pluginsLoaded) {
            BOOT('');
            BOOT(`Files Adapter: ${chalk.cyan(this.ID)}`);
        }
    }

    // createFile(filename: string, data, contentType: string): Promise {}
    createFile(filename, data, contentType) {
        return this._get().createFile(filename, data, contentType);
    }

    // deleteFile(filename: string): Promise {}
    deleteFile(filename) {
        return this._get().deleteFile(filename);
    }

    // getFileData(filename: string): Promise<any> {}
    getFileData(filename) {
        return this._get().getFileData(filename);
    }

    // getFileLocation(config: Config, filename: string): string {}
    getFileLocation(config, filename) {
        return this._get().getFileLocation(config, filename);
    }

    _validateFilenameDefault(filename) {
        const regx = /^[_a-zA-Z0-9][a-zA-Z0-9@./ ~_-]*$/;
        if (!filename.match(regx)) {
            return new Parse.Error(
                Parse.Error.INVALID_FILE_NAME,
                'Filename contains invalid characters.',
            );
        }

        return null;
    }

    // validateFilename(filename: string): ?Parse.Error {}
    validateFilename(filename) {
        if (typeof this._get().validateFilename === 'function') {
            return this._get().validateFilename(filename);
        }

        return this._validateFilenameDefault(filename);
    }

    // handleFileStream(filename: string, res: any, req: any, contentType: string): Promise
    handleFileStream(filename, res, req, contentType) {
        if ('handleFileStream' in this._get())
            return this._get().handleFileStream(
                filename,
                res,
                req,
                contentType,
            );
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

FilesAdapter.update = async (ID, active) => {
    try {
        const { adapter } = await Hook.run(
            'files-adapter',
            proxy.config,
            ENV,
            ID,
            active,
        );
        if (active) {
            await proxy._set(adapter, ID);
        } else if (ID === proxy.ID) {
            await proxy._set();
        }
    } catch (error) {
        ERROR('Error setting files-adapter.', error);
    }
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
        async (config, env, ID, active = false, context) => {
            if (active && ID === plugin.ID) {
                context.ID = plugin.ID;
                context.adapter = await installer(config, env);
            }
        },
        order,
    );

    op.set(plugins, plugin.ID, hookId);

    return pluginRegister(plugin);
};

Hook.register(
    'plugin-before-save',
    async ({ ID, active }) => {
        if (ID in plugins) {
            await FilesAdapter.update(ID, active);
        }
    },
    Enums.priority.highest,
);

Hook.register(
    'activate',
    async ({ ID, active }) => {
        if (ID in plugins) {
            await FilesAdapter.update(ID, active);
        }
    },
    Enums.priority.highest,
);

Hook.register(
    'deactivate',
    async ({ ID, active }) => {
        if (ID in plugins) {
            await FilesAdapter.update(ID, active);
        }
    },
    Enums.priority.highest,
);

export default FilesAdapter;
