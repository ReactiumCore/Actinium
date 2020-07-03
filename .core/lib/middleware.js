const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const _ = require('underscore');
const op = require('object-path');
const globby = require('globby').sync;
const ActionSequence = require('action-sequence');

const matches = [
    'Actinium.Middleware.register',
    'Actinium.Middleware.unregister',
];

const noop = () => Promise.resolve();

const mw = {
    sort: [],
    list: {},
    unregistered: [],
    replacements: {},
};

const isMiddleware = fileContent =>
    matches.reduce((valid, match) => {
        if (valid !== true && String(fileContent).includes(match) === true) {
            valid = true;
        }
        return valid;
    }, false);

mw.init = app => {
    app = app || Actinium.app;

    globby(ENV.GLOB_MIDDLEWARE)
        .filter(file => isMiddleware(fs.readFileSync(file, 'utf8')))
        .forEach(file => require(file));

    const sorted = _.sortBy(mw.sort, 'order');
    const actions = sorted.reduce((acts, { callback = noop, id }) => {
        acts[id] = () => {
            BOOT(
                chalk.cyan('  Middleware'),
                chalk.cyan('→'),
                chalk.magenta(id),
            );
            callback(app);
        };
        return acts;
    }, {});

    // Replace
    Object.entries(mw.replacements).forEach(([id, callback]) => {
        actions[id] = () => callback(app);
    });

    if (Object.keys(mw.replacements).length > 0) {
        BOOT(
            chalk.cyan('  Middleware'),
            chalk.cyan('→'),
            chalk.magenta('Replaced'),
        );
        BOOT(' ', Object.keys(mw.replacements).join(', '));
    }

    // Unregister
    _.uniq(mw.unregistered).forEach(id => op.del(actions, id));

    if (mw.unregistered.length > 0) {
        BOOT(
            chalk.cyan('  Middleware'),
            chalk.cyan('→'),
            chalk.magenta('Unregistered'),
        );
        BOOT(' ', mw.unregistered.join(', '));
    }

    mw.list = actions;

    return ActionSequence({ actions });
};

mw.register = (id, callback, order = 100) => {
    if (!Array.isArray(op.get(mw, 'sort'))) {
        mw.sort = [];
    }

    mw.sort.push({ id, callback, order });
};

mw.replace = (id, callback) => op.set(mw.replacements, id, callback);

mw.unregister = id => mw.unregistered.push(id);

module.exports = mw;
