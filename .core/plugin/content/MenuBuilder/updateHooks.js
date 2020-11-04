const PLUGIN = require('./info');
const semver = require('semver');
const op = require('object-path');
const _ = require('underscore');

const conditionallyMigratePre362Content = async type => {
    const options = Actinium.Utils.MasterOptions();
    let migrate = false;
    for (const { fieldName, fieldType } of Object.values(
        op.get(type, 'fields', {}),
    )) {
        if (fieldType === 'MenuBuilder') {
            migrate = true;
        }
    }

    if (migrate) {
        // menu builder fields to modify in this type
        const menuFields = _.chain(Object.values(op.get(type, 'fields', {})))
            .where({ fieldType: 'MenuBuilder' })
            .map(({ fieldName }) => Actinium.Utils.slugify(fieldName))
            .compact()
            .value();

        let limit = 10,
            page = 1;
        let response = await Actinium.Content.list(
            { type, limit, page },
            options,
        );

        const convertMenuItem = async item => {
            if (item.type === 'Link')
                return {
                    ...item,
                    item: {
                        icon: op.get(item, 'item.icon', 'Feather.Link'),
                        title: op.get(item, 'item.title'),
                        url: op.get(item, 'item.url'),
                    },
                };

            if (item.type === 'ContentType') {
                const options = Actinium.Utils.MasterOptions();
                console.log({ lookup: op.get(item, 'item') });
                const context = await Actinium.Content.retrieve(
                    {
                        ...op.get(item, 'item'),
                        current: true,
                        resolveRelations: true,
                    },
                    options,
                );

                return {
                    ...item,
                    item: {
                        icon: op.get(
                            item,
                            'item.icon',
                            op.get(context, 'type.meta.icon', 'Linear.Papers'),
                        ),
                        title: op.get(
                            item,
                            'item.title',
                            op.get(context, 'title'),
                        ),
                        url: op.get(
                            context,
                            'urls.0.route',
                            `/${op.get(context, 'type.machineName')}/${op.get(
                                context,
                                'slug',
                            )}`,
                        ),
                        context,
                    },
                };
            }
        };

        while (op.get(response, 'results', []).length > 0) {
            for (const nav of op.get(response, 'results', [])) {
                for (const field of menuFields) {
                    const fromField = op.get(nav, [field, 'items'], []);
                    const toField = await Promise.all(
                        fromField.map(convertMenuItem),
                    );
                    op.set(nav, [field], {
                        items: toField,
                        plugin: PLUGIN.ID,
                        version: '3.6.2',
                    });
                }

                op.del(nav, 'user');
                op.del(nav, 'ACL');

                const updated = await Actinium.Content.update(nav, options);
                await Actinium.Content.publish(updated, options);
            }

            response = await Actinium.Content.list(
                { type, limit, page: page++ },
                options,
            );
        }
    }
};

const migratePre362 = async () => {
    BOOT(`${PLUGIN.ID} is migrating menu content to new format.`);

    const options = Actinium.Utils.MasterOptions();
    const { types = [] } = await Actinium.Type.list({}, options);

    for (const type of types) {
        conditionallyMigratePre362Content(type);
    }
};

// Order from oldest migration to newest migration
const migrations = {
    '3.6.2': {
        test: plugin => plugin.version === '3.6.2',
        migration: async (plugin, req, old) => {
            await migratePre362();
        },
    },
};

Actinium.Hook.register(
    'update',
    Actinium.Plugin.updateHookHelper(PLUGIN.ID, migrations),
);

module.exports = {
    migrations,
};
