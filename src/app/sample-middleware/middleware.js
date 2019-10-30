const express = require('express');

Actinium.Middleware.register(
    'sample',
    app => {
        const router = express.Router();

        router.get('/login', (req, res) => {
            res.render(`${__dirname}/login`, {
                error: null,
                username: null,
                password: null,
            });
        });

        router.post('/login', async (req, res) => {
            const { username, password } = req.body;

            Parse.User.logIn(username, password)
                .then(user => user.fetch())
                .then(user => {
                    res.send(
                        '<pre><code>' +
                            JSON.stringify(user.toJSON(), null, 2) +
                            '</code></pre>',
                    );
                })
                .catch(err => {
                    res.render(`${__dirname}/login`, {
                        error: 'invalid username or password',
                        username,
                    });
                });
        });

        app.use(router);

        return Promise.resolve();
    },
    100000,
);
