const coreFeatures = require('./core-features');

if (ENV.RUN_TEST === true) {
    Actinium.Hook.register('init', () =>
        coreFeatures.forEach(ID => FEATURES.register(ID)),
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
