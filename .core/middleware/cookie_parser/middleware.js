import cookieParser from 'cookie-parser';

Actinium.Middleware.register(
    'cookie-parser',
    app => {
        app.use(cookieParser());
        return Promise.resolve();
    },
    -100000,
);
