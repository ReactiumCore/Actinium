const _ = require('underscore');
const op = require('object-path');
const {
    CloudHasCapabilities,
    CloudRunOptions,
    serialize,
} = require(`${ACTINIUM_DIR}/lib/utils`);

const PLUGIN = {
    ID: 'CollectionWidget',
    name: 'Collection Widget',
    meta: {
        group: 'Editing',
    },
};

const relationGet = async (params, options) => {
    const collection = op.get(params, 'collection');
    const fieldName = op.get(params, 'fieldName');
    const objectId = op.get(params, 'objectId');

    if (!collection) {
        throw new Error('`collection` name is a required parameter');
    }

    if (!fieldName) {
        throw new Error('`fieldName` is a required parameter');
    }

    if (!objectId) {
        throw new Error('`objectId` is a required parameter');
    }

    const qry = new Parse.Query(collection);
    const obj = await qry.get(objectId, options);
    const relation = obj.relation(fieldName);

    return [relation, obj];
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
        if (!op.get(field, 'targetClass')) {
            return;
        }

        if (String(op.get(field, 'fieldType')).toLowerCase() !== 'collection') {
            return;
        }

        const fieldSlug = String(
            Actinium.Utils.slugify(field.fieldName),
        ).toLowerCase();
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
        return _.indexBy(
            results.map(item => serialize(item)),
            'objectId',
        );
    } catch (err) {
        return new Error(err.message);
    }
});

Actinium.Cloud.define(PLUGIN.ID, 'content-relation-fetch', async req => {
    const options = CloudRunOptions(req);
    let [relation] = await relationGet(req.params, options);

    let limit = 1000;
    let skip = 0;

    relation = relation.query();
    relation.limit(limit);
    relation.ascending('title');

    let output = [];
    let results = await relation.skip(skip).find(options);

    while (results.length > 0) {
        skip += limit;
        output = output.concat(results.map(item => serialize(item)));
        results = await relation.skip(skip).find(options);
    }

    return _.indexBy(output, 'objectId');
});

Actinium.Cloud.define(PLUGIN.ID, 'content-relation-add', async req => {
    const fieldName = op.get(req.params, 'fieldName');
    const ids = _.flatten([op.get(req.params, 'add', [])]);

    if (ids.length < 1) {
        return new Error('`add` array is a required parameter');
    }

    const options = CloudRunOptions(req);
    const [relation, obj] = await relationGet(req.params, options);
    const collection = op.get(serialize(obj), [fieldName, 'className']);

    let id = ids.shift();

    while (id) {
        let item = await new Parse.Query(collection).get(id, options);
        if (item) relation.add(item);
        id = ids.shift();
    }

    await obj.save(null, options);

    return Actinium.Cloud.run('content-relation-fetch', req.params, options);
});

Actinium.Cloud.define(PLUGIN.ID, 'content-relation-remove', async req => {
    const fieldName = op.get(req.params, 'fieldName');
    const ids = _.flatten([op.get(req.params, 'remove', [])]);

    if (ids.length < 1) {
        return new Error('`remove` array is a required parameter');
    }

    const options = CloudRunOptions(req);
    const [relation, obj] = await relationGet(req.params, options);
    const collection = op.get(serialize(obj), [fieldName, 'className']);

    let id = ids.shift();

    while (id) {
        let item = await new Parse.Query(collection).get(id, options);
        if (item) relation.remove(item);
        id = ids.shift();
    }

    await obj.save(null, options);

    return Actinium.Cloud.run('content-relation-fetch', req.params, options);
});

// EOF
