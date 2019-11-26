const op = require('object-path');
const ENUMS = require('./enums');
const _ = require('underscore');

const {
    CloudHasCapabilities,
    CloudRunOptions,
} = require(`${ACTINIUM_DIR}/lib/utils`);

const COLLECTION = ENUMS.COLLECTION;

const PLUGIN = require('./meta');
const PLUGIN_LIB = require('./lib');
const PLUGIN_ROUTES = require('./routes');
const PLUGIN_SCHEMA = require('./schema');
const PLUGIN_BLUEPRINTS = require('./blueprints');

// Create Singleton
Actinium[COLLECTION.MEDIA] = op.get(Actinium, COLLECTION.MEDIA, PLUGIN_LIB);

// Register Plugin
Actinium.Plugin.register(PLUGIN, true);

// Register Capabilities & Schema
Actinium.Hook.register('activate', async ({ ID }) => {
    if (ID !== PLUGIN.ID) {
        return;
    }

    Object.keys(PLUGIN_SCHEMA.ACTIONS.MEDIA).forEach(action =>
        Actinium.Capability.register(`${COLLECTION.MEDIA}.${action}`),
    );

    Actinium.Collection.register(
        COLLECTION.DIRECTORY,
        PLUGIN_SCHEMA.ACTIONS.DIRECTORY,
        PLUGIN_SCHEMA.SCHEMA.DIRECTORY,
    );

    Actinium.Collection.register(
        COLLECTION.MEDIA,
        PLUGIN_SCHEMA.ACTIONS.MEDIA,
        PLUGIN_SCHEMA.SCHEMA.MEDIA,
    );

    Actinium.Collection.register(
        COLLECTION.UPLOAD,
        PLUGIN_SCHEMA.ACTIONS.UPLOAD,
        PLUGIN_SCHEMA.SCHEMA.UPLOAD,
    );
});

// Register Blueprints
Actinium.Hook.register(
    'blueprint-defaults',
    blueprints => {
        if (Actinium.Plugin.isActive(PLUGIN.ID)) {
            PLUGIN_BLUEPRINTS.forEach(item => blueprints.push(item));
        }
    },
    -1000,
);

// Register Routes
Actinium.Hook.register('route-defaults', routes => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
    PLUGIN_ROUTES.forEach(item => routes.push(item));
});

// Load MediaDirectories to memory
Actinium.Hook.register('start', async () => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
    await Actinium.Media.load();

    // Register a pulse to reload the MediaDirectories every minute
    Actinium.Pulse.define('media-directories', Actinium.Media.load);
});

// Setup pulses on install
Actinium.Hook.register('install', ({ ID }) => {
    if (ID !== PLUGIN.ID) return;

    if (
        _.pluck(Actinium.Pulse.definitions, 'id').includes('media-directories')
    ) {
        return;
    }

    Actinium.Pulse.define('media-directories', Actinium.Media.load);
});

// Remove pulses on uninstall
Actinium.Hook.register('uninstall', ({ ID }) => {
    if (ID !== PLUGIN.ID) return;
    Actinium.Pulse.remove('media-directories');
});

// Register Cloud functions

/**
 * @api {Cloud} upload-chunk upload-chunk
 * @apiVersion 3.1.3
 * @apiGroup Cloud
 * @apiName upload-chunk
 * @apiDescription Cloud function that uploads a chunk of bytes to the Upload table where it is queued for file creation. Use this cloud function when you want to have progressive file uploads. When all chunks of the file have been uploaded, a new file will be generated.

Permission: `Media.create` _(use the **media.capabilities.create** setting to change)_

Returns: `{ status:Actinium.Media.ENUMS.STATUS, file:Parse.Object('Media') }`
 * @apiParam {Object} upload The configuration object for the chunk upload. Contains information about the file that will be created.
 * @apiParam {Array} .chunk A segment of the file's bytes.
 * @apiParam {String} .directory The directory where the completed file will be saved.
 * @apiParam {String} .filename The file name of the completed file.
 * @apiParam {String} .ID Unique ID of the completed file. This should be the same for each file chunk.
 * @apiParam {Number} .index The index of the chunk. The index is used when putting the chunks together to create the file.
 * @apiParam {Number} .total The total bytes of the completed file. This should be the same for each file chunk.
 * @apiExample Example Usage:
const upload = {
    ID: '46e30b13-6d53-4010-8430-1755552cfbe4',
    chunk: ByteArray,
    directory: 'uploads',
    filename: 'avatar.png',
    index: 0,
    total: 34469
};

Actinium.Cloud.run('upload-chunk', upload).then(result => {
    if (result.status === Actinium.Media.ENUMS.STATUS.COMPLETE) {
        console.log(result.file);
    }
});
 */
