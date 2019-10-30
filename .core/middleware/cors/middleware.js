const cors = require('cors');

// module.exports = {
//     order: -1000000,
//     middleware: [
//         {
//             function: cors(),
//         },
//     ],
// };

Actinium.Middleware.register(
    'cors',
    app => {
        app.use(cors());
        return Promise.resolve();
    },
    -100000,
);
