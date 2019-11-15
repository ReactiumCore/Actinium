const moment = require('moment');
const COLLECTION = 'Pulse';

const PLUGIN = {
    ID: COLLECTION,
    description:
        'Pulse plugin used to manage cron jobs via the Actinium.Pulse API',
    name: 'Pulse Plugin',
    order: 0,
    version: {
        actinium: '>=3.0.5',
        plugin: '0.0.1',
    },
    meta: {
        group: 'core',
        builtIn: true,
    },
};

const pulseStatus = req => {
    let { id, sort, status } = req.params;
    const qry = new Parse.Query(COLLECTION);

    if (id) {
        qry.equalTo('job', id);
    }

    if (status) {
        status = typeof status === 'string' ? [status] : status;
        qry.containedIn('status', status);
    }

    if (String(sort).toLowerCase() === 'ascending') {
        qry.ascending('createAt');
    } else {
        qry.descending('createdAt');
    }

    return qry.find().then(results => results.map(item => item.toJSON()));
};

const pulseCull = req => {
    const date = moment()
        .subtract(1, 'days')
        .toDate();
    const qry = new Parse.Query(COLLECTION);
    qry.lessThan('createdAt', date);
    return qry.find().then(results => {
        if (results.length > 0) {
            Parse.Object.destroyAll(results);
        }
    });
};

const pulseLog = req => {
    const { id, params = {}, status = 'log' } = req.params;

    if (!id) {
        return Promise.reject('id is a required parameter');
    }

    const obj = new Parse.Object(COLLECTION);
    return obj.save({ job: id, params, status }).catch(err => {});
};

Actinium.Plugin.register(PLUGIN, true);

Actinium.Cloud.define(PLUGIN.ID, 'actinium-pulse-log', pulseLog);

Actinium.Cloud.define(PLUGIN.ID, 'actinium-pulse-status', pulseStatus);

Actinium.Cloud.afterSave(COLLECTION, pulseCull);

Actinium.Hook.register('start', () => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        Actinium.Pulse.init();
    }
});
