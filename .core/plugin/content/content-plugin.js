const _ = require('underscore');
const op = require('object-path');
const uuidv5 = require('uuid/v5');
const slugify = require(`${ACTINIUM_DIR}/lib/utils/slugify`);
const serialize = require(`${ACTINIUM_DIR}/lib/utils/serialize`);
const getACL = require(`${ACTINIUM_DIR}/lib/utils/acl`);
const equal = require('fast-deep-equal');

const PLUGIN = {
    ID: 'Content',
    name: 'Content Plugin',
    description: 'Plugin used to manage content.',
    version: {
        actinium: '>=3.0.5',
        plugin: '0.0.1',
    },
    meta: {
        group: 'core',
        builtIn: true,
    },
};

const PLUGIN_SDK = require('./sdk');
const PLUGIN_ROUTES = require('./routes');
const PLUGIN_SCHEMA = require('./schema-template');
const PLUGIN_BLUEPRINTS = require('./blueprints');
const ENUMS = require('./enums');

// Create SDK Singleton
Actinium.Content = PLUGIN_SDK;

// Register Plugin
Actinium.Plugin.register(PLUGIN, true);

// Register Blueprints
Actinium.Hook.register(
    'blueprint-defaults',
    blueprints => {
        if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
        PLUGIN_BLUEPRINTS.forEach(item => blueprints.push(item));
    },
    -1000,
);

// Register Routes
Actinium.Hook.register('route-defaults', routes => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
    PLUGIN_ROUTES.forEach(item => routes.push(item));
});

Actinium.Hook.register('start', async () => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;

    Actinium.Pulse.define(
        'scheduled-publish',
        {
            schedule: Actinium.Setting.get(ENUMS.CRON_SETTING, '*/30 * * * *'),
        },
        Actinium.Content.publishScheduled,
    );
    Actinium.Content.publishScheduled();
});

Actinium.Hook.register('start', async () => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;

    /**
     * @api {Hook} content-default-statuses content-default-statuses
     * @apiDescription Hook during `start` if content plugin is active.
     You can use this to add additional default content statuses (e.g. DRAFT, PUBLISHED)
     * @apiParam {Object} STATUS pass by reference, built-in statuses
     * @apiName content-default-statuses
     * @apiGroup Hooks
     */
    await Actinium.Hook.run('content-default-statuses', ENUMS.STATUS);

    /**
     * @api {Hook} content-default-change-types content-default-change-types
     * @apiDescription Hook during `start` if content plugin is active.
     You can use this to add additional change log reasons.
     * @apiParam {Object} STATUS pass by reference, built-in statuses
     * @apiName content-default-change-types
     * @apiGroup Hooks
     */
    await Actinium.Hook.run('content-default-change-types', ENUMS.CHANGES);
});

Actinium.Hook.register('setting-set', async (key, value) => {
    if (key === ENUMS.CRON_SETTING) {
        Actinium.Pulse.replace(
            'scheduled-publish',
            {
                schedule: Actinium.Setting.get(
                    ENUMS.CRON_SETTING,
                    '*/30 * * * *',
                ),
            },
            Actinium.Content.publishScheduled,
        );
    }
});

Actinium.Hook.register('schema', async () => {
    const { types = [] } = await Actinium.Type.list({}, { useMasterKey: true });

    for (const type of types) {
        try {
            await Actinium.Content.saveSchema(type);
        } catch (error) {
            console.log(`Error updating content schema ${type.type}`, error);
        }
    }
});

Actinium.Hook.register('type-saved', async contentType => {
    const { objectId, type } = contentType;
    try {
        await Actinium.Content.saveSchema(contentType);
    } catch (error) {
        console.log(`Error updating content schema ${type}`, error);
    }
});

