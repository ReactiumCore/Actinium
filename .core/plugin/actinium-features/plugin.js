import chalk from 'chalk';
import coreFeatures from './core-features.js';

if (ENV.RUN_TEST === true) {
    Actinium.Hook.register(
        'init',
        () => coreFeatures.forEach((ID) => FEATURES.register(ID)),
        -1000000,
    );

    Actinium.Hook.register('start', () =>
        FEATURES.list
            .map(({ id }) => id)
            .sort()
            .forEach(
                (key) =>
                    Actinium.Harness.test(
                        `Actinium.${key}`,
                        (assert) =>
                            assert.strictEqual(Actinium.Utils.isSDK(key), true),
                        null,
                        null,
                        -1000,
                    ),
                1000000,
            ),
    );
}
