const chalk = require('chalk');
const _ = require('underscore');
const op = require('object-path');
const { CloudRunOptions } = require(`${ACTINIUM_DIR}/lib/utils`);

const PLUGIN = require('./info');

/**
 * ----------------------------------------------------------------------------
 * Extend Actinium SDK
 * ----------------------------------------------------------------------------
 */
const Taxonomy = require('./sdk');
Actinium['Taxonomy'] = op.get(Actinium, 'Taxonomy', Taxonomy);

/**
 * ----------------------------------------------------------------------------
 * Plugin registration
 * ----------------------------------------------------------------------------
 */
Actinium.Plugin.register(PLUGIN, true);

/**
 * ----------------------------------------------------------------------------
 * Hook registration
 * ----------------------------------------------------------------------------
 */

// blueprint-defaults hook
Actinium.Hook.register(
    'blueprint-defaults',
    blueprints => {
        if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
        const PLUGIN_BLUEPRINTS = require('./blueprints');
        PLUGIN_BLUEPRINTS.forEach(item => blueprints.push(item));
    },
    -1000,
);

// route-defaults hook
Actinium.Hook.register(
    'route-defaults',
    routes => {
        if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
        const PLUGIN_ROUTES = require('./routes');
        PLUGIN_ROUTES.forEach(item => routes.push(item));
    },
    100,
);

// schema hook
Actinium.Hook.register('schema', async ({ ID }) => {
    if (ID !== PLUGIN.ID) return;

    const PLUGIN_SCHEMA = require('./schema');
    PLUGIN_SCHEMA.forEach(item => {
        const { actions = {}, collection, schema = {} } = item;
        if (!collection) return;

        Actinium.Collection.register(collection, actions, schema);
        Object.keys(actions).forEach(action => {
            Actinium.Capability.register(`${collection}.${action}`);
        });
    });
});

// warning hook
Actinium.Hook.register('warning', () => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
    if (Taxonomy.warning !== true) return;

    LOG('');
    LOG(chalk.cyan.bold('Notice:'), 'The default Taxonomy has been created');
});

// start hook
Actinium.Hook.register(
    'start',
    async () => {
        await Taxonomy.install();
    },
    -1000,
);

// content-schema-field-types hook
Actinium.Hook.register('content-schema-field-types', async fieldTypes => {
    fieldTypes['Taxonomy'] = { type: 'Relation', targetClass: 'Taxonomy' };
});

// content-retrieve hook
Actinium.Hook.register('content-retrieve', async (content, params, options) => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;

    const { type } = content;
    const tax = await Taxonomy.Content.retrieve({ content, type }, options);
    Object.entries(tax).forEach(([key, value]) => op.set(content, key, value));
});

// content-saved hook
Actinium.Hook.register(
    'content-saved',
    async (content, type, isNew, params, options) => {
        if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;

        const tax = _.flatten(
            Taxonomy.Content.fields(content, options).map(field =>
                Object.values({ ...op.get(params, field, {}) }),
            ),
        );

        // prettier-ignore
        const add = tax.filter(item => !op.has(item, 'deleted') && op.get(item, 'pending') === true);
        const del = tax.filter(item => op.get(item, 'deleted') === true);

        // prettier-ignore
        const [addTAX, delTAX] = await Promise.all([
            add.map(({ slug, type }) => Taxonomy.Content.attach({ content, slug, type }), options),
            del.map(({ slug, type }) => Taxonomy.Content.detach({ content, slug, type }), options)
        ]);

        const newTax = await Taxonomy.Content.retrieve(
            { content, type },
            options,
        );

        Object.entries(newTax).forEach(([key, value]) =>
            op.set(content, key, value),
        );
    },
);

// taxonomy-query hook
Actinium.Hook.register(
    'taxonomy-query',
    async (qry, params, options) => {
        qry.include('type');

        if (op.get(params, 'name')) {
            qry.containedIn('name', _.flatten([params.name]));
        }
        if (op.get(params, 'slug')) {
            qry.containedIn('slug', _.flatten([params.slug]));
        }
        if (op.get(params, 'type')) {
            let typeArray = [];
            let types = _.flatten([params.type]);

            for (let type of types) {
                if (typeof type === 'string') {
                    // prettier-ignore
                    type = await Actinium.Query.or(
                        new Actinium.Query('Type_taxonomy').equalTo('slug', type),
                        new Actinium.Query('Type_taxonomy').equalTo('objectId', type),
                    ).first({ useMasterKey: true });
                }

                if (type) typeArray.push(type);
            }

            if (typeArray.length > 0) qry.containedIn('type', typeArray);
        }
    },
    -1000,
);

