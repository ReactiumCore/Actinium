const cors = require('cors');

module.exports = Actinium => {
    Actinium.Middleware.register(
        'cors',
        app => {
            app.use(cors());
            return Promise.resolve();
        },
        -100000,
    );
};
