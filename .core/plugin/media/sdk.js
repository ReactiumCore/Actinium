/**
 * @api {Object} Media Media
 * @apiVersion 3.1.3
 * @apiGroup Actinium
 * @apiName Media
 * @apiDescription Utilities for managing the `Media` collection.
 */

const sharp = require('sharp');
const _ = require('underscore');
const uuid = require('uuid/v4');
const ENUMS = require('./enums');
const moment = require('moment');
const op = require('object-path');
const slugify = require('slugify');
const stripSlashes = str => String(str).replace(/^\/|\/$/g, '');

const {
    CloudHasCapabilities,
    CloudRunOptions,
    UserFromSession,
} = require(`${ACTINIUM_DIR}/lib/utils`);

const Media = { ENUMS };

const getDirectories = async options => {
    const cached = Actinium.Cache.get('media-directories-fetch');
    if (cached) return cached;

    options = options || { useMasterKey: true };
    const qry = new Parse.Query(ENUMS.COLLECTION.DIRECTORY)
        .ascending('directory')
        .exists('directory')
        .limit(1000)
        .skip(0);

    await Actinium.Hook.run('directory-query', qry);

    let results = await qry.find(options);
    const directories = [];

    while (results.length > 0) {
        results.forEach(item => directories.push(item.toJSON()));
        qry.skip(directories.length);
        results = await qry.find(options);
    }

    Actinium.Cache.set('media-directories-fetch', directories, 5000);
    return directories;
};

const getMedia = async () => {
    const options = { useMasterKey: true };
    const qry = new Parse.Query(ENUMS.COLLECTION.MEDIA)
        .ascending(['updatedAt', 'directory', 'file'])
        .include('file')
        .exists('file')
        .limit(1000)
        .skip(0);

    await Actinium.Hook.run('media-query', qry);

    let results = await qry.find(options);
    const files = {};

    while (results.length > 0) {
        results.forEach(item => (files[item.id] = item.toJSON()));
        qry.skip(Object.keys(files).length);
        results = await qry.find(options);
    }

    return files;
};

const isAdmin = userId => {
    const roles = Actinium.Roles.User.get(userId);
    return (
        _.intersection(Object.keys(roles), ['admin', 'super-admin']).length > 0
    );
};

const updateMediaDirectories = async (prev, current) => {
    if (prev === current) return;

    let skip = 0;
    const limit = 100;
    const options = { useMasterKey: true };
    const qry = new Parse.Query(ENUMS.COLLECTION.MEDIA)
        .startsWith('url', `/media/${prev}`)
        .limit(limit)
        .skip(skip);

    let results = await qry.find(options);

    while (results.length > 0) {
        results = results.map(item => {
            let { url } = item.toJSON();
            url = String(url).replace(`/media/${prev}`, `/media/${current}`);

            item.set('url', url);
            item.set('directory', current);

            return item;
        });

        await Parse.Object.saveAll(results, options);

        // Get next batch of records
        skip += limit;
        qry.skip(skip);

        results = results.length === limit ? await qry.find(options) : [];
    }
};

Media.cleanup = async (objects, deep = false) => {
    objects = Array.isArray(objects) ? objects : [objects];

    const cleanup = _.chain(
        objects.map(item => {
            const file = item.get('file');
            const meta = item.get('meta') || {};
            const thumbnail = item.get('thumbnail');

            const filenames = [file.name()];

            if (thumbnail) {
                filenames.push(thumbnail.name());
            }

            if (op.has(meta, 'image') && deep === true) {
                Object.values(meta.image).forEach(image => {
                    filenames.push(image.name());
                });
            }

            return filenames;
        }),
    )
        .flatten()
        .compact()
        .uniq()
        .value();

    return Promise.all(
        cleanup.map(filename => Media.deleteFileObject(filename)),
    );
};

