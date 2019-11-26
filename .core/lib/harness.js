const Hook = require('./hook');
const slugify = require('slugify');
const op = require('object-path');
const chalk = require('chalk');

const results = {};

const Harness = {
    run: async () => {
        if (process.env.NODE_ENV !== 'production') {
            LOG(' ');
            LOG(chalk.cyan('Test Runner:'));

            const response = await Hook.run('tests');
        }
    },

    test: async (description, cb, setup, teardown) => {
        const desc = slugify(description);
        const assert = require('assert');

        Hook.register('tests', async context => {
            try {
                if (typeof setup === 'function') {
                    setup();
                }

                context[desc] = await cb(assert);
                LOG(' - ' + description + ': ' + chalk.green('OK'));

                if (typeof setup === 'function') {
                    teardown();
                }
            } catch (error) {
                if (typeof setup === 'function') {
                    teardown();
                }
                throw { description, error };
            }
        });
    },
};

Harness.test('An Example Test', async assert => {
    assert(true, 'asserted false');
});

module.exports = Harness;
