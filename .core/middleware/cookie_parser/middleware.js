const cookieParser = require('cookie-parser');

module.exports = Actinium => {
    Actinium.Middleware.register(
        'cookie-parser',
        app => {
            app.use(cookieParser());
            return Promise.resolve();
        },
        -100000,
    );
};
