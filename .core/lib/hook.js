const chalk = require('chalk');
const uuid = require('uuid/v4');
const _ = require('underscore');
const op = require('object-path');
const ActionSequence = require('action-sequence');
const assert = require('assert');

const noop = () => Promise.resolve();

const Hook = {
    action: {
        middleware: {},
        install: {},
        start: {},
        uninstall: {},
        activate: {},
        deactivate: {},
        warning: {},
        user: {},
    },
};

Hook.flush = name => op.set(Hook.action, name, {});

Hook.unregister = id =>
    Object.keys(Hook.action).forEach(action => {
        op.del(Hook.action, `${action}.${id}`);
    });

Hook.register = (name, callback, order = 100, id) => {
    id = id || uuid();
    op.set(Hook.action, `${name}.${id}`, { id, order, callback });
    return id;
};

Hook.list = () => Object.keys(Hook.action).sort();

Hook.run = async (name, ...params) => {
    const context = { hook: name, params };

    const actions = _.sortBy(
        Object.values(op.get(Hook.action, `${name}`, {})),
        'order',
    ).reduce((acts, action) => {
        const { callback = noop, id } = action;
        acts[id] = () => callback(...params, context);
        return acts;
    }, {});

    try {
        await ActionSequence({ actions });
        return context;
    } catch (errors) {
        Object.entries(errors).forEach(([id, error]) => {
            ERROR(chalk.magenta(`Error in action.${name}[${id}]`));
            if (op.get(error, 'error') instanceof assert.AssertionError) {
                const assertion = error.error;
                DEBUG(chalk.cyan('Assertion: ' + assertion.message));
                DEBUG(
                    chalk.cyan(
                        'operator: ' +
                            JSON.stringify(assertion.operator, null, 2),
                    ),
                );
                DEBUG(
                    chalk.green(
                        'expected: ' +
                            JSON.stringify(assertion.expected, null, 2),
                    ),
                );
                DEBUG(
                    chalk.red(
                        'actual: ' + JSON.stringify(assertion.actual, null, 2),
                    ),
                );
                DEBUG(' ');
            } else {
                ERROR(error);
            }
        });
    }
};

module.exports = Hook;