Actinium.Hook.register(
    'content-field-sanitize',
    async (field, config, fieldIndex, fieldData) => {
        if (
            typeof field.fieldValue === 'undefined' ||
            field.fieldValue === null
        )
            return;

        switch (config.fieldType) {
            case 'Text':
                if (typeof field.fieldValue !== 'string') field.fieldValue = '';
                break;
            case 'RichText':
                if (typeof field.fieldValue !== 'object')
                    field.fieldValue = { children: [] };
                break;
            case 'List':
                if (!Array.isArray(field.fieldValue)) field.fieldValue = [];
                break;
            case 'Number':
                if (!_.isNumber(field.fieldValue))
                    field.fieldValue = Number(field.fieldValue);
        }
    },
);

/**
 * @api {Asynchronous} content-create content-create
 * @apiDescription Create new content of a defined Type. In addition to the required parameters of
 `type` and `slug`, you can provide any parameter's that conform to the runtime fields saved for that type.
 * @apiParam {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam {String} slug The unique slug for the new content.
 * @apiParam {Array} [permissions=Array] List of permissions to apply to content. If not provided, no ACL will be set.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (permission) {Object} permission Read or write
 * @apiParam (permission) {Object} type role or user
 * @apiParam (permission) {Object} [objectId] objectId of user
 * @apiParam (permission) {Object} [name] name of role
 * @apiName content-create
 * @apiGroup Cloud
 */
Actinium.Cloud.define(PLUGIN.ID, 'content-create', async req => {
    const collection = await Actinium.Type.getCollection(
        op.get(req.params, 'type'),
    );

    if (req.user) {
        req.params.user = req.user;
    }

    return Actinium.Content.create(
        req.params,
        Actinium.Utils.CloudCapOptions(req, [`${collection}.create`]),
    );
});

/**
 * @api {Asynchronous} content-list content-list
 * @apiDescription Get list of content of a specific Type.
 * @apiParam {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam {Boolean} [refresh=false] skip cache check when true
 * @apiParam {Boolean} [optimize=false] if optimize is true, and collection contains
less than 1000 records, the entire set will be delivered in one page for application-side pagination.
 * @apiParam {String} [status=PUBLISHED] "PUBLISHED" or "DRAFT" status of the content
 * @apiParam {String} [orderBy=createdAt] Field to order the results by.
 * @apiParam {String} [direction=descending] Order "descending" or "ascending"
 * @apiParam {Number} [limit=20] Limit page results
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiName content-list
 * @apiGroup Actinium
 * @apiExample Usage
Actinium.Cloud.run('content-list', {
    "type": {
        "machineName": "article"
    },
    "orderBy":"title",
    "direction": "ascending",
    "limit": 1,
    "status": "DRAFT"
});
 */
Actinium.Cloud.define(PLUGIN.ID, 'content-list', async req => {
    const collection = await Actinium.Type.getCollection(
        op.get(req.params, 'type'),
    );
    const options = Actinium.Utils.CloudHasCapabilities(req, [
        `${collection}.retrieveAny`,
    ])
        ? Actinium.Utils.CloudMasterOptions(req)
        : Actinium.Utils.CloudRunOptions(req);

    return Actinium.Content.list(req.params, options);
});

/**
 * @api {Asynchronous} content-retrieve content-retrieve
 * @apiDescription Retrieve one item of content.
 * @apiParam {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam {Boolean} [current=false] When true, get the currently committed content (not from revision system).
 otherwise, construct the content from the provided history (branch and revision index).
 * @apiParam {Object} [history] revision history to retrieve, containing branch and revision index.
 * @apiParam {String} [slug] The unique slug for the content.
 * @apiParam {String} [objectId] The objectId for the content.
 * @apiParam {String} [uuid] The uuid for the content.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (history) {String} [branch=master] the revision branch of current content
 * @apiParam (history) {Number} [revision] index in branch history to retrieve
 (default index of latest revision)
 * @apiName content-retrieve
 * @apiGroup Cloud
 */
