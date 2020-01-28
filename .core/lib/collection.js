const _ = require('underscore');
const op = require('object-path');
const ActionSequence = require('action-sequence');
const chalk = require('chalk');

const collectionPerms = {};
const collectionSchema = {};
const collectionIndexes = {};

const defaultPublicSetting = {
    create: false,
    retrieve: false,
    update: false,
    delete: false,
    addField: false,
};

const Collection = {
    loaded: false,
};
Collection.register = (
    collection,
    publicSetting = defaultPublicSetting,
    schema,
    indexes,
) => {
    if (schema) {
        collectionSchema[collection] = schema;
    }

    if (indexes) {
        collectionIndexes[collection] = indexes;
    }

    collectionPerms[collection] = publicSetting;

    // Update Collection classLevelPermissions on capability updates
    Actinium.Hook.register('capability-updated', async capability => {
        if (
            Actinium.Collection.loaded &&
            [
                `${collection}.create`,
                `${collection}.retrieve`,
                `${collection}.update`,
                `${collection}.delete`,
                `${collection}.addField`,
            ].includes(capability)
        ) {
            await Actinium.Collection.load(collection);
            LOG(
                chalk.cyan(`Capability ${capability} edited.`),
                chalk.magenta(`Reloading CLP for ${collection}`),
            );
        }
    });

    if (Collection.loaded) {
        Collection.load(collection);
    }
};

Collection.unregister = collection => {
    if (collection in collectionPerms) {
        // default to private permissions
        collectionPerms[collection] = defaultPublicSetting;

        if (Collection.loaded) {
            Collection.load(collection);
        }
    }
};

Collection.load = async (collection = false) => {
    // initial load
    const loading = !Collection.loaded && !collection;

    let entries = [];
    if (collection && collection in collectionPerms) {
        entries.push([collection, collectionPerms[collection]]);
    } else {
        entries = Object.entries(collectionPerms);
    }

    if (loading) {
        LOG(' ');
        LOG(chalk.cyan('Loading collection schemas and CLPs...'));
    }

    const actions = entries.reduce((actions, [collection, publicSetting]) => {
        if (!Collection.loaded && loading) {
            LOG(chalk.cyan('  ', collection));
        }

        actions[`${collection}Hook`] = () =>
            Actinium.Hook.run(
                'collection-before-permissions',
                collection,
                publicSetting,
            );
        actions[collection] = async () => {
            const ParseSchema = new Parse.Schema(collection);
            const schemaController = Parse.CoreManager.getSchemaController();
            let loadedSchema;
            try {
                loadedSchema = await ParseSchema.get({
                    useMasterKey: true,
                });
            } catch (error) {
                loadedSchema = {
                    classLevelPermissions: {},
                };
            }

            // Whatever ParseSchema.get() is returning, it has writability attributes
            // set to false. Quickest way around this is stringify and parse
            const schema = JSON.parse(JSON.stringify(loadedSchema));

            const {
                createPermission,
                retrievePermission,
                updatePermission,
                deletePermission,
                addFieldPermission,
            } = ['create', 'retrieve', 'update', 'delete', 'addField'].reduce(
                (classLevelPermissions, capability) => {
                    const permLabel = `${capability}Permission`;
                    classLevelPermissions[permLabel] = op.get(
                        publicSetting,
                        capability,
                        false,
                    )
                        ? { '*': true }
                        : {};

                    Actinium.Capability.roles(
                        `${collection}.${capability}`,
                    ).forEach(role =>
                        op.set(
                            classLevelPermissions,
                            [permLabel, `role:${role}`],
                            true,
                        ),
                    );

                    op.set(
                        classLevelPermissions,
                        [permLabel, 'role:administrator'],
                        true,
                    );
                    op.set(
                        classLevelPermissions,
                        [permLabel, 'role:super-admin'],
                        true,
                    );

                    return classLevelPermissions;
                },
                {},
            );

            try {
                op.set(
                    schema,
                    'classLevelPermissions.find',
                    retrievePermission,
                );
                op.set(
                    schema,
                    'classLevelPermissions.count',
                    retrievePermission,
                );
                op.set(schema, 'classLevelPermissions.get', retrievePermission);
                op.set(
                    schema,
                    'classLevelPermissions.create',
                    createPermission,
                );
                op.set(
                    schema,
                    'classLevelPermissions.update',
                    updatePermission,
                );
                op.set(
                    schema,
                    'classLevelPermissions.delete',
                    deletePermission,
                );
                op.set(
                    schema,
                    'classLevelPermissions.addField',
                    addFieldPermission,
                );
            } catch (error) {
                console.log(
                    schema.classLevelPermissions.find,
                    typeof schema.classLevelPermissions.find,
                );
                console.log({ collection });
                console.log(error);
            }

            const { className, classLevelPermissions } = schema;

            const fields = op.has(collectionSchema, collection)
                ? collectionSchema[collection]
                : {};

            const newIndexes = op
                .get(collectionIndexes, collection, [])
                .reduce((fieldIndex, fieldName) => {
                    if (!op.has(schema, ['indexes', fieldName])) {
                        fieldIndex[fieldName] = {
                            [fieldName]: 1,
                        };
                    }

                    return fieldIndex;
                }, {});

            Object.keys(fields).forEach(field => {
                const del = op.get(fields, [field, 'delete']) === true;

                if (del === true) {
                    op.set(fields, [field, '__op'], 'Delete');
                    op.del(fields, [field, 'delete']);
                }

                const hasField = op.get(schema, ['fields', field], false);

                if (hasField && del) {
                    return;
                }

                if ((!hasField && del) || hasField) {
                    op.del(fields, field);
                }
            });

            // Update Schema
            if (className) {
                return schemaController.update(
                    collection,
                    {
                        className: collection,
                        classLevelPermissions,
                        fields,
                        indexes: newIndexes,
                    },
                    { useMasterKey: true },
                );
            }

            // Create Schema
            return schemaController.create(
                collection,
                {
                    className: collection,
                    classLevelPermissions,
                    fields,
                    indexes: newIndexes,
                },
                { useMasterKey: true },
            );
        };

        return actions;
    }, {});

    try {
        const results = await ActionSequence({
            actions,
        });

        if (loading) {
            Collection.loaded = true;
            LOG(' ');
        }
        return results;
    } catch (error) {
        LOG(
            chalk.cyan('Error'),
            chalk.magenta('loading class level permissions'),
            error,
        );
    }
    return Promise.resolve();
};

module.exports = Collection;
