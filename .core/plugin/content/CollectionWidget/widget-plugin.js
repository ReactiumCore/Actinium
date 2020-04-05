const op = require('object-path');
const {
    CloudHasCapabilities,
    CloudRunOptions,
    serialize,
} = require(`${ACTINIUM_DIR}/lib/utils`);

const PLUGIN = {
    ID: 'CollectionWidget',
    name: 'Collection Widget',
};

Actinium.Plugin.register(PLUGIN, true);

Actinium.Hook.register('content-schema', async (schema, machineName) => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;

    const type = await Actinium.Type.retrieve(
        {
            machineName,
        },
        { useMasterKey: true },
    );

    // Create relation column for `Collection` field types.
    Object.values(op.get(type, 'fields', [])).forEach(field => {
        if (op.get(field, 'fieldType') !== 'Collection') return;
        if (!op.get(field, 'targetClass')) return;

        const fieldSlug = Actinium.Utils.slugify(field.fieldName);
        schema[fieldSlug] = {
            type: 'Relation',
            targetClass: field.targetClass,
        };
    });
});

Actinium.Cloud.define(PLUGIN.ID, 'dynamic-query', async req => {
    const collection = op.get(req.params, 'collection');
    const attributes = op.get(req.params, 'attributes');

    if (!collection) {
        return new Error('`collection` name is a required parameter');
    }

    if (!attributes) {
        return new Error('`attributes` array is a required parameter');
    }

    let qry = new Parse.Query(collection);

    const isOpt = ['count', 'get', 'first', 'find'];

    let action;

    attributes.forEach(item => {
        let { func, args, options = {} } = item;

        if (isOpt.includes(func)) {
            options = { ...CloudRunOptions(req), ...options };
            args.push(options);
            action = { func, args };
        } else {
            qry[func](...args);
        }
    });

    let results;

    try {
        results = await qry[action.func](...action.args);
        results = Array.isArray(results) ? results : [results];
        return results.map(item => serialize(item));
    } catch (err) {
        return new Error(err.message);
    }
});
