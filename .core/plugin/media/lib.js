const path = require('path');
const fs = require('fs-extra');
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

Buffer.prototype.toArray = function() {
    if (this.length > 0) {
        const data = new Array(this.length);
        for (let i = 0; i < this.length; i = i + 1) data[i] = this[i];
        return data;
    }
    return [];
};

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

Media.chunkCount = (ID, options = { useMasterKey: true }) =>
    new Parse.Query(ENUMS.COLLECTION.UPLOAD).equalTo('ID', ID).count(options);

Media.chunkClear = async (ID, options = { useMasterKey: true }) => {
    const qry = new Parse.Query(ENUMS.COLLECTION.UPLOAD)
        .equalTo('ID', ID)
        .limit(100)
        .skip(0);

    let results = await qry.find(options);

    while (results.length > 0) {
        await Parse.Object.destroyAll(results, options);
        results = await qry.find(options);
    }
};

Media.chunkUpload = async (upload = {}, options = { useMasterKey: true }) => {
    const { directory, filename, index, ID, total, totalChunkCount } = upload;

    // 1.0 - Create chunk Parse object
    await new Parse.Object(ENUMS.COLLECTION.UPLOAD).save(upload, options);

    // 2.0 - Check if the upload is complete
    const count = await Media.chunkCount(ID, options);
    const progress = count / totalChunkCount;
    const status =
        count === totalChunkCount
            ? ENUMS.STATUS.COMPLETE
            : ENUMS.STATUS.UPLOADING;

    console.log(`${Math.ceil((count / totalChunkCount) * 100)}%`);

    if (status === ENUMS.STATUS.COMPLETE) {
        let user;

        if (op.get(upload, 'params')) {
            options = CloudRunOptions(upload);
            upload = upload.params;
            user = upload.user;
        }

        if (!user && op.get(options, 'sessionToken')) {
            user = await UserFromSession(op.get(options, 'sessionToken'));
        }

        // 3.0 - Create the Media object
        const mediaData = { directory, filename, ID, bytes: total };
        const mediaObj = await Media.fileCreate(ID, mediaData, user, options);
        return { status, progress: 1, file: mediaObj };
    } else {
        return { status, progress };
    }
};

Media.chunks = async (ID, meta, options) => {
    const ext = String(op.get(meta, 'filename', ''))
        .split('.')
        .pop();

    const tmp = path.join(process.cwd(), '.tmp', 'upload', `${ID}.${ext}`);
    fs.ensureFileSync(tmp);

    const stream = fs.createWriteStream(tmp, { flags: 'a' });
    let skip = 0;

    const qry = new Parse.Query(ENUMS.COLLECTION.UPLOAD)
        .ascending('index')
        .equalTo('ID', ID)
        .limit(50)
        .skip(0);

    let results = await qry.find(options);
    while (results.length > 0) {
        results.forEach(item => stream.write(Buffer.from(item.get('chunk'))));
        // await Parse.Object.destroyAll(results, { useMasterKey: true });

        skip += results.length;
        qry.skip(skip);

        results = await qry.find(options);
    }

    return tmp;
};

Media.fileCreate = async (ID, meta, user, options) => {
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

    let fileExists = await new Parse.Query(ENUMS.COLLECTION.MEDIA)
        .endsWith('url', fname)
        .find({ useMasterKey: true });

    if (fileExists.length > 0) {
        const farr = filename.split('.');
        farr.pop();
        filename = `${uuid()}-${farr.join('.')}.${ext}`;
        fname = [stripSlashes(directory), stripSlashes(filename)].join('/');
    }

    const tmp = await Media.chunks(ID, meta, options);
    const bytes = Buffer.from(fs.readFileSync(tmp)).toArray();

    const file = await new Actinium.File(fname, bytes).save(options);
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
        meta,
        user,
        uuid: ID,
        url,
    };

    fileObj = await new Parse.Object(ENUMS.COLLECTION.MEDIA).save(obj, options);

    // Create the directory
    try {
        await Media.directoryCreate(directory, null, options);
    } catch (err) {}

    return fileObj.toJSON();
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
