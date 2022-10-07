const chalk = require('chalk');
const _ = require('underscore');
const cron = require('node-cron');

const SDK = Actinium => {
    const pulse = {};

    const noop = () => {};

    pulse.definitions = [];

    pulse.define = (...args) => {
        // id should be first arg
        let id = args.shift();
        if (!id) {
            return;
        }

        id = String(id);

        // Callback should be last arg
        const callback = args.length > 0 ? args.pop() : null;
        if (typeof callback !== 'function') {
            return;
        }

        // Params should be the 2nd arg
        let params = args.length > 0 ? args.shift() : {};
        params = typeof params === 'string' ? { schedule: params } : params;

        // Options should be the 3rd arg
        const options = args.length > 0 ? args.shift() : {};

        const { schedule = '* * * * *', order = 100 } = params;
        params['pulseID'] = id;

        const task = cron.schedule(
            schedule,
            () =>
                callback(params)
                    .then(result => {
                        return result;
                    })
                    .catch(err => pulse.log(id, 'error', err)),
            options,
        );
        const warn = _.findWhere(pulse.definitions, { id })
            ? `${id} Pulse already defined`
            : null;

        const obj = { id, order, task, warn };
        pulse.definitions.push(obj);

        return obj;
    };

    pulse.info = () => {
        if (!Actinium.options.NO_PULSE) {
            _.sortBy(pulse.definitions, 'order').forEach(({ id, task }) => {
                BOOT(
                    ' ',
                    chalk.cyan('Pulse'),
                    chalk.cyan('→'),
                    chalk.magenta(id),
                );
            });
        }
    };

    pulse.init = () => {
        if (!Actinium.options.NO_PULSE) {
            _.sortBy(pulse.definitions, 'order').forEach(({ task }) =>
                task.start(),
            );
        }
    };

    pulse.log = (id, status, params, user) => {
        const sessionToken = user ? user.getSessionToken() : null;
        return Parse.Cloud.run(
            'actinium-pulse-log',
            { id, params, status },
            { sessionToken },
        );
    };

    pulse.remove = id => {
        if (!id) {
            return;
        }

        for (let i = pulse.definitions.length - 1; i > -1; i--) {
            const item = pulse.definitions[i];
            if (id == item.id) {
                const { task } = item;
                if (task) {
                    task.destroy();
                    pulse.definitions.splice(i, 1);
                }
            }
        }
    };

    pulse.replace = (...args) => {
        const id = args[0];
        if (!id) {
            return;
        }

        pulse.remove(id, true);
        pulse.define(...args);
    };

    pulse.start = id => {
        if (!id) {
            return;
        }

        for (let i = pulse.definitions.length - 1; i > -1; i--) {
            const item = pulse.definitions[i];
            if (id == item.id) {
                const { task } = item;
                if (task) {
                    task.start();
                }
            }
        }
    };

    pulse.status = (id, params = {}) =>
        Actinium.Cloud.run('actinium-pulse.status', params);

    pulse.stop = id => {
        if (!id) {
            return;
        }

        for (let i = pulse.definitions.length - 1; i > -1; i--) {
            const item = pulse.definitions[i];
            if (id == item.id) {
                const { task } = item;
                if (task) {
                    task.stop();
                }
            }
        }
    };

    return pulse;
};
module.exports = SDK;