// taxonomy-type-query hook
Actinium.Hook.register(
    'taxonomy-type-query',
    async (qry, params, options) => {
        if (op.get(params, 'name')) {
            qry.containedIn('name', _.flatten([params.name]));
        }
        if (op.get(params, 'slug')) {
            qry.containedIn('slug', _.flatten([params.slug]));
        }
    },
    -1000,
);

// taxonomy-type-list hook
Actinium.Hook.register(
    'taxonomy-type-list',
    async (resp, params, options) => {
        if (op.get(params, 'verbose') !== true) return;
        let { results = {} } = resp;

        const tax = await Promise.all(
            Object.keys(results).map(id => {
                return Taxonomy.Type.retrieve({
                    objectId: id,
                    outputType: op.get(params, 'outputType', 'JSON'),
                });
            }),
        );

        tax.forEach(item => {
            const { id, objectId } = item;
            resp.results[id || objectId] = item;
        });
    },
    -1000,
);

// taxonomy-type-retrieve-query hook
Actinium.Hook.register(
    'taxonomy-type-retrieve-query',
    async (qry, params, options) => {
        if (op.get(params, 'name')) {
            qry.containedIn('name', _.flatten([params.name]));
        }
        if (op.get(params, 'slug')) {
            qry.containedIn('slug', _.flatten([params.slug]));
        }
    },
    -1000,
);

// taxonomy-retrieve-query hook
Actinium.Hook.register(
    'taxonomy-retrieve-query',
    async (qry, params, options) => {
        qry.include('type');
        if (op.get(params, 'name')) qry.equalTo('name', params.name);
        if (op.get(params, 'slug')) qry.equalTo('slug', params.slug);
        if (op.get(params, 'type')) {
            let type = params.type;

            if (typeof type === 'string') {
                // prettier-ignore
                type = await Actinium.Query.or(
                    new Actinium.Query('Type_taxonomy').equalTo('slug', type),
                    new Actinium.Query('Type_taxonomy').equalTo('objectId', type),
                ).first({ useMasterKey: true });
            }
            if (type) qry.equalTo('type', type);
        }
    },
    -1000,
);

// taxonomy-save hook
Actinium.Hook.register(
    'taxonomy-save',
    async req => {
        // validate required fields
        if (!req.object.get('name')) {
            req.context.errors.push('name is a required parameter');
        }
        if (!req.object.get('slug')) {
            req.context.errors.push('slug is a required parameter');
        }
        if (!req.object.get('type')) {
            req.context.errors.push('type is a required parameter');
        }
    },
    -1000,
);

// taxonomy-type-save hook
Actinium.Hook.register(
    'taxonomy-type-save',
    async req => {
        // validate required fields
        if (!req.object.get('name')) {
            req.context.errors.push('name is a required parameter');
        }
        if (!req.object.get('slug')) {
            req.context.errors.push('slug is a required parameter');
        }

        // Check slug if new
        if (req.object.isNew()) {
            const slug = req.object.get('slug');
            const lookup = await Taxonomy.Type.retrieve(
                { slug },
                { useMasterKey: true },
            );

            if (lookup) req.context.errors.push('slug must be unique');
        }
    },
    -1000,
);

// taxonomy-type-after-delete hook
Actinium.Hook.register(
    'taxonomy-type-after-delete',
    req => {
        Taxonomy.delete({ type: req.object }, { useMasterKey: true });
    },
    -1000,
);

// taxonomy-type-retrieved hook
Actinium.Hook.register(
    'taxonomy-type-retrieved',
    async (resp, params, options) => {
        if (!resp) return;

        const type = op.get(resp, 'objectId', op.get(resp, 'id'));

        const tax = await Taxonomy.list(
            { type, outputType: 'OBJECT' },
            options,
        );

        if (op.get(params, 'outputType') === 'JSON') {
            Object.keys(tax.results).forEach(key => {
                let item = tax.results[key];
                if (op.has(item, 'className')) {
                    item = item.toJSON();
                    op.del(item, 'type');
                    op.set(tax, ['results', key], item);
                }
            });
        }

        if (tax) {
            if (op.has(resp, 'className')) {
                resp.set('taxonomies', tax);
            } else {
                op.set(resp, 'taxonomies', tax);
            }
        }
    },
    -1000,
);

/**
 * ----------------------------------------------------------------------------
 * beforeSave hooks
 * ----------------------------------------------------------------------------
 */

Actinium.Cloud.beforeSave('Taxonomy', async req => {
    req.context = { errors: [] };

    await Actinium.Hook.run('taxonomy-save', req);

    if (_.flatten([op.get(req.context, 'errors', [])]).length > 0) {
        throw req.context.errors.join(',');
    }
});

