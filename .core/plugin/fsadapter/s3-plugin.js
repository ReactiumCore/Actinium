const os = require('os');
const path = require('path');
const op = require('object-path');
const S3Adapter = require('@parse/s3-files-adapter');
const AWS = require('aws-sdk');
const config = require(`${BASE_DIR}/.core/actinium-config`);

const PLUGIN = {
    ID: 'S3Adapter',
    name: 'Actinium S3 Adapter plugin.',
    description:
        'Actinium S3 file adapter plugin, used to allow runtime change of underlying Parse file adapter to allow AWS S3 Storage or Digital Ocean Spaces.',
    order: 0,
    version: {
        actinium: '>=3.1.2',
        plugin: '0.0.1',
    },
    meta: {
        group: 'FilesAdapter',
        builtIn: true,
        settings: true,
    },
};

Actinium.FilesAdapter.register(PLUGIN, async (config, env) => {
    const settings = Actinium.Setting.get('S3Adapter', {
        directAccess: config.directAccess,
        bucket: ENV.S3_BUCKET,
        region: ENV.S3_REGION,
        baseUrl: ENV.S3_BASE_URL,
        s3overrides: {
            accessKeyId: ENV.S3_ACCESS_KEY,
            secretAccessKey: ENV.S3_SECRET_KEY,
        },
    });

    if (!op.has(settings, 's3overrides.endpoint')) {
        const endpoint = op.get(ENV, 'SPACES_ENDPOINT');
        if (endpoint) op.set(settings, 's3overrides.endpoint', endpoint);
    }

    await new S3Adapter(settings);
});

Actinium.Plugin.addLogo(
    PLUGIN.ID,
    path.resolve(__dirname, 'plugin-assets/add-files.svg'),
);
Actinium.Plugin.addScript(
    PLUGIN.ID,
    path.resolve(__dirname, 'plugin-assets/s3-adapter.js'),
);
Actinium.Plugin.addStylesheet(
    PLUGIN.ID,
    path.resolve(__dirname, 'plugin-assets/s3-adapter-plugin.css'),
);

Actinium.Hook.register('add-meta-asset', async metaAsset => {
    if (!Plugin.isActive(PLUGIN.ID)) return;
    const parsedFilename = path.parse(metaAsset.targetFileName);
    const plugin = Actinium.Cache.get(`plugins.${metaAsset.ID}`);
    const appVer = op.get(config, 'version');
    const version = op.get(plugin, 'version', appVer);
    const { name, ext } = parsedFilename;

    metaAsset.targetFileName = `${name}-${version}${ext}`;
});
