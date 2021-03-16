/**
 * @api {Function} Utils.isSDK(feature,feature2,feature3) Utils.isSDK()
 * @apiName isSDK
 * @apiGroup Actinium
 * @apiDescription Check for specific Actinium SDK features. When the first
 argument is an array, each item in the array is checked and must be present on
 the Actinium SDK for a valid response.

 Returns Boolean.

 * @apiExample
if (Actinium.Utils.isSDK('Recycle')) {
  // Recycle something
}

if (Actinium.Utils.isSDK('Recycle', 'User')) {
  // Recycle a User
}

if (Actinium.Utils.isSDK(['Recycle', 'User'])) {
  // Recycle a User
}

if (Actinium.Utils.isSDK(['Recycle', 'User'], 'Media')) {
  // Recycle a User and some Media
}
 */
const _ = require('underscore');

module.exports = (check, ...args) => {
    check = Array.isArray(check) ? Array.from(check) : [check];
    args = Array.from(args);

    // append the args to the check array
    if (args.length > 0) args.forEach(key => check.push(key));

    // normalize the check string values
    check = check.map(key => String(key).toLowerCase());

    // get the Actinium SDK keys
    const keys = Object.keys(Actinium).map(key => String(key).toLowerCase());

    return _.intersection(keys, check).length === check.length;
};
