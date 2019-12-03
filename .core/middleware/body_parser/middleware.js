const bodyParser = require('body-parser');

Actinium.Middleware.register(
    'body-parser',
    app => {
        app.use(bodyParser.json({ limit: '50mb' }));
        app.use(bodyParser.urlencoded({ extended: true, limti: '50mb' }));
        return Promise.resolve();
    },
    -100000,
);
