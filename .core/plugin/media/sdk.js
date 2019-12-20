/**
 * @api {Object} Media Media
 * @apiVersion 3.1.3
 * @apiGroup Actinium
 * @apiName Media
 * @apiDescription Utilities for managing the `Media` collection.
 */

const _ = require('underscore');
const uuid = require('uuid/v4');
const ENUMS = require('./enums');
const moment = require('moment');
const op = require('object-path');
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
    if (!user) {
        throw new Error('Permission denied');
        return;
    }

    let { capabilities, directory, filename } = meta;
    directory = String(directory).toLowerCase();
    filename = String(filename).toLowerCase();

    capabilities = capabilities || ['Media.retrieve'];

    const ext = filename.split('.').pop();

    let fname = [stripSlashes(directory), stripSlashes(filename)].join('/');

    const fileExists = await new Parse.Query(ENUMS.COLLECTION.MEDIA)
        .endsWith('url', fname)
        .limit(1)
        .skip(0)
        .find({ useMasterKey: true });

    if (fileExists.length > 0) {
        const farr = filename.split('.');
        farr.pop();
        filename = `${uuid()}-${farr.join('.')}.${ext}`;
        fname = [stripSlashes(directory), stripSlashes(filename)].join('/');
    }

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

    fileObj = await new Parse.Object(ENUMS.COLLECTION.MEDIA).save(obj, options);

    // Create the directory
    try {
        await Media.directorySave({ directory, options });
    } catch (err) {}

    return fileObj.toJSON();
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

    // Find by objectId
    if (op.has(params, 'objectId')) {
        qry.equalTo('objectId', params.objectId);
    }

    // Find by url
    if (op.has(params, 'url')) {
        qry.equalTo('url', params.url);
    }

    // Find by uuid
    if (op.has(params, 'uuid')) {
        qry.equalTo('uuid', params.uuid);
    }

    // Find by filename
    if (op.has(params, 'filename') && master && isAdmin(user.id)) {
        qry.equalTo('filename', params.filename);
    }

    // Find by directory
    if (op.has(params, 'directory') && master && isAdmin(user.id)) {
        qry.equalTo('directory', params.directory);
    }

    const objs = await qry.find(options);

    if (objs.length > 0) {
        await Parse.Object.destroyAll(objs, options);
        return Media.load();
    } else throw new Error(ENUMS.ERRORS.FILE_DELETE);
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

    await Media.updateMediaDirectories(prevDirectory, directory);

    await Media.load();

    return obj.toJSON();
};

Media.updateMediaDirectories = async (prev, current) => {
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
Media.directoryDelete = async (directory, user) => {
    if (!directory) throw ENUMS.ERRORS.DIRECTORY;
    if (!user) throw ENUMS.ERRORS.PERMISSIONS;

    const obj = await new Parse.Query(ENUMS.COLLECTION.DIRECTORY)
        .equalTo('directory', directory)
        .first({ useMasterKey: true });

    if (obj && CloudHasCapabilities({ user }, obj.capabilities)) {
        await obj.destroy();

        let dirs = Actinium.Cache.get('Media.directories', []);
        dirs = _.without(directory);

        Actinium.Cache.set('Media.directories', dirs);
    }
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
    const items = Actinium.Cache.get('Media.directories', []).filter(item => {
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
        .sort();
};

Media.directoriesFetch = getDirectories;

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
    const loading = Actinium.Cache.get('Media.loading', false);

    if (loading === true) {
        return Actinium.Cache.get('Media');
    }

    Actinium.Cache.set('Media.loading', true);

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

module.exports = Media;
