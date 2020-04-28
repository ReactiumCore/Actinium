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
    const options = Actinium.Utils.MasterOptions();
    const schema = new Parse.Schema(COLLECTION);
    let isSchema;

    try {
        isSchema = await schema.get(options);
    } catch (err) {
        schema.addString('key');
        schema.addObject('value');
        return schema.save(null, options);
    }

    return Promise.resolve(isSchema);
};

/**
 * @api {Function} Actinium.Setting.set(key,value) Setting.set()
 * @apiVersion 3.1.1
 * @apiGroup Actinium
 * @apiName Setting.set
 * @apiDescription Create or update a setting value. Returns a `{Promise}`.
 * @apiParam {String} key The unique setting key, in object path form (`group.path.to.leaf`).
 * @apiParam {Mixed} [value] The setting value. If the value is an object, you can use dot notation to set a specific portion of the setting.
 * @apiParam {Parse.ACL} [ACL] The Parse ACL object to apply to the setting.
 * @apiExample Example Usage:
// Save group of site settings
Actinium.Setting.set('site', { title: 'My Awesome Site', hostname: 'mysite.com' });

// Save hostname setting in site group
Actinium.Setting.set('site.hostname', 'mysite.com');
 */
Setting.set = async (key, value) => {
    const options = Actinium.Utils.MasterOptions();
    const karr = String(key).split('.');
    const rootKey = karr.shift();

    if (karr.length > 0) {
        const obj = await Parse.Cloud.run(
            'setting-get',
            { key: rootKey },
            options,
        );

        if (obj) {
            op.set(obj, `value.${karr.join('.')}`, value);
            value = obj.value;
        }
    }

    return Parse.Cloud.run('setting-set', { key: rootKey, value }, options);
};

/**
 * @api {Asynchronous} Actinium.Setting.get(key,default) Setting.get()
 * @apiVersion 3.1.1
 * @apiGroup Actinium
 * @apiName Setting.get
 * @apiDescription Get a setting value.
 * @apiParam {String} key The unique setting key, in object path form (`group.path.to.leaf`).
 * @apiParam {Mixed} default The default value if the key has not been set.
 * @apiExample Example Usage:
// get hostname setting in site group
Actinium.Setting.get('site.hostname');

// get object of all site settings
Actinium.Setting.get('site');
 */
Setting.get = async (key, defaultValue) => {
    const options = Actinium.Utils.MasterOptions();
    const karr = String(key).split('.');
    const rootKey = karr.shift();

    if (!rootKey) return Setting.load();

    const obj = await Parse.Cloud.run('setting-get', { key }, options);

    if (typeof obj === 'undefined') {
        return defaultValue;
    }

    return obj;
};

/**
 * @api {Function} Actinium.Setting.unset(key) Setting.unset()
 * @apiVersion 3.1.1
 * @apiGroup Actinium
 * @apiName Setting.unset
 * @apiDescription Unset a setting value. Returns a `{Promise}`.
 * @apiParam {String} key The unique setting key, in object path form (`group.path.to.leaf`).
 * @apiExample Example Usage:
// unsets the title setting in the site group
Actinium.Setting.unset('site.title');

// remove the entire site setting group, including all settings and the capabilities associated
Actinium.Setting.unset('site');
 */
Setting.unset = key => {
    const options = Actinium.Utils.MasterOptions();

    return key.split('.').length > 0
        ? Setting.set(key)
        : Parse.Cloud.run('setting-unset', { key }, options);
};

Setting.load = async () => {
    const options = Actinium.Utils.MasterOptions();

    await Setting.schema();
    return Parse.Cloud.run('settings', {}, options);
};

module.exports = Setting;
