/**
 * @api {Function} Utils.isSDK(feature) Utils.isSDK()
 * @apiName isSDK
 * @apiGroup Actinium
 * @apiDescription Check for specific Actinium SDK features. Returns Boolean.
 * @apiParam {Mixed} feature String or String Array of Actinium SDK features to validate.
 */
const _ = require('underscore');

module.exports = check => {
    const keys = Object.keys(Actinium).map(key => String(key).toLowerCase());
    check = Array.isArray(check) ? Array.from(check) : [check];
    check = check.map(key => String(key).toLowerCase());
    return _.intersection(keys, check).length === check.length;
};
