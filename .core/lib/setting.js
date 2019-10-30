const path = require('path');
const chalk = require('chalk');
const _ = require('underscore');
const semver = require('semver');
const op = require('object-path');
const config = require(`${BASE_DIR}/.core/actinium-config`);

const COLLECTION = 'Setting';

Actinium.Cache.set('setting', ENV.SETTINGS);

const Setting = {};

Setting.schema = async () => {
    const schema = new Parse.Schema(COLLECTION);
    let isSchema;

    try {
        isSchema = await schema.get({ useMasterKey: true });
    } catch (err) {
        schema.addString('key');
        schema.addObject('value');
        return schema.save(null, { useMasterKey: true });
    }

    return Promise.resolve(isSchema);
};

Setting.set = async (key, value) => {
    const karr = String(key).split('.');
    const rootKey = karr.shift();

    if (karr.length > 0) {
        const obj = await Parse.Cloud.run('setting-get', { key: rootKey });

        if (obj) {
            op.set(obj, `value.${karr.join('.')}`, value);
            value = obj.value;
        }
    }

    return Parse.Cloud.run(
        'setting-set',
        { key: rootKey, value },
        { useMasterKey: true },
    );
};

Setting.get = (key, defaultValue) => {
    if (key) {
        return Actinium.Cache.get(`setting.${key}`, defaultValue);
    } else {
        return Actinium.Cache.get('setting') || defaultValue;
    }
};

Setting.unset = key =>
    key.split('.').length > 0
        ? Setting.set(key)
        : Parse.Cloud.run('setting-unset', { key }, { useMasterKey: true });

Setting.load = async () => {
    await Setting.schema();
    return Parse.Cloud.run('settings', {}, { useMasterKey: true });
};

module.exports = Setting;
