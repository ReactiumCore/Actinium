const op = require('object-path');
const ENUMS = require('./enums');
const _ = require('underscore');

const {
    CloudHasCapabilities,
    CloudRunOptions,
} = require(`${ACTINIUM_DIR}/lib/utils`);

const COLLECTION = ENUMS.COLLECTION;

const PLUGIN = require('./meta');
const PLUGIN_SDK = require('./sdk');
const PLUGIN_ROUTES = require('./routes');
const PLUGIN_SCHEMA = require('./schema');
const PLUGIN_BLUEPRINTS = require('./blueprints');

// Create SDK Singleton
Actinium[COLLECTION.MEDIA] = op.get(Actinium, COLLECTION.MEDIA, PLUGIN_SDK);

// Register Plugin
Actinium.Plugin.register(PLUGIN, true);

// Register Capabilities & Schema
Actinium.Hook.register('activate', async ({ ID }) => {
    if (ID !== PLUGIN.ID) return;

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
});

// Register Blueprints
Actinium.Hook.register(
    'blueprint-defaults',
    blueprints => {
        if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
        PLUGIN_BLUEPRINTS.forEach(item => blueprints.push(item));
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

    if (_.pluck(Actinium.Pulse.definitions, 'id').includes('media-directories'))
        return;

    Actinium.Pulse.define('media-directories', Actinium.Media.load);
});

// Remove pulses on uninstall
Actinium.Hook.register('uninstall', ({ ID }) => {
    if (ID !== PLUGIN.ID) return;
    Actinium.Pulse.remove('media-directories');
});

// Recycle a deleted
Actinium.Hook.register('directory-delete', req => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;

    const collection = req.object.className;
    const object = req.object;

    return Actinium.Recycle.trash(
        { collection, object },
        { useMasterKey: true },
    );
});

// Register Cloud functions

/**
 * @api {Cloud} media-upload media-upload
 * @apiVersion 3.1.3
 * @apiGroup Cloud
 * @apiName media-upload
 * @apiDescription Cloud function that creates a file and adds it to the Media Library.

Permission: `Media.create` _(use the **media.capabilities.upload** setting to change)_

Returns: `Parse.Object('Media')`
 * @apiParam {Mixed} data The contents of the file. This can be any valid `Actinium.File` file data value.
 * @apiParam {Object} meta The meta object for the file upload.
 * @apiParam {String} .directory The directory where the file will be saved. Required.
 * @apiParam {String} .filename The file name. Required.
 * @apiParam {Number} [.size] The number of bytes the file contains.
 * @apiParam {String} [.ID] Unique ID of the file. If empty, a new UUID will be created.
 * @apiExample Base64 Example:
const upload = {
    data: { base64: "V29ya2luZyBhdCBQYXJzZSBpcyBncmVhdCE=" }
    meta: {
        directory: 'uploads',
        filename: 'avatar.png',
        size: 139894
    }
};

Actinium.Cloud.run('media-upload', upload);
 * @apiExample ByteArray Example:
const upload = {
    data: [ 0xBE, 0xEF, 0xCA, 0xFE ],
    meta: {
        directory: 'uploads',
        filename: 'avatar.png',
        size: 139894
    }
};

Actinium.Cloud.run('media-upload', upload);
 */
Actinium.Cloud.define(PLUGIN.ID, 'media-upload', req => {
    const cap = Actinium.Setting.get('media.capabilities.upload', [
        'Media.create',
    ]);

    if (!CloudHasCapabilities(req, cap))
        return Promise.reject(ENUMS.ERRORS.PERMISSION);

    return Actinium.Media.upload(
        req.params.data,
        req.params.meta,
        req.user,
        CloudRunOptions(req),
    );
});

