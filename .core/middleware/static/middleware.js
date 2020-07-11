const path = require('path');
const fs = require('fs-extra');
const express = require('express');

Actinium.Middleware.registerHook('plugin-assets', '/api/plugin-assets', -10000);

Actinium.Middleware.register(
    'static',
    app => {
        fs.ensureDirSync(path.normalize(ENV.STATIC_PATH));
        app.use('/api/static', express.static(path.normalize(ENV.STATIC_PATH)));
    },
    -10000,
);
