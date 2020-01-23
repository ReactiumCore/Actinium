const op = require('object-path');
const _ = require('underscore');
const uuidv5 = require('uuid/v5');
const slugify = require('slugify');
const chalk = require('chalk');

const {
    CloudHasCapabilities,
    CloudCapOptions,
    CloudRunOptions,
} = require(`${ACTINIUM_DIR}/lib/utils`);

const {
    UNINSTALLED_NAMESPACE,
    PLUGIN_BLUEPRINTS,
    PLUGIN_ROUTES,
    PLUGIN,
} = require('./enums');

const COLLECTION = PLUGIN.ID;

Actinium.Plugin.register(PLUGIN, true);

const getNamespace = () => {
    return (
        op.get(Actinium.Plugin.get(PLUGIN.ID), 'meta.namespace') ||
        UNINSTALLED_NAMESPACE
    );
};

Actinium.Hook.register('start', async () => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        const namespace = getNamespace();
        if (namespace === UNINSTALLED_NAMESPACE) {
            LOG('');
            LOG(
                chalk.cyan.bold('Warning:'),
                'It appears you have not set the ID_NAMESPACE to a unique random uuid/v4. The default will be used and your content ids will not be unique!',
            );
            LOG(
                chalk.cyan(`  PLUGINS[${PLUGIN.ID}].meta.namespace → `),
                namespace,
            );
        }
    }
});

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

    let { page = 0, limit = 1000, refresh = false } = req.params;

    page = Math.max(page, 0);
    limit = Math.min(limit, 1000);
    let cacheKey = ['types', page, limit, 'types'];

    let types = page < 1 && !refresh ? Actinium.Cache.get(cacheKey, []) : [];

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
            const { type, uuid, meta = {} } = obj;
            const label = op.get(meta, 'label', type);
            return { type, uuid, label };
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
    const machineName = slugify(type).toLowerCase();
    const namespace = op.get(req.params, 'namespace', getNamespace());
    const uuid = uuidv5(machineName, namespace);

    const query = new Parse.Query(COLLECTION);
    query.equalTo('uuid', uuid);
    const existing = await query.first(options);
    if (existing)
        throw new Error(`Type ${type} is not unique in namespace ${namespace}`);

    const collection = `Content-${machineName}`;

    contentType.set('uuid', uuid);
    contentType.set('type', machineName);
    contentType.set('machineName', machineName);
    contentType.set('collection', collection);
    contentType.set('fields', op.get(req.params, 'fields'));
    contentType.set('meta', {
        ...op.get(req.params, 'meta', {}),
        label: type,
    });
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
    const machineName = op.get(req.params, 'machineName');
    const namespace = op.get(req.params, 'namespace', getNamespace());
    const uuid = machineName
        ? uuidv5(machineName, namespace)
        : op.get(req.params, 'uuid');

    if (!uuid) throw new Error('uuid or machineName parameter required.');

    const options = CloudCapOptions(req, [`${COLLECTION}.retrieve`]);
    const query = new Parse.Query(COLLECTION);
    query.equalTo('uuid', uuid);
    const contentType = await query.first(options);

    if (!contentType) throw new Error('Unable to find type.');

    return contentType.toJSON();
});

Actinium.Cloud.define(PLUGIN.ID, 'type-update', async req => {
    const machineName = op.get(req.params, 'machineName');
    const namespace = op.get(req.params, 'namespace', getNamespace());
    const uuid = machineName
        ? uuidv5(machineName, namespace)
        : op.get(req.params, 'uuid');
    const { type, fields = {} } = req.params;
    if (!uuid) throw new Error('uuid or machineName parameter required.');

    const options = CloudCapOptions(req, [`${COLLECTION}.update`]);
    const query = new Parse.Query(COLLECTION);
    query.equalTo('uuid', uuid);
    const contentType = await query.first(options);

    if (!contentType) throw new Error('Unable to find type.');

    let meta = contentType.get('meta') || {};
    meta = {
        ...meta,
        ...op.get(req.params, 'meta'),
        ...(type ? { label: type } : {}),
    };

    contentType.set('meta', meta);
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
    const machineName = op.get(req.params, 'machineName');
    const namespace = op.get(req.params, 'namespace', getNamespace());
    const uuid = machineName
        ? uuidv5(machineName, namespace)
        : op.get(req.params, 'uuid');
    if (!uuid) throw new Error('uuid or machineName parameter required.');

    const options = CloudCapOptions(req, [`${COLLECTION}.delete`]);
    const query = new Parse.Query(COLLECTION);

    query.equalTo('uuid', uuid);
    const contentType = await query.first(options);

    if (!contentType) throw new Error('Unable to find type.');

    await contentType.destroy(options);
    Actinium.Cache.del('types');
    return true;
});