Actinium.Cloud.define(PLUGIN.ID, 'content-retrieve', async req => {
    const collection = await Actinium.Type.getCollection(
        op.get(req.params, 'type'),
    );
    const options = Actinium.Utils.CloudHasCapabilities(req, [
        `${collection}.retrieveAny`,
    ])
        ? Actinium.Utils.CloudMasterOptions(req)
        : Actinium.Utils.CloudRunOptions(req);

    return Actinium.Content.retrieve(req.params, options);
});

/**
 * @api {Asynchronous} content-revisions content-revisions
 * @apiDescription Retrieve branch history of some content.
 * @apiParam {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam {Boolean} [current=false] When true, get the currently committed content (not from revision system).
 otherwise, construct the content from the provided history (branch and revision index).
 * @apiParam {Object} [history] revision history to retrieve, containing branch and revision index.
 * @apiParam {String} [slug] The unique slug for the content.
 * @apiParam {String} [objectId] The objectId for the content.
 * @apiParam {String} [uuid] The uuid for the content.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (history) {String} [branch=master] the revision branch of current content
 * @apiName content-revisions
 * @apiGroup Cloud
 */
Actinium.Cloud.define(PLUGIN.ID, 'content-revisions', async req => {
    const collection = await Actinium.Type.getCollection(
        op.get(req.params, 'type'),
    );
    const options = Actinium.Utils.CloudHasCapabilities(req, [
        `${collection}.retrieveAny`,
    ])
        ? Actinium.Utils.CloudMasterOptions(req)
        : Actinium.Utils.CloudRunOptions(req);

    return Actinium.Content.revisions(req.params, options);
});

/**
 * @api {Asynchronous} content-set-current content-set-current
 * @apiDescription Take content from a specified branch or revision,
 and make it the "official" version of the content. If no `history` is param is
 specified the latest master branch revision will be used.
 * @apiParam {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam {String} [slug] The unique slug for the content.
 * @apiParam {String} [objectId] The Parse object id of the content.
 * @apiParam {String} [uuid] The uuid of the content.
 * @apiParam {Object} [history] revision history to retrieve, containing branch and revision index.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (history) {String} [branch=master] the revision branch of current content
 * @apiParam (history) {Number} [revision] index in branch history to update (defaults to most recent in branch).
 * @apiName content-set-current
 * @apiGroup Cloud
 * @apiExample Usage
 Actinium.Cloud.run('content-set-current', {
     // Type object required to look up content
     // i.e. the collection is determined by the parent Type
     type: {
         // one of these 3 required to look up content
         objectId: 'MvAerDoRQN',
         machineName: 'article',
         uuid: '975776a5-7070-5c23-bee6-4e9bba84a431',
     },

     // one of these 3 required to look up content
     objectId: 'tEiojmmHA1',
     slug: 'test-article1',
     uuid: '5320803c-b709-5327-a06f-b482c8f41b92',

     history: { branch: 'master' }
 });
 */
Actinium.Cloud.define(PLUGIN.ID, 'content-set-current', async req => {
    const collection = await Actinium.Type.getCollection(
        op.get(req.params, 'type'),
    );
    const options = Actinium.Utils.CloudHasCapabilities(req, [
        `${collection}.updateAny`,
    ])
        ? Actinium.Utils.CloudMasterOptions(req)
        : Actinium.Utils.CloudRunOptions(req);

    if (req.user) {
        req.params.user = req.user;
    }

    return Actinium.Content.setCurrent(req.params, options);
});

/**
 * @api {Asynchronous} content-permissions content-permissions
 * @apiDescription Update permissions for content.
 * @apiParam {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam {String} [slug] The unique slug for the content.
 * @apiParam {String} [objectId] The Parse object id of the content.
 * @apiParam {String} [uuid] The uuid of the content.
 * @apiParam {Array} permissions List of permissions to apply to content.
 If unset, ACL will not be updated. If empty array, public read access will be applied.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (permission) {Object} permission Read or write
 * @apiParam (permission) {Object} type role or user
 * @apiParam (permission) {Object} [objectId] objectId of user
 * @apiParam (permission) {Object} [name] name of role
 * @apiName content-permissions
 * @apiGroup Cloud
 */
