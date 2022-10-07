const cookieSession = require('cookie-session');

module.exports = Actinium => {
    Actinium.Middleware.register(
        'cookie-session',
        app => {
            app.use(
                cookieSession({
                    name: '4lqaOOlW1',
                    keys: ['Q2FtZXJvbiBSdWxlcw', 'vT3GtyZKbnoNSdWxlcw'],
                }),
            );

            return Promise.resolve();
        },
        -100000,
    );
};
