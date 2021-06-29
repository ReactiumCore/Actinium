const chalk = require('chalk');
const op = require('object-path');
const { parseID } = require('./parsers');

const actiniumConfig = require(arcli.normalizePath(
    process.cwd(),
    '.core',
    'actinium-config.js',
));

const type = 'input';
const prefix = arcli.prefix;
const suffix = chalk.magenta(': ');
const when = (answers, key) => !op.get(answers, key);
const validate = (input, param) =>
    String(input).trim().length > 0 ? true : `${param} is required`;

const TEXTS = (props, params) =>
    props.inquirer.prompt(
        [
            {
                type,
                prefix,
                suffix,
                name: 'plugin',
                default: '1.0.0',
                message: 'Version',
                when: answers => when(answers, 'version.plugin'),
            },
            {
                type,
                prefix,
                suffix,
                name: 'actinium',
                message: 'Compatible Actinium semver',
                default: `>=${actiniumConfig.version}`,
                when: answers => when(answers, 'version.actinium'),
            },
            {
                type,
                prefix,
                suffix,
                name: 'reactium',
                message: 'Compatible Reactium semver',
                default: '>=4.0.0',
                when: answers => when(answers, 'version.reactium'),
            },
            {
                type,
                prefix,
                suffix,
                default: 'MIT',
                name: 'license',
                message: 'License',
                when: () => !params.license || params.license === true,
            },
            {
                type,
                prefix,
                suffix,
                name: 'sdk',
                message: 'SDK',
                default: parseID(params.ID),
                when: () => !params.sdk || params.sdk === true,
            },
            {
                type,
                prefix,
                suffix,
                name: 'name',
                message: 'Title',
                validate: input => validate(input, 'Title'),
                when: () => !params.name || params.name === true,
            },
            {
                type,
                prefix,
                suffix,
                name: 'description',
                message: 'Description',
                when: () => !params.description || params.description === true,
            },
            {
                type,
                prefix,
                suffix,
                name: 'cloud',
                message: 'Cloud Functions',
                when: () => !params.cloud || params.cloud === true,
            },
        ],
        params,
    );

module.exports = TEXTS;
