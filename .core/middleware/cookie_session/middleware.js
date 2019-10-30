const cookieSession = require('cookie-session');

// module.exports = {
//     order: -100000,
//     middleware: [
//         {
//             function: cookieSession({
//                 name: '4lqaOOlW1',
//                 keys: ['Q2FtZXJvbiBSdWxlcw', 'vT3GtyZKbnoNSdWxlcw'],
//             }),
//         },
//     ],
// };

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