Media.deleteFileObject = async filename => {
    filename = decodeURIComponent(filename);

    filename =
        String(filename).substr(0, 1) === '/'
            ? String(filename).substr(1)
            : filename;

    filename = encodeURIComponent(filename);

    const endpoint = [
        ENV.SERVER_URI,
        ENV.PARSE_MOUNT,
        '/files/',
        filename,
    ].join('');

    const req = {
        followRedirects: false,
        headers: {
            'X-Parse-Application-Id': ENV.APP_ID,
            'X-Parse-Master-Key': ENV.MASTER_KEY,
        },
        method: 'DELETE',
        url: endpoint,
    };

    let result;

    try {
        result = await Parse.Cloud.httpRequest(req);
    } catch (err) {
        /* EMPTY ON PURPOSE */
    }

    return result;
};

/**
 * @api {Asynchronous} Media.directories(search,user) Media.directories
 * @apiVersion 3.1.3
 * @apiGroup Actinium
 * @apiName Media.directories
 * @apiDescription Retrieves the complete list of Media directories.
Runs the `directory-query` hook allowing you to change or replace the default query.
The results are reduced based on the capabilities applied to each directory and the current user request.

 * @apiParam {String} [search] Search for a specific directory. Uses `Parse.Query.startsWith()` to execute the query.
 * @apiParam {Parse.User} user The user object.
 * @apiExample Example usage:
...
await Actinium.Media.directories('uploads', user);
...
 */
Media.directories = (search, user) => {
    if (!user) return {};

    // Filter items by capability & search
    let items = Actinium.Cache.get('Media.directories', []).filter(item => {
        if (
            user.id !== item.user.objectId &&
            !CloudHasCapabilities({ user }, item.capabilities)
        ) {
            return false;
        }

        if (search && !String(directory).startsWith(search)) {
            return false;
        }

        return true;
    });

    return _.chain(items)
        .pluck('directory')
        .compact()
        .uniq()
        .value()
        .sort()
        .map(item => String(slugify(item)).toLowerCase());
};

Media.directoriesFetch = getDirectories;

/**
 * @api {Asynchronous} Media.directoryDelete(directory,user) Media.directoryDelete
 * @apiVersion 3.1.3
 * @apiGroup Actinium
 * @apiName Media.directoryDelete
 * @apiDescription Delete a directory from the `MediaDirectory` table.

This will NOT delete the files within the directory.

_Use the `Media.fileDelete()` function for deleting a directory of files._
 * @apiParam {String} directory The directory path.
 * @apiParam {Parse.User} user The user object.
 * @apiExample Example usage:
...
await Actinium.Media.directoryDelete('avatars', user);
...
 */
Media.directoryDelete = async (directory, user, deleteFiles = false) => {
    if (!directory) throw ENUMS.ERRORS.DIRECTORY;
    if (!user) throw ENUMS.ERRORS.PERMISSIONS;

    const obj = await new Parse.Query(ENUMS.COLLECTION.DIRECTORY)
        .equalTo('directory', directory)
        .first({ useMasterKey: true });

    const options = CloudRunOptions({ user });
    // if (obj && CloudHasCapabilities({ user }, obj.capabilities)) {
    await obj.destroy(options);

    if (deleteFiles === true) {
        await Media.fileDelete({ directory }, user, true);
    }

    return await Media.load();
    // }

    return Media.files({ user });
};

/**
 * @api {Asynchronous} Media.directorySave({capabilities,directory,objectId,options,permissions}) Media.directorySave
 * @apiVersion 3.1.3
 * @apiGroup Actinium
 * @apiName Media.directorySave
 * @apiDescription Create a new Media directory.

 * @apiParam {String} directory The directory path.
 * @apiParam {Array} [capabilities='[Media.create]'] The capabilities array.
 * @apiParam {String} objectId Used when updating an existing directory object.
 * @apiParam {Object} options The options object.
 * @apiParam {Array} permissions List of permissions to apply to the directory. If empty the directory is read/write for all users.
 * @apiExample Example usage:
...
await Actinium.Media.directorySave({
  directory:'avatars',
  capabilities: ['Media.create'],
  objectId: 'aatk324t',
  options: { sessionToken: 'alrkgjao4tqu23qw4' },
  permissions: [
    { objectId: "Lxank79qjx", type: "role", permission: "write", name: "super-admin" },
    { objectId: "s0UJ2Hk7XC", type: "user", permission: "write" }
  ]
});
 */
