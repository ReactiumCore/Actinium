const op = require('object-path');
const _ = require('underscore');
const uuid = require('uuid/v4');
const slugify = require('slugify');

const {
    CloudHasCapabilities,
    CloudCapOptions,
    CloudRunOptions,
} = require(`${ACTINIUM_DIR}/lib/utils`);

const PLUGIN_BLUEPRINTS = require('./blueprints');
const PLUGIN_ROUTES = require('./routes');
const PLUGIN = {
    ID: 'Type',
    name: 'Content Types',
    meta: {
        builtIn: true,
        group: 'core',
    },
};
const COLLECTION = PLUGIN.ID;

Actinium.Plugin.register(PLUGIN, true);

// Register Blueprints
Actinium.Hook.register(
    'blueprint-defaults',
    blueprints => {
        PLUGIN_BLUEPRINTS.forEach(item => blueprints.push(item));
    },
    -1000,
);

// Register Routes
Actinium.Hook.register('route-defaults', routes => {
    PLUGIN_ROUTES.forEach(item => routes.push(item));
});

Actinium.Capability.register(
    `${COLLECTION}.create`,
    {},
    Actinium.Enums.priority.highest,
);
Actinium.Capability.register(
    `${COLLECTION}.retrieve`,
    {},
    Actinium.Enums.priority.highest,
);
Actinium.Capability.register(
    `${COLLECTION}.update`,
    {},
    Actinium.Enums.priority.highest,
);
Actinium.Capability.register(
    `${COLLECTION}.delete`,
    {},
    Actinium.Enums.priority.highest,
);
Actinium.Capability.register(
    `${COLLECTION}.addField`,
    {},
    Actinium.Enums.priority.highest,
);

// All operations on settings are privileged
Actinium.Collection.register(
    COLLECTION,
    {
        create: false,
        retrieve: false,
        update: false,
        delete: false,
        addField: false,
    },
    {
        uuid: {
            type: 'String',
        },
        type: {
            type: 'String',
        },
        fields: {
            type: 'Object',
        },
        meta: {
            type: 'Object',
        },
    },
);

Actinium.Cloud.define(PLUGIN.ID, 'types', async req => {
    let pages = 0,
        total = 0;

    let { page = 0, limit = 1000 } = req.params;

    page = Math.max(page, 0);
    limit = Math.min(limit, 1000);
    let cacheKey = ['types', page, limit, 'types'];

    let types = page < 1 ? Actinium.Cache.get(cacheKey, []) : [];

    if (types.length < 1) {
        const skip = page > 0 ? page * limit - limit : 0;
        const query = new Parse.Query(COLLECTION);
        const options = CloudRunOptions(req);

        // Pagination
        total = await query.count(options);

        // Find
        query.skip(skip);
        query.limit(limit);

        let results = await query.find(options);

        while (results.length > 0) {
            types = types.concat(results);

            if (page < 1) {
                query.skip(types.length);
                results = await query.find(options);
            } else {
                break;
            }
        }
        types = types.map(contentType => {
            const obj = contentType.toJSON();
            const { type, uuid } = obj;
            return { type, uuid };
        });

        Actinium.Cache.set(cacheKey, types, 20000);
    } else {
        total = types.length;
    }

    pages = Math.ceil(total / limit);

    const list = {
        timestamp: Date.now(),
        limit,
        page,
        pages,
        total,
        types,
    };

    await Actinium.Hook.run('type-list', list);

    return Promise.resolve(list);
});

Actinium.Cloud.define(PLUGIN.ID, 'type-create', async req => {
    const options = CloudCapOptions(req, [`${COLLECTION}.create`]);
    const contentType = new Parse.Object(COLLECTION);

    const { type, fields = {} } = req.params;

    if (!type) throw new Error('type parameter required.');

    contentType.set('uuid', uuid());
    contentType.set('type', op.get(req.params, 'type'));
    contentType.set('fields', op.get(req.params, 'fields'));
    contentType.set(
        'regions',
        op.get(req.params, 'regions', {
            default: {
                id: 'default',
                label: 'Default',
                slug: 'default',
            },
        }),
    );

    const saved = await contentType.save(null, options);
    return saved.toJSON();
});

Actinium.Cloud.define(PLUGIN.ID, 'type-retrieve', async req => {
    const options = CloudCapOptions(req, [`${COLLECTION}.retrieve`]);
    const query = new Parse.Query(COLLECTION);

    const { uuid } = req.params;

    if (!uuid) throw new Error('uuid parameter required.');

    query.equalTo('uuid', uuid);
    const contentType = await query.first(options);

    if (!contentType) throw new Error('Unable to find type.');

    return contentType.toJSON();
});

Actinium.Cloud.define(PLUGIN.ID, 'type-update', async req => {
    const options = CloudCapOptions(req, [`${COLLECTION}.update`]);
    const query = new Parse.Query(COLLECTION);

    const { uuid, type, fields = {} } = req.params;

    if (!uuid) throw new Error('uuid parameter required.');
    if (!type) throw new Error('type parameter required.');

    query.equalTo('uuid', uuid);
    const contentType = await query.first(options);

    if (!contentType) throw new Error('Unable to find type.');

    contentType.set('type', type);
    contentType.set('fields', fields);
    contentType.set(
        'regions',
        op.get(req.params, 'regions', {
            default: {
                id: 'default',
                label: 'Default',
                slug: 'default',
            },
        }),
    );

    const saved = await contentType.save(null, options);
    return saved.toJSON();
});

Actinium.Cloud.define(PLUGIN.ID, 'type-delete', async req => {
    const options = CloudCapOptions(req, [`${COLLECTION}.delete`]);
    const query = new Parse.Query(COLLECTION);

    const { uuid } = req.params;

    if (!uuid) throw new Error('uuid parameter required.');

    query.equalTo('uuid', uuid);
    const contentType = await query.first(options);

    if (!contentType) throw new Error('Unable to find type.');

    await contentType.destroy(options);
    Actinium.Cache.del('types');
    return true;
});
