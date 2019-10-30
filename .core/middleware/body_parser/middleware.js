const bodyParser = require('body-parser');

Actinium.Middleware.register(
    'body-parser',
    app => {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        return Promise.resolve();
    },
    -100000,
);
