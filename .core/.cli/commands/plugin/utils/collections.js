const chalk = require('chalk');
const _ = require('underscore');
const CONFIRM = require('./confirm');

const COLLECTION = async (props, count = 0) => {
    count += 1;
    const prefix = arcli.prefix;
    const validate = val => !!val;
    const suffix = chalk.magenta(': ');

    console.log('');
    console.log(arcli.prefix, '------------------------------');
    // prettier-ignore
    console.log(arcli.prefix, chalk.bold('Collection'), chalk.bold.magenta(count));
    console.log(arcli.prefix, '------------------------------');

    const collection = await props.inquirer.prompt([
        {
            prefix,
            suffix,
            validate,
            name: 'collection',
            type: 'input',
            message: 'Collection',
        },
        {
            prefix,
            suffix,
            default: false,
            type: 'confirm',
            name: 'actions_addField',
            message: 'Add Field Permission?',
        },
        {
            prefix,
            suffix,
            default: true,
            type: 'confirm',
            name: 'actions_create',
            message: 'Create Object Permission?',
        },
        {
            prefix,
            suffix,
            default: true,
            type: 'confirm',
            name: 'actions_retrieve',
            message: 'Retrieve Object Permission?',
        },
        {
            prefix,
            suffix,
            default: true,
            type: 'confirm',
            name: 'actions_update',
            message: 'Update Object Permission?',
        },
        {
            prefix,
            suffix,
            default: true,
            type: 'confirm',
            name: 'actions_delete',
            message: 'Delete Object Permission?',
        },
        {
            prefix,
            suffix,
            default: true,
            type: 'confirm',
            name: 'afterDelete',
            message: 'After delete hook?',
        },
        {
            prefix,
            suffix,
            default: true,
            type: 'confirm',
            name: 'afterFind',
            message: 'After find hook?',
        },
        {
            prefix,
            suffix,
            default: true,
            type: 'confirm',
            name: 'afterSave',
            message: 'After save hook?',
        },
        {
            prefix,
            suffix,
            default: true,
            type: 'confirm',
            name: 'beforeDelete',
            message: 'Before delete hook?',
        },
        {
            prefix,
            suffix,
            default: true,
            type: 'confirm',
            name: 'beforeSave',
            message: 'Before save hook?',
        },
        {
            prefix,
            suffix,
            default: true,
            type: 'confirm',
            name: 'schema',
            message: 'Define Schema?',
        },
    ]);

    collection.action = {
        addField: collection.actions_addField,
        create: collection.actions_create,
        retrieve: collection.actions_retrieve,
        update: collection.actions_update,
        delete: collection.actions_delete,
    };

    collection.hooks = {
        afterFind: collection.afterFind,
        afterDelete: collection.afterDelete,
        afterSave: collection.afterSave,
        beforeDelete: collection.beforeDelete,
        beforeSave: collection.beforeSave,
    };

    // clean up collection action keys
    Object.keys(collection).forEach(key => {
        if (
            String(key).startsWith('actions_') ||
            String(key).startsWith('before') ||
            String(key).startsWith('after')
        ) {
            delete collection[key];
        }
    });

    const schema = [];
    if (collection.schema === true) {
        let field = await FIELD(props, collection, 0);

        let { more } = field;
        delete field.more;

        schema.push(field);

        while (more === true) {
            field = await FIELD(props, collection, schema.length);
            more = field.more;
            delete field.more;
            schema.push(field);
        }
    }

    collection.schema = _.indexBy(schema, 'field');
    Object.keys(collection.schema).forEach(key => {
        delete collection.schema[key]['field'];
    });

    await CONFIRM(props, { message: 'Add another collection?' }).then(
        ({ confirm }) => (collection.more = confirm),
    );

    return collection;
};

const FIELD = async (props, params, count = 0) => {
    count += 1;
    const prefix = arcli.prefix;
    const validate = val => !!val;
    const suffix = chalk.magenta(': ');
    const pointers = ['Pointer', 'Relation'];

    console.log('');
    console.log(arcli.prefix, '------------------------------');
    // prettier-ignore
    console.log(arcli.prefix, chalk.bold(params.collection), chalk.bold('Field'), chalk.bold.magenta(count));
    console.log(arcli.prefix, '------------------------------');

    return props.inquirer.prompt([
        {
            prefix,
            suffix,
            type: 'input',
            name: 'field',
            message: 'Field',
        },
        {
            prefix,
            suffix,
            name: 'type',
            type: 'list',
            message: 'type',
            choices: [
                'String',
                'Number',
                'Boolean',
                'Date',
                'Object',
                'Array',
                'Pointer',
                'Relation',
            ],
        },
        {
            prefix,
            suffix,
            validate,
            name: 'targetClass',
            message: 'targetClass',
            when: answers => pointers.includes(answers.type),
        },
        {
            prefix,
            suffix,
            name: 'more',
            default: true,
            type: 'confirm',
            message: 'Add another field?',
        },
    ]);
};

const COLLECTIONS = async (props, params) => {
    const { confirm = params.collections } = await CONFIRM(props, {
        message: 'Schema?',
        when: !params.collections,
    });
    if (!confirm) return {};

    const collections = [];
    const collectionHooks = {
        afterFind: [],
        afterDelete: [],
        afterSave: [],
        beforeDelete: [],
        beforeSave: [],
    };

    let collection = await COLLECTION(props, 0);
    let { more } = collection;

    delete collection.more;

    collections.push(collection);

    while (more === true) {
        collection = await COLLECTION(props, collections.length);
        more = collection.more;

        delete collection.more;

        collections.push(collection);
    }

    // get collection hooks
    collections.forEach(item => {
        const { hooks = {} } = item;

        Object.entries(hooks).forEach(([key, val]) => {
            if (val !== true) return;
            collectionHooks[key].push(String(item.collection).toLowerCase());
        });

        delete item.hooks;
    });

    return { collections, ...collectionHooks };
};

module.exports = COLLECTIONS;
