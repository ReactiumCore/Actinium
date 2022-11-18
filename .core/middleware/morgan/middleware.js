import morgan from 'morgan';

Actinium.Middleware.register('morgan', app => {
    if (process.env.NODE_ENV !== 'development') {
        app.use(morgan('combined'));
    }

    return Promise.resolve();
});
