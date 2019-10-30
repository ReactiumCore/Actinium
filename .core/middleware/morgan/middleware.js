const morgan = require('morgan');

// module.exports = {
//     order: -10000000,
//     middleware:
//         process.env.NODE_ENV !== 'development'
//             ? [
//                   {
//                       function: morgan('combined'),
//                   },
//               ]
//             : [],
// };

Actinium.Middleware.register('morgan', app => {
    if (process.env.NODE_ENV !== 'development') {
        app.use(morgan('combined'));
    }

    return Promise.resolve();
});
