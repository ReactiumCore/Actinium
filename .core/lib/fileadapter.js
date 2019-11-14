const Hook = require('./hook');
const {
    GridFSBucketAdapter,
} = require('parse-server/lib/Adapters/Files/GridFSBucketAdapter');

const FileAdapter = {
    _adapter: null,
};

FileAdapter._proxy = new Proxy(FileAdapter, {
    get(target, key) {
        if (key in target._adapter) return target._adapter[key];
        return undefined;
    },

    has(target, key) {
        return key in target._adapter;
    },
});

FileAdapter.getProxy = config => {
    FileAdapter.config = config;
    FileAdapter._default();
    return FileAdapter._proxy;
};

FileAdapter._default = () => {
    if (!FileAdapter._adapter)
        FileAdapter._adapter = new GridFSBucketAdapter(
            FileAdapter.config.databaseURI,
        );
};

FileAdapter.update = async () => {
    const { adapter } = await Hook.run(
        'files-adapter',
        FileAdapter.config,
        ENV,
    );

    if (adapter) {
        FileAdapter._adapter = adapter;
    } else {
        FileAdapter._default();
    }
};

module.exports = FileAdapter;
