const chalk = require('chalk');
const copy = require('clipboardy');
const coreFeatures = require('./core-features');

Actinium.Hook.register('start', () => {
    if (ENV.FEATURE_GEN) {
        const regex = /^[A-Z]/;

        copy.writeSync(
            JSON.stringify(
                Object.keys(Actinium)
                    .sort()
                    .filter(key => regex.test(key)),
                null,
                2,
            ),
        );

        BOOT('');
        BOOT(chalk.green('✓'), 'Actinium SDK feature list copied to clipboard');
    }
});

if (ENV.RUN_TEST === true) {
    Actinium.Hook.register(
        'init',
        () => coreFeatures.forEach(ID => FEATURES.register(ID)),
        -1000000,
    );

    Actinium.Hook.register('start', () =>
        FEATURES.list
            .map(({ id }) => id)
            .sort()
            .forEach(
                key =>
                    Actinium.Harness.test(
                        `Actinium.${key}`,
                        assert =>
                            assert.strictEqual(Actinium.Utils.isSDK(key), true),
                        null,
                        null,
                        -1000,
                    ),
                1000000,
            ),
    );
}
