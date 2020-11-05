const chalk = require('chalk');
const op = require('object-path');
const _ = require('underscore');
const ENUMS = require('../enums');
const semver = require('semver');
const PLUGIN = require('./info');

/**
 * ----------------------------------------------------------------------------
 * Plugin registration
 * ----------------------------------------------------------------------------
 */
Actinium.Plugin.register(PLUGIN, true);

// Manage types that will have menu content to keep fresh
const typeSubscriptions = new Actinium.Utils.Registry(
    'MenuBuilderMaintenanceRegistry',
    'uuid',
    Actinium.Utils.Registry.MODES.CLEAN,
);

const contentSubscriptions = new Actinium.Utils.Registry(
    'MenuContentSubscriptions',
    'contentUUID',
    Actinium.Utils.Registry.MODES.CLEAN,
);

const conditionallySubscribeType = type => {
    let subscribe = false;
    for (const { fieldName, fieldType } of Object.values(
        op.get(type, 'fields', {}),
    )) {
        if (fieldType === 'MenuBuilder') {
            subscribe = true;
        }
    }
    if (subscribe) typeSubscriptions.register(type.uuid, type);
    else typeSubscriptions.unregister(type.uuid);
};

// This can be done anytime a navigation is published (i.e. content with a MenuBuilder field)
const subscribeMenuBuilderContent = async (nav, typeObj) => {
    const type = op.get(nav, 'type');
    const menuFields = _.chain(
        Object.values(op.get(type, 'fields', op.get(typeObj, 'fields', {}))),
    )
        .where({ fieldType: 'MenuBuilder' })
        .map(({ fieldName }) => Actinium.Utils.slugify(fieldName))
        .compact()
        .value();

    // the navigation that is subscribing to content changes
    const navUUID = op.get(nav, 'uuid');
    const navType = op.get(nav, 'type.machineName');
    const navTypeUUID = op.get(nav, 'type.uuid');

    const contentUUIDs = [];
    for (const field of menuFields) {
        const items = _.where(op.get(nav, [field, 'items'], []), {
            type: 'ContentType',
        });
        items.forEach(menuItem => {
            const contentUUID = op.get(menuItem, 'item.context.uuid');
            const contentType = op.get(
                menuItem,
                'item.context.type.machineName',
            );

            DEBUG(
                `subscribeMenuBuilderContent subscribing to ${contentUUID} of type ${contentType}`,
            );
            contentUUIDs.push(contentUUID);

            // registry of registries, woof, hard to understand, sorry in advance
            // TLDR; each item in the contentSubscriptions registry is a piece of content that appears in one or more menus
            // in turn, the value is a registry of the menus that subscribe to the content
            let pubRegistry = op.get(
                _.findWhere(contentSubscriptions.list, { contentUUID }),
                'registry',
            );

            if (!pubRegistry) {
                pubRegistry = new Actinium.Utils.Registry(
                    contentUUID,
                    'navUUID',
                    Actinium.Utils.Registry.MODES.CLEAN,
                );

                contentSubscriptions.register(contentUUID, {
                    contentType,
                    registry: pubRegistry,
                });
            }

            pubRegistry.register(navUUID, { navType, navTypeUUID });
        });
    }

    // cleanup, remove any registries no long in the navigation
    contentSubscriptions.list
        .filter(({ contentUUID }) => !contentUUIDs.includes(contentUUID))
        .forEach(({ contentUUID }) =>
            contentSubscriptions.unregister(contentUUID),
        );
};

// Potentially Expensive, fetches all content for a given content type to update
// navigation subscriptions for the MenuBuilder fields.
const subscribeMenuType = async type => {
    const options = Actinium.Utils.MasterOptions();

    let limit = 10,
        page = 1;

    let response = await Actinium.Content.list({ type, limit, page }, options);

    while (op.get(response, 'results', []).length > 0) {
        for (const nav of op.get(response, 'results', [])) {
            subscribeMenuBuilderContent(nav);
        }

        response = await Actinium.Content.list(
            { type, limit, page: page++ },
            options,
        );
    }
};

// Potentially Expensive. Only do this once on Actinium startup.
// Go through each subscribed content type (having MenuBuilder fields) and gather up
// specific menu items that are content types themselves to be kept up to date
const subscribeAllMenuTypes = async () => {
    for (type of typeSubscriptions.list) {
        await subscribeMenuType(type);
    }
};

/**
 * ----------------------------------------------------------------------------
 * Hook registration
 * ----------------------------------------------------------------------------
 */
