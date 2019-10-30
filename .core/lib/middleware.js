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

    const grouped = _.chain(mw.sort)
        .sortBy('order')
        .groupBy('id')
        .value();

    const actions = Object.keys(grouped).reduce((acts, key) => {
        const item = _.last(grouped[key]);
        const { callback = noop, id } = item;

        acts[id] = () => callback(app);

        LOG(chalk.cyan('  Middleware'), chalk.cyan('→'), chalk.magenta(id));

        return acts;
    }, {});

    // Replace
    Object.entries(mw.replacements).forEach(([id, callback]) => {
        actions[id] = () => callback(app);
    });

    if (Object.keys(mw.replacements).length > 0) {
        LOG(
            chalk.cyan('  Middleware'),
            chalk.cyan('→'),
            chalk.magenta('Replaced'),
        );
        LOG(' ', Object.keys(mw.replacements).join(', '));
    }

    // Unregister
    _.uniq(mw.unregistered).forEach(id => op.del(actions, id));

    if (mw.unregistered.length > 0) {
        LOG(
            chalk.cyan('  Middleware'),
            chalk.cyan('→'),
            chalk.magenta('Unregistered'),
        );
        LOG(' ', mw.unregistered.join(', '));
    }

    mw.list = actions;

    return ActionSequence({ actions }).then(() => {
        delete mw.sort;
    });
};

mw.register = (id, callback, order = 100) =>
    mw.sort.push({ id, callback, order });

mw.replace = (id, callback) => op.set(mw.replacements, id, callback);

mw.unregister = id => mw.unregistered.push(id);

module.exports = mw;
