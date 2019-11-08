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
Actinium.Cloud.define(PLUGIN.ID, 'blueprint-generate', async req => {
    if (Actinium.Cache.get('blueprint-generating')) return;
    Actinium.Cache.get(
        'blueprint-generating',
        true,
        Actinium.Enums.cache.dataLoading,
    );

    const options = CloudRunOptions(req);

    // Allow plugins to add to the default blueprints
    await Actinium.Hook.run('blueprint-defaults', DEFAULTS, options);

    const defaultBlueprints = DEFAULTS.reduce((defaults, bp) => {
        if (op.has(bp, 'ID')) {
            defaults[bp.ID] = bp;
        }

        return defaults;
    }, {});

    // Lookup defaults before creating
    let IDS = Object.keys(defaultBlueprints);

    let search = await new Parse.Query(COLLECTION)
        .containedIn('ID', IDS)
        .find(options);

    search = _.pluck(search.map(item => item.toJSON()), 'ID');

    const blueprints = Object.entries(defaultBlueprints)
        .filter(([ID]) => !search.includes(ID))
        .map(([, blueprintData]) => {
            const blueprint = new Parse.Object(COLLECTION);
            Object.entries(blueprintData).forEach(([key, value]) =>
                blueprint.set(key, value),
            );
            return blueprint;
        });

    // Save initial blueprints
    if (blueprints.length > 0) {
        await Parse.Object.saveAll(blueprints, options);
    }
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

const mapBlueprints = (blueprints = []) =>
    blueprints.map(blueprint => {
        if (op.has(blueprint, 'id')) {
            return blueprint.toJSON();
        } else {
            return blueprint;
        }
    });

/**
* @api {Cloud} blueprint-retrieve blueprint-retrieve
* @apiVersion 3.1.2
* @apiGroup Cloud
* @apiName blueprint-retrieve
* @apiParam {String} ID The name of an existing blueprint.
* @apiDescription Retrieve a blueprint.
* @apiExample Example Usage:
// get a specific blueprint
Actinium.Cloud.run('blueprint-retrieve', { ID: 'MyBlueprint'});
*/
Actinium.Cloud.define(PLUGIN.ID, 'blueprint-retrieve', async req => {
    const { ID } = req.params;
    if (Actinium.Cache.get(['blueprint', ID])) {
        return Actinium.Cache.get(['blueprint', ID]);
    }

    const options = CloudRunOptions(req);
    const query = new Parse.Query(COLLECTION);

    if (!ID) {
        throw 'ID is a required parameter';
    }

    query.equalTo('ID', ID);

    const blueprints = await query.find(options);
    const blueprint = op.get(mapBlueprints(blueprints), 0);

    await Actinium.Hook.run('blueprint-retrieve', blueprint);
    Actinium.Cache.set(
        ['blueprint', ID],
        blueprint,
        Actinium.Enums.cache.dataLoading,
    );
    return blueprint;
});

/**
* @api {Cloud} blueprints blueprints
* @apiVersion 3.1.2
* @apiGroup Cloud
* @apiName blueprints
* @apiParam {Number} [limit=1000] Limit of blueprints to return
* @apiParam {Number} [skip=0] Number of blueprints to skip
* @apiDescription Get all blueprints by default. If page > 0, deliver page of `limit` blueprints.
* @apiExample All Example:
// get all blueprints
Actinium.Cloud.run('blueprints');
* @apiExample Page Example:
// get first page of 1000 maximum blueprints
Actinium.Cloud.run('blueprints', { page: 1, limit: 1000 });
*/
Actinium.Cloud.define(PLUGIN.ID, 'blueprints', async req => {
    let pages = 0,
        total = 0;

    let { page = 0, limit = 1000 } = req.params;

    page = Math.max(page, 0);
    limit = Math.min(limit, 1000);
    let cacheKey = ['blueprints', page, limit, 'blueprints'];

    let blueprints = page < 1 ? Actinium.Cache.get(cacheKey, []) : [];

    if (blueprints.length < 1) {
        const skip = page > 0 ? page * limit - limit : 0;
        const query = new Parse.Query(COLLECTION);
        const options = CloudRunOptions(req);

        // Pagination
        total = await query.count(options);

        // Find
        query.skip(skip);
        query.limit(limit);
        query.include('blueprint');

        let results = await query.find(options);

        while (results.length > 0) {
            blueprints = blueprints.concat(results);

            if (page < 1) {
                query.skip(blueprints.length);
                results = await query.find(options);
            } else {
                break;
            }
        }

        Actinium.Cache.set(
            cacheKey,
            blueprints,
            Actinium.Enums.cache.dataLoading,
        );
    } else {
        total = blueprints.length;
    }

    pages = Math.ceil(total / limit);

    const list = {
        timestamp: Date.now(),
        limit,
        page,
        pages,
        total,
        blueprints: mapBlueprints(blueprints),
    };

    await Actinium.Hook.run('blueprint-list', list);

    return Promise.resolve(list);
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
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
    const blueprint = req.object.toJSON();

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

    if (!op.has(blueprint, 'ID')) {
        throw 'ID required.';
    }
    if (!op.has(blueprint, 'description')) {
        throw 'description required.';
    }
    if (!op.has(blueprint, 'sections')) {
        throw 'sections required.';
    }

    if (req.object.isNew()) {
        const { ID } = blueprint;
        const fetched = await Actinium.Cloud.run(
            'blueprint-retrieve',
            { ID },
            { useMasterKey: true },
        );

        if (ID && op.get(fetched, 'objectId') === ID) {
            throw `Blueprint with ID [${ID}] already exists.`;
            return;
        }
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
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
    const blueprint = req.object.toJSON();

    if (op.get(blueprint, 'meta.builtIn')) {
        throw 'Deleting built-in blueprint not permitted.';
    }

    return Promise.resolve();
};

Actinium.Hook.register('start', async () => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        return Actinium.Cloud.run('blueprint-generate', null, {
            useMasterKey: true,
        });
    }
});

Actinium.Hook.register('activate', ({ ID }) => {
    if (ID === PLUGIN.ID) {
        return Actinium.Cloud.run('blueprint-generate', null, {
            useMasterKey: true,
        });
    }
});

Parse.Cloud.beforeSave(COLLECTION, beforeSave);

Parse.Cloud.beforeDelete(COLLECTION, beforeDelete);