Media.directorySave = async ({
    directory,
    capabilities,
    permissions = [],
    objectId,
    options,
}) => {
    if (directory) {
        directory = String(slugify(directory)).toLowerCase();
    }

    capabilities = capabilities || ['Media.create'];

    const user = await UserFromSession(op.get(options, 'sessionToken'));

    const useMasterKey = true;
    const qry = new Parse.Query(ENUMS.COLLECTION.DIRECTORY);
    const existing = objectId
        ? await qry.equalTo('objectId', objectId).first({ useMasterKey })
        : await qry.equalTo('directory', directory).first({ useMasterKey });

    if (existing && !objectId) return existing.toJSON();

    const prevDirectory = existing
        ? op.get(existing.toJSON(), 'directory')
        : null;

    const acl = new Parse.ACL();
    acl.setPublicWriteAccess(false);
    acl.setRoleWriteAccess('super-admin', true);

    if (permissions.length > 0) {
        permissions.forEach(perm => {
            const { label, name, objectId, permission, type } = perm;
            const action = `${type}-${permission}`;

            switch (action) {
                case 'role-write':
                    acl.setRoleWriteAccess(name, true);
                    acl.setRoleReadAccess(name, true);
                    break;

                case 'role-read':
                    acl.setRoleReadAccess(name, true);
                    break;

                case 'user-write':
                    acl.setWriteAccess(objectId, true);
                    acl.setReadAccess(objectId, true);
                    break;

                case 'user-read':
                    acl.setReadAccess(objectId, true);
                    break;
            }
        });
    } else {
        acl.setPublicReadAccess(true);
        acl.setRoleWriteAccess('administrator', true);
    }

    const obj = existing
        ? existing
        : new Parse.Object(ENUMS.COLLECTION.DIRECTORY);

    obj.setACL(acl)
        .set('directory', directory)
        .set('capabilities', capabilities);

    if (!existing) obj.set('user', user);

    await obj.save(null, options);

    await updateMediaDirectories(prevDirectory, directory);

    await Media.load();

    return obj.toJSON();
};

/**
 * @api {Asynchronous} Media.fileDelete(match,user,master) Media.fileDelete
 * @apiVersion 3.1.3
 * @apiGroup Actinium
 * @apiName Media.fileDelete
 * @apiDescription Delete a single file or directory containing multiple files.

The file to search for will be matched against the following fields: `url, objectId, uuid, filename, directory`

When deleting based on `filename` or `directory` There are a couple protections built in:

1. You must specify `useMasterKey` in the run `options` object.
2. Only 50 files will be deleted per request.

 * @apiParam {String} match The search string.
 * @apiParam {Parse.User} user The user object.
 * @apiParam {Boolean} [master=false] Use master key.
 * @apiExample Example usage:
...
await Actinium.Media.fileDelete('/media/uploads/some-file.jpg', user, options);
...
 */
Media.fileDelete = async (params, user, master) => {
    if (!user && !master) ENUMS.ERRORS.PERMISSIONS;

    if (Object.keys(params).length < 1)
        throw new Error(ENUMS.ERRORS.FILE_DELETE);

    const req = { user, master };
    const options = CloudRunOptions(req);

    const qry = new Parse.Query(ENUMS.COLLECTION.MEDIA);
    let p = 0;

    // Find by objectId
    if (op.has(params, 'objectId')) {
        qry.equalTo('objectId', params.objectId);
        p++;
    }

    // Find by url
    if (op.has(params, 'url')) {
        qry.equalTo('url', params.url);
        p++;
    }

    // Find by uuid
    if (op.has(params, 'uuid')) {
        qry.equalTo('uuid', params.uuid);
        p++;
    }

    // Find by filename
    if (op.has(params, 'filename') && master && isAdmin(user.id)) {
        qry.equalTo('filename', params.filename);
        p++;
    }

    // Find by directory
    if (op.has(params, 'directory') && master && isAdmin(user.id)) {
        qry.startsWith('directory', params.directory);
        p++;
    }

    // Stop from deleting all the files
    if (p < 1) return Media.files({ user });

    const objs = await qry.find(options);

    if (objs.length > 0) {
        return Parse.Object.destroyAll(objs, { useMasterKey: true });
    }
};

