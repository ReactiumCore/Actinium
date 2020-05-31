const _ = require('underscore');
const chalk = require('chalk');
const op = require('object-path');
const { CloudRunOptions } = require(`${ACTINIUM_DIR}/lib/utils`);

const PLUGIN = require('./info');

/**
 * ----------------------------------------------------------------------------
 * Extend Actiniun SDK
 * ----------------------------------------------------------------------------
 */
const SDK = require('./sdk');
Actinium['Taxonomy'] = op.get(Actinium, 'Taxonomy', SDK);

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

Actinium.Hook.register('blueprint-defaults', blueprints => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
    const PLUGIN_BLUEPRINTS = require('./blueprints');
    PLUGIN_BLUEPRINTS.forEach(item => blueprints.push(item));
});

Actinium.Hook.register(
    'route-defaults',
    routes => {
        if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
        const PLUGIN_ROUTES = require('./routes');
        PLUGIN_ROUTES.forEach(item => routes.push(item));
    },
    100,
);

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

Actinium.Hook.register('warning', () => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
    if (SDK.warning !== true) return;

    LOG('');
    LOG(chalk.cyan.bold('Notice:'), 'The default Taxonomy has been created');
});

Actinium.Hook.register('start', async () => {
    await SDK.install();
});

Actinium.Hook.register('uninstall', async ({ ID }) => {
    if (ID !== PLUGIN.ID) return;

    // Your uninstall code here
});

Actinium.Hook.register('activate', ({ ID }) => {
    if (ID !== PLUGIN.ID) return;

    // Your activation code here
});

Actinium.Hook.register('deactivate', ({ ID }) => {
    if (ID !== PLUGIN.ID) return;

    // Your deactivation code here
});

/*
{"name": "Category", "slug": "category", "description": "Default taxonomy type"}
*/
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
);

Actinium.Hook.register(
    'taxonomy-retrieve-query',
    async (qry, params, options) => {
        if (op.get(params, 'name')) qry.equalTo('name', params.name);
        if (op.get(params, 'slug')) qry.equalTo('slug', params.slug);
        if (op.get(params, 'type')) qry.equalTo('type', params.type);
    },
);

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
            const lookup = await SDK.Type.retrieve(
                { slug },
                { useMasterKey: true },
            );

            if (lookup) req.context.error.push('slug must be unique');
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
    req.context = { error: [] };

    await Actinium.Hook.run('taxonomy-save', req);

    if (_.flatten([op.get(req.context, 'error', [])]).length > 0) {
        throw req.context.error.join(',');
    }
});

Actinium.Cloud.beforeSave('Type_taxonomy', async req => {
    req.context = { error: [] };

    await Actinium.Hook.run('taxonomy-type-save', req);

    if (_.flatten([op.get(req.context, 'error', [])]).length > 0) {
        throw req.context.error.join(',');
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

    if (_.flatten([op.get(req.context, 'error', [])]).length > 0) {
        throw req.context.error.join(',');
    }
});

Actinium.Cloud.beforeDelete('Type_taxonomy', async req => {
    req.context = { error: [] };

    await Actinium.Hook.run('taxonomy-type-delete', req);

    if (_.flatten([op.get(req.context, 'error', [])]).length > 0) {
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
    SDK.create(req.params, Actinium.Utils.CloudRunOptions(req)),
);

Actinium.Cloud.define(PLUGIN.ID, 'taxonomy-update', req =>
    SDK.update(req.params, Actinium.Utils.CloudRunOptions(req)),
);

Actinium.Cloud.define(PLUGIN.ID, 'taxonomy-delete', req =>
    SDK.delete(req.params, Actinium.Utils.CloudRunOptions(req)),
);

Actinium.Cloud.define(PLUGIN.ID, 'taxonomy-retrieve', req =>
    SDK.retrieve(req.params, Actinium.Utils.CloudRunOptions(req)),
);

Actinium.Cloud.define(PLUGIN.ID, 'taxonomies', req =>
    SDK.list(req.params, Actinium.Utils.CloudRunOptions(req)),
);

Actinium.Cloud.define(PLUGIN.ID, 'taxonomy-type-create', req =>
    SDK.Type.create(req.params, Actinium.Utils.CloudRunOptions(req)),
);

Actinium.Cloud.define(PLUGIN.ID, 'taxonomy-type-update', req =>
    SDK.Type.update(req.params, Actinium.Utils.CloudRunOptions(req)),
);

Actinium.Cloud.define(PLUGIN.ID, 'taxonomy-type-delete', req =>
    SDK.Type.delete(req.params, Actinium.Utils.CloudRunOptions(req)),
);

Actinium.Cloud.define(PLUGIN.ID, 'taxonomy-type-retrieve', req =>
    SDK.Type.retrieve(req.params, Actinium.Utils.CloudRunOptions(req)),
);

Actinium.Cloud.define(PLUGIN.ID, 'taxonomy-types', req =>
    SDK.Type.list(req.params, Actinium.Utils.CloudRunOptions(req)),
);
