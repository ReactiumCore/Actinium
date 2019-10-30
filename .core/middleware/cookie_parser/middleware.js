const cookieParser = require('cookie-parser');

// module.exports = {
//     order: -100000,
//     middleware: [
//         {
//             function: cookieParser(),
//         },
//     ],
// };

Actinium.Middleware.register(
    'cookie-parser',
    app => {
        app.use(cookieParser());
        return Promise.resolve();
    },
    -100000,
);
