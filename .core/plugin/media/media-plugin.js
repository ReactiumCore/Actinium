const op = require('object-path');
const ENUMS = require('./enums');
const _ = require('underscore');
const uuid = require('uuid/v4');

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

// Directory save hook
Actinium.Hook.register('directory-save', async req => {
    if (req.object.isNew()) {
        const { directory } = req.object.toJSON();

        // Lookup the directory before we create it
        const fetch = await new Parse.Query(COLLECTION.DIRECTORY)
            .equalTo('directory', directory)
            .first({ useMasterKey: true });

        if (fetch) throw new Error('directory exists');
        return;
    }
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

// Media save
Actinium.Hook.register('media-save', async req => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;

    let { ext, thumbnail, type } = req.object.toJSON();
    const file = req.object.get('file');

    // Set Type
    if (!type) {
        type = Actinium.Media.fileType(file.name());
        req.object.set('type', type);
    }

    // Clear existing file if uploading a new one
    if (!req.object.isNew() && op.get(req, 'context.upload')) {
        const prevObj = await new Parse.Object(COLLECTION.MEDIA)
            .set('objectId', req.object.id)
            .fetch({ useMasterKey: true });

        if (prevObj) {
            await Actinium.Media.cleanup([prevObj]);
            thumbnail = undefined;
        }
    }

    // Create thumbnail
    if (type === 'IMAGE' && file && !thumbnail) {
        thumbnail = await Actinium.Media.crop({ url: file });
        if (thumbnail) {
            req.object.set('thumbnail', thumbnail);
        }
    }
});

// Media deleted
Actinium.Hook.register('after-media-delete', req =>
    Actinium.Media.cleanup([req.object], true),
);

// Register Cloud functions

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

Actinium.Cloud.define(PLUGIN.ID, 'media-delete-thumbnail', async req => {
    const cap = Actinium.Setting.get('media.capabilities.upload', [
        'Media.create',
    ]);

    if (!CloudHasCapabilities(req, cap))
        return Promise.reject(ENUMS.ERRORS.PERMISSION);

    const { user, master } = req;
    const { objectId, property } = req.params;

    let file;
    const options = CloudRunOptions(req);
    const obj = await new Parse.Object(COLLECTION.MEDIA)
        .set('objectId', objectId)
        .fetch(options);

    const isMeta = String(property).startsWith('meta.');

    if (isMeta) {
        const fld = String(property).substr(5);
        const meta = obj.get('meta') || {};
        file = op.get(meta, fld);

        op.del(meta, fld);
        obj.set('meta', meta);
    } else {
        file = obj.get(property);
        obj.unset(property);
    }

    if (file) {
        const filename = file.name();
        await Actinium.Media.deleteFileObject(filename);
    }

    return obj.save(null, options);
});

/**
 * @api {Cloud} media-update media-update
 * @apiVersion 3.1.3
 * @apiGroup Cloud
 * @apiName media-update
 * @apiDescription Function that updates a Media Object.
 * @apiParam {Object} params The Media Object data to update.
 * @apiParam {String} .objectId The `objectId` field is required and is used to fetch the Media Object to update.
 * @apiParam {String} .filedata If you're trying replace the `file` object via dataurl, you can pass the `filedata` property to accomplish this.
 * @apiParam {Object} options Parse options object.
 * @apiExample Example usage:
const updatedMediaObj = await Parse.Cloud.run('media-update', {
    objectId: 'tP66wMkNPx',
    filename: 'different-file-name.jpg',
    meta: {
        title: 'A new title',
        description: 'A new decription',
    }
}, {
    useMasterKey: true,
});
 */
Actinium.Cloud.define(PLUGIN.ID, 'media-update', req => {
    const cap = Actinium.Setting.get('media.capabilities.upload', [
        'Media.create',
    ]);

    if (!CloudHasCapabilities(req, cap))
        return Promise.reject(ENUMS.ERRORS.PERMISSION);

    delete req.params.thumbnail;

    return Actinium.Media.update(req.params, CloudRunOptions(req));
});

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
 * @api {Cloud} media-retrieve media-retrieve
 * @apiVersion 3.1.7
 * @apiGroup Cloud
 * @apiName media-retrieve
 * @apiDescription Retrieves a specific `Media` object.
 * @apiParam {String} [directory] Retrieve a file by it's directory value. You must also specify `filename`.
 * @apiParam {String} [filename] Retrieve a file by it's filename value. You must also specify `directory`.
 * @apiParam {String} [objectId] Retrieve a file by it's objectId value.
 * @apiParam {String} [uuid] Retrieve a file by it's uuid value.
 * @apiParam {String} [url] Retrieve a file by it's url value.
 */
Actinium.Cloud.define(PLUGIN.ID, 'media-retrieve', req => {
    const cap = Actinium.Setting.get('media.capabilities.retrieve', [
        'Media.retrieve',
    ]);

    if (!CloudHasCapabilities(req, cap))
        return Promise.reject(ENUMS.ERRORS.PERMISSION);

    const options = CloudRunOptions(req);

    return Actinium.Media.get(req.params, options);
});

/**
 * @api {Asynchronous} media-image-crop media-image-crop
 * @apiVersion 3.1.3
 * @apiGroup Actinium
 * @apiName media-image-crop
 * @apiDescription Generate a cropped version of the specified image from an `Actinium.File` object or image URL. Useful for creating thumbnails or responsive image sizes. Returns: `Actinium.File` object.
 * @apiParam {Mixed} url `String` or `Actinium.File` object. The source image url. If the value is an `Actinium.File` object, the `Actinium.File.url()` value used to fetch the image.
 * @apiParam {String} [objectId] The Parse Object to attach the cropped image to.
 * @apiParam {String} [field='thumbnail'] The field to attach the new image to. Used when the `objectId` parameter is set.
 * @apiParam {Object} [options] Sharp image [resize](https://sharp.pixelplumbing.com/api-resize) options. By default, `width` and `height` are set to `400`.
 * @apiExample Example usage:
...
const thumbnail = await Actinium.Cloud.run('media-image-crop', {
    url: 'http://somesite/someimage.jpg',
    options: { width: 200, height: 200 }
});
...
 */
Actinium.Cloud.define(PLUGIN.ID, 'media-image-crop', async req => {
    let { ext, field, objectId, options, url } = req.params;

    if (!url) throw new Error('url is a required parameter');

    field = field || 'thumbnail';

    const image = await Actinium.Media.crop({
        ext,
        prefix: field,
        url,
        options,
    });

    if (objectId) {
        const cloudopts = CloudRunOptions(req);

        const obj = await new Parse.Object(COLLECTION.MEDIA)
            .set('objectId', objectId)
            .fetch(cloudopts);

        if (field === 'thumbnail') {
            // Delete previous image
            const prevTHM = obj.get('thumbnail');

            if (prevTHM) {
                await Actinium.Media.deleteFileObject(prevTHM.name());
            }

            // Set new thumbnail
            obj.set(field, image);
        } else {
            // Delete previous image
            const f = String(field).replace('meta.', '');
            const meta = obj.get('meta') || {};
            const prevURL = op.get(meta, f);

            if (prevURL) {
                await Actinium.Media.deleteFileObject(prevURL.name());
            }

            // Set new image
            op.set(meta, f, image);
            obj.set('meta', meta);
        }

        await obj.save(null, cloudopts);
    }

    return image;
});

Actinium.Cloud.beforeDelete(COLLECTION.DIRECTORY, async req => {
    await Actinium.Hook.run('directory-delete', req);
});

Actinium.Cloud.beforeSave(COLLECTION.DIRECTORY, req =>
    Actinium.Hook.run('directory-save', req),
);

Actinium.Cloud.beforeSave(COLLECTION.MEDIA, req => {
    req.context = req.object.get('context') || {};
    req.object.unset('context');

    return Actinium.Hook.run('media-save', req);
});

Actinium.Cloud.afterDelete(COLLECTION.DIRECTORY, req => {
    const dirs = () => {
        const directories = Actinium.Cache.get('Media.directories', []);
        return _.chain(directories)
            .pluck('directory')
            .compact()
            .uniq()
            .value()
            .sort();
    };

    const { directory } = req.object.toJSON();
    let directories = _.without(dirs(), directory).sort();
    Actinium.Cache.set('Media.directories', directories);
    Actinium.Hook.run('after-directory-delete', req);
});

Actinium.Cloud.afterDelete(COLLECTION.MEDIA, req => {
    const id = req.object.id;
    const files = Actinium.Cache.get('Media.files', {});
    delete files[id];
    Actinium.Cache.set('Media.files', files);
    Actinium.Hook.run('after-media-delete', req);
});

Actinium.Cloud.afterFind(COLLECTION.MEDIA, async req => {
    req.objects.forEach(obj => {
        const file = obj.get('file');
        const type = Actinium.Media.fileType(file.name());
        obj.set('type', type);
    });

    await Actinium.Hook.run('media-find', req);

    return req.objects;
});

Actinium.Cloud.afterSave(COLLECTION.MEDIA, async req => {
    await Actinium.Hook.run('after-media-save', req);
    Actinium.Media.load();
});

Actinium.Cloud.afterSave(COLLECTION.DIRECTORY, async req => {
    await Actinium.Hook.run('after-directory-save', req);
    Actinium.Media.load();
});
