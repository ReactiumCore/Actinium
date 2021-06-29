const _ = require('underscore');
const slugify = require('slugify');
const camelcase = require('camelcase');

const parseArray = val => {
    if (typeof val === 'undefined') return [];
    return _.compact(
        String(val)
            .replace(/\,/g, ', ')
            .replace(/\s\s+/g, ' ')
            .replace(/,/g, '')
            .split(' '),
    );
};

const parseCaps = str =>
    parseArray(str).map(item => String(item).toLowerCase());

const parseDest = val => {
    const cwd = process.cwd();
    val = arcli.normalizePath(val);
    val = String(val).replace(/^cwd\\|^cwd\//i, cwd);
    val = String(val).replace(/^app\\|^app\//i, `${cwd}/src/app/`);
    val = String(val).replace(/^core\\|^core\//i, `${cwd}/.core/plugin/`);
    val = String(val).replace(
        /^plugin\\|^plugin\//i,
        `${cwd}/actinium_modules/`,
    );

    return arcli.normalizePath(val);
};

const parseID = ID =>
    slugify(ID, { lower: true, replace: '-', remove: /[^a-z0-9@\-\s\/\\]/gi });

module.exports = {
    parseArray,
    parseCaps,
    parseDest,
    parseID,
};