Actinium.Cloud.define(PLUGIN.ID, 'upload-chunk', req => {
    const cap = Actinium.Setting.get('media.capabilities.create', [
        'Media.create',
    ]);

    if (!CloudHasCapabilities(req, cap, false)) {
        return Promise.reject(ENUMS.ERRORS.PERMISSION);
    }

    return Actinium.Media.chunkUpload(req);
});

/**
 * @api {Cloud} file-upload file-upload
 * @apiVersion 3.1.3
 * @apiGroup Cloud
 * @apiName file-upload
 * @apiDescription Cloud function that creates a file and adds it to the Media Library.

Permission: `Media.create` _(use the **media.capabilities.upload** setting to change)_

Returns: `Parse.Object('Media')`
 * @apiParam {Mixed} file The contents of the file. This can be any valid `Actinium.File` file data value.
 * @apiParam {Object} meta The meta object for the file upload.
 * @apiParam {String} .directory The directory where the file will be saved. Required.
 * @apiParam {String} .filename The file name. Required.
 * @apiParam {String} [.ID] Unique ID of the file. If empty, a new UUID will be created.
 * @apiExample Base64 Example:
const upload = {
    file: { base64: "V29ya2luZyBhdCBQYXJzZSBpcyBncmVhdCE=" }
    meta: {
        directory: 'uploads',
        filename: 'avatar.png',
    }
};

Actinium.Cloud.run('file-upload', upload);
 * @apiExample ByteArray Example:
const upload = {
    file: [ 0xBE, 0xEF, 0xCA, 0xFE ],
    meta: {
        directory: 'uploads',
        filename: 'avatar.png',
    }
};

Actinium.Cloud.run('file-upload', upload);
 */
Actinium.Cloud.define(PLUGIN.ID, 'file-upload', req => {
    const cap = Actinium.Setting.get('media.capabilities.upload', [
        'Media.create',
    ]);

    if (!CloudHasCapabilities(req, cap)) {
        return Promise.reject(ENUMS.ERRORS.PERMISSION);
    }

    if (!op.get(req.params, 'filename'))
        return Promise.reject(ENUMS.ERRORS.FILE);

    const { file, meta } = req.params;
    return Media.fileCreate(file, meta, req.user, CloudRunOptions(req));
});

Actinium.Cloud.define(PLUGIN.ID, 'file-delete', req => {
    const cap = Actinium.Setting.get('media.capabilities.upload', [
        'Media.create',
    ]);

    if (!CloudHasCapabilities(req, cap)) {
        return Promise.reject(ENUMS.ERRORS.PERMISSION);
    }

    const { user } = req;
    const { ID } = req.params;

    if (!user) ENUMS.ERRORS.PERMISSIONS;

    return Actinium.Media.fileDelete(ID, user);
});

/**
 * @api {Cloud} directories directories
 * @apiVersion 3.1.3
 * @apiGroup Cloud
 * @apiName directories
 * @apiDescription Retrieves the complete list of Media directories.
Runs the `directory-query` hook allowing you to change or replace the default query.
The results are reduced based on the capabilities applied to each directory and the current user request.

capabilities: `Media.retrieve` _(use the **media.capabilities.list** setting to change)_.

 * @apiParam {String} [search] Search for a specific directory. Uses `Parse.Query.startsWith()` to execute the query.
 * @apiExample Example usage:
Actinium.Cloud.run('directories').then(directories => {
    console.log(directories);
});
 */
