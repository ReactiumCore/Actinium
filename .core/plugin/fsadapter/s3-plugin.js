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
    order: Actinium.Enums.priority.high,
    version: {
        actinium: '>=3.1.8',
        plugin: '0.0.2',
    },
    meta: {
        group: 'FilesAdapter',
        builtIn: true,
        settings: true,
    },
};

const _addStaticAssets = plugin => {
    op.set(
        plugin,
        'meta.assets.admin.logo',
        '/plugin-assets/S3Adapter/add-files.svg',
    );
    op.set(
        plugin,
        'meta.assets.admin.script',
        '/plugin-assets/S3Adapter/s3-adapter.js',
    );
    op.set(
        plugin,
        'meta.assets.admin.style',
        '/plugin-assets/S3Adapter/s3-adapter-plugin.css',
    );
};

_addStaticAssets(PLUGIN);

Actinium.FilesAdapter.register(PLUGIN, async (config, env) => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;

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

const installAssets = async (pluginObj, req) => {
    if (PLUGIN.ID !== pluginObj.ID) return;

    _addStaticAssets(pluginObj);
    if (req.object) {
        req.object.set('meta', op.get(pluginObj, 'meta', {}));
    }
};

Actinium.Hook.register('plugin-assets-middleware', async app => {
    const router = express.Router();
    router.use(
        `/${PLUGIN.ID}`,
        express.static(path.resolve(__dirname, 'plugin-assets')),
    );
    app.use(router);
});