Actinium.Cloud.define(PLUGIN.ID, 'content-permissions', async req => {
    const collection = await Actinium.Type.getCollection(
        op.get(req.params, 'type'),
    );
    const options = Actinium.Utils.CloudHasCapabilities(req, [
        `${collection}.updateAny`,
    ])
        ? Actinium.Utils.CloudMasterOptions(req)
        : Actinium.Utils.CloudRunOptions(req);

    if (req.user) {
        req.params.changeUser = req.user;
    }

    return Actinium.Content.setPermissions(req.params, options);
});

/**
 * @api {Asynchronous} content-update content-update
 * @apiDescription Update content of a defined Type. In addition to the required parameters of
 `type` and `slug`, you can provide any parameter's that conform to the runtime fields saved for that type.
 Changes to content will be staged as a new delta revision. If no `history` (branch and revision index) are provided
 A new revision will be added in the master branch. To commit a revision to your content
 collection, use `content-set-current`.
 * @apiParam {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam {String} [slug] The unique slug for the content.
 * @apiParam {String} [objectId] The Parse object id of the content.
 * @apiParam {String} [uuid] The uuid of the content.
 * @apiParam {Object} [history] revision history to retrieve, containing branch and revision index.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (history) {String} [branch=master] the revision branch of current content
 * @apiParam (history) {Number} [revision] index in branch history to update (defaults to most recent in branch).
 If you select a revision before the latest revision, a new branch will be created.
 * @apiName content-update
 * @apiGroup Cloud
 * @apiExample Usage
 Actinium.Cloud.run('content-update', {
     // Type object required to look up content
     // i.e. the collection is determined by the parent Type
     type: {
         // one of these 3 required to look up content
         objectId: 'MvAerDoRQN',
         machineName: 'article',
         uuid: '975776a5-7070-5c23-bee6-4e9bba84a431',
     },

     // one of these 3 required to look up content
     objectId: 'tEiojmmHA1',
     slug: 'test-article1',
     uuid: '5320803c-b709-5327-a06f-b482c8f41b92',

     // optionally set meta data for the content
     meta: {},

     // Any additional field as defined in the Type object `fields`.
     // Can be different from one type to another.
     title: 'Test Article',
     body: {
        children: [
            {
                text: 'simple text',
            },
        ],
     },

     // Update the latest master revision
     history: { branch: 'master' }
 });
 */
Actinium.Cloud.define(PLUGIN.ID, 'content-update', async req => {
    const collection = await Actinium.Type.getCollection(
        op.get(req.params, 'type'),
    );
    const options = Actinium.Utils.CloudHasCapabilities(req, [
        `${collection}.updateAny`,
    ])
        ? Actinium.Utils.CloudMasterOptions(req)
        : Actinium.Utils.CloudRunOptions(req);

    if (req.user) {
        req.params.user = req.user;
    }

    return Actinium.Content.update(req.params, options);
});

/**
 * @api {Asynchronous} Content.changeSlug(params,options) Content.changeSlug()
 * @apiDescription Update the official slug for existing content. This results in a new uuid.
 * @apiParam {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam {String} newSlug The new content slug.
 * @apiParam {String} [slug] The unique slug for the content (for lookup only).
 * @apiParam {String} [objectId] The Parse object id of the content (for lookup only).
 * @apiParam {String} [uuid] The uuid of the content. (for lookup only)
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiName Content.changeSlug
 * @apiGroup Actinium
 */
Actinium.Cloud.define(PLUGIN.ID, 'content-change-slug', async req => {
    const collection = await Actinium.Type.getCollection(
        op.get(req.params, 'type'),
    );
    const options = Actinium.Utils.CloudHasCapabilities(req, [
        `${collection}.updateAny`,
    ])
        ? Actinium.Utils.CloudMasterOptions(req)
        : Actinium.Utils.CloudRunOptions(req);

    if (req.user) {
        req.params.user = req.user;
    }

    return Actinium.Content.changeSlug(req.params, options);
});