Actinium.Cloud.define(PLUGIN.ID, 'directories', async req => {
    const cap = Actinium.Setting.get('media.capabilities.list', [
        'Media.retrieve',
    ]);

    if (!CloudHasCapabilities(req, cap)) {
        return Promise.reject(ENUMS.ERRORS.PERMISSION);
    }

    const { user } = req;
    const { search } = req.params;

    let directories = Actinium.Media.directories(search, user);

    await Actinium.Hook.run('directories', directories, user);

    return directories;
});

/**
 * @api {Cloud} directory-create director-create
 * @apiVersion 3.1.3
 * @apiGroup Cloud
 * @apiName directory-create
 * @apiDescription Create a new Media directory.

capabilities `Media.create` _(use the **media.capabilities.directory** setting to change)_.
 * @apiParam {String} directory The directory path.
 * @apiParam {Array} [capabilities='[Media.create]'] The capabilities array.
 * @apiExample Example usage:
Actinium.Cloud.run('directory-create', {
    directory: 'uploads',
    capabilities: ['Media.create']
}).then(result => {
    console.log(result);
});
 */
Actinium.Cloud.define(PLUGIN.ID, 'directory-create', req => {
    const cap = Actinium.Setting.get('media.capabilities.directory', [
        'Media.create',
    ]);

    if (!CloudHasCapabilities(req, cap)) {
        return Promise.reject(ENUMS.ERRORS.PERMISSION);
    }

    const { directory, capabilities } = req.params;

    if (!directory) return Promise.reject(ENUMS.ERRORS.DIRECTORY);

    return Actinium.Media.directoryCreate(
        directory,
        capabilities,
        CloudRunOptions(req),
    );
});

Actinium.Cloud.define(PLUGIN.ID, 'directory-delete', req => {
    const cap = Actinium.Setting.get('media.capabilities.directory', [
        'Media.create',
    ]);

    if (!CloudHasCapabilities(req, cap)) {
        return Promise.reject(ENUMS.ERRORS.PERMISSION);
    }

    const { user } = req;
    const { directory } = req.params;

    if (!user) return Promise.reject(ENUMS.ERRORS.PERMISSIONS);
    if (!directory) return Promise.reject(ENUMS.ERRORS.DIRECTORY);

    return Actinium.Media.directoryDelete(directory, user);
});

Actinium.Cloud.define(PLUGIN.ID, 'media', req => {
    const cap = Actinium.Setting.get('media.capabilities.retrieve', [
        'Media.retrieve',
    ]);

    if (!CloudHasCapabilities(req, cap)) {
        return Promise.reject(ENUMS.ERRORS.PERMISSION);
    }

    return Actinium.Media.files({ ...req.params, user: req.user });
});

Actinium.Cloud.beforeSave(COLLECTION.DIRECTORY, async req => {
    const { directory } = req.object.toJSON();

    // Lookup the directory before we create it
    const fetch = await new Parse.Query(COLLECTION.DIRECTORY)
        .equalTo('directory', directory)
        .first({ useMasterKey: true });

    if (fetch) throw ENUMS.ERRORS.DUPLICATE_DIRECTORY;
});

Actinium.Cloud.afterDelete(COLLECTION.MEDIA, req => {
    const id = req.object.id;
    const files = Actinium.Cache.get('Media.files', {});
    delete files[id];
    Actinium.Cache.set('Media.files', files);
});

Actinium.Cloud.afterSave(COLLECTION.MEDIA, req => {
    const id = req.object.id;
    const files = Actinium.Cache.get('Media.files', {});
    files[id] = req.object.toJSON();
    Actinium.Cache.set('Media.files', files);
});
