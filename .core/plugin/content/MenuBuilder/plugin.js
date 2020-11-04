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

// // Manage types that will have menu content to keep fresh
// const typeSubscriptions = new Actinium.Utils.Registry(
//     'MenuBuilderMaintenanceRegistry',
//     'uuid',
//     Actinium.Utils.Registry.MODES.CLEAN,
// );
//
// const contentSubscriptions = new Actinium.Utils.Registry(
//     'MenuContentSubscriptions',
//     'uuid',
//     Actinium.Utils.Registry.MODES.CLEAN,
// );
//
// const conditionallySubscribeType = type => {
//     let subscribe = false;
//     for (const { fieldName, fieldType } of Object.values(
//         op.get(type, 'fields', {}),
//     )) {
//         if (fieldType === 'MenuBuilder') {
//             subscribe = true;
//         }
//     }
//     if (subscribe) typeSubscriptions.register(type.uuid, type);
//     else typeSubscriptions.unregister(type.uuid);
// };
//
// const subscribeMenus = async () => {
//     const options = Actinium.Utils.MasterOptions();
//
//     for (type of typeSubscriptions.list) {
//         const menuFields = _.chain(Object.values(op.get(type, 'fields', {})))
//             .where({ fieldType: 'MenuBuilder' })
//             .map(({ fieldName }) => Actinium.Utils.slugify(fieldName))
//             .compact()
//             .value();
//
//         let limit = 10,
//             page = 1;
//         let response = await Actinium.Content.list(
//             { type, limit, page },
//             options,
//         );
//
//         while (op.get(response, 'results', []).length > 0) {
//             for (const nav of op.get(response, 'results', [])) {
//                 for (const field of menuFields) {
//                     const items = _.where(op.get(nav, [field, 'items'], []), {
//                         type: 'ContentType',
//                     });
//
//                     console.log('menu items', items);
//                 }
//             }
//
//             response = await Actinium.Content.list(
//                 { type, limit, page: page++ },
//                 options,
//             );
//         }
//     }
// };

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

// Actinium.Hook.register('start', async () => {
//     if (Actinium.Plugin.isActive(PLUGIN.ID)) {
//         const options = Actinium.Utils.MasterOptions();
//         const { types = [] } = await Actinium.Type.list({}, options);
//         for (const type of types) {
//             conditionallySubscribeType(type);
//         }
//
//         const schedule = await Actinium.Setting.get(
//             ENUMS.CRON_SETTING,
//             '*/30 * * * *',
//         );
//
//         Actinium.Pulse.define(
//             'maintain-menus',
//             {
//                 schedule,
//             },
//             subscribeMenus,
//         );
//
//         await subscribeMenus();
//     }
// });

// Actinium.Hook.register('type-saved', conditionallySubscribeType);