Actinium.Cloud.beforeSave('Type_taxonomy', async req => {
    req.context = { errors: [] };

    await Actinium.Hook.run('taxonomy-type-save', req);

    if (_.flatten([op.get(req.context, 'errors', [])]).length > 0) {
        throw req.context.errors.join(',');
    }
});

/**
 * ----------------------------------------------------------------------------
 * beforeDelete hooks
 * ----------------------------------------------------------------------------
 */

Actinium.Cloud.beforeDelete('Taxonomy', async req => {
    req.context = { error: [] };

    await Actinium.Hook.run('taxonomy-delete', req);

    if (_.flatten([op.get(req.context, 'errors', [])]).length > 0) {
        throw req.context.error.join(',');
    }
});

Actinium.Cloud.beforeDelete('Type_taxonomy', async req => {
    req.context = { error: [] };

    await Actinium.Hook.run('taxonomy-type-delete', req);

    if (_.flatten([op.get(req.context, 'errors', [])]).length > 0) {
        throw req.context.error.join(',');
    }
});

/**
 * ----------------------------------------------------------------------------
 * afterSave hooks
 * ----------------------------------------------------------------------------
 */

Actinium.Cloud.afterSave('Taxonomy', async req => {
    await Actinium.Hook.run('taxonomy-after-save', req);
});

Actinium.Cloud.afterSave('Type_taxonomy', async req => {
    await Actinium.Hook.run('taxonomy-type-after-save', req);
});

/**
 * ----------------------------------------------------------------------------
 * afterDelete hooks
 * ----------------------------------------------------------------------------
 */

Actinium.Cloud.afterDelete('Taxonomy', async req => {
    await Actinium.Hook.run('taxonomy-after-delete', req);
});

Actinium.Cloud.afterDelete('Type_taxonomy', async req => {
    await Actinium.Hook.run('taxonomy-type-after-delete', req);
});

/**
 * Cloud functions
 */
Actinium.Cloud.define(PLUGIN.ID, 'taxonomy-create', req =>
    Taxonomy.create(req.params, Actinium.Utils.CloudRunOptions(req)),
);

Actinium.Cloud.define(PLUGIN.ID, 'taxonomy-update', req =>
    Taxonomy.update(req.params, Actinium.Utils.CloudRunOptions(req)),
);

Actinium.Cloud.define(PLUGIN.ID, 'taxonomy-delete', req =>
    Taxonomy.delete(req.params, Actinium.Utils.CloudRunOptions(req)),
);

Actinium.Cloud.define(PLUGIN.ID, 'taxonomy-retrieve', req =>
    Taxonomy.retrieve(req.params, Actinium.Utils.CloudRunOptions(req)),
);

Actinium.Cloud.define(PLUGIN.ID, 'taxonomy-exists', req =>
    Taxonomy.exists(req.params, Actinium.Utils.CloudRunOptions(req)),
);

Actinium.Cloud.define(PLUGIN.ID, 'taxonomies', req =>
    Taxonomy.list(req.params, Actinium.Utils.CloudRunOptions(req)),
);

Actinium.Cloud.define(PLUGIN.ID, 'taxonomy-type-create', req =>
    Taxonomy.Type.create(req.params, Actinium.Utils.CloudRunOptions(req)),
);

Actinium.Cloud.define(PLUGIN.ID, 'taxonomy-type-update', req =>
    Taxonomy.Type.update(req.params, Actinium.Utils.CloudRunOptions(req)),
);

Actinium.Cloud.define(PLUGIN.ID, 'taxonomy-type-delete', req =>
    Taxonomy.Type.delete(req.params, Actinium.Utils.CloudRunOptions(req)),
);

Actinium.Cloud.define(PLUGIN.ID, 'taxonomy-type-retrieve', req =>
    Taxonomy.Type.retrieve(req.params, Actinium.Utils.CloudRunOptions(req)),
);

Actinium.Cloud.define(PLUGIN.ID, 'taxonomy-type-exists', req =>
    Taxonomy.Type.exists(req.params, Actinium.Utils.CloudRunOptions(req)),
);

Actinium.Cloud.define(PLUGIN.ID, 'taxonomy-types', req =>
    Taxonomy.Type.list(req.params, Actinium.Utils.CloudRunOptions(req)),
);

Actinium.Cloud.define(PLUGIN.ID, 'taxonomy-content-attach', async req =>
    Taxonomy.Content.attach(req.params, Actinium.Utils.CloudRunOptions(req)),
);

Actinium.Cloud.define(PLUGIN.ID, 'taxonomy-content-detach', async req =>
    Taxonomy.Content.detach(req.params, Actinium.Utils.CloudRunOptions(req)),
);

Actinium.Cloud.define(PLUGIN.ID, 'taxonomy-content-retrieve', async req =>
    Taxonomy.Content.retrieve(req.params, Actinium.Utils.CloudRunOptions(req)),
);
