const slugify = require('slugify');
const chalk = require('chalk');

const SDK = Actinium => {
    const Harness = {
        run: async () => {
            if (
                process.env.NODE_ENV === 'development' &&
                ENV.RUN_TEST === true
            ) {
                BOOT(' ');
                BOOT(chalk.cyan('Test Runner:'));

                await Actinium.Hook.run('tests');
            }
        },

        /**
 * @api {Function} Harness.test(description,cb,setup,teardown) Harness.test()
 * @apiVersion 3.1.2
 * @apiGroup Actinium
 * @apiName Harness.test
 * @apiDescription Add a local development functional test, to be run at startup of Actinium. Your test callback will be passed
 the node.js 'assert' object.
 * @apiParam {String} description Describe the tests run.
 * @apiParam {AsyncFunction} cb the test body
 * @apiParam {AsyncFunction} setup setup to be performed before the test
 * @apiParam {AsyncFunction} teardown work to be performed after the test to clean up
 * @apiExample Example Usage:
Actinium.Harness.test('My Test', async assert => {
    assert(false, 'should be true');
});

// Example with setup / teardown
const setup = async () => {
    const user = new Parse.User();
        user.set("username", "myName");
        user.set("password", ";lajksdf;lajsdf");
        user.set("email", "email@example.com");
    await user.save(null, { useMasterKey: true });
    await Actinium.Roles.User.add(user.id, 'super-admin', { useMasterKey: true });
};
const teardown = async () => {
    const query = new Parse.Query('_User');
    query.equalTo('username', 'myName');
    const user = await query.first({ useMasterKey: true });
    await user.destroy({ useMasterKey: true });
};
Actinium.Harness.test('My Test', async assert => {
    const query = new Parse.Query('_User');
    query.equalTo('username', 'myName');
    const user = await query.first({ useMasterKey: true });

    assert(user, 'User myName should exist.');
}, setup, teardown);

 */
        test: async (description, cb, setup, teardown, order = 100) => {
            const desc = slugify(description);
            const assert = require('assert');

            Actinium.Hook.register(
                'tests',
                async context => {
                    try {
                        if (typeof setup === 'function') {
                            await setup();
                        }

                        context[desc] = await cb(assert);
                        BOOT(
                            ' ',
                            chalk.cyan('Test'),
                            chalk.cyan('→'),
                            chalk.magenta(description),
                            chalk.green.bold('[OK]'),
                        );

                        if (typeof teardown === 'function') {
                            await teardown();
                        }
                    } catch (error) {
                        if (typeof teardown === 'function') {
                            await teardown();
                        }
                        BOOT(
                            ' ',
                            chalk.cyan('Test'),
                            chalk.cyan('→'),
                            chalk.magenta(description),
                            chalk.red.bold('[FAIL]'),
                        );
                        DEBUG(error);
                    }
                },
                order,
            );
        },
    };

    return Harness;
};

module.exports = SDK;