/**
 * @api {Asynchronous} content-delete content-delete
 * @apiDescription Delete content of a defined Type. To identify the content, you must provided
the `type` object, and one of `slug`, `objectId`, or `uuid` of the content.
 * @apiParam {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam {String} [slug] The unique slug for the content.
 * @apiParam {String} [objectId] The Parse object id of the content.
 * @apiParam {String} [uuid] The uuid of the content.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiName content-delete
 * @apiGroup Cloud
 */
Actinium.Cloud.define(PLUGIN.ID, 'content-delete', async req => {
    const collection = await Actinium.Type.getCollection(
        op.get(req.params, 'type'),
    );

    if (req.user) {
        req.params.user = req.user;
    }

    const options = Actinium.Utils.CloudHasCapabilities(req, [
        `${collection}.deleteAny`,
    ])
        ? Actinium.Utils.CloudMasterOptions(req)
        : Actinium.Utils.CloudRunOptions(req);

    return Actinium.Content.delete(req.params, options);
});

/**
 * @api {Asynchronous} content-restore content-restore
 * @apiDescription Restore deleted content of a defined Type (if still in recycle).
 To identify the content, you must provided the `type` object, and `objectId` of
 the content. Restores main record for content as well as any revisions.
 * @apiParam {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam {String} objectId The Parse object id of the deleted content.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiName content-restore
 * @apiGroup Cloud
 */
Actinium.Cloud.define(PLUGIN.ID, 'content-restore', async req => {
    const collection = await Actinium.Type.getCollection(
        op.get(req.params, 'type'),
    );
    const options = Actinium.Utils.CloudHasCapabilities(req, [
        `${collection}.createAny`,
    ])
        ? Actinium.Utils.CloudMasterOptions(req)
        : Actinium.Utils.CloudRunOptions(req);

    if (req.user) {
        req.params.user = req.user;
    }

    return Actinium.Content.restore(req.params, options);
});

/**
 * @api {Asynchronous} content-publish content-publish
 * @apiDescription Set revision to current version and publish content.
 * @apiParam (params) {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam (params) {String} [slug] The unique slug for the content.
 * @apiParam (params) {String} [objectId] The Parse object id of the content.
 * @apiParam (params) {String} [uuid] The uuid of the content.
 * @apiParam (params) {Object} [history] revision history to retrieve, containing branch and revision index.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (history) {String} [branch=master] the revision branch of current content
 * @apiParam (history) {Number} [revision] index in branch history to update (defaults to most recent in branch).
 * @apiName content-publish
 * @apiGroup Actinium
 */
Actinium.Cloud.define(PLUGIN.ID, 'content-publish', async req => {
    const collection = await Actinium.Type.getCollection(
        op.get(req.params, 'type'),
    );
    const canPublish = Actinium.Utils.CloudHasCapabilities(
        req,
        [`${collection}.publish`, 'publish-content'],
        false,
    );

    if (!canPublish) throw 'You do not have permission to publish content.';

    if (req.user) {
        req.params.user = req.user;
    }

    return Actinium.Content.publish(
        req.params,
        Actinium.Utils.CloudMasterOptions(req),
    );
});

/**
 * @api {Asynchronous} content-set-status content-set-status
 * @apiDescription Set revision to current version and set the status of the content.
 * @apiParam {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam {String} [slug] The unique slug for the content.
 * @apiParam {String} [objectId] The Parse object id of the content.
 * @apiParam {String} [uuid] The uuid of the content.
 * @apiParam {Object} [history] revision history to retrieve, containing branch and revision index.
 * @apiParam {String} [userId] User objectId that set the status of the content.
 * @apiParam {String} [reason] Change log change reason. Cause of setStatus action, default ENUMS.CHANGES.SET_STATUS
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (history) {String} [branch=master] the revision branch of current content
 * @apiParam (history) {Number} [revision] index in branch history to update (defaults to most recent in branch).
 * @apiName content-set-status
 * @apiGroup Actinium
 */
