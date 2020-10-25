const express = require('express');
const request = require('request');
const op = require('object-path');
const _ = require('underscore');

Actinium.Middleware.register(
    'media',
    app => {
        const router = express.Router();
        router.use('/media/all', (req, res) => {
            res.json(
                Object.values(Actinium.Cache.get('Media.files', {})).map(
                    ({ url }) => url,
                ),
            );
        });

        router.use('/media/*', (req, res) => {
            const files = Object.values(Actinium.Cache.get('Media.files', {}));
            const rec = _.findWhere(files, { url: req.baseUrl });

            // Prioritize .redirect
            if (op.get(rec, 'redirect.url')) {
                res.redirect(rec.redirect.url);
                return;
            }

            // Test file.url value and redirect or pipe given if it's an external file or local
            const u = String(op.get(rec, 'file.url', ''));

            if (/^https?:/.test(u)) {
                res.redirect(u);
            } else {
                const p = [80, 443].includes(PORT) ? '' : `:${PORT}`;
                const fileURL = u
                    .replace('undefined/', `${ENV.PARSE_MOUNT}/`)
                    .substr(1);

                const url = `${req.protocol}://${req.hostname}${p}/${fileURL}`;
                request(url).pipe(res);
            }
        });

        app.use(router);

        return Promise.resolve();
    },
    -10000000,
);
