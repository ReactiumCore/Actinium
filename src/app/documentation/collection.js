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