/**
 * @api {Function} Media.files({directory,limit,page,search,user}) Media.files
 * @apiVersion 3.1.3
 * @apiGroup Actinium
 * @apiName Media.files
 * @apiDescription Retrieves a paginated list of `Media` objects.
 * @apiParam {String} [directory] Retrieve a specific directory.
 * @apiParam {String} [search] Search for a specific `url` or `filename`.
 * @apiParam {Number} [page=1] Return the specified page of the results.
 * @apiParam {Number} [limit=50] Number of objections to return per page.
 * @apiExample Example usage:
const results = Actinium.Media.files({ directory: 'uploads' });
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
Media.files = ({ directory, limit = 50, page = 1, search, user }) => {
    if (!user) return {};

    // Filter items by capability, directory, & search
    const ids = Object.keys(Actinium.Cache.get('Media.files', {}));
    const items = Object.values(Actinium.Cache.get('Media.files', {})).filter(
        item => {
            if (
                user.id !== item.user.objectId &&
                !CloudHasCapabilities({ user }, item.capabilities)
            ) {
                return false;
            }

            if (directory && !String(item.directory).startsWith(directory)) {
                return false;
            }

            if (search && !String(item.url).includes(search)) {
                return false;
            }

            return true;
        },
    );

    const index = limit * page - limit;
    const pages = Math.ceil(items.length / limit);
    const selection = Array.from(items).splice(index, limit);
    const next = page < pages ? page + 1 : undefined;
    const prev = page > 1 ? page - 1 : undefined;

    return {
        empty: ids.length < 1,
        files: _.indexBy(selection, 'objectId'),
        directories: Media.directories(null, user),
        count: items.length,
        page,
        pages,
        index,
        limit,
        next,
        prev,
    };
};

/**
 * @api {Asynchronous} Media.get(params,options) Media.get()
 * @apiVersion 3.1.7
 * @apiGroup Actinium
 * @apiName Media.get
 * @apiDescription Retrieves a specific `Media` object.
 * @apiParam {Object} params Parameters object.
 * @apiParam {String} [params.directory] Retrieve a file by it's directory value. You must also specify `filename`.
 * @apiParam {String} [params.filename] Retrieve a file by it's filename value. You must also specify `directory`.
 * @apiParam {String} [params.objectId] Retrieve a file by it's objectId value.
 * @apiParam {String} [params.uuid] Retrieve a file by it's uuid value.
 * @apiParam {String} [params.url] Retrieve a file by it's url value.
 * @apiParam {Object} [options] The Parse options object.
 * @apiExample Example Usage:
Actinium.Media.get({ objectId: 'nr3NEdj13R'});
 */
Media.get = async (params, options) => {
    if (Object.keys(params).length < 1) {
        throw new Error('no search criteria specified.');
        return;
    }

    if (op.has(params, 'directory') && !op.has(params, 'filename')) {
        throw new Error(
            'filename is required when retrieving a file by the directory value',
        );
        return;
    }

    if (op.has(params, 'filename') && !op.has(params, 'directory')) {
        throw new Error(
            'directory is required when retrieving a file by the filename value',
        );
        return;
    }

    const qry = new Parse.Query(ENUMS.COLLECTION.MEDIA).descending('updatedAt');

    const where = {
        equalTo: ['directory', 'filename', 'objectId', 'uuid'],
        endsWith: ['url'],
    };

    Object.entries(where).forEach(([key, fields]) => {
        fields.forEach(field => {
            if (!op.has(params, field)) return;
            qry[key](field, params[field]);
        });
    });

    const item = await qry.first(options);

    if (item) return item.toJSON();
};

