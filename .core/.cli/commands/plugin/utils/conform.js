const _ = require('underscore');
const op = require('object-path');
const { parseArray, parseDest, parseID } = require('./parsers');

const CONFORM = (input, props) =>
    Object.entries(input).reduce((obj, [key, val]) => {
        switch (key) {
            case 'ID':
                op.set(obj, key, parseID(val));
                break;

            case 'destination':
                op.set(obj, key, parseDest(val, props));
                break;

            case 'actiniumVersion':
            case 'pluginVersion':
                op.set(
                    obj,
                    ['version', String(key).replace(/version/gi, '')],
                    val,
                );
                break;

            case 'cloud':
                val = parseArray(val);
                if (val.length > 0) op.set(obj, key, val);
                break;

            case 'sdk':
                val = val === true ? parseID(input.ID) : val;
                op.set(obj, key, val);
                break;

            case 'blueprints':
            case 'routes':
                if (_.isArray(val)) op.set(obj, key, val);
                break;

            case 'collections':
                if (_.isArray(val))
                    op.set(obj, key, JSON.stringify(val, null, 4));
                break;

            default:
                if (typeof val !== 'undefined') op.set(obj, key, val);
                break;
        }

        return obj;
    }, {});

module.exports = CONFORM;