Actinium.Cloud.define(PLUGIN.ID, 'content-set-status', async req => {
    const collection = await Actinium.Type.getCollection(
        op.get(req.params, 'type'),
    );

    const status = op.get(req.params, 'status');

    const canSet = Actinium.Utils.CloudHasCapabilities(
        req,
        [`${collection}.setStatus-${status}`, 'set-content-status'],
        false,
    );

    if (!canSet) throw 'You do not have permission to set this status.';

    if (req.user) {
        req.params.user = req.user;
    }

    return Actinium.Content.setStatus(
        req.params,
        Actinium.Utils.CloudMasterOptions(req),
    );
});

/**
 * @api {Asynchronous} Content.unpublish(params,options) Content.unpublish()
 * @apiDescription Unpublish current version of content.
 * @apiParam {Object} params parameters for content
 * @apiParam {Object} options Parse Query options (controls access)
 * @apiParam (params) {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam (params) {String} [slug] The unique slug for the content.
 * @apiParam (params) {String} [objectId] The Parse object id of the content.
 * @apiParam (params) {String} [uuid] The uuid of the content.
 * @apiParam (params) {Object} [history] revision history to retrieve, containing branch and revision index.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (history) {String} [branch=master] the revision branch of current content
 * @apiParam (history) {Number} [revision] index in branch history to update (defaults to most recent in branch).
 * @apiName Content.unpublish
 * @apiGroup Actinium
 */
Actinium.Cloud.define(PLUGIN.ID, 'content-unpublish', async req => {
    const collection = await Actinium.Type.getCollection(
        op.get(req.params, 'type'),
    );
    const canUnpublish = Actinium.Utils.CloudHasCapabilities(
        req,
        [`${collection}.unpublish`, 'unpublish-content'],
        false,
    );

    if (!canUnpublish) throw 'You do not have permission to unpublish content.';

    if (req.user) {
        req.params.user = req.user;
    }

    return Actinium.Content.unpublish(
        req.params,
        Actinium.Utils.CloudMasterOptions(req),
    );
});

/**
 * @api {Asynchronous} content-schedule content-schedule
 * @apiDescription Schedule the publishing / unpublishing of content. If `history` is provided, that revision will be
 made current and published on optional `sunrise`. On optional `sunset`, the current version of the content will be unpublished.
 The requesting user must have publish and unpublish capabilities.
 * @apiParam {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiParam {String} [slug] The unique slug for the content.
 * @apiParam {String} [objectId] The Parse object id of the content.
 * @apiParam {String} [uuid] The uuid of the content.
 * @apiParam {String} [sunrise] Optional ISO8601 + UTC Offset datetime string (moment.format()) for sunrise of content. e.g. 2020-02-07T11:15:04-05:00
 * @apiParam {String} [sunset] Optional ISO8601 + UTC Offset datetime string (moment.format()) for sunset of content. e.g. 2020-02-07T11:15:04-05:00
 * @apiParam {Object} [history] revision history to retrieve, containing branch and revision index.
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiParam (history) {String} [branch=master] the revision branch of current content
 * @apiParam (history) {Number} [revision] index in branch history to update (defaults to most recent in branch).
 * @apiName content-schedule
 * @apiGroup Cloud
 * @apiExample Usage
const moment = require('moment');
const now = moment();

// publish version 3 of master branch a month from now
// unpublish the article in 2 months
Actinium.Cloud.run(
  'content-schedule',
  {
    type: { machineName: 'article' },
    slug: 'my-article',
    history: { branch: 'master', revision: 3 },
    sunrise: now.clone().add(1, 'month').format(),
    sunset: now.clone().add(2, 'month').format(),
  }
);
 */