const { migrations } = require('./updateHooks');
Actinium.Hook.register('install', async obj => {
    if (PLUGIN.ID !== op.get(obj, 'ID')) return;
    if (op.get(obj, 'version') === '3.6.2') {
        await op.get(migrations, ['3.6.2', 'migration'], () => {})();
    }
});

Actinium.Hook.register(
    'content-field-sanitize',
    async ({ field, fieldConfig, fieldData }) => {
        const version = op.get(Actinium.Cache.get('plugins'), [
            PLUGIN.ID,
            'version',
        ]);
        switch (fieldConfig.fieldType) {
            case 'MenuBuilder':
                field.fieldValue = {
                    items: op.get(field.fieldValue, 'items', []) || [],
                    plugin: PLUGIN.ID,
                    version,
                };
        }
    },
);

Actinium.Hook.register('start', async () => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        const options = Actinium.Utils.MasterOptions();
        const { types = [] } = await Actinium.Type.list({}, options);
        for (const type of types) {
            conditionallySubscribeType(type);
        }

        await subscribeAllMenuTypes();
    }
});

const updateNavContent = async (nav, content, options) => {
    DEBUG('updateNavContent', nav, content);
    const type = op.get(nav, 'type');
    const menuFields = _.chain(Object.values(op.get(type, 'fields', {})))
        .where({ fieldType: 'MenuBuilder' })
        .map(({ fieldName }) => Actinium.Utils.slugify(fieldName))
        .compact()
        .value();

    let updates = false;
    // search through menu and update if necessary
    for (const fieldSlug of menuFields) {
        const items = op.get(nav, [fieldSlug, 'items'], []);
        for (const menuItem of items) {
            const itemType = op.get(menuItem, 'type');
            const { context } = op.get(menuItem, 'item', {});

            if (
                itemType === 'ContentType' &&
                op.get(context, 'uuid') === content.uuid
            ) {
                updates = true;
                op.set(
                    menuItem,
                    'item.url',
                    op.get(
                        content,
                        'urls.0.route',
                        `/${op.get(content, 'type.machineName')}/${op.get(
                            content,
                            'slug',
                        )}`,
                    ),
                );
                op.set(menuItem, 'item.context', content);
            }
        }
    }

    if (updates) {
        op.del(nav, 'user');
        op.del(nav, 'ACL');

        const saved = await Actinium.Content.update(nav, options);
        await Actinium.Content.publish(saved, options);
    }
};

// check to see if published content is being subscribed to by some navigation
Actinium.Hook.register('content-saved', async (contentObj, typeObj) => {
    const options = Actinium.Utils.MasterOptions();
    const contentSub = _.findWhere(contentSubscriptions.list, {
        contentUUID: op.get(contentObj, 'uuid'),
    });
    if (!contentSub) return;

    const { contentUUID, contentType, registry } = contentSub;

    // let this be async so we don't hold up the cloud function that initiated the save
    _.defer(() => {
        Actinium.Content.retrieve({
            uuid: contentUUID,
            type: { machineName: contentType },
            current: true,
            resolveRelations: true,
        }).then(async content => {
            for (const { navUUID, navType, navTypeUUID } of registry.list) {
                // if we are no longer subscribing to type, because it doesn't exist anymore or
                // no longer has a MenuBuilder field, bail on update
                if (!_.findWhere(typeSubscriptions.list, { uuid: navTypeUUID }))
                    continue;
                const nav = await Actinium.Content.retrieve(
                    {
                        uuid: navUUID,
                        type: { uuid: navTypeUUID },
                        current: true,
                        resolveRelations: true,
                    },
                    options,
                );
                await updateNavContent(nav, content, options);
            }
        });
    });
});

// update nav content suscriptions when navigation is published
Actinium.Hook.register('content-published', async (contentObj, typeObj) => {
    if (!_.findWhere(typeSubscriptions.list, { uuid: op.get(typeObj, 'uuid') }))
        return;

    DEBUG(
        `Navigation of type ${op.get(typeObj, 'machineName')} and slug ${op.get(
            contentObj,
            'slug',
        )} published. Subscribing to menu items with content.`,
    );

    subscribeMenuBuilderContent(contentObj, typeObj);
});

// subscribe or unsubscribe to types that have MenuBuilder fields
Actinium.Hook.register('type-saved', conditionallySubscribeType);
Actinium.Hook.register('type-deleted', typeObj => {
    typeSubscriptions.unregister(type.uuid);
});
