const express = require('express');
const request = require('request');
const op = require('object-path');
const _ = require('underscore');

Actinium.Middleware.register(
    'media',
    app => {
        const router = express.Router();

        router.use('/media/*', (req, res) => {
            const p = [80, 443].includes(PORT) ? '' : `:${PORT}`;
            const files = Object.values(Actinium.Cache.get('Media.files', {}));
            const rec = _.findWhere(files, { url: req.baseUrl });
            const fileURL = String(op.get(rec, 'file.url', ''))
                .replace('undefined/', `${ENV.PARSE_MOUNT}/`)
                .substr(1);

            const url = `${req.protocol}://${req.hostname}${p}/${fileURL}`;

            request(url).pipe(res);
        });

        app.use(router);

        return Promise.resolve();
    },
    -10000000,
);