Actinium.Cloud.define(PLUGIN.ID, 'content-schedule', async req => {
    const collection = await Actinium.Type.getCollection(
        op.get(req.params, 'type'),
    );

    if (req.user) {
        req.params.user = req.user;
    }

    const canPublish = Actinium.Utils.CloudHasCapabilities(
        req,
        [`${collection}.publish`, 'publish-content'],
        false,
    );
    const canUnpublish = Actinium.Utils.CloudHasCapabilities(
        req,
        [`${collection}.unpublish`, 'unpublish-content'],
        false,
    );

    if (!canPublish)
        throw `You must have ${collection}.publish or publish-content capability to schedule content.`;
    if (!canUnpublish)
        throw `You must have ${collection}.unpublish or unpublish-content capability to schedule content.`;

    return Actinium.Content.schedule(
        req.params,
        Actinium.Utils.CloudMasterOptions(req),
    );
});

/*
1. CLP (Class Level Permissions) is primarily guard against using Parse Cloud REST API improperly
- capabilities can be used to guard cloud functions, but not direct Parse API use (such as REST)
- Actinium.Collection.register() provides mapping from capabilities (COLLECTION.create, COLLECTION.retrieve, COLLECTION.update, COLLECTION.delete, COLLECTION.addFields) to role based CLP
- Granting a capability such as above will automatically update the appropriate CLP on that schema.

2. Content schema's (Content-{type}) should NOT use Content-{type}.create/retrieve/update/delete
in conjuction with CloudCapOptions(), which escalates the action to useMasterKey: true. Instead, use
Actinium.Utils.CloudRunOptions() or equivalent only, and let the CLP naturally filter out responses.

3. ACLs will be required to protect any individual content from read/write.
- By default a REST interaction retrieve/update/delete of existing content will need to first pass CLP, and then read/write ACL check.

4. When we want to provide "super" retrieve, update, delete permission, we can use CloudCapOptions(), but for a different
set of permissions (COLLECTION.createAny, COLLECTION.retrieveAny, COLLECTION.updateAny, COLLECTION.deleteAny), and only
through cloud function. "super" operations should be impossible through ordinary Parse REST API calls.

Use Cases:
1. Publicly creatable, not publicly readable

  How:
  Content-{type}.create capability applied to anonymous role

  Check:
  CLP enforced

2. Publicly readable, not writable in any way, enforce ACL.

  How:
  Content-{type}.retrieve capability applied to anonymous role

  Check:
  CLP enforced, ACL enforced

3. Publicly readable, not writable in any way, ignore ACL.

  How:
  Content-{type}.retrieveAny capability applied to anonymous role.

  Check:
  Escalate to master read for cloud function if Content-{type}.retrieveAny using CloudCapOptions()
  Neither CLP nor ACL enforced on read of content type.

4. Role X has one or more CRUD permission, but only RUD "own" content

  How:
  Content-{type}.[create|update|retrieve|delete] for role X.

  Check:
  CLP enforced, ACL enforced

5. Role X is moderator, has one or more RUD permission, access to content owned by others, ACL not enforced.

  How:
  Content-{type}.[updateAny|retrieveAny|deleteAny] for role X.

  Check:
  Escalate to master for cloud function if Content-{type}.[updateAny|retrieveAny|deleteAny] using CloudCapOptions()
  CLP and ACL ignored

Cloud Pseudo:

# contents
options = CloudCapOptions([Content-{type}.retrieveAny])
perform fetch

# content-create:

options = Actinium.Utils.CloudRunOptions()
perform creation

# content-retrieve: (1)

options = CloudCapOptions([Content-{type}.retrieveAny])
perform fetch

# content-update: (1)

options = CloudCapOptions([Content-{type}.updateAny])
perform fetch/update

# content-delete: (1)

options = CloudCapOptions([Content-{type}.deleteAny])
perform fetch/update

*/
