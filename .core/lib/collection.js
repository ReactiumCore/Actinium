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
    Actinium.Hook.register('capability-change', async req => {
        const capability = req.object.get('group');
        if (
            Actinium.Collection.loaded &&
            [
                `${collection}.create`,
                `${collection}.retrieve`,
                `${collection}.update`,
                `${collection}.delete`,
                `${collection}.addField`,
            ]
                .map(c => String(c).toLowerCase(c))
                .includes(capability)
        ) {
            await Actinium.Collection.load(collection);
            BOOT(
                chalk.cyan(`Capability ${capability} edited.`),
                chalk.magenta(`Reloading CLP for ${collection}`),
            );
        }
    });

    if (Collection.loaded) {
        return Collection.load(collection);
    }

    return Promise.resolve();
};

Collection.unregister = collection => {
    if (collection in collectionPerms) {
        // default to private permissions
        collectionPerms[collection] = defaultPublicSetting;

        if (Collection.loaded) {
            return Collection.load(collection);
        }
    }

    return Promise.resolve();
};

Collection.load = async (collection = false) => {
    await Actinium.Hook.run('collection-before-load', collection);

    // initial load
    const loading = !Collection.loaded && !collection;

    let entries = [];
    if (collection && collection in collectionPerms) {
        entries.push([collection, collectionPerms[collection]]);
    } else {
        entries = Object.entries(collectionPerms);
    }

    if (loading) {
        BOOT(' ');
        BOOT(chalk.cyan('Loading collection schemas and CLPs...'));
    }

    const actions = {};
    for (const [collection, publicSetting] of entries) {
        if (!Collection.loaded && loading) {
            BOOT(
                chalk.cyan('  Collection'),
                chalk.cyan('→'),
                chalk.magenta(collection),
            );
        }

        actions[`${collection}Hook`] = async () =>
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

            const classLevelPermissions = {};
            for (const capability of [
                'create',
                'retrieve',
                'update',
                'delete',
                'addField',
            ]) {
                const capabilityName = `${collection}.${capability}`.toLowerCase();

                classLevelPermissions[capabilityName] = {};

                const currentCap = await Actinium.Capability.getAsync(
                    capabilityName,
                );

                const allowed = op.get(currentCap, 'allowed', []);

                allowed.forEach(role =>
                    op.set(
                        classLevelPermissions,
                        [capabilityName, `role:${role}`],
                        true,
                    ),
                );

                classLevelPermissions[capabilityName] =
                    op.get(publicSetting, capability, false) === true ||
                    allowed.includes('anonymous')
                        ? { '*': true }
                        : classLevelPermissions[capabilityName];

                op.set(
                    classLevelPermissions,
                    [capabilityName, 'role:administrator'],
                    true,
                );
                op.set(
                    classLevelPermissions,
                    [capabilityName, 'role:super-admin'],
                    true,
                );
            }

            try {
                ['create', 'retrieve', 'update', 'delete', 'addField'].forEach(
                    capability => {
                        const capabilityName = `${collection}.${capability}`.toLowerCase();
                        let permissions = [];
                        switch (capability) {
                            case 'create': {
                                permissions = ['create'];
                                break;
                            }

                            case 'retrieve': {
                                permissions = ['find', 'count', 'get'];
                                break;
                            }

                            case 'update': {
                                permissions = ['update'];
                                break;
                            }

                            case 'delete': {
                                permissions = ['delete'];
                                break;
                            }

                            case 'addField': {
                                permissions = ['addField'];
                                break;
                            }
                        }

                        permissions.forEach(permission => {
                            op.set(
                                schema,
                                `classLevelPermissions.${permission}`,
                                op.get(
                                    classLevelPermissions,
                                    [capabilityName],
                                    {},
                                ),
                            );
                        });
                    },
                );
            } catch (error) {
                ERROR(
                    schema.classLevelPermissions.find,
                    typeof schema.classLevelPermissions.find,
                );
                ERROR({ collection });
                ERROR(error);
            }

            const { className } = schema;

            const fields = op.has(collectionSchema, collection)
                ? collectionSchema[collection]
                : {};

            let newIndexes = op
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

            let CLP = { ...schema.classLevelPermissions };

            await Actinium.Hook.run('collection-clp', { collection, CLP });

            let indexes = Array.from(newIndexes);
            await Actinium.Hook.run('collection-indexes', {
                collection,
                indexes,
            });

            // Update Schema
            if (className) {
                return schemaController.update(
                    collection,
                    {
                        className: collection,
                        classLevelPermissions: CLP,
                        fields,
                        indexes,
                    },
                    Actinium.Utils.MasterOptions(),
                );
            }

            // Create Schema
            return schemaController.create(
                collection,
                {
                    className: collection,
                    classLevelPermissions: CLP,
                    fields,
                    indexes,
                },
                Actinium.Utils.MasterOptions(),
            );
        };
    }

    try {
        const results = await ActionSequence({
            actions,
        });

        if (loading) {
            Collection.loaded = true;
            INFO(' ');
        }
        return results;
    } catch (error) {
        ERROR(
            chalk.cyan('Error'),
            chalk.magenta('loading class level permissions'),
            error,
        );
    }
    return Promise.resolve();
};

