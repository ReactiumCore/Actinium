import cors from 'cors';

Actinium.Middleware.register(
    'cors',
    app => {
        app.use(cors());
        return Promise.resolve();
    },
    -100000,
);
