const op = require('object-path');

/**
 * @api {Function} Utils.serialize(ParseObject) Utils.serialize()
 * @apiParam {ParseObject} data Parse object you wish to serialize to JSON.
 * @apiName Utils.serialize
 * @apiGroup Actinium
 * @apiExample Usage
const serialize = require(`${ACTINIUM_DIR}/lib/utils/serialize`);

Actinium.Cloud.define('MY_PLUGIN', 'some-function', async req => {
    const object = new Parse.Object('SomeObject');
    object.id = 'lL1SfyzHiE';
    await object.fetch({useMasterKey: true});

    return serialize(object);
});
 */
const serialize = data => {
    if (!data || typeof data.toJSON === 'undefined') return data;

    const obj = data.toJSON();
    Object.entries(obj).forEach(([key, value]) => {
        if (typeof value.toJSON !== 'undefined') {
            obj[key] = value.toJSON();
        }

        // strip pointers
        if (op.has(obj, [key, '__type'])) op.del(obj, [key, '__type']);
    });

    return obj;
};

module.exports = serialize;
