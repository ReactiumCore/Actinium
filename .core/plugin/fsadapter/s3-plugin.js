const os = require('os');
const path = require('path');
const op = require('object-path');
const S3Adapter = require('@parse/s3-files-adapter');
const AWS = require('aws-sdk');
const config = require(`${BASE_DIR}/.core/actinium-config`);
const chalk = require('chalk');
const express = require('express');

const PLUGIN = {
    ID: 'S3Adapter',
    name: 'Actinium S3 Adapter plugin.',
    description:
        'Actinium S3 file adapter plugin, used to allow runtime change of underlying Parse file adapter to allow AWS S3 Storage or Digital Ocean Spaces.',
    order: 0,
    version: {
        actinium: '>=3.1.8',
        plugin: '0.0.2',
    },
    meta: {
        group: 'FilesAdapter',
        builtIn: true,
        settings: true,
        logoURL: '/plugin-assets/S3Adapter/add-files.svg',
        scriptURL: '/plugin-assets/S3Adapter/s3-adapter.js',
        styleURL: '/plugin-assets/S3Adapter/s3-adapter-plugin.css',
    },
};

Actinium.FilesAdapter.register(PLUGIN, async (config, env) => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
    BOOT('  Files Adapter set to S3Adapter.');

    const settings = await Actinium.Setting.get('S3Adapter', {
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

    return new S3Adapter(settings);
});

Actinium.Hook.register('add-meta-asset', async metaAsset => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID) || PLUGIN.ID === metaAsset.ID)
        return;
    const parsedFilename = path.parse(metaAsset.targetFileName);
    const plugin = Actinium.Cache.get(`plugins.${metaAsset.ID}`);

    const appVer = op.get(config, 'version');
    const version = op.get(plugin, 'version', appVer);
    const { name, ext } = parsedFilename;
    metaAsset.targetFileName = `${name}-${version}${ext}`;
});

Actinium.Hook.register('activate', async ({ ID, meta = {} }, req) => {
    if (ID !== PLUGIN.ID) return;
    op.set(meta, 'logoURL', '/plugin-assets/S3Adapter/add-files.svg');
    op.set(meta, 'scriptURL', '/plugin-assets/S3Adapter/s3-adapter.js');
    op.set(meta, 'styleURL', '/plugin-assets/S3Adapter/s3-adapter-plugin.css');
    if (req.object) {
        req.object.set('meta', meta);
    }
});

Actinium.Hook.register('plugin-assets-middleware', async app => {
    const router = express.Router();
    router.use(
        `/${PLUGIN.ID}`,
        express.static(path.resolve(__dirname, 'plugin-assets')),
    );
    app.use(router);
});