/**
 * @api {Cloud} media-delete media-delete
 * @apiVersion 3.1.3
 * @apiGroup Cloud
 * @apiName media-delete
 * @apiDescription Delete a single file or directory containing multiple files.

The file to search for will be matched against the following fields: `url, objectId, uuid, filename, directory`

When deleting based on `filename` or `directory` There are a couple protections built in:

1. You must specify `useMasterKey` in the run `options` object.
2. Only 50 files will be deleted per request.

Permission: `Media.create` _(use the **media.capabilities.upload** setting to change)_

 * @apiParam {String} match The search string.
 * @apiExample Example usage:
// URL delete
Actinium.Cloud.run('media-delete', { match: '/uploads/some-file.txt' });

// Directory Delete
Actinium.Cloud.run('media-delete', { match: '/uploads' }, { useMasterKey: true });

 */
Actinium.Cloud.define(PLUGIN.ID, 'media-delete', req => {
    const cap = Actinium.Setting.get('media.capabilities.upload', [
        'Media.create',
    ]);

    if (!CloudHasCapabilities(req, cap))
        return Promise.reject(ENUMS.ERRORS.PERMISSION);

    const { user, master } = req;
    return Actinium.Media.fileDelete(req.params, user, master);
});

/**
 * @api {Cloud} directories directories
 * @apiVersion 3.1.3
 * @apiGroup Cloud
 * @apiName directories
 * @apiDescription Retrieves the complete list of Media directories.
Runs the `directory-query` hook allowing you to change or replace the default query.
The results are reduced based on the capabilities applied to each directory and the current user request.

Permission: `Media.retrieve` _(use the **media.capabilities.list** setting to change)_.

 * @apiParam {String} [search] Search for a specific directory. Uses `Parse.Query.startsWith()` to execute the query.
 * @apiParam {Boolean} [verbose] Return an Array of ParseObjects instead of the default array of strings.
 * @apiExample Example usage:
Actinium.Cloud.run('directories').then(directories => {
    console.log(directories);
});
 */
Actinium.Cloud.define(PLUGIN.ID, 'directories', async req => {
    const cap = Actinium.Setting.get('media.capabilities.list', [
        'Media.retrieve',
    ]);

    if (!CloudHasCapabilities(req, cap))
        return Promise.reject(ENUMS.ERRORS.PERMISSION);

    const { user } = req;
    const { search, verbose } = req.params;

    let directories =
        verbose === true
            ? await Actinium.Media.directoriesFetch(CloudRunOptions(req))
            : Actinium.Media.directories(search, user);

    await Actinium.Hook.run('directories', { directories, req });

    return directories;
});

/**
 * @api {Cloud} directory-save directory-save
 * @apiVersion 3.1.3
 * @apiGroup Cloud
 * @apiName directory-save
 * @apiDescription Create or update a new Media directory.

Permission: `Media.create` _(use the **media.capabilities.directory** setting to change)_.
 * @apiParam {String} directory The directory path.
 * @apiParam {Array} [capabilities='[Media.create]'] The capabilities array.
 * @apiParam {String} objectId Used when updating an existing directory object.
 * @apiParam {Array} permissions List of permissions to apply to the directory. If empty the directory is read/write for all users.
 * @apiExample Example usage:
Actinium.Cloud.run('directory-save', {
    directory: 'uploads',
    capabilities: ['Media.create']
    permissions: [
      { objectId: "Lxank79qjx", type: "role", permission: "write", name: "super-admin" },
      { objectId: "s0UJ2Hk7XC", type: "user", permission: "write" }
    ]
}).then(result => {
    console.log(result);
});
 */
Actinium.Cloud.define(PLUGIN.ID, 'directory-save', req => {
    const cap = Actinium.Setting.get('media.capabilities.directory', [
        'Media.create',
    ]);

    if (!CloudHasCapabilities(req, cap))
        return Promise.reject(ENUMS.ERRORS.PERMISSION);

    const { capabilities, directory, objectId, permissions = [] } = req.params;

    if (!directory) return Promise.reject(ENUMS.ERRORS.DIRECTORY);

    return Actinium.Media.directorySave({
        directory,
        capabilities,
        permissions,
        objectId,
        options: CloudRunOptions(req),
    });
});

