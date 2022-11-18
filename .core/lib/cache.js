import memory from 'memory-cache';
import op from 'object-path';
import moment from 'moment';
import _ from 'underscore';

const getKeyRoot = key => {
    const k = String(key).split('.')[0];
    return k;
};

const getValue = key => {
    const v = memory.get(getKeyRoot(key));
    return v;
};

const cache = {
    ...memory,
};

cache.get = (key, defaultValue) => {
    key = Array.isArray(key) ? key.join('.') : key;

    if (!key) {
        const keys = memory.keys();
        return keys.reduce((obj, key) => {
            obj[key] = memory.get(key);
            return obj;
        }, {});
    }

    const keyArray = String(key).split('.');

    if (keyArray.length > 1) {
        keyArray.shift();
        return op.get(getValue(key), keyArray.join('.'), defaultValue);
    } else {
        return memory.get(key) || defaultValue;
    }
};

cache.put = (key, value, ...args) => {
    key = Array.isArray(key) ? key.join('.') : key;

    let curr = getValue(key);
    const keyRoot = getKeyRoot(key);
    const keyArray = String(key).split('.');

    if (keyArray.length > 1) {
        curr = curr || {};
        keyArray.shift();
        op.set(curr, keyArray.join('.'), value);
        return memory.put(keyRoot, curr, ...args);
    } else {
        return memory.put(key, value, ...args);
    }
};

cache.del = (key, ...args) => {
    key = Array.isArray(key) ? key.join('.') : key;

    let curr = getValue(key);
    if (!curr) {
        return true;
    }

    const keyRoot = getKeyRoot(key);
    const keyArray = String(key).split('.');

    if (keyArray.length > 1) {
        curr = curr || {};
        keyArray.shift();
        op.del(curr, keyArray.join('.'));
        return memory.put(keyRoot, curr, ...args);
    } else {
        return memory.del(key);
    }
};

cache.merge = (values, options) => {
    options = options || { skipDuplicates: false };

    values = Object.keys(values).reduce((obj, key) => {
        const value = values[key];

        const expire = op.get(value, 'expire');

        if (typeof expire === 'number') {
            value.expire = moment(Date.now())
                .add(expire, 'milliseconds')
                .valueOf();
        }

        obj[key] = value;
        return obj;
    }, {});

    return memory.importJson(JSON.stringify(values));
};

cache.set = cache.put;

export default cache;
