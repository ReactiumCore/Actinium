const { CloudRunOptions } = require(`${ACTINIUM_DIR}/lib/utils`);
const ParseNode = require('parse/node');
const op = require('object-path');
const _ = require('underscore');

const COLLECTION = 'Blueprint';

const DEFAULTS = require('./defaults');

const PLUGIN = {
    ID: COLLECTION,
    description: 'Blueprint plugin.',
    name: 'Blueprint Plugin',
    order: 0,
    version: {
        actinium: '>=3.0.5',
        plugin: '0.0.1',
    },
    meta: {
        builtIn: true,
    },
};

Actinium.Plugin.register(PLUGIN, true);

Actinium.Capability.register(
    `${COLLECTION}.create`,
    {
        allowed: ['administrator', 'super-admin'],
        excluded: ['banned'],
    },
    1000,
);

Actinium.Capability.register(
    `${COLLECTION}.retrieve`,
    {
        allowed: ['administrator', 'super-admin'],
        excluded: ['banned'],
    },
    1000,
);

Actinium.Capability.register(
    `${COLLECTION}.update`,
    {
        allowed: ['administrator', 'super-admin'],
        excluded: ['banned'],
    },
    1000,
);

Actinium.Capability.register(
    `${COLLECTION}.delete`,
    {
        allowed: ['administrator', 'super-admin'],
        excluded: ['banned'],
    },
    1000,
);

Actinium.Capability.register(
    `${COLLECTION}.addField`,
    {
        allowed: ['administrator', 'super-admin'],
        excluded: ['banned'],
    },
    1000,
);

Actinium.Collection.register(COLLECTION, {
    create: false,
    retrieve: true,
    update: false,
    delete: false,
    addField: false,
});

/**
 * @api {Cloud} blueprint-generate blueprint-generate
 * @apiVersion 3.1.2
 * @apiGroup Cloud
 * @apiName blueprint-generate
 * @apiDescription Generate the default Blueprint objects.
 * @apiExample Example Usage:
 Actinium.Cloud.run('blueprint-generate');
 */
Actinium.Cloud.define(PLUGIN.ID, 'blueprint-generate', async () => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        // Allow plugins to add to the default blueprints
        await Actinium.Hook.run('blueprint-defaults', DEFAULTS);

        // Lookup defaults before creating
        let IDS = _.pluck(DEFAULTS, 'ID');

        let search = await new Parse.Query(COLLECTION)
            .containedIn('ID', IDS)
            .limit(IDS.length)
            .find();

        search = _.pluck(search.map(item => item.toJSON()), 'ID');

        const blueprints = DEFAULTS.filter(
            ({ ID }) => !search.includes(ID),
        ).map(blueprintData => {
            const blueprint = new Parse.Object(COLLECTION);
            Object.entries(blueprintData).forEach(([key, value]) =>
                blueprint.set(key, value),
            );
            return blueprint;
        });

        // Save initial blueprints
        if (blueprints.length > 0) {
            await Parse.Object.saveAll(blueprints, { useMasterKey: true });
        }
    }

    return Promise.resolve();
});

/**
  * @api {Cloud} blueprint-create blueprint-create
  * @apiVersion 3.1.2
  * @apiGroup Cloud
  * @apiName blueprint-create
  * @apiParam {String} ID The name of the blueprint.
  * @apiParam {String} description The description of the blueprint.
  * @apiParam {Object} sections object containing 1 or more sections, each with 1 or more zones.
  * @apiParam {Object} meta free-form metadata object
  * @apiDescription Create a new blueprint for use in a front-end application.
  * @apiExample Example Usage:
Actinium.Cloud.run('blueprint-create', {
        ID: 'MyBlueprint',
        description: 'Blueprint with a top, left, right, center, and bottom section.',
        sections: {
            top: {
                zones: ['top'],
                meta: {},
            },
            right: {
                zones: ['right'],
                meta: {},
            },
            left: {
                zones: ['left'],
                meta: {},
            },
            center: {
                zones: ['center'],
                meta: {},
            },
            bottom: {
                zones: ['bottom'],
                meta: {},
            },
        },
        meta: {
            foo: 'bar',
        },
    },
);
  */
Actinium.Cloud.define(PLUGIN.ID, 'blueprint-create', async req => {
    const { ID, description, sections, meta = {} } = req.params;
    const options = CloudRunOptions(req);
    const blueprint = new Parse.Object(COLLECTION);
    blueprint.set('ID', ID);
    blueprint.set('description', description);
    blueprint.set('sections', sections);
    blueprint.set('meta', meta);

    return blueprint.save(null, options);
});

/**
* @api {Cloud} blueprint-retrieve blueprint-retrieve
* @apiVersion 3.1.2
* @apiGroup Cloud
* @apiName blueprint-retrieve
* @apiParam {String} ID The name of an existing blueprint.
* @apiParam {Number} limit=1000 Limit of blueprints to return
* @apiParam {Number} skip=0 Number of blueprints to skip
* @apiDescription Retrieve list of blueprints.
* @apiExample Example Usage:
// get a specific blueprint
Actinium.Cloud.run('blueprint-retrieve', { ID: 'MyBlueprint'});

// get list of blueprints, limit to 1000
Actinium.Cloud.run('blueprint-retrieve', { limit: 1000 });
*/
Actinium.Cloud.define(PLUGIN.ID, 'blueprint-retrieve', async req => {
    const { ID, limit = 1000, skip = 0 } = req.params;
    const options = CloudRunOptions(req);
    const query = new Parse.Query(COLLECTION);

    if (ID) {
        query.equalTo('ID', ID);
    }

    query.limit(limit);
    query.skip(skip);

    const total = await query.count(options);
    const blueprints = await query.find(options);
    const list = {
        total,
        limit,
        skip,
        blueprints,
    };

    await Actinium.Hook.run('blueprint-retrieve', list);
    return list;
});