module.exports = Collection;

/**
 * @api {Object} Actinium.Collection Collection
 * @apiVersion 3.1.2
 * @apiName Collection
 * @apiGroup Actinium
 * @apiDescription Actinium uses a concept of Parse Collections and gives the developer
control over what roles have the ability to create, update, retrieve, delete and add fields to each collection
using Actinium Roles and Capabilities.

For each Parse Collection in your application, you can register capabilities that your roles will use
on your collection.

The `super-admin` and `administrator` roles will have always access to your collection, and cannot be removed using the Actinium API (although they can be remove using the Parse Node API or using the Parse Dashboard).

Actinium comes with these default capabilities for each Collection you create (COLLECTION below is replaced by your collection name):

| Capability | Roles |
| ---------- | ----- |
| COLLECTION.create | super-admin, administrator |
| COLLECTION.retrieve | super-admin, administrator |
| COLLECTION.update | super-admin, administrator |
| COLLECTION.delete | super-admin, administrator |
| COLLECTION.addField | super-admin, administrator |

### COLLECTION.create
Ability to create a new object in your collection.

### COLLECTION.retrieve
Ability to fetch, find, count objects in your collection.

### COLLECTION.update
Ability to update an existing object in your collection.

### COLLECTION.delete
Ability to delete an object from your collection.

### COLLECTION.addField
Ability to add a new field to your collection.

 */

/**
  * @api {Function} Actinium.Collection.register(collection,publicPermissions) Collection.register()
  * @apiVersion 3.1.2
  * @apiGroup Actinium
  * @apiName Collection.register
  * @apiDescription Registers public class level permission for your collection.
  * @apiParam {String} collection The collection name you wish to set class level permission for.
  * @apiParam {Object} publicPermissions Object with boolean properties create, retrieve, update, delete, and addField. True indicates the public has permission to perform this operation. False indicates that only users with roles that match this capability should be permitted to perform this operation. By default all operations are private if this registration is called, but the Parse collection default is fully public otherwise (and only per-object ACLs will apply).
  * @apiParam {Object} [fields] Parse fields schema
  * @apiParam {Array} [indexes] List of field names to index (use sparingly, and only on high entropy columns)
  * @apiExample Example Usage:
// Register Capability for contributor role to create, update, delete, and add fields to collection
Actinium.Capabilities.register('MyCollection.create', {
        allowed: ['contributor'],
    },
    1000,
);
Actinium.Capabilities.register('MyCollection.update', {
        allowed: ['contributor'],
    },
    1000,
);
Actinium.Capabilities.register('MyCollection.delete', {
        allowed: ['contributor'],
    },
    1000,
);
Actinium.Capabilities.register('MyCollection.addField', {
        allowed: ['contributor'],
    },
    1000,
);

// Allow public read, but private everything else:
Actinium.Collection.register(
  'MyCollection', {
      create: false,
      retrieve: true,
      update: false,
      delete: false,
      addField: false,
  }
);
  */

/**
 * @api {Function} Actinium.Collection.unregister(collection) Collection.unregister()
 * @apiVersion 3.1.2
 * @apiGroup Actinium
 * @apiName Collection.unregister
 * @apiDescription Set collection permissions to Actinium default (i.e. fully private or only administrator, super-admin, and master key use).
 * @apiParam {String} collection The collection to unregister public permissions.
 * @apiExample Example Usage:
Actinium.Collection.unregister('MyCollection');
 */