/**
 * @api {Function} Media.fileType(params,options) Media.fileType()
 * @apiVersion 3.1.7
 * @apiGroup Actinium
 * @apiName Media.fileType
 * @apiDescription Get the type of file the media object is. Returns one of: `IMAGE`, `VIDEO`, `AUDIO`, `FILE`.
 * @apiParam {String} file The name of the file or URL path.
 * @apiExample Example Usage:
const type = Actinium.Media.fileType('something.jpg'); // type: 'IMAGE' will be returned.
 */
Media.fileType = filename => {
    let ext = String(filename)
        .split('.')
        .pop();
    ext = String(ext).toUpperCase();

    let type = _.chain(
        Object.entries(ENUMS.TYPE).map(([type, values]) => {
            if (values.includes(ext)) return type;
            return null;
        }),
    )
        .compact()
        .uniq()
        .value()[0];

    type = type || 'FILE';
    return type;
};

// TODO: Document Media.image (sharp docs link)
Media.image = sharp;

/**
 * @api {Asynchronous} Media.load() Media.load
 * @apiVersion 3.1.3
 * @apiGroup Actinium
 * @apiName Media.load
 * @apiDescription Query the Media collection and load the results in memory.
 * @apiExample Example usage:
...
await Actinium.Media.load();
...
 */
Media.load = async () => {
    const [directories, files] = await Promise.all([
        getDirectories(),
        getMedia(),
    ]);

    Actinium.Cache.set('Media', {
        directories,
        files,
        timestamp: Date.now(),
        loading: false,
    });

    return Actinium.Cache.get('Media');
};

/**
 * @api {Asynchronous} Media.thumbnailGenerate() Media.thumbnailGenerate
 * @apiVersion 3.1.3
 * @apiGroup Actinium
 * @apiName Media.thumbnailGenerate
 * @apiDescription Generate a thumbnail from a `Actinium.File` object or image URL.
 * @apiExample Example usage:
...
const thumbnail = await Actinium.Media.thumbnailGenerate('http://somesite/someimage.jpg', { width: 200, height: 200 });
...
 */
Media.crop = async ({ prefix, url, options = { width: 200, height: 200 } }) => {
    url = typeof url === 'string' ? url : url.url();
    prefix = prefix || 'thumbnail';

    url = String(url).replace('undefined/', `${ENV.PARSE_MOUNT}/`);

    const filepath = decodeURIComponent(url.split(`/${ENV.APP_ID}/`).pop());
    const farr = String(filepath).split('/');
    const ext = url.split('.').pop();

    farr.push(`${slugify(prefix)}-${uuid()}.${ext}`);

    const filename = String(farr.join('/')).toLowerCase();

    try {
        if (String(url).substr(0, 1) === '/') {
            url = [ENV.SERVER_URI, String(url).substr(1)].join('/');
        }

        const imageData = await Parse.Cloud.httpRequest({ url }).then(
            ({ buffer }) => buffer,
        );

        if (!imageData) return;

        const buffer = await sharp(imageData)
            .resize(options)
            .toBuffer();

        if (!buffer) return;

        const byteArray = [...buffer.entries()].map(([index, byte]) => byte);

        await Media.deleteFileObject(filename);

        return new Actinium.File(filename, byteArray).save();
    } catch (err) {
        /* EMPTY ON PURPOSE */
    }
};

// TODO: Document Media.update function
Media.update = async (params, options) => {
    const { filedata, ...data } = params;
    const mediaObj = await new Parse.Query(ENUMS.COLLECTION.MEDIA)
        .equalTo('objectId', op.get(data, 'objectId'))
        .first(options);

    if (!mediaObj) return new Error(`MediaObject: ${objectId} not found`);

    delete data.objectId;

    const context = {};

    Object.entries(data).forEach(([key, value]) => {
        op.set(context, key, !!value);
        mediaObj.set(key, value);
    });

    if (filedata) {
        context['upload'] = true;
        const { directory = 'uploads', filename } = data;

        if (!filename) return new Error('filename is a required parameter');

        const ext = filename.split('.').pop();
        const fname = `${uuid()}.${ext}`;
        const file = await new Actinium.File(fname, filedata).save();

        mediaObj.set('file', file);
        mediaObj.set('ext', ext);

        const url = decodeURIComponent(
            String(file.url()).replace(
                `${ENV.SERVER_URI}${ENV.PARSE_MOUNT}/files/${ENV.APP_ID}/`,
                '/media/',
            ),
        );
        mediaObj.set('url', url);
    }

    mediaObj.set('context', context);

    return mediaObj.save(null, options).then(result => result.toJSON());
};

