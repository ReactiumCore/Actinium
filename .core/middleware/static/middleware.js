import path from 'path'; 
import fs from 'fs-extra';
import express from 'express';

Actinium.Middleware.registerHook('plugin-assets', '/api/plugin-assets', -10000);

Actinium.Middleware.register(
    'static',
    app => {
        fs.ensureDirSync(path.normalize(ENV.STATIC_PATH));
        app.use(ENV.PARSE_MOUNT + '/static', express.static(path.normalize(ENV.STATIC_PATH)));
    },
    -10000,
);