/**
* @api {Cloud} blueprint-update blueprint-update
* @apiVersion 3.1.2
* @apiGroup Cloud
* @apiName blueprint-update
* @apiParam {String} [objectId] the object id of the existing blueprint
* @apiParam {String} ID The name of the existing blueprint.
* @apiParam {String} description The description of the blueprint.
* @apiParam {Object} sections object containing 1 or more sections, each with 1 or more zones.
* @apiParam {Object} meta free-form metadata object
* @apiDescription Create a new blueprint for use in a front-end application.
* @apiExample Example Usage:
Actinium.Cloud.run('blueprint-update', {
      ID: 'MyBlueprint',
      description: 'Blueprint with a top, left, right, center, and bottom section.',
      sections: {
          top: {
              zones: ['top'],
              meta: {},
          },
          right: {
              zones: ['right'],
              meta: {},
          },
          left: {
              zones: ['left'],
              meta: {},
          },
          center: {
              zones: ['center'],
              meta: {},
          },
          bottom: {
              zones: ['bottom'],
              meta: {},
          },
      },
      meta: {
          foo: 'bar',
      },
  },
);
*/
Actinium.Cloud.define(PLUGIN.ID, 'blueprint-update', async req => {
    const { objectId, ID, description, sections, meta = {} } = req.params;
    const options = CloudRunOptions(req);

    let blueprint;
    if (objectId) {
        blueprint = new Parse.Object(COLLECTION);
        blueprint.id = objectId;
    } else if (ID) {
        const query = new Parse.Query(COLLECTION);
        query.equalTo('ID', ID);
        blueprint = await query.first(options);
    } else {
        throw 'missing objectId or ID in blueprint-update';
    }

    if (!blueprint) throw 'blueprint not found in blueprint-update';
    await blueprint.fetch(options);

    if (description) blueprint.set('description', description);
    if (sections) blueprint.set('sections', sections);
    if (meta) blueprint.set('meta', meta);

    return blueprint.save(null, options);
});

/**
* @api {Cloud} blueprint-delete blueprint-delete
* @apiVersion 3.1.2
* @apiGroup Cloud
* @apiName blueprint-delete
* @apiParam {String} [objectId] the object id of the existing blueprint
* @apiParam {String} ID The name of the existing blueprint.
* @apiDescription Delete existing blueprint. Built-in blueprints can not be deleted by default.
* @apiExample Example Usage:
Actinium.Cloud.run('blueprint-delete', {
    ID: 'MyBlueprint',
});
*/
Actinium.Cloud.define(PLUGIN.ID, 'blueprint-delete', async req => {
    const { objectId, ID } = req.params;
    const options = CloudRunOptions(req);

    let blueprint;
    if (objectId) {
        blueprint = new Parse.Object(COLLECTION);
        blueprint.id = objectId;
    } else if (ID) {
        const query = new Parse.Query(COLLECTION);
        query.equalTo('ID', ID);
        blueprint = await query.first(options);
    } else {
        throw 'missing objectId or ID in blueprint-delete';
    }

    if (!blueprint) throw 'blueprint not found in blueprint-delete';
    return blueprint.destroy(options);
});

const beforeSave = async req => {
    const blueprint = req.object.toJSON();

    if (req.object.isNew()) {
        const { ID } = blueprint;
        const { blueprints: fetched } = await Actinium.Cloud.run(
            'blueprint-retrieve',
            { ID },
        );

        if (fetched.length) {
            throw `Blueprint with ID [${ID}] already exists.`;
            return;
        }
    }

    Object.keys(blueprint).forEach(key => {
        switch (key) {
            case 'objectId':
            case 'ID':
            case 'description':
            case 'sections':
            case 'meta':
                break;
            default:
                req.object.unset(key);
        }
    });

    if (!blueprint.ID) {
        throw 'ID required.';
    }
    if (!blueprint.description) {
        throw 'description required.';
    }
    if (!blueprint.sections) {
        throw 'sections required.';
    }

    const sections = Object.values(blueprint.sections).filter(section => {
        const zones = op.get(section, 'zones', []);
        return zones && Array.isArray(zones) && zones.length > 0;
    });

    if (!sections.length) {
        throw 'sections must contain at least one section with non-empty list of zones.';
    }
};

const beforeDelete = async req => {
    const blueprint = req.object.toJSON();

    if (op.get(blueprint, 'meta.builtIn')) {
        throw 'Deleting built-in blueprint not permitted.';
    }

    await Actinium.Cloud.run('blueprint-generate');

    return Promise.resolve();
};

Actinium.Hook.register('activate', ({ ID }) => {
    if (ID === PLUGIN.ID) {
        return Actinium.Cloud.run('blueprint-generate');
    }
});

Actinium.Hook.register(
    'start',
    () => Actinium.Cloud.run('blueprint-generate'),
    -1000,
);

Actinium.Hook.register('start', () => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        Actinium.Hook.register('beforeSave-blueprint', beforeSave);
        Actinium.Hook.register('beforeDelete-blueprint', beforeDelete);
    }
    return Promise.resolve();
});

Parse.Cloud.beforeSave(COLLECTION, async req => {
    return Actinium.Hook.run('beforeSave-blueprint', req);
});

Parse.Cloud.beforeDelete(COLLECTION, async req => {
    return Actinium.Hook.run('beforeDelete-blueprint', req);
});