/**
 * @api {Asynchronous} Media.upload(data,meta,user,options) Media.upload
 * @apiVersion 3.1.3
 * @apiGroup Actinium
 * @apiName Media.upload
 * @apiDescription Function that creates a file and adds it to the Media Library.

Returns: `Parse.Object('Media')`
 * @apiParam {Mixed} data The contents of the file. This can be any valid `Actinium.File` file data value.
 * @apiParam {Object} meta The meta object for the file upload.
 * @apiParam {String} .directory The directory where the file will be saved. Required.
 * @apiParam {String} .filename The file name. Required.
 * @apiParam {Number} [.size] The number of bytes the file contains.
 * @apiParam {String} [.ID] Unique ID of the file. If empty, a new UUID will be created.
 * @apiParam {Parse.User} user The user object.
 * @apiParam {Object} options The options object.

 * @apiExample Base64 Example:
...
const data = { base64: "V29ya2luZyBhdCBQYXJzZSBpcyBncmVhdCE=" };
const meta = {
    directory: 'uploads',
    filename: 'some-file.jpg',
    size: 128093,
    other: 'meta values...',
};

const file = await Actinium.Media.upload(data, meta, user, options);
...
 * @apiExample ByteArray Example:
...
const data = [ 0xBE, 0xEF, 0xCA, 0xFE ];
const meta = {
    directory: 'uploads',
    filename: 'some-file.jpg',
    size: 128093,
    other: 'meta values...',
};

const file = await Actinium.Media.upload(data, meta, user, options);
...
 */
Media.upload = async (data, meta, user, options) => {
    let { capabilities, directory, filename } = meta;
    directory = String(directory).toLowerCase();
    filename = String(filename).toLowerCase();
    filename = slugify(filename);

    capabilities = capabilities || ['Media.retrieve'];

    const ext = filename.split('.').pop();

    // let fname = [stripSlashes(directory), stripSlashes(filename)].join('/');
    //
    // const fileExists = await new Parse.Query(ENUMS.COLLECTION.MEDIA)
    //     .endsWith('url', fname)
    //     .limit(1)
    //     .skip(0)
    //     .find({ useMasterKey: true });
    //
    // if (fileExists.length > 0) {
    //     const farr = filename.split('.');
    //     farr.pop();
    //     filename = `${uuid()}-${farr.join('.')}.${ext}`;
    //     fname = [stripSlashes(directory), stripSlashes(filename)].join('/');
    // }

    const fname = `${uuid()}.${ext}`;
    const file = await new Actinium.File(fname, data).save();

    const url = decodeURIComponent(
        String(file.url()).replace(
            `${ENV.SERVER_URI}${ENV.PARSE_MOUNT}/files/${ENV.APP_ID}/`,
            '/media/',
        ),
    );

    const obj = {
        capabilities,
        directory,
        ext,
        file,
        filename,
        meta: {
            size: meta.total,
        },
        user,
        url,
        uuid: meta.ID,
    };

    op.set(
        obj,
        'context',
        Object.keys(obj).reduce((keys, key) => {
            keys[key] = true;
            return keys;
        }, {}),
    );

    op.set(obj, 'context.upload', true);

    fileObj = await new Parse.Object(ENUMS.COLLECTION.MEDIA).save(obj, options);

    // Create the directory
    try {
        await Media.directorySave({ directory, options });
    } catch (err) {}

    return fileObj.toJSON();
};

module.exports = Media;
