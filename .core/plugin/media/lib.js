const _ = require('underscore');
const uuid = require('uuid/v4');
const ENUMS = require('./enums');
const moment = require('moment');
const op = require('object-path');
const stripSlashes = str => String(str).replace(/^\/|\/$/g, '');
const {
    CloudRunOptions,
    UserFromSession,
} = require(`${ACTINIUM_DIR}/lib/utils`);

const Media = { ENUMS };

const getDirectories = async () => {
    const options = { useMasterKey: true };
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

const mapUploadToData = upload => {
    const {
        ID,
        chunk,
        directory,
        filename,
        index,
        total,
        totalChunkCount,
    } = upload;

    return {
        ID,
        chunk,
        directory,
        index: Number(index),
        filename,
        total,
        totalChunkCount,
    };
};

const load = async () => {
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

Media.chunks = async (ID, options = { useMasterKey: true }) => {
    const qry = new Parse.Query(ENUMS.COLLECTION.UPLOAD)
        .ascending('index')
        .equalTo('ID', ID)
        .limit(1000)
        .skip(0);

    let results = await qry.find(options);
    let chunks = [];

    while (results.length > 0) {
        results.forEach(item => {
            chunks.push(item.toJSON());
        });

        qry.skip(chunks.length);
        results = await qry.find(options);
    }

    return _.flatten(_.pluck(chunks, 'chunk'));
};

Media.chunkClear = async (ID, options = { useMasterKey: true }) => {
    const qry = new Parse.Query(ENUMS.COLLECTION.UPLOAD)
        .equalTo('ID', ID)
        .ascending('index')
        .skip(0)
        .limit(100);

    let results = await qry.find(options);

    while (results.length > 0) {
        await Parse.Object.destroyAll(results, options);
        results = await qry.find(options);
    }
};

Media.chunkUpload = async (upload = {}, options = { useMasterKey: true }) => {
    let user;

    if (op.get(upload, 'params')) {
        options = CloudRunOptions(upload);
        upload = upload.params;
        user = upload.user;
    }

    if (!user && op.get(options, 'sessionToken')) {
        user = await UserFromSession(op.get(options, 'sessionToken'));
    }

    // 1.0 - Create chunk Parse object
    const data = mapUploadToData(upload);
    await new Parse.Object(ENUMS.COLLECTION.UPLOAD).save(data, options);

    // 2.0 - Check if the upload is complete
    const { directory, filename, ID, total } = upload;
    const chunks = await Media.chunks(ID, options);

    // 3.0 - Get status
    const status =
        chunks.length === total
            ? ENUMS.STATUS.COMPLETE
            : ENUMS.STATUS.UPLOADING;

    // 4.0 - If complete -> create the Actinium.File object
    if (status === ENUMS.STATUS.COMPLETE) {
        // 4.1 - Clear the chunks
        await Media.chunkClear(ID, options);

        // 4.2 - Create the file object
        const data = { directory, filename, ID, bytes: total };
        const mediaObj = await Media.fileCreate(chunks, data, user, options);

        // 4.3 - return the file object
        return { status, file: mediaObj.toJSON() };
    } else {
        // 4.4 - return the status if not complete
        return { status };
    }
};

Media.fileCreate = async (filedata, meta, user, options) => {
    if (!user) {
        throw new Error('Permission denied');
        return;
    }

    let { capabilities, directory, filename, ID } = meta;
    ID = ID || uuid();
    directory = String(directory).toLowerCase();
    filename = String(filename).toLowerCase();

    capabilities = capabilities || ['Media.retrieve'];

    let fileObj = await new Parse.Query(ENUMS.COLLECTION.MEDIA)
        .equalTo('uuid', ID)
        .first({ useMasterKey: true });

    if (!fileObj) {
        const fname = [stripSlashes(directory), stripSlashes(filename)].join(
            '/',
        );

        const regex = new RegExp(`http://localhost:${PORT}`, 'gi');
        const file = await new Actinium.File(fname, filedata).save(options);
        const ext = filename.split('.').pop();
        const obj = {
            capabilities,
            directory,
            ext,
            file,
            filename,
            meta,
            user,
            uuid: ID,
            url: decodeURIComponent(String(file.url()).replace(regex, '')),
        };

        fileObj = await new Parse.Object(ENUMS.COLLECTION.MEDIA).save(
            obj,
            options,
        );

        // Create the directory
        try {
            await Media.directoryCreate(directory, null, options);
        } catch (err) {}
    }

    return fileObj;
};

Media.fileDelete = async (ID, user) => {
    let obj = await new Parse.Query(ENUMS.COLLECTION.MEDIA)
        .equalTo('objectId', ID)
        .first({ useMasterKey: true });

    obj =
        obj ||
        (await new Parse.Query(ENUMS.COLLECTION.MEDIA)
            .equalTo('uuid', ID)
            .first({ useMasterKey: true }));

    if (obj && CloudHasCapabilities({ user }, obj.capabilities)) {
        ID = obj.id;

        await obj.destroy();

        let files = Actinium.Cache.get('Media.files', {});
        delete files[ID];

        Actinium.Cache.set('Media.files', files);
    }
};

Media.directoryCreate = async (directory, capabilities, options) => {
    capabilities = capabilities || ['Media.create'];

    const user = await UserFromSession(op.get(options, 'sessionToken'));

    const existing = Actinium.Cache.get('Media.directories', []).includes(
        directory,
    );

    if (existing) {
        return true;
    }

    try {
        const obj = await new Parse.Object(ENUMS.COLLECTION.DIRECTORY)
            .set('directory', directory)
            .set('capabilities', capabilities)
            .set('user', user)
            .save(null, options);

        await Actinium.Hook.run('directory-create', obj);

        await Media.load();

        return obj.toJSON();
    } catch (err) {}
};

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

Media.directories = (search, user) => {
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

Media.files = ({ directory, limit = 100, page = 1, search, user }) => {
    if (!user) return {};

    // Filter items by capability, directory, & search
    let items = Object.values(Actinium.Cache.get('Media.files', {})).filter(
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

    const pages = Math.ceil(items.length / limit);
    const index = limit * page - limit;
    const selection = Array.from(items).splice(index, limit);
    const next = page < pages ? page + 1 : undefined;
    const prev = page > 1 ? page - 1 : undefined;

    return {
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

Media.load = load;

module.exports = Media;