/**
 * @api {Cloud} directory-delete directory-delete
 * @apiVersion 3.1.3
 * @apiGroup Cloud
 * @apiName directory-delete
 * @apiDescription Delete a directory from the `MediaDirectory` table.

This will NOT delete the files within the directory.

_Use the `media-delete` function for deleting a directory of files._

Permission: `Media.create` _(use the **media.capabilities.directory** setting to change)_

 * @apiParam {String} directory The directory path.
 * @apiExample Example usage:
Actinium.Cloud.run('directory-delete', { directory: 'avatars' });
 */
Actinium.Cloud.define(PLUGIN.ID, 'directory-delete', req => {
    const cap = Actinium.Setting.get('media.capabilities.directory', [
        'Media.create',
    ]);

    if (!CloudHasCapabilities(req, cap))
        return Promise.reject(ENUMS.ERRORS.PERMISSION);

    const { user } = req;
    const { directory, content = false } = req.params;

    if (!user) return Promise.reject(ENUMS.ERRORS.PERMISSIONS);
    if (!directory) return Promise.reject(ENUMS.ERRORS.DIRECTORY);

    return Actinium.Media.directoryDelete(directory, user, content);
});

/**
 * @api {Cloud} media media
 * @apiVersion 3.1.3
 * @apiGroup Cloud
 * @apiName media
 * @apiDescription Retrieves a paginated list of `Media` objects.

Permission: `Media.retrieve` _(use the **media.capabilities.retrieve** setting to change)_
 * @apiParam {String} [directory] Retrieve a specific directory.
 * @apiParam {String} [search] Search for a specific `url` or `filename`.
 * @apiParam {Number} [page=1] Return the specified page of the results.
 * @apiParam {Number} [limit=50] Number of objections to return per page.

 * @apiExample Example usage:
Actinium.Cloud.run('media', { page: 1, limit: 20 directory: 'avatars', search: 'user-123.jpg'});

 * @apiExample Returns
{
    files: Object,
    directories: Array,
    count: Number
    page: Number,
    pages: Number,
    index: Number,
    limit: Number,
    next: Number,
    prev: Number
}
 */
Actinium.Cloud.define(PLUGIN.ID, 'media', req => {
    const cap = Actinium.Setting.get('media.capabilities.retrieve', [
        'Media.retrieve',
    ]);

    if (!CloudHasCapabilities(req, cap))
        return Promise.reject(ENUMS.ERRORS.PERMISSION);

    return Actinium.Media.files({ ...req.params, user: req.user });
});

const dirs = () => {
    const directories = Actinium.Cache.get('Media.directories', []);
    return _.chain(directories)
        .pluck('directory')
        .compact()
        .uniq()
        .value()
        .sort();
};

Actinium.Cloud.beforeSave(COLLECTION.DIRECTORY, async req => {
    if (req.object.isNew()) {
        const { directory } = req.object.toJSON();

        // Lookup the directory before we create it
        const fetch = await new Parse.Query(COLLECTION.DIRECTORY)
            .equalTo('directory', directory)
            .first({ useMasterKey: true });

        if (fetch) return new Error('directory exists');
    }

    await Actinium.Hook.run('directory-save', req.object);
});

Actinium.Cloud.beforeDelete(COLLECTION.DIRECTORY, async req => {
    await Actinium.Hook.run('directory-delete', req);
});

Actinium.Cloud.afterDelete(COLLECTION.DIRECTORY, req => {
    const { directory } = req.object.toJSON();
    let directories = _.without(dirs(), directory).sort();
    Actinium.Cache.set('Media.directories', directories);
});

Actinium.Cloud.afterDelete(COLLECTION.MEDIA, req => {
    console.log('afterDelete', COLLECTION.MEDIA);

    const id = req.object.id;
    const files = Actinium.Cache.get('Media.files', {});
    delete files[id];
    Actinium.Cache.set('Media.files', files);
});

Actinium.Cloud.afterSave(COLLECTION.MEDIA, req => {
    Actinium.Media.load();
});

Actinium.Cloud.afterSave(COLLECTION.DIRECTORY, req => {
    Actinium.Media.load();
});
