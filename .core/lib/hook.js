import chalk from 'chalk';
import _ from 'underscore';
import assert from 'assert';
import op from 'object-path';
import Enums from './enums.js';
import { v4 as uuid } from 'uuid';
import ActionSequence from 'action-sequence';

const noop = {
    sync: () => {},
    async: () => Promise.resolve(),
};

const Hook = {
    action: {},
    actionIds: {},
};

Hook.flush = (name, type = 'async') =>
    op.set(Hook.action, `${type}.${name}`, {});

Hook.unregister = id => {
    const path = op.get(Hook.actionIds, [id]);
    if (path) {
        op.del(Hook.action, path);
        op.del(Hook.actionIds, [id]);
    }
};

Hook._register = (type = 'async') => (
    name,
    callback,
    order = Enums.priority.neutral,
    id,
) => {
    id = id || uuid();
    const path = `${type}.${name}.${id}`;
    op.set(Hook.actionIds, [id], path);
    op.set(Hook.action, `${type}.${name}.${id}`, { id, order, callback });

    return id;
};

Hook.register = Hook._register('async');
Hook.registerSync = Hook._register('sync');

Hook.list = (type = 'async') =>
    Object.keys(op.get(Hook.action, type, {})).sort();

Hook._actions = (name, type = 'async', params) =>
    _.sortBy(
        Object.values(op.get(Hook.action, `${type}.${name}`, {})),
        'order',
    ).reduce((acts, action) => {
        const { callback = noop[type], id } = action;
        acts[id] = ({ context }) => callback(...params, context);
        return acts;
    }, {});

Hook.run = async (name, ...params) => {
    const context = { hook: name, params };
    try {
        await ActionSequence({
            actions: Hook._actions(name, 'async', params),
            context,
        });

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

Hook.runSync = (name, ...params) => {
    const context = { hook: name, params };
    Object.values(Hook._actions(name, 'sync', params)).forEach(callback =>
        callback({ context }),
    );

    return context;
};

export default Hook;
