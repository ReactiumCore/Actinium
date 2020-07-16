define({ "api": [
  {
    "type": "Object",
    "url": "Actinium.Cache",
    "title": "Cache",
    "version": "3.0.3",
    "name": "Cache",
    "group": "Actinium",
    "description": "<p>Cache allows you to easily store application data in memory.</p>",
    "filename": "src/app/documentation/cache.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Cache.clear()",
    "title": "Cache.clear()",
    "version": "3.0.3",
    "group": "Actinium",
    "name": "Cache_clear",
    "description": "<p>Delete all cached values.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>The key to delete. If the value is an <code>{Object}</code> you can use an object path to delete a specific part of the value. The updated value is then returned.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Cache.clear();",
        "type": "json"
      }
    ],
    "filename": "src/app/documentation/cache.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Cache.del(key)",
    "title": "Cache.del()",
    "version": "3.0.3",
    "group": "Actinium",
    "name": "Cache_del",
    "description": "<p>Delete the value for a given key. Returns <code>{Boolean}</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>The key to delete. If the value is an <code>{Object}</code> you can use an object path to delete a specific part of the value. The updated value is then returned.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "// Given the cached value: { foo: { bar: 123, blah: 'hahaha' } }\nActinium.Cache.del('foo.bar'); // returns: { blah: 'hahaha' }\nActinium.Cache.del('foo');     // returns: true",
        "type": "json"
      }
    ],
    "filename": "src/app/documentation/cache.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Cache.get(key)",
    "title": "Cache.get()",
    "version": "3.0.3",
    "group": "Actinium",
    "name": "Cache_get",
    "description": "<p>Retrieves the value for a given key. If the value is not cached <code>null</code> is returned.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "key",
            "description": "<p>The key to retrieve. If the value is an <code>{Object}</code> you can use an object path for the key. If no key is specified the entire cache is returned.</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": true,
            "field": "default",
            "description": "<p>The default value to return if key is not found.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "// Given the cached value: { foo: { bar: 123 } }\nActinium.Cache.get('foo.bar'); // returns: 123;\nActinium.Cache.get('foo');     // returns: { bar: 123 }",
        "type": "json"
      }
    ],
    "filename": "src/app/documentation/cache.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Cache.keys()",
    "title": "Cache.keys()",
    "version": "3.0.3",
    "group": "Actinium",
    "name": "Cache_keys",
    "description": "<p>Returns an array of the cached keys.</p>",
    "filename": "src/app/documentation/cache.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Cache.memsize()",
    "title": "Cache.memsize()",
    "version": "3.0.3",
    "group": "Actinium",
    "name": "Cache_memsize",
    "description": "<p>Returns the number of entries taking up space in the cache.</p>",
    "filename": "src/app/documentation/cache.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Cache.merge(values)",
    "title": "Cache.merge()",
    "version": "3.0.3",
    "group": "Actinium",
    "name": "Cache_merge",
    "description": "<p>Merges the supplied values object with the current cache. Any existing entries will remain in cache. Duplicates will be overwritten unless <code>option.skipDuplicates</code> is <code>true</code>. Entries that would have exipired since being merged will expire upon merge but their timeoutCallback will not be invoked. Returns the new size of the cache.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "values",
            "description": "<p>Key value pairs to merge into the cache.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "// Give the existing cache: { foo: 'bar' }\n\nActinium.Cache.merge({\n    test: {\n        value: 123,\n        expire: 5000,\n    },\n});\n\nActinium.Cache.get()\n// returns: { foo: 'bar', test: 123 }",
        "type": "json"
      }
    ],
    "filename": "src/app/documentation/cache.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Cache.set(key,value,timeout,timeoutCallback)",
    "title": "Cache.set()",
    "version": "3.0.3",
    "group": "Actinium",
    "name": "Cache_set",
    "description": "<p>Sets the value for a given key. If the value is an <code>{Object}</code> and is already cached, you can use an object path to update a specific part of the value. Returns the cached value.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>The key to set. If the key is an object path and the key does not exist, it will be created.</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "value",
            "description": "<p>The value to cache.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "timeout",
            "description": "<p>Remove the value in the specified time in milliseconds. If no timeout value specified, the value will remain indefinitely.</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": true,
            "field": "timeoutCallback",
            "description": "<p>Function called when the timeout has expired. The timeoutCallback will be passed the key and value as arguments.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "// The following are equivalent\nActinium.Cache.set('foo', { bar: 123 });\nActinium.Cache.set('foo.bar', 123);\n\n// Set to expire in 5 seconds\nActinium.Cache.set('error', 'Ivnalid username or password', 5000);\n\n// Set to expire in 5 seconds and use a timeoutCallback\nActinium.Cache.set('foo', { bar: 456 }, 5000, (key, value) => console.log(key, value));",
        "type": "json"
      }
    ],
    "filename": "src/app/documentation/cache.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Cache.size()",
    "title": "Cache.size()",
    "version": "3.0.3",
    "group": "Actinium",
    "name": "Cache_size",
    "description": "<p>Returns the current number of entries in the cache.</p>",
    "filename": "src/app/documentation/cache.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Object",
    "url": "Actinium.Capability",
    "title": "Capabilities",
    "version": "3.1.2",
    "name": "Capabilities",
    "group": "Actinium",
    "description": "<p>Actinium uses a concept of Roles, Levels, and Capabilities, designed to give the developer the ability to control what users can and cannot do within the application.</p> <p>A capability is permission to perform one or more types of task. Each user might have some capabilities but not others, depending on their role.</p> <p>Actinium comes with the default capabilities:</p> <table> <thead> <tr> <th>Capability</th> <th>Roles</th> </tr> </thead> <tbody> <tr> <td>user.admin</td> <td>super-admin, administrator, moderator, contributor</td> </tr> <tr> <td>user.ban</td> <td>super-admin, administrator, moderator</td> </tr> <tr> <td>user.view</td> <td>super-admin, administrator, moderator</td> </tr> <tr> <td>user.create</td> <td>super-admin, administrator</td> </tr> <tr> <td>user.edit</td> <td>super-admin, administrator</td> </tr> <tr> <td>user.delete</td> <td>super-admin, administrator</td> </tr> <tr> <td>plugin.view</td> <td>super-admin, administrator</td> </tr> <tr> <td>plugin.activate</td> <td>super-admin, administrator</td> </tr> <tr> <td>plugin.deactivate</td> <td>super-admin, administrator</td> </tr> <tr> <td>plugin.uninstall</td> <td>super-admin, administrator</td> </tr> </tbody> </table> <h3>user.admin</h3> <p>Ability to view the /admin pages.</p> <h3>user.ban</h3> <p>Ability to ban a user.</p> <h3>user.view</h3> <p>Ability to view the user list and other user profiles.</p> <h3>user.create</h3> <p>Ability to create a new user.</p> <h3>user.edit</h3> <p>Ability to edit a user.</p> <h3>user.delete</h3> <p>Ability to delete a user.</p> <h3>plugin.view</h3> <p>Ability to view the plugin list.</p> <h3>plugin.activate</h3> <p>Ability to activate a plugin.</p> <h3>plugin.deactivate</h3> <p>Ability to deactivate a plugin.</p> <h3>plugin.uninstall</h3> <p>Ability to uninstall a plugin.</p>",
    "filename": ".core/lib/capability.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Capability.Role.can(role,capability)",
    "title": "Capability.Role.can()",
    "version": "3.1.2",
    "group": "Actinium",
    "name": "Capability_Role_can",
    "description": "<p>Determines if the role has the specified capability. Returns <code>{Boolean}</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>The role name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "capability",
            "description": "<p>The capability.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Capability.Role.can('banned', 'user.edit');\n// Retuns false",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Capability.Role.get(role)",
    "title": "Capability.Role.get()",
    "version": "3.1.2",
    "group": "Actinium",
    "name": "Capability_Role_get",
    "description": "<p>Get the capabilities of the specified role. Returns an <code>{Array}</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>The role name.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Capability.Role.get('super-admin');\n// Retuns array of capabilities\n[\n   'user.view',\n   'user.create',\n   'user.edit',\n   'user.delete',\n   'user.ban',\n   'plugin.view',\n   'plugin.activate',\n   'plugin.deactivate'\n]",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Capability.User.can(capability,user)",
    "title": "Capability.User.can()",
    "version": "3.1.2",
    "group": "Actinium",
    "name": "Capability_User_can",
    "description": "<p>Determines if a user has the specified capability. If the user is a Super Admin this will always return true. If the user is an Administrator this will almost always return true except in cases where the Administrator has been expressly excluded from the capability. Returns <code>{Boolean}</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "capability",
            "description": "<p>The capability name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>The user id or username. Alternatively you can pass a request object. If the request object has the master key specified, role and capabilities are bipassed and <code>true</code> is returned.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Capability.User.can('user.edit', 'SuperAdmin');\n// Returns true",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Capability.User.get(user)",
    "title": "Capability.User.get()",
    "version": "3.1.2",
    "group": "Actinium",
    "name": "Capability_User_get",
    "description": "<p>Get the capabilities of the specified user. Returns an <code>{Array}</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>The user id or username.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Capability.User.get('yg8yIUql');\nActinium.Capability.User.get('username');",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Capability.get(capability)",
    "title": "Capability.get()",
    "version": "3.1.2",
    "group": "Actinium",
    "name": "Capability_get",
    "description": "<p>Retrieves the specified capability. If no capability is specified a list of all capability names will be returned.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": true,
            "field": "capability",
            "description": "<p>The string capability to retrieve, or array of capabilities to retrieve, or nothing to get list of names..</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Capability.get(['admin-ui.view', 'plugins-ui.view']);\nActinium.Capability.get('user.edit');\nActinium.Capability.get();",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Capability.register(group,roles,order)",
    "title": "Capability.register()",
    "version": "3.1.2",
    "group": "Actinium",
    "name": "Capability_register",
    "description": "<p>Registers a new capability.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "group",
            "defaultValue": "global",
            "description": "<p>The capability group. Specifying a group namespaces your capability so that it doesn't collide with other plugins. For instance you may have a <code>view</code> capability. Adding this to the global group would potentially cause conflicts but adding it to <em>your-plugin-group</em> can avoid this.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "roles",
            "description": "<p>Allowed or excluded roles of the capability.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "order",
            "defaultValue": "100",
            "description": "<p>The order index to register your capability. Useful when trying to overwrite an existing capability.</p>"
          }
        ],
        "Roles": [
          {
            "group": "Roles",
            "type": "Array",
            "optional": true,
            "field": "allowed",
            "description": "<p>Array of role names that are allowed the capability.</p>"
          },
          {
            "group": "Roles",
            "type": "Array",
            "optional": true,
            "field": "excluded",
            "description": "<p>Array or role names that are expressly not allowed the capability.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "// Give only super-admin the ability to ban a user:\n\nActinium.Capability.register(\n  'user.ban',\n  {\n    allowed: ['super-admin'],\n    excluded: ['administrator'],\n  },\n  1000,\n);",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Capability.unregister(capability)",
    "title": "Capability.unregister()",
    "version": "3.1.2",
    "group": "Actinium",
    "name": "Capability_unregister",
    "description": "<p>Unregisters a capability.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "capability",
            "description": "<p>The capability to unregister.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Capability.unregister('sample.edit');",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Utils.CloudACL(permissions,readCapability,writeCapability,existingACL)",
    "title": "Utils.CloudACL()",
    "description": "<p>Generate or augment a Parse.ACL object.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "permissions",
            "description": "<p>list of permissions to apply, when empty array, indicates public read, privileged write</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "readCapability",
            "description": "<p>If provided, will allow read for any roles that have this capability.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "writeCapability",
            "description": "<p>If provided, will allow write for any roles that have this capability.</p>"
          },
          {
            "group": "Parameter",
            "type": "Parse.ACL",
            "optional": true,
            "field": "existingACL",
            "description": "<p>If provided, will be the starting point for the returned ACL, otherwise, returns fresh ACL object.</p>"
          }
        ],
        "permission": [
          {
            "group": "permission",
            "type": "String",
            "optional": false,
            "field": "permission",
            "description": "<p>&quot;read&quot; or &quot;write&quot;</p>"
          },
          {
            "group": "permission",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>&quot;role&quot;, &quot;user&quot;, or &quot;public&quot;</p>"
          },
          {
            "group": "permission",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Required if permission type is &quot;user&quot;. The objectId of the user.</p>"
          },
          {
            "group": "permission",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>Required if permission type is &quot;role&quot;. The name of the role.</p>"
          },
          {
            "group": "permission",
            "type": "Boolean",
            "optional": true,
            "field": "allowed",
            "defaultValue": "true",
            "description": "<p>Access to true or false, default true.</p>"
          }
        ]
      }
    },
    "name": "CloudACL",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/lib/utils/acl.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Object",
    "url": "Actinium.Collection",
    "title": "Collection",
    "version": "3.1.2",
    "name": "Collection",
    "group": "Actinium",
    "description": "<p>Actinium uses a concept of Parse Collections and gives the developer control over what roles have the ability to create, update, retrieve, delete and add fields to each collection using Actinium Roles and Capabilities.</p> <p>For each Parse Collection in your application, you can register capabilities that your roles will use on your collection.</p> <p>The <code>super-admin</code> and <code>administrator</code> roles will have always access to your collection, and cannot be removed using the Actinium API (although they can be remove using the Parse Node API or using the Parse Dashboard).</p> <p>Actinium comes with these default capabilities for each Collection you create (COLLECTION below is replaced by your collection name):</p> <table> <thead> <tr> <th>Capability</th> <th>Roles</th> </tr> </thead> <tbody> <tr> <td>COLLECTION.create</td> <td>super-admin, administrator</td> </tr> <tr> <td>COLLECTION.retrieve</td> <td>super-admin, administrator</td> </tr> <tr> <td>COLLECTION.update</td> <td>super-admin, administrator</td> </tr> <tr> <td>COLLECTION.delete</td> <td>super-admin, administrator</td> </tr> <tr> <td>COLLECTION.addField</td> <td>super-admin, administrator</td> </tr> </tbody> </table> <h3>COLLECTION.create</h3> <p>Ability to create a new object in your collection.</p> <h3>COLLECTION.retrieve</h3> <p>Ability to fetch, find, count objects in your collection.</p> <h3>COLLECTION.update</h3> <p>Ability to update an existing object in your collection.</p> <h3>COLLECTION.delete</h3> <p>Ability to delete an object from your collection.</p> <h3>COLLECTION.addField</h3> <p>Ability to add a new field to your collection.</p>",
    "filename": ".core/lib/collection.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Collection.register(collection,publicPermissions)",
    "title": "Collection.register()",
    "version": "3.1.2",
    "group": "Actinium",
    "name": "Collection_register",
    "description": "<p>Registers public class level permission for your collection.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "collection",
            "description": "<p>The collection name you wish to set class level permission for.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "publicPermissions",
            "description": "<p>Object with boolean properties create, retrieve, update, delete, and addField. True indicates the public has permission to perform this operation. False indicates that only users with roles that match this capability should be permitted to perform this operation. By default all operations are private if this registration is called, but the Parse collection default is fully public otherwise (and only per-object ACLs will apply).</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "fields",
            "description": "<p>Parse fields schema</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "indexes",
            "description": "<p>List of field names to index (use sparingly, and only on high entropy columns)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "// Register Capability for contributor role to create, update, delete, and add fields to collection\nActinium.Capabilities.register('MyCollection.create', {\n        allowed: ['contributor'],\n    },\n    1000,\n);\nActinium.Capabilities.register('MyCollection.update', {\n        allowed: ['contributor'],\n    },\n    1000,\n);\nActinium.Capabilities.register('MyCollection.delete', {\n        allowed: ['contributor'],\n    },\n    1000,\n);\nActinium.Capabilities.register('MyCollection.addField', {\n        allowed: ['contributor'],\n    },\n    1000,\n);\n\n// Allow public read, but private everything else:\nActinium.Collection.register(\n  'MyCollection', {\n      create: false,\n      retrieve: true,\n      update: false,\n      delete: false,\n      addField: false,\n  }\n);",
        "type": "json"
      }
    ],
    "filename": ".core/lib/collection.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Collection.unregister(collection)",
    "title": "Collection.unregister()",
    "version": "3.1.2",
    "group": "Actinium",
    "name": "Collection_unregister",
    "description": "<p>Set collection permissions to Actinium default (i.e. fully private or only administrator, super-admin, and master key use).</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "collection",
            "description": "<p>The collection to unregister public permissions.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Collection.unregister('MyCollection');",
        "type": "json"
      }
    ],
    "filename": ".core/lib/collection.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.Log.add(params,options)",
    "title": "Content.Log.add()",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>parameters for log</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse Query options (controls access)</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "user",
            "description": "<p>Parse user object</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "userId",
            "description": "<p>Parse user object id (alternative)</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": false,
            "field": "contentId",
            "description": "<p>objectId of the content</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": false,
            "field": "collection",
            "description": "<p>the Parse collection of the content</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": false,
            "field": "changeType",
            "description": "<p>the type of change being logged</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "meta",
            "description": "<p>meta data for the change log</p>"
          }
        ]
      }
    },
    "name": "Content_Log_add",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.Log.list(params,options)",
    "title": "Content.Log.list()",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>parameters for log</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse Query options (controls access)</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "orderBy",
            "defaultValue": "createdAt",
            "description": "<p>Field to order the results by.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "direction",
            "defaultValue": "descending",
            "description": "<p>Order &quot;descending&quot; or &quot;ascending&quot;</p>"
          },
          {
            "group": "params",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>Limit page results</p>"
          },
          {
            "group": "params",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "50",
            "description": "<p>Limit page results</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "userId",
            "description": "<p>Parse user object id (alternative)</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "contentId",
            "description": "<p>objectId of the content</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "collection",
            "description": "<p>the Parse collection of the content</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "changeType",
            "description": "<p>the type of change being logged</p>"
          }
        ]
      }
    },
    "name": "Content_Log_list",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.changeSlug(params,options)",
    "title": "Content.changeSlug()",
    "description": "<p>Update the official slug for existing content. This results in a new uuid.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "newSlug",
            "description": "<p>The new content slug.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content (for lookup only).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The Parse object id of the content (for lookup only).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid of the content. (for lookup only)</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ]
      }
    },
    "name": "Content_changeSlug",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/content-plugin.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.changeSlug(params,options)",
    "title": "Content.changeSlug()",
    "description": "<p>Update the official slug for existing content. This results in a new uuid.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>parameters for content lookup and newSlug</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse Query options (controls access)</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": false,
            "field": "newSlug",
            "description": "<p>The new content slug.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content (for lookup only).</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The Parse object id of the content (for lookup only).</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid of the content. (for lookup only)</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ]
      }
    },
    "name": "Content_changeSlug",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.cloneBranch(params,options)",
    "title": "Content.cloneBranch()",
    "description": "<p>Clone a branch / specific revision as a new branch.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>parameters for content</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse Query options (controls access)</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "branchLabel",
            "description": "<p>New branch label.</p>"
          },
          {
            "group": "params",
            "type": "Boolean",
            "optional": true,
            "field": "current",
            "defaultValue": "false",
            "description": "<p>When true, get the currently committed content (not from revision system). otherwise, construct the content from the provided history (branch and revision index).</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": true,
            "field": "history",
            "description": "<p>revision history to retrieve, containing branch and revision index.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The objectId for the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid for the content.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "String",
            "optional": true,
            "field": "branch",
            "defaultValue": "master",
            "description": "<p>the revision branch of current content</p>"
          }
        ]
      }
    },
    "name": "Content_cloneBranch__",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.create(params,options)",
    "title": "Content.create()",
    "description": "<p>Create new content of a defined Type. In addition to the required parameters of <code>type</code> and <code>slug</code>, you can provide any parameter's that conform to the runtime fields saved for that type.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>parameters for content</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse Query options (controls access)</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": false,
            "field": "slug",
            "description": "<p>The unique slug for the new content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>The title of the new content.</p>"
          },
          {
            "group": "params",
            "type": "Array",
            "optional": true,
            "field": "permissions",
            "defaultValue": "Array",
            "description": "<p>List of permissions to apply to content. If not provided, no ACL will be set.</p>"
          },
          {
            "group": "params",
            "type": "ParseUser",
            "optional": true,
            "field": "user",
            "description": "<p>User object that created (&quot;owns&quot;) the content.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "permission": [
          {
            "group": "permission",
            "type": "Object",
            "optional": false,
            "field": "permission",
            "description": "<p>Read or write</p>"
          },
          {
            "group": "permission",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>role or user</p>"
          },
          {
            "group": "permission",
            "type": "Object",
            "optional": true,
            "field": "objectId",
            "description": "<p>objectId of user</p>"
          },
          {
            "group": "permission",
            "type": "Object",
            "optional": true,
            "field": "name",
            "description": "<p>name of role</p>"
          }
        ]
      }
    },
    "name": "Content_create",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.createBranch(content,type,branch,options)",
    "title": "Content.createBranch()",
    "description": "<p>Create a new revision branch based on the current revision of some content. Returns new branches and fresh history objects.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "content",
            "description": "<p>A specific version of your content.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>The Type object of the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "branch",
            "defaultValue": "master",
            "description": "<p>the new branch name. If not provided or already taken, will be generated uuid.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse Query options (controls access)</p>"
          }
        ]
      }
    },
    "name": "Content_createBranch",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.delete(params,options)",
    "title": "Content.delete()",
    "description": "<p>Delete content of a defined Type. To identify the content, you must provided the <code>type</code> object, and one of <code>slug</code>, <code>objectId</code>, or <code>uuid</code> of the content. Destroys main record for content, marks all revisions for cleanup, and returns recycled master record.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>parameters for content</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse Query options (controls access)</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The Parse object id of the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid of the content.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ]
      }
    },
    "name": "Content_delete",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.deleteBranch(params,options)",
    "title": "Content.deleteBranch()",
    "description": "<p>Delete a branch and mark its revisions for deletion.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>parameters for content</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse Query options (controls access)</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "params",
            "type": "Boolean",
            "optional": true,
            "field": "current",
            "defaultValue": "false",
            "description": "<p>When true, get the currently committed content (not from revision system). otherwise, construct the content from the provided history (branch and revision index).</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": true,
            "field": "history",
            "description": "<p>revision history to retrieve, containing branch and revision index.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The objectId for the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid for the content.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "String",
            "optional": true,
            "field": "branch",
            "defaultValue": "master",
            "description": "<p>the revision branch of current content</p>"
          }
        ]
      }
    },
    "name": "Content_deleteBranch__",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.diff(content,changes)",
    "title": "Content.diff()",
    "description": "<p>Compares content object to proposed changes, and returns difference.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "content",
            "description": "<p>your content object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "changes",
            "description": "<p>proposed changes to the content</p>"
          }
        ]
      }
    },
    "name": "Content_diff",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.getVersion(content,branch,revision,options)",
    "title": "Content.getVersion()",
    "description": "<p>Given a content object, fetch a specific revision of that content.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "content",
            "description": "<p>your content object</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "branch",
            "defaultValue": "master",
            "description": "<p>the revision branch of current content</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "revision",
            "description": "<p>index in branch history to retrieve (default latest)</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse Query options (controls access)</p>"
          }
        ]
      }
    },
    "name": "Content_getVersion",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.labelBranch(params,options)",
    "title": "Content.labelBranch()",
    "description": "<p>Clone a branch / specific region as a new branch.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>parameters for content</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse Query options (controls access)</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "branchLabel",
            "description": "<p>New branch label.</p>"
          },
          {
            "group": "params",
            "type": "Boolean",
            "optional": true,
            "field": "current",
            "defaultValue": "false",
            "description": "<p>When true, get the currently committed content (not from revision system). otherwise, construct the content from the provided history (branch and revision index).</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": true,
            "field": "history",
            "description": "<p>revision history to retrieve, containing branch and revision index.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The objectId for the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid for the content.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "String",
            "optional": true,
            "field": "branch",
            "defaultValue": "master",
            "description": "<p>the revision branch of current content</p>"
          }
        ]
      }
    },
    "name": "Content_labelBranch__",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.list(params,options)",
    "title": "Content.list()",
    "description": "<p>Get list of content of a specific Type.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>parameters for content</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse Query options (controls access)</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "params",
            "type": "Boolean",
            "optional": true,
            "field": "refresh",
            "defaultValue": "false",
            "description": "<p>skip cache check when true</p>"
          },
          {
            "group": "params",
            "type": "Boolean",
            "optional": true,
            "field": "optimize",
            "defaultValue": "false",
            "description": "<p>if optimize is true, and collection contains less than 1000 records, the entire set will be delivered in one page for application-side pagination.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "status",
            "description": "<p>&quot;PUBLISHED&quot; or &quot;DRAFT&quot;, or other custom status of the content</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "orderBy",
            "defaultValue": "updatedAt",
            "description": "<p>Field to order the results by.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "order",
            "defaultValue": "descending",
            "description": "<p>Order &quot;descending&quot; or &quot;ascending&quot;</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "indexBy",
            "description": "<p>Out put the results as an {Object} indexed by the specified collection field.</p>"
          },
          {
            "group": "params",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "20",
            "description": "<p>Limit page results</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ]
      }
    },
    "name": "Content_list",
    "group": "Actinium",
    "examples": [
      {
        "title": "Usage",
        "content": "Actinium.Content.list({\n    \"type\": {\n        \"machineName\": \"article\"\n    },\n    \"orderBy\":\"title\",\n    \"direction\": \"ascending\",\n    \"limit\": 1,\n    \"status\": \"DRAFT\"\n});",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.masterCopyProps(content,",
    "title": "schema, type) Content.masterCopyProps()",
    "description": "<p>Return subset of all properties from master copy of content that <em>must</em> come from the master copy (not revisions). This helps with certainty about which properties are comeing from the collection, and which may be coming from revisions.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "content",
            "description": "<p>Actinium.Object or serialized object from recently fetched content.</p>"
          }
        ]
      }
    },
    "name": "Content_masterCopyProps",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.publish(params,options)",
    "title": "Content.publish()",
    "description": "<p>Set revision to current version and publish content.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>parameters for content</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse Query options (controls access)</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The Parse object id of the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid of the content.</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": true,
            "field": "history",
            "description": "<p>revision history to retrieve, containing branch and revision index.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "userId",
            "description": "<p>User objectId that published the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "reason",
            "description": "<p>Cause of publish action, default ENUMS.CHANGES.PUBLISHED</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "String",
            "optional": true,
            "field": "branch",
            "defaultValue": "master",
            "description": "<p>the revision branch of current content</p>"
          },
          {
            "group": "history",
            "type": "Number",
            "optional": true,
            "field": "revision",
            "description": "<p>index in branch history to update (defaults to most recent in branch).</p>"
          }
        ]
      }
    },
    "name": "Content_publish",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.publishScheduled()",
    "title": "Content.publishScheduled()",
    "description": "<p>Manually run content scheduler. Publishes or unpublishes any content that is scheduled.</p>",
    "name": "Content_publishScheduled",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.restore(params,options)",
    "title": "Content.restore()",
    "description": "<p>Restore deleted content of a defined Type (if still in recycle). To identify the content, you must provided the <code>type</code> object, and <code>objectId</code> of the content. Restores main record for content as well as any revisions.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>parameters for content</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse Query options (controls access)</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": false,
            "field": "objectId",
            "description": "<p>The Parse object id of the deleted content.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ]
      }
    },
    "name": "Content_restore",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.retrieve(params,options)",
    "title": "Content.retrieve()",
    "description": "<p>Retrieve one item of content.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>parameters for content</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse Query options (controls access)</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "params",
            "type": "Boolean",
            "optional": true,
            "field": "current",
            "defaultValue": "false",
            "description": "<p>When true, get the currently committed content (not from revision system). otherwise, construct the content from the provided history (branch and revision index).</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": true,
            "field": "history",
            "description": "<p>revision history to retrieve, containing branch and revision index.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The objectId for the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid for the content.</p>"
          },
          {
            "group": "params",
            "type": "Boolean",
            "optional": true,
            "field": "attach",
            "defaultValue": "false",
            "description": "<p>boolean flag to attach Pointers and Relations.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "String",
            "optional": true,
            "field": "branch",
            "defaultValue": "master",
            "description": "<p>the revision branch of current content</p>"
          },
          {
            "group": "history",
            "type": "Number",
            "optional": true,
            "field": "revision",
            "description": "<p>index in branch history to retrieve (default index of latest revision)</p>"
          }
        ]
      }
    },
    "name": "Content_retrieve",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.revision(params,options)",
    "title": "Content.revision()",
    "description": "<p>Retrieve branch history of some content.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>parameters for content</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse Query options (controls access)</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "params",
            "type": "Boolean",
            "optional": true,
            "field": "current",
            "defaultValue": "false",
            "description": "<p>When true, get the currently committed content (not from revision system). otherwise, construct the content from the provided history (branch and revision index).</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": true,
            "field": "history",
            "description": "<p>revision history to retrieve, containing branch and revision index.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The objectId for the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid for the content.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "String",
            "optional": true,
            "field": "branch",
            "defaultValue": "master",
            "description": "<p>the revision branch of current content</p>"
          }
        ]
      }
    },
    "name": "Content_revision__",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.sanitize(content)",
    "title": "Content.sanitize()",
    "description": "<p>Based on content provided, will return array of sanitized content fields based on the field types in the content type. (Array of <code>{fieldSlug, fieldValue}</code>)</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>params data to sanitize</p>"
          },
          {
            "group": "Parameter",
            "type": "ActiniumObject",
            "optional": false,
            "field": "object",
            "description": "<p>the Actinium.Object to be saved</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>The Type object of the content.</p>"
          }
        ]
      }
    },
    "name": "Content_sanitize",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.schedule(params,options)",
    "title": "Content.schedule()",
    "description": "<p>Schedule the publishing / unpublishing of content. If <code>history</code> is provided, that revision will be made current and published on optional <code>sunrise</code>. On optional <code>sunset</code>, the current version of the content will be unpublished.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>parameters for content</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse Query options (controls access)</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The Parse object id of the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid of the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "sunrise",
            "description": "<p>Optional ISO8601 + UTC Offset datetime string (moment.format()) for sunrise of content. e.g. 2020-02-07T11:15:04-05:00</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "sunset",
            "description": "<p>Optional ISO8601 + UTC Offset datetime string (moment.format()) for sunset of content. e.g. 2020-02-07T11:15:04-05:00</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": true,
            "field": "history",
            "description": "<p>revision history to retrieve, containing branch and revision index.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "String",
            "optional": true,
            "field": "branch",
            "defaultValue": "master",
            "description": "<p>the revision branch of current content</p>"
          },
          {
            "group": "history",
            "type": "Number",
            "optional": true,
            "field": "revision",
            "description": "<p>index in branch history to update (defaults to most recent in branch).</p>"
          }
        ]
      }
    },
    "name": "Content_schedule",
    "group": "Actinium",
    "examples": [
      {
        "title": "Usage",
        "content": "const moment = require('moment');\nconst now = moment();\n\n// publish version 3 of master branch a month from now\n// unpublish the article in 2 months\nActinium.Content.schedule({\n  type: { machineName: 'article' },\n  slug: 'my-article',\n  history: { branch: 'master', revision: 3 },\n  sunrise: now.clone().add(1, 'month').format(),\n  sunset: now.clone().add(2, 'month').format(),\n}, Actinium.Utils.MasterOptions());",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.setCurrent(params,options)",
    "title": "Content.setCurrent()",
    "description": "<p>Take content from a specified branch or revision, and make it the &quot;official&quot; version of the content. If no <code>history</code> is param is specified the latest master branch revision will be used.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>parameters for content</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse Query options (controls access)</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The Parse object id of the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid of the content.</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": true,
            "field": "history",
            "description": "<p>revision history to retrieve, containing branch and revision index.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "String",
            "optional": true,
            "field": "branch",
            "defaultValue": "master",
            "description": "<p>the revision branch of current content</p>"
          },
          {
            "group": "history",
            "type": "Number",
            "optional": true,
            "field": "revision",
            "description": "<p>index in branch history to update (defaults to most recent in branch).</p>"
          }
        ]
      }
    },
    "name": "Content_setCurrent",
    "group": "Actinium",
    "examples": [
      {
        "title": "Usage",
        "content": "Actinium.Content.setCurrent({\n    // Type object required to look up content\n    // i.e. the collection is determined by the parent Type\n    type: {\n        // one of these 3 required to look up content\n        objectId: 'MvAerDoRQN',\n        machineName: 'article',\n        uuid: '975776a5-7070-5c23-bee6-4e9bba84a431',\n    },\n\n    // one of these 3 required to look up content\n    objectId: 'tEiojmmHA1',\n    slug: 'test-article1',\n    uuid: '5320803c-b709-5327-a06f-b482c8f41b92',\n\n    history: { branch: 'master' }\n}, { sessionToken: 'lkjasfdliewaoijfesoij'});",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.setPermissions(params,options)",
    "title": "Content.setPermissions()",
    "description": "<p>Update permissions for content.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>parameters for content</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse Query options (controls access)</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The Parse object id of the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid of the content.</p>"
          },
          {
            "group": "params",
            "type": "Array",
            "optional": false,
            "field": "permissions",
            "description": "<p>List of permissions to apply to content. If unset, ACL will not be updated. If empty array, public read access will be applied.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "permission": [
          {
            "group": "permission",
            "type": "Object",
            "optional": false,
            "field": "permission",
            "description": "<p>Read or write</p>"
          },
          {
            "group": "permission",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>role or user</p>"
          },
          {
            "group": "permission",
            "type": "Object",
            "optional": true,
            "field": "objectId",
            "description": "<p>objectId of user</p>"
          },
          {
            "group": "permission",
            "type": "Object",
            "optional": true,
            "field": "name",
            "description": "<p>name of role</p>"
          }
        ]
      }
    },
    "name": "Content_setPermissions",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.setStatus(params,options)",
    "title": "Content.setStatus()",
    "description": "<p>Set revision to current version and set the status of the content.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>parameters for content</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse Query options (controls access)</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The Parse object id of the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid of the content.</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": true,
            "field": "history",
            "description": "<p>revision history to retrieve, containing branch and revision index.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "userId",
            "description": "<p>User objectId that set the status of the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "reason",
            "description": "<p>Change log change reason. Cause of setStatus action, default ENUMS.CHANGES.SET_STATUS</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "String",
            "optional": true,
            "field": "branch",
            "defaultValue": "master",
            "description": "<p>the revision branch of current content</p>"
          },
          {
            "group": "history",
            "type": "Number",
            "optional": true,
            "field": "revision",
            "description": "<p>index in branch history to update (defaults to most recent in branch).</p>"
          }
        ]
      }
    },
    "name": "Content_setStatus",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.trash(params,options)",
    "title": "Content.trash()",
    "description": "<p>Mark content for deletion.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>parameters for content</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse Query options (controls access)</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The Parse object id of the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid of the content.</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": true,
            "field": "history",
            "description": "<p>revision history to retrieve, containing branch and revision index.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "String",
            "optional": true,
            "field": "branch",
            "defaultValue": "master",
            "description": "<p>the revision branch of current content</p>"
          },
          {
            "group": "history",
            "type": "Number",
            "optional": true,
            "field": "revision",
            "description": "<p>index in branch history to update (defaults to most recent in branch).</p>"
          }
        ]
      }
    },
    "name": "Content_trash",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/content-plugin.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.trash(params,options)",
    "title": "Content.trash()",
    "description": "<p>Mark content for deletion.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>parameters for content</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse Query options (controls access)</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The Parse object id of the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid of the content.</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": true,
            "field": "history",
            "description": "<p>revision history to retrieve, containing branch and revision index.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "String",
            "optional": true,
            "field": "branch",
            "defaultValue": "master",
            "description": "<p>the revision branch of current content</p>"
          },
          {
            "group": "history",
            "type": "Number",
            "optional": true,
            "field": "revision",
            "description": "<p>index in branch history to update (defaults to most recent in branch).</p>"
          }
        ]
      }
    },
    "name": "Content_trash",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.typeMaintenance()",
    "title": "Content.typeMaintenance()",
    "description": "<p>Manually run content maintenance. Primarily makes sure that the current content slugs are accounted for in the Type object, but also runs the Hook <code>type-maintenance</code> for each type, giving plugins an opportunity to do their own maintenance.</p>",
    "name": "Content_typeMaintenance",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.unpublish(params,options)",
    "title": "Content.unpublish()",
    "description": "<p>Unpublish current version of content.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>parameters for content</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse Query options (controls access)</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The Parse object id of the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid of the content.</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": true,
            "field": "history",
            "description": "<p>revision history to retrieve, containing branch and revision index.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "String",
            "optional": true,
            "field": "branch",
            "defaultValue": "master",
            "description": "<p>the revision branch of current content</p>"
          },
          {
            "group": "history",
            "type": "Number",
            "optional": true,
            "field": "revision",
            "description": "<p>index in branch history to update (defaults to most recent in branch).</p>"
          }
        ]
      }
    },
    "name": "Content_unpublish",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/content-plugin.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.unpublish(params,options)",
    "title": "Content.unpublish()",
    "description": "<p>Unpublish current version of content.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>parameters for content</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse Query options (controls access)</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The Parse object id of the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid of the content.</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": true,
            "field": "history",
            "description": "<p>revision history to retrieve, containing branch and revision index.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "userId",
            "description": "<p>User objectId that unpublished the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "reason",
            "description": "<p>Cause of unpublish action, default ENUMS.CHANGES.UNPUBLISH</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "String",
            "optional": true,
            "field": "branch",
            "defaultValue": "master",
            "description": "<p>the revision branch of current content</p>"
          },
          {
            "group": "history",
            "type": "Number",
            "optional": true,
            "field": "revision",
            "description": "<p>index in branch history to update (defaults to most recent in branch).</p>"
          }
        ]
      }
    },
    "name": "Content_unpublish",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.unschedule(params,options)",
    "title": "Content.unschedule()",
    "description": "<p>Remove scheduled publishing job by id.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The Parse object id of the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid of the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "jobId",
            "description": "<p>The id of the schedule job.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ]
      }
    },
    "name": "Content_unschedule",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/content-plugin.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.unschedule(params,options)",
    "title": "Content.unschedule()",
    "description": "<p>Remove scheduled publishing job by id.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>parameters for content</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse Query options (controls access)</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The Parse object id of the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid of the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": false,
            "field": "jobId",
            "description": "<p>The id of the schedule job.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ]
      }
    },
    "name": "Content_unschedule",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Content.update(params,options)",
    "title": "Content.update()",
    "description": "<p>Update content of a defined Type. In addition to the required parameters of <code>type</code> and <code>slug</code>, you can provide any parameter's that conform to the runtime fields saved for that type. Changes to content will be staged as a new delta revision. If no <code>history</code> (branch and revision index) are provided A new revision will be added in the master branch. To commit a revision to your content collection, use <code>content-set-current</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>parameters for content</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse Query options (controls access)</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "title",
            "description": "<p>The updated title of the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content (for lookup only, use <code>Content.changeSlug() to change.</code>).</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The Parse object id of the content (for lookup only).</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid of the content. (for lookup only)</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": true,
            "field": "history",
            "description": "<p>revision history to retrieve, containing branch and revision index.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "String",
            "optional": true,
            "field": "branch",
            "defaultValue": "master",
            "description": "<p>the revision branch of current content</p>"
          },
          {
            "group": "history",
            "type": "Number",
            "optional": true,
            "field": "revision",
            "description": "<p>index in branch history to update (defaults to most recent in branch). If you select a revision before the latest revision, a new branch will be created.</p>"
          }
        ]
      }
    },
    "name": "Content_update",
    "group": "Actinium",
    "examples": [
      {
        "title": "Usage",
        "content": "Actinium.Content.update({\n    // Type object required to look up content\n    // i.e. the collection is determined by the parent Type\n    type: {\n        // one of these 3 required to look up content\n        objectId: 'MvAerDoRQN',\n        machineName: 'article',\n        uuid: '975776a5-7070-5c23-bee6-4e9bba84a431',\n    },\n\n    // one of these 3 required to look up content\n    objectId: 'tEiojmmHA1',\n    slug: 'test-article1',\n    uuid: '5320803c-b709-5327-a06f-b482c8f41b92',\n\n    // optionally set meta data for the content\n    meta: {},\n\n    // Any additional field as defined in the Type object `fields`.\n    // Can be different from one type to another.\n    title: 'Test Article',\n    body: {\n       children: [\n           {\n               text: 'simple text',\n           },\n       ],\n    },\n\n    // Update the latest master revision\n    history: { branch: 'master' }\n}, { sessionToken: 'lkjasdljadsfoijaef'});",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "File.create(filePath,targetPath)",
    "title": "File.create()",
    "version": "3.1.2",
    "group": "Actinium",
    "name": "File_create",
    "description": "<p>Create a new parse file from disk. Returns a Parse.File object that has been saved to storage.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "filePath",
            "description": "<p>Full path to file.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "targetPath",
            "description": "<p>the &quot;directory&quot; relative path prefix to add to the filename (url encoded). This is useful for saving the file to a specific location in S3 or FSAdapter path.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "targetFileName",
            "description": "<p>if provided, will be the filename of the stored file, otherwise the base filename of the source file will be used.</p>"
          }
        ]
      }
    },
    "filename": ".core/lib/file.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "FilesAdapter.register(plugin,installer,order)",
    "title": "FilesAdapter.register()",
    "description": "<p>Register a Parse FilesAdapter plugin to handle file operations. Ideally, at most only one FilesAdapter plugin should be active at a time. If multiple FilesAdapter plugins are enabled, the plugin with the highest <code>order</code> will determine the running FilesAdapter.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "Plugin",
            "description": "<p>Plugin object taken by <code>Actinium.Plugin.register()</code>.</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "installer",
            "description": "<p>Async function that takes Actinium startup config and environment as arguments, and returns a promise for a Parse FilesAdapter object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "order",
            "description": "<p>The order in which active FilesAdapters will decide on which is in play.</p>"
          }
        ]
      }
    },
    "version": "3.1.6",
    "group": "Actinium",
    "name": "FilesAdapter_register",
    "filename": ".core/lib/files-adapter.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Harness.test(description,cb,setup,teardown)",
    "title": "Harness.test()",
    "version": "3.1.2",
    "group": "Actinium",
    "name": "Harness_test",
    "description": "<p>Add a local development functional test, to be run at startup of Actinium. Your test callback will be passed the node.js 'assert' object.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Describe the tests run.</p>"
          },
          {
            "group": "Parameter",
            "type": "AsyncFunction",
            "optional": false,
            "field": "cb",
            "description": "<p>the test body</p>"
          },
          {
            "group": "Parameter",
            "type": "AsyncFunction",
            "optional": false,
            "field": "setup",
            "description": "<p>setup to be performed before the test</p>"
          },
          {
            "group": "Parameter",
            "type": "AsyncFunction",
            "optional": false,
            "field": "teardown",
            "description": "<p>work to be performed after the test to clean up</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Harness.test('My Test', async assert => {\n    assert(false, 'should be true');\n});\n\n// Example with setup / teardown\nconst setup = async () => {\n    const user = new Parse.User();\n        user.set(\"username\", \"myName\");\n        user.set(\"password\", \";lajksdf;lajsdf\");\n        user.set(\"email\", \"email@example.com\");\n    await user.save(null, { useMasterKey: true });\n    await Actinium.Roles.User.add(user.id, 'super-admin', { useMasterKey: true });\n};\nconst teardown = async () => {\n    const query = new Parse.Query('_User');\n    query.equalTo('username', 'myName');\n    const user = await query.first({ useMasterKey: true });\n    await user.destroy({ useMasterKey: true });\n};\nActinium.Harness.test('My Test', async assert => {\n    const query = new Parse.Query('_User');\n    query.equalTo('username', 'myName');\n    const user = await query.first({ useMasterKey: true });\n\n    assert(user, 'User myName should exist.');\n}, setup, teardown);",
        "type": "json"
      }
    ],
    "filename": ".core/lib/harness.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Object",
    "url": "Actinium.Hook",
    "title": "Hook",
    "version": "3.0.5",
    "group": "Actinium",
    "name": "Hook",
    "description": "<p>Hooks are a way for one piece of code to interact/modify another piece of code. They make up the foundation for how plugins interact with Actinium.</p> <h2>Using Hooks</h2> <p>Simply create a callback function that returns a <code>{Promise}</code> and register it with Actinium.</p> <pre><code class=\"language-js\">Actinium.Hook.register('start', myFunction); </code></pre> <p><em>See: <a href=\"#api-Actinium-Hook_register\">Hook.register</a> for full example.</em></p> <h2>Custom Hooks</h2> <p>You can create custom hooks in your plugins so that other developers can extend and modify it. Just create a function and implement the hook using:</p> <pre><code class=\"language-js\">Hook.run('myHook', param1, param2) </code></pre> <p><em>See: <a href=\"#api-Actinium-Hook_run\">Hook.run</a> for full example.</em></p> <h2>Behavior</h2> <p>Hooks are synchronous and will execute in the order they are registered unless the <code>order</code> parameter is specified.</p>",
    "parameter": {
      "fields": {
        "Hooks": [
          {
            "group": "Hooks",
            "optional": false,
            "field": "activate",
            "description": "<p>Triggered when a plugin has been activated. The <code>Plugin</code> object is passed to the hook.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "add-meta-asset",
            "description": "<p>Triggered when a new Plugable meta asset is added with addMetaAsset(). The hook is passed the metaAsset object used to create the file asset.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "afterDelete-plugin",
            "description": ""
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "afterDelete-route",
            "description": ""
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "afterSave",
            "description": ""
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "afterSave-route",
            "description": ""
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "beforeDelete-plugin",
            "description": ""
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "beforeSave-plugin",
            "description": ""
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "blueprint-list",
            "description": "<p>Triggered when the list of Blueprints is retrieved from <code>Blueprint.list()</code> or the cloud function <code>blueprints</code></p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "capability-edit",
            "description": ""
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "capability-loaded",
            "description": ""
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "capability-loading",
            "description": ""
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "capability-registered",
            "description": "<p>Run when a new capability is created. The</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "capability-unregistered",
            "description": ""
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "capability-updated",
            "description": ""
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "content-schema-field-types",
            "description": "<p>Triggered when content type fields are mapped to Parse field types. Use this hook when you defined custom field types.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "content-schema-permissions",
            "description": "<p>Triggered when content schemas are created, sets default class level permissions.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "content-schema-indexes",
            "description": "<p>Triggered when content schemas are created, sets default indexes.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "content-field-sanitize",
            "description": "<p>Triggered when field data is sanitized.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "content-saved",
            "description": "<p>Triggered when content is edited.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "collection-before-permissions",
            "description": ""
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "deactivate",
            "description": "<p>Triggered when a plugin has been deactivated. The <code>Plugin</code> object is passed to the hook.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "directories",
            "description": "<p>Triggered after the list of upload directories is retrieved. Passes the <code>Array</code> of directories as the only paramter.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "directory-create",
            "description": "<p>Triggered after a directory is created. Passes the <code>Parse.Object('MediaDirectory')</code> object as the only parameter.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "directory-query",
            "description": "<p>Triggered when the query for a directory is created. Passes the <code>Parse.Query</code> object as the only parameter.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "init",
            "description": "<p>Triggered after Actinium has initialized Express, Middleware, and Plugins. <code>init</code> is the very first hook triggered. If you have any pre-configuration that needs to take place, this is an optimal time to do it. This will execute regardless of the plugin's active state.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "install",
            "description": "<p>Triggered after a plugin has been installed. The <code>Plugin</code> object is passed to the hook.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "live-query-classnames",
            "description": "<p>Triggered before he server starts and after <code>init</code>. The ENV.LIVE_QUERY_SETTINGS.classNames value is passed allow you to mutate the list of classNames before the server starts. This will execute regardless of the plugin's active state.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "login",
            "description": "<p>Triggered when a user has logged in. The user object will be saved after changes have been made. The <code>Parse.User</code> object is passed to the hook.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "mailer-transport",
            "description": ""
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "plugin-load",
            "description": "<p>Triggered after a plugin has been loaded. This hook runs before <code>start</code> making it a good place to extend the Actinium SDK or do any before-start but after init actions.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "reset-request-context",
            "description": "<p>Triggered when the context object is created for a password reset request. Use this hook to add additional context data to a reset request email.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "reset-request-email-html",
            "description": "<p>Triggered when the password reset request email is generating the HTML version of the message. Use this hook to replace or edit the output of the html email message.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "reset-request-email-text",
            "description": "<p>Triggered when the password reset request email is generating the text version of the message. Use this hook to replace or edit the output of the text email message.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "role-created",
            "description": "<p>Run when a role is created. The new role and updated role list is passed to the hook.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "role-find",
            "description": "<p>Run when a role is fetched from the server. The fetched <code>Parse.Role</code> object is passed to the hook.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "role-removed",
            "description": "<p>Run when a role is removed. The removed role and updated role ist is passed to the hook.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "roles",
            "description": "<p>Triggered when roles are fetched from the server. The roles object is passed to the hook.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "route-list",
            "description": ""
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "route-retrieve",
            "description": ""
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "running",
            "description": "<p>Triggered before the end of the Actinium bootstrap after warnings and tests have run.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "setting-capability",
            "description": ""
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "setting-change",
            "description": "<p>Triggered when the value of a setting has been changed. The setting key and value are passed to the hook.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "setting-set",
            "description": "<p>Triggered when a new setting has been registered. The setting key and value are passed to the hook.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "setting-unset",
            "description": "<p>Triggered when a setting has been deleted. The setting key and value are passed to the hook.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "settings",
            "description": "<p>Triggered when the settings have been fetched from the server. The settings object is passed to the hook.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "settings-acl",
            "description": ""
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "settings-acl-roles",
            "description": ""
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "settings-sync",
            "description": "<p>Triggered when the settings are synced across multiple instances.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "start",
            "description": "<p>Triggered when the server starts up. If you have any database seeding or schema to construct, this is the optimal time to do it.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "uninstall",
            "description": "<p>Triggered after a plugin has been uninstalled. The <code>Plugin</code> object is passed to the hook.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "update",
            "description": ""
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "user-after-save",
            "description": "<p>Triggered after a Parse.User object is saved.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "user-before-find",
            "description": "<p>Triggered when the <code>user-find</code> cloud function is called.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "user-before-login",
            "description": "<p>Triggered before a sign in attempt.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "user-before-save",
            "description": "<p>Triggered after a Parse.User object is saved.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "user-fetch",
            "description": "<p>Triggered when a user is fetched from the server. The fetched <code>Parse.User</code> object is passed to the hook.</p>"
          },
          {
            "group": "Hooks",
            "optional": false,
            "field": "warning",
            "description": "<p>Triggered when the startup warnings are logged.</p>"
          }
        ]
      }
    },
    "filename": "src/app/documentation/hooks.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Object",
    "url": "Actinium.Hook.flush()",
    "title": "Hook.flush()",
    "version": "3.0.5",
    "group": "Actinium",
    "name": "Hook_flush",
    "description": "<p>Unregister all callback functions for the specified hook.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "hook",
            "description": "<p>The name of the hook to flush.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Hook.flush('custom-hook');",
        "type": "json"
      }
    ],
    "filename": "src/app/documentation/hooks.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Array",
    "url": "Actinium.Hook.list()",
    "title": "Hook.list()",
    "version": "3.0.5",
    "group": "Actinium",
    "name": "Hook_list",
    "description": "<p>Get a list of all the registered hooks.</p>",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "console.log(Actinium.Hook.list());",
        "type": "json"
      }
    ],
    "filename": "src/app/documentation/hooks.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Object",
    "url": "Actinium.Hook.register(name,callback,order)",
    "title": "Hook.register()",
    "version": "3.0.5",
    "group": "Actinium",
    "name": "Hook_register",
    "description": "<p>Registering a hook queues your callback function to be executed when the hook is run.</p> <p>The callback function is passed any parameters from <code>Hook.run()</code> as well as a <code>context</code> object that can be modified between hook callbacks. The context object will be the very last parameter.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The hook you wish to register your callback function to.</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "callback",
            "description": "<p>Function to execute when the hook is run. This function must return a <code>{Promise}</code>.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "order",
            "defaultValue": "100",
            "description": "<p>The index order in which to execute your callback function. The lower the number, the sooner it executes.</p>"
          }
        ],
        "Returns": [
          {
            "group": "Returns",
            "type": "String",
            "optional": false,
            "field": "hookID",
            "description": "<p>Returns the UUID of the registered hook. The hookID can be used when unregistering a hook with <a href=\"#api-Actinium-Hook_unregister\">Hook.unregister()</a>;</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "const hookID = Actinium.Hook.register('activate', (plugin, context) => {\n    const { ID } = plugin;\n\n    // Exit if the activated plugin has nothing to do with my plugin\n    if (ID !== 'TEST-PLUGIN') { return Promise.resolve(); }\n\n    // Pass this along to the subsequent callbacks\n    context[ID] = 'Yo.. we activated the TEST-PLUGIN bro!';\n\n    // Resolve the promise after 5 seconds and log the activity\n    return new Promise(resolve => setTimeout(() => {\n        console.log(ID, 'activated');\n        resolve();\n    }, 5000));\n});\n\n// Returns 8c12574f-1dbc-496f-8125-371937acc716",
        "type": "json"
      }
    ],
    "filename": "src/app/documentation/hooks.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Object",
    "url": "Actinium.Hook.run(name,[,params])",
    "title": "Hook.run()",
    "version": "3.0.5",
    "group": "Actinium",
    "name": "Hook_run",
    "description": "<p>Hook.Run is useful when implementing custom hooks in your plugins.</p> <p>Upon completion of the hook action sequence the <code>context</code> object is returned.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Unique name of the hook you wish to run.</p>"
          },
          {
            "group": "Parameter",
            "type": "Arguments",
            "optional": false,
            "field": "params",
            "description": "<p>Any number of arguments you wish to pass on to the hook callback functions.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": " // 1. Register a hook\nActinium.Hook.register('custom-hook', (stream, context) => {\n    context['prevStream'] = { ...stream };\n    stream['foo'] = 123;\n    return Promise.resolve();\n});\n\n// 2. Create a function that implements Hook.run()\nconst myFunction = async () => {\n    const stream = { foo: 'bar' };\n\n    // Implement `custom-hook`\n    return await Hook.run('custom-hook', stream).then(context => {\n        return { context, stream };\n    });\n};\n\n// 3. Results of myFunction() -> {Promise}\n{\n    context: {\n        hook: 'custom-hook',\n        prevStream: {\n            foo: 'bar',\n        },\n    },\n    stream: {\n        foo: 123\n    },\n}",
        "type": "json"
      }
    ],
    "filename": "src/app/documentation/hooks.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Object",
    "url": "Actinium.Hook.unregister(hookID)",
    "title": "Hook.unregister()",
    "version": "3.0.5",
    "group": "Actinium",
    "name": "Hook_unregister",
    "description": "<p>Unregister a hook callback removing it from the Hook's action sequence.</p>",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Hook.unregister('8c12574f-1dbc-496f-8125-371937acc716');",
        "type": "json"
      }
    ],
    "filename": "src/app/documentation/hooks.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Object",
    "url": "Media",
    "title": "Media",
    "version": "3.1.3",
    "group": "Actinium",
    "name": "Media",
    "description": "<p>Utilities for managing the <code>Media</code> collection.</p>",
    "filename": ".core/plugin/media/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Media.Image",
    "title": "Media.Image",
    "version": "3.1.3",
    "group": "Actinium",
    "name": "Media_Image",
    "description": "<p>Under the hood, Actinium uses <a href=\"Sharp\">https://sharp.pixelplumbing.com</a> a Node.js image processing library. You can use the API however you like in your own application.</p>",
    "filename": ".core/plugin/media/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Media.crop(url,config)",
    "title": "Media.crop",
    "version": "3.1.3",
    "group": "Actinium",
    "name": "Media_crop",
    "description": "<p>Generate a cropped version of the specified image from an <code>Actinium.File</code> object or image URL. Useful for creating thumbnails or responsive image sizes.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "prefix",
            "defaultValue": "thumbnail",
            "description": "<p>Used to prefix the new image file name.</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "url",
            "description": "<p><code>String</code> or <code>Actinium.File</code> object. The source image url. If the value is an <code>Actinium.File</code> object, the <code>Actinium.File.url()</code> value used to fetch the image.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Sharp image <a href=\"https://sharp.pixelplumbing.com/api-resize\">resize</a> options. By default, <code>width</code> and <code>height</code> are set to <code>400</code>.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "...\nconst thumbnail = await Actinium.Media.crop({\n    url: 'http://somesite/someimage.jpg',\n    options: { width: 200, height: 200 }\n});\n...",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/media/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Media.directories(search,user)",
    "title": "Media.directories",
    "version": "3.1.3",
    "group": "Actinium",
    "name": "Media_directories",
    "description": "<p>Retrieves the complete list of Media directories. Runs the <code>directory-query</code> hook allowing you to change or replace the default query. The results are reduced based on the capabilities applied to each directory and the current user request.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "search",
            "description": "<p>Search for a specific directory. Uses <code>Parse.Query.startsWith()</code> to execute the query.</p>"
          },
          {
            "group": "Parameter",
            "type": "Parse.User",
            "optional": false,
            "field": "user",
            "description": "<p>The user object.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "...\nawait Actinium.Media.directories('uploads', user);\n...",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/media/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Media.directoryDelete(directory,user)",
    "title": "Media.directoryDelete",
    "version": "3.1.3",
    "group": "Actinium",
    "name": "Media_directoryDelete",
    "description": "<p>Delete a directory from the <code>MediaDirectory</code> table.</p> <p>This will NOT delete the files within the directory.</p> <p><em>Use the <code>Media.fileDelete()</code> function for deleting a directory of files.</em></p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "directory",
            "description": "<p>The directory path.</p>"
          },
          {
            "group": "Parameter",
            "type": "Parse.User",
            "optional": false,
            "field": "user",
            "description": "<p>The user object.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "...\nawait Actinium.Media.directoryDelete('avatars', user);\n...",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/media/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Media.directorySave({capabilities,directory,objectId,options,permissions})",
    "title": "Media.directorySave",
    "version": "3.1.3",
    "group": "Actinium",
    "name": "Media_directorySave",
    "description": "<p>Create a new Media directory.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "directory",
            "description": "<p>The directory path.</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "capabilities",
            "defaultValue": "[Media.create]",
            "description": "<p>The capabilities array.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "objectId",
            "description": "<p>Used when updating an existing directory object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>The options object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "permissions",
            "description": "<p>List of permissions to apply to the directory. If empty the directory is read/write for all users.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "...\nawait Actinium.Media.directorySave({\n  directory:'avatars',\n  capabilities: ['Media.create'],\n  objectId: 'aatk324t',\n  options: { sessionToken: 'alrkgjao4tqu23qw4' },\n  permissions: [\n    { objectId: \"Lxank79qjx\", type: \"role\", permission: \"write\", name: \"super-admin\" },\n    { objectId: \"s0UJ2Hk7XC\", type: \"user\", permission: \"write\" }\n  ]\n});",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/media/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Media.fileDelete(match,user,master)",
    "title": "Media.fileDelete",
    "version": "3.1.3",
    "group": "Actinium",
    "name": "Media_fileDelete",
    "description": "<p>Delete a single file or directory containing multiple files.</p> <p>The file to search for will be matched against the following fields: <code>url, objectId, uuid, filename, directory</code></p> <p>When deleting based on <code>filename</code> or <code>directory</code> There are a couple protections built in:</p> <ol> <li>You must specify <code>useMasterKey</code> in the run <code>options</code> object.</li> <li>Only 50 files will be deleted per request.</li> </ol>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "match",
            "description": "<p>The search string.</p>"
          },
          {
            "group": "Parameter",
            "type": "Parse.User",
            "optional": false,
            "field": "user",
            "description": "<p>The user object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "master",
            "defaultValue": "false",
            "description": "<p>Use master key.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "...\nawait Actinium.Media.fileDelete('/media/uploads/some-file.jpg', user, options);\n...",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/media/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Media.fileType(params,options)",
    "title": "Media.fileType()",
    "version": "3.1.7",
    "group": "Actinium",
    "name": "Media_fileType",
    "description": "<p>Get the type of file the media object is. Returns one of: <code>IMAGE</code>, <code>VIDEO</code>, <code>AUDIO</code>, <code>FILE</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "file",
            "description": "<p>The name of the file or URL path.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "const type = Actinium.Media.fileType('something.jpg'); // type: 'IMAGE' will be returned.",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/media/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Media.files({directory,limit,page,search,user})",
    "title": "Media.files",
    "version": "3.1.3",
    "group": "Actinium",
    "name": "Media_files",
    "description": "<p>Retrieves a paginated list of <code>Media</code> objects.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "directory",
            "description": "<p>Retrieve a specific directory.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "search",
            "description": "<p>Search for a specific <code>url</code> or <code>filename</code>.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>Return the specified page of the results.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "50",
            "description": "<p>Number of objections to return per page.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "const results = Actinium.Media.files({ directory: 'uploads' });",
        "type": "json"
      },
      {
        "title": "Returns",
        "content": "{\n   files: Object,\n   directories: Array,\n   count: Number\n   page: Number,\n   pages: Number,\n   index: Number,\n   limit: Number,\n   next: Number,\n   prev: Number\n}",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/media/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Media.get(params,options)",
    "title": "Media.get()",
    "version": "3.1.7",
    "group": "Actinium",
    "name": "Media_get",
    "description": "<p>Retrieves a specific <code>Media</code> object.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>Parameters object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "params.directory",
            "description": "<p>Retrieve a file by it's directory value. You must also specify <code>filename</code>.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "params.filename",
            "description": "<p>Retrieve a file by it's filename value. You must also specify <code>directory</code>.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "params.objectId",
            "description": "<p>Retrieve a file by it's objectId value.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "params.uuid",
            "description": "<p>Retrieve a file by it's uuid value.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "params.url",
            "description": "<p>Retrieve a file by it's url value.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "options",
            "description": "<p>The Parse options object.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Media.get({ objectId: 'nr3NEdj13R'});",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/media/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Media.load()",
    "title": "Media.load",
    "version": "3.1.3",
    "group": "Actinium",
    "name": "Media_load",
    "description": "<p>Query the Media collection and load the results in memory.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "...\nawait Actinium.Media.load();\n...",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/media/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Media.update(data,options)",
    "title": "Media.upload",
    "version": "3.1.3",
    "group": "Actinium",
    "name": "Media_update",
    "description": "<p>Function that updates a Media Object.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>The Media Object data to update.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": ".objectId",
            "description": "<p>The <code>objectId</code> field is required and is used to fetch the Media Object to update.</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": ".filedata",
            "description": "<p>If you're trying replace the <code>file</code> object via dataurl, you can pass the <code>filedata</code> property to accomplish this.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse options object.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "const updatedMediaObj = await Media.update({\n    objectId: 'tP66wMkNPx',\n    filename: 'different-file-name.jpg',\n    meta: {\n        title: 'A new title',\n        description: 'A new decription',\n    }\n}, {\n    useMasterKey: true,\n});",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/media/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Media.upload(data,meta,user,options)",
    "title": "Media.upload",
    "version": "3.1.3",
    "group": "Actinium",
    "name": "Media_upload",
    "description": "<p>Function that creates a file and adds it to the Media Library.</p> <p>Returns: <code>Actinium.Object('Media')</code></p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "data",
            "description": "<p>The contents of the file. This can be any valid <code>Actinium.File</code> file data value.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "meta",
            "description": "<p>The meta object for the file upload.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": ".directory",
            "description": "<p>The directory where the file will be saved. Required.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": ".filename",
            "description": "<p>The file name. Required.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": ".size",
            "description": "<p>The number of bytes the file contains.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": ".ID",
            "description": "<p>Unique ID of the file. If empty, a new UUID will be created.</p>"
          },
          {
            "group": "Parameter",
            "type": "Parse.User",
            "optional": false,
            "field": "user",
            "description": "<p>The user object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>The options object.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Base64 Example:",
        "content": "...\nconst data = { base64: \"V29ya2luZyBhdCBQYXJzZSBpcyBncmVhdCE=\" };\nconst meta = {\n    directory: 'uploads',\n    filename: 'some-file.jpg',\n    size: 128093,\n    other: 'meta values...',\n};\n\nconst file = await Actinium.Media.upload(data, meta, user, options);\n...",
        "type": "json"
      },
      {
        "title": "ByteArray Example:",
        "content": "...\nconst data = [ 0xBE, 0xEF, 0xCA, 0xFE ];\nconst meta = {\n    directory: 'uploads',\n    filename: 'some-file.jpg',\n    size: 128093,\n    other: 'meta values...',\n};\n\nconst file = await Actinium.Media.upload(data, meta, user, options);\n...",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/media/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Object",
    "url": "Actinium.Middleware",
    "title": "Middleware",
    "version": "3.1.0",
    "name": "Middleware",
    "group": "Actinium",
    "description": "<p>Create or replace Express middleware.</p>",
    "filename": "src/app/documentation/middleware.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Object",
    "url": "Actinium.Middleware.register(id,callback,order)",
    "title": "Middleware.register()",
    "version": "3.1.0",
    "group": "Actinium",
    "name": "Middleware_register",
    "description": "<p>Register middleware to be executed when the app initializes.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The uniq identifier for the middleware.</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "callback",
            "description": "<p>The middleware function. Must return a <code>{Promise}</code>.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "order",
            "defaultValue": "100",
            "description": "<p>The sort index for the middleware. Used to prioritize certain middleware above others.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "// Middleware to create a custom router handler for `/sample`\n\nconst express = require('express');\n\nActinium.Middleware.register(\n    'sample',\n    app => {\n        const router = express.Router();\n        router.get('/sample', (req, res) => {\n            res.send('hello bruh!');\n        });\n\n        app.use(router);\n\n        return Promise.resolve();\n    },\n    100000,\n);",
        "type": "json"
      }
    ],
    "filename": "src/app/documentation/middleware.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Object",
    "url": "Actinium.Middleware.replace(id,callback)",
    "title": "Middleware.replace()",
    "version": "3.1.0",
    "group": "Actinium",
    "name": "Middleware_replace",
    "description": "<p>Replace exsisting middleware.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The uniq identifier for the middleware.</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "callback",
            "description": "<p>The middleware function. Must return a <code>{Promise}</code>.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": " // Replace the 'sample' middleware\n\nconst express = require('express');\n\nActinium.Middleware.replace(\n    'sample',\n    app => {\n        const router = express.Router();\n        router.get('/sample', (req, res) => {\n            res.send('hello bro!');\n        });\n\n        app.use(router);\n\n        return Promise.resolve();\n    }\n );",
        "type": "json"
      }
    ],
    "filename": "src/app/documentation/middleware.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Object",
    "url": "Actinium.Middleware.unregister(id)",
    "title": "Middleware.unregister()",
    "version": "3.1.0",
    "group": "Actinium",
    "name": "Middleware_unregister",
    "description": "<p>Unegister middleware. Used to disable a middleware from executing.</p>",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Middleware.unregister('docs');",
        "type": "json"
      }
    ],
    "filename": "src/app/documentation/middleware.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Object",
    "url": "Actinium.User",
    "title": "User",
    "group": "Actinium",
    "version": "3.0.3",
    "description": "<p>Set of functions to interact with the User collection.</p>",
    "filename": ".core/plugin/users/sdk.js",
    "groupTitle": "Actinium",
    "name": "ObjectActiniumUser"
  },
  {
    "type": "Object",
    "url": "Actinium.Plugin",
    "title": "Plugin",
    "version": "3.0.5",
    "group": "Actinium",
    "name": "Plugin",
    "description": "<p>Define plugins that extend Actinium functionality.</p>",
    "filename": ".core/lib/plugable.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Plugin.activate(ID)",
    "title": "Plugin.activate()",
    "version": "3.0.5",
    "group": "Actinium",
    "name": "Plugin_activate",
    "description": "<p>Programmatically activate a plugin.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The ID of the plugin.</p>"
          }
        ],
        "Returns": [
          {
            "group": "Returns",
            "type": "Promise",
            "optional": false,
            "field": "plugin",
            "description": "<p>Returns a promise containing the activated plugin <code>{Object}</code>.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "const myFunction = async () => {\n    const plugin = await Actinium.Plugin.activate('TEST-PLUGIN');\n\n    if (plugin) {\n        console.log(plugin.ID, 'activated');\n    }\n};",
        "type": "json"
      }
    ],
    "filename": ".core/lib/plugable.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Plugin.addLogo(ID,filePath,app)",
    "title": "Plugin.addLogo()",
    "version": "3.5.5",
    "group": "Actinium",
    "name": "Plugin_addLogo",
    "description": "<p>Register a logo image for your plugin at plugin activation. This calls Plugin.addMetaAsset() with assetURL of <code>logoURL</code>. See <code>Plugin.addMetaAsset()</code> for more information. Actinium admin (a Reactium instance) will automatically load logoURLs found for active actinium plugins. This logo image will represent your plugin in the plugin manager.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Unique identifier for the plugin provided to <code>Actinium.Plugin.register()</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "filePath",
            "description": "<p>Full path to file asset to attach to the plugin.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "app",
            "defaultValue": "admin",
            "description": "<p>the application prefix for the asset object path</p>"
          }
        ]
      }
    },
    "filename": ".core/lib/plugable.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Plugin.addMetaAsset(ID,filePath,assetObjectPath)",
    "title": "Plugin.addMetaAsset()",
    "version": "3.5.5",
    "group": "Actinium",
    "name": "Plugin_addMetaAsset",
    "description": "<p>Register an asset to the Parse file API and store the URL in your plugin meta object. Example usage, for providing a browser js script, a css file, or a plugin manager logo image. This is generally called after you have called <code>Actinium.Plugin.register()</code> to register your plugin, and the assets will be added to your plugin on plugin <code>activation</code> hook.</p> <p>Before your asset is stored, and the URL created, you will have an opportunity to change the targetFileName, when the <code>add-meta-asset</code> hook is called. For example the S3 file adapter plugin automatically adds the plugin version or Actinium version to asset filename (and URL) so that the correct asset is cached in your S3 bucket.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Unique identifier for the plugin provided to <code>Actinium.Plugin.register()</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "filePath",
            "description": "<p>Full path to file asset to attach to the plugin.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "assetObjectPath",
            "defaultValue": "assetURL",
            "description": "<p>string (object path relative to plugin.meta) to store in plugin meta the file URL for the asset. e.g. by default your file URL will be found at <code>plugin.meta.assets.admin.assetURL</code> object path.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "example-plugin.js",
        "content": "// A plugin object, see Actinium.Plugin.register() for more information.\nconst PLUGIN = {\n  ID: 'Example',\n  name: 'Example Plugin',\n  description: 'A generic plugin',\n  version: {\n      plugin: 0.0.1,\n      actinium: 3.1.6,\n  },\n};\n\nActinium.Plugin.register(PLUGIN);\n\n// all these execute on `activation` hook of your plugin\n// addLogo uses addMetaAsset with assetObjectPath='logoURL'\nActinium.Plugin.addLogo(\n    PLUGIN.ID,\n    path.resolve(__dirname, 'plugin-assets/reset-logo.svg'),\n);\n// addLogo uses addMetaAsset with assetObjectPath='scriptURL'\nActinium.Plugin.addScript(\n    PLUGIN.ID,\n    path.resolve(__dirname, 'plugin-assets/reset.js'),\n);\n// addLogo uses addMetaAsset with assetObjectPath='styleURL'\nActinium.Plugin.addStylesheet(\n    PLUGIN.ID,\n    path.resolve(__dirname, 'plugin-assets/reset-plugin.css'),\n);\nActinium.Plugin.addMetaAsset(PLUGIN.ID, 'plugin-assets/worker.js', 'webworkerURL');",
        "type": "json"
      },
      {
        "title": "add-meta-asset-hook-example.js",
        "content": "const path = require('path');\n\n// The full object passed to the `add-meta-asset` is:\n// {\n//     ID, // the plugin id\n//     filePath, // the path to the file to be attached\n//     objectPath, // the meta object path to store the URL (default 'meta.assetURL', 'meta.scriptURL', 'meta.style.URL', 'meta.logoURL')\n//     targetPath, // the target file URI (default plugins/PLUGIN.ID)\n//     targetFileName, // the target file name (default basename of filePath)\n//}\nActinium.Hook.register('add-meta-asset', async metaAsset => {\n    const parsedFilename = path.parse(metaAsset.targetFileName);\n    // get plugin object\n    const plugin = Actinium.Cache.get(`plugins.${metaAsset.ID}`);\n    const version = op.get(plugin, 'version');\n    const { name, ext } = parsedFilename;\n\n    // put the plugin version in the target filename\n    metaAsset.targetFileName = `${name}-${version}${ext}`;\n});",
        "type": "json"
      }
    ],
    "filename": ".core/lib/plugable.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Plugin.addScript(ID,filePath,app)",
    "title": "Plugin.addScript()",
    "version": "3.5.5",
    "group": "Actinium",
    "name": "Plugin_addScript",
    "description": "<p>Register a front-end Reactium plugin script asset for your plugin. This calls Plugin.addMetaAsset() with assetURL of <code>scriptURL</code>. See <code>Plugin.addMetaAsset()</code> for more information. Actinium admin (a Reactium instance) will automatically load scriptURLs found for active actinium plugins. In this way, you can publish plugin code to the Actinium admin.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Unique identifier for the plugin provided to <code>Actinium.Plugin.register()</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "filePath",
            "description": "<p>Full path to file asset to attach to the plugin.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "app",
            "defaultValue": "admin",
            "description": "<p>the application prefix for the asset object path</p>"
          }
        ]
      }
    },
    "filename": ".core/lib/plugable.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Plugin.addStylesheet(ID,filePath,app)",
    "title": "Plugin.addStylesheet()",
    "version": "3.5.5",
    "group": "Actinium",
    "name": "Plugin_addStylesheet",
    "description": "<p>Register a front-end Reactium plugin script asset for your plugin. This calls Plugin.addMetaAsset() with assetURL of <code>styleURL</code>. See <code>Plugin.addMetaAsset()</code> for more information. Actinium admin (a Reactium instance) will automatically load styleURLs found for active actinium plugins. In this way, you can publish styles for your plugin to be used when your plugin is active in the Actinium admin.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Unique identifier for the plugin provided to <code>Actinium.Plugin.register()</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "filePath",
            "description": "<p>Full path to file asset to attach to the plugin.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "app",
            "defaultValue": "admin",
            "description": "<p>the application prefix for the asset object path</p>"
          }
        ]
      }
    },
    "filename": ".core/lib/plugable.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Plugin.deactivate(ID)",
    "title": "Plugin.deactivate()",
    "version": "3.0.5",
    "group": "Actinium",
    "name": "Plugin_deactivate",
    "description": "<p>Programmatically deactivate a plugin.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The ID of the plugin.</p>"
          }
        ],
        "Returns": [
          {
            "group": "Returns",
            "type": "Promise",
            "optional": false,
            "field": "plugin",
            "description": "<p>Returns a promise containing the deactivated plugin <code>{Object}</code>.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "const myFunction = async () => {\n    const plugin = await Actinium.Plugin.deactivate('TEST-PLUGIN');\n\n    if (plugin) {\n        console.log(plugin.ID, 'deactivated');\n    }\n};",
        "type": "json"
      }
    ],
    "filename": ".core/lib/plugable.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Plugin.get()",
    "title": "Plugin.get()",
    "version": "3.0.5",
    "group": "Actinium",
    "name": "Plugin_get",
    "description": "<p>Get the list of plugins.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "id",
            "description": "<p>Retrieves only the specified plugin.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage: All",
        "content": "Actinium.Plugin.get();\n\n// Returns {Array}\n[\n    {\n        ID: 'TEST-PLUGIN',\n        description: 'This is my plugin to test if this shit works',\n        name: 'My Awesome Test Plugin',\n        order: 100,\n        version: {\n            actinium: '>=3.0.5',\n            plugin: '0.0.1',\n        },\n    }\n ]",
        "type": "json"
      },
      {
        "title": "Example Usage: Single",
        "content": "Actinium.Plugin.get('TEST-PLUGIN');\n\n// Returns {Object}\n{\n    ID: 'TEST-PLUGIN',\n    description: 'This is my plugin to test if this shit works',\n    name: 'My Awesome Test Plugin',\n    order: 100,\n    version: {\n        actinium: '>=3.0.5',\n        plugin: '0.0.1',\n    },\n}",
        "type": "json"
      }
    ],
    "filename": ".core/lib/plugable.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Plugin.isActive(ID)",
    "title": "Plugin.isActive()",
    "version": "3.0.5",
    "group": "Actinium",
    "name": "Plugin_isActive",
    "description": "<p>Determine if a plugin is active.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The ID of the plugin.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Plugin.isActive('TEST-PLUGIN');\n\n// Returns {Boolean}",
        "type": "json"
      }
    ],
    "filename": ".core/lib/plugable.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Plugin.isValid(ID,strict)",
    "title": "Plugin.isValid()",
    "version": "3.0.5",
    "group": "Actinium",
    "name": "Plugin_isValid",
    "description": "<p>Determine if a plugin is valid.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The ID of the plugin.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "strict",
            "defaultValue": "false",
            "description": "<p>If <code>true</code> the plugin must also be active.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Plugin.isValid('TEST-PLUGIN', true);\n\n// Returns {Boolean}",
        "type": "json"
      }
    ],
    "filename": ".core/lib/plugable.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Plugin.register(Plugin,active)",
    "title": "Plugin.register()",
    "version": "3.0.5",
    "group": "Actinium",
    "name": "Plugin_register",
    "description": "<p>Register a plugin object.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "Plugin",
            "description": "<p>The plugin object to register.</p>"
          },
          {
            "group": "Parameter",
            "type": "Active",
            "optional": true,
            "field": "active",
            "defaultValue": "false",
            "description": "<p>The default active state of plugin.</p>"
          }
        ],
        "Plugin": [
          {
            "group": "Plugin",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Unique identifier for the plugin. If the ID has already been defined, it will be overwritten with the current plugin object.</p>"
          },
          {
            "group": "Plugin",
            "type": "String",
            "optional": true,
            "field": "description",
            "description": "<p>Summary of the plugin used when displaying the plugin list. The description can use markdown formatting.</p>"
          },
          {
            "group": "Plugin",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>Common name for the plugin used when displaying the plugin list.</p>"
          },
          {
            "group": "Plugin",
            "type": "Number",
            "optional": true,
            "field": "order",
            "defaultValue": "100",
            "description": "<p>The sort order of the plugin used when establishing the initial loading order of the plugins.</p>"
          },
          {
            "group": "Plugin",
            "type": "Object",
            "optional": false,
            "field": "version",
            "description": "<p>Version information of the plugin.</p>"
          },
          {
            "group": "Plugin",
            "type": "String",
            "optional": false,
            "field": ".actinium",
            "description": "<p>The <a href=\"https://www.npmjs.com/package/semver#ranges\">semver</a> range of Actinium the plugin can work with.</p>"
          },
          {
            "group": "Plugin",
            "type": "String",
            "optional": false,
            "field": ".plugin",
            "description": "<p>The version of the plugin.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Plugin.register({\n   ID: 'TEST-PLUGIN',\n   description: 'This is my plugin to test if this shit works',\n   name: 'My Awesome Test Plugin',\n   order: 100,\n   version: {\n       actinium: '>=3.0.5',\n       plugin: '0.0.1',\n   },\n});",
        "type": "json"
      }
    ],
    "filename": ".core/lib/plugable.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Object",
    "url": "Actinium.Pulse",
    "title": "Pulse",
    "version": "3.0.3",
    "name": "Pulse",
    "group": "Actinium",
    "description": "<p>Pulse allows you to schedule tasks in Actinium using full <a href=\"http://www.nncron.ru/help/EN/working/cron-format.htm\">crontab</a> syntax.</p>",
    "filename": "src/app/documentation/pulse.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Pulse.define(id,params,options,callback)",
    "title": "Pulse.define()",
    "version": "3.0.3",
    "group": "Actinium",
    "name": "Pulse_define",
    "description": "<p>Define and scheudle a Pulse cron job.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the cron job.</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": true,
            "field": "params",
            "description": "<p>If the value is an <code>{Object}</code>, the value will be passed to the callback function excluding the <code>schedule</code> and <code>order</code> parameters.</p> <p>If the value is a <code>{String}</code>, the value will be used as the crontab schedule value.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "params.schedule",
            "defaultValue": "* * * * *",
            "description": "<p>The crontab syntax for job scheduling.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "params.order",
            "defaultValue": "100",
            "description": "<p>The index of the job. Used to prioritize jobs. The lower the value the higher the priority.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "options",
            "description": "<p>Optional configuration for job scheduling.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "options.scheduled",
            "defaultValue": "true",
            "description": "<p>A boolean to set if the created task is schaduled.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "options.timezone",
            "description": "<p>The timezone that is used for job scheduling.</p> <p>Example: <code>America/Sao_Paulo</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Promise",
            "optional": false,
            "field": "callback",
            "description": "<p>Function to execute when the job is run. The <code>params</code> object will be passed to the callback function. Your callback function should return a promise.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "// 1. Log the current timestamp every minute.\nActinium.Pulse.define('timestamp', () => {\n  console.log(Date.now());\n});\n\n// 2. Log the current timestamp at 5 minutes into the hour.\nActinium.Pulse.define('timestamp', '5 * * * *', () => {\n  console.log(Date.now());\n});\n\n// 3. Say Hello every 5 seconds then wait for 30 seconds before restarting.\nActinium.Pulse.define(\n  'hello',\n  {\n    schedule: '0,5,10,15,20,25,30 * * * * *',\n    name: 'Todd'\n  },\n  ({ name }) => console.log(`Hello ${name}`)\n);\n\n// 4. Create a job but don't start it.\nActinium.Pulse.define('timestamp', '* * * * *', { scheduled: false }, () => {\n  console.log(Date.now());\n});",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Returns:",
          "content": "{\n      id: '{String} id of the job',\n      order: '{Number} The index of the job.'\n      task: {\n          start: '{Function} Starts the scheduled task.',\n          stop: '{Function} Stops the scheduled task. You will be able to restart the task.',\n          destroy: '{Function} Stops and destroys the task. You will not be able to restart the task.'\n      },\n      warn: '{String} Warning message indicating if the task has already been defined.'\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/app/documentation/pulse.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Array",
    "url": "Actinium.Pulse.definitions",
    "title": "Pulse.definitions",
    "version": "3.0.3",
    "group": "Actinium",
    "name": "Pulse_definitions",
    "description": "<p>List of defined Pulse cron jobs.</p>",
    "filename": "src/app/documentation/pulse.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Pulse.log(id,status,params,user)",
    "title": "Pulse.log()",
    "version": "3.0.3",
    "group": "Actinium",
    "name": "Pulse_log",
    "description": "<p>Manually log activity related to a job.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the cron job.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>The status you wish to log.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "params",
            "description": "<p>Key value pairs of additional data to log.</p>"
          },
          {
            "group": "Parameter",
            "type": "User",
            "optional": true,
            "field": "user",
            "description": "<p>Parse.User object who the cron job is acting on the behalf of.</p>"
          }
        ]
      }
    },
    "filename": "src/app/documentation/pulse.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Pulse.remove(id)",
    "title": "Pulse.remove()",
    "version": "3.0.3",
    "group": "Actinium",
    "name": "Pulse_remove",
    "description": "<p>Remove a Pulse cron job. If the task is duplicated, all instances are removed.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the cron job.</p>"
          }
        ]
      }
    },
    "filename": "src/app/documentation/pulse.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Pulse.replace(id,params,options,callback)",
    "title": "Pulse.replace()",
    "version": "3.0.3",
    "group": "Actinium",
    "name": "Pulse_replace",
    "description": "<p>Place a Pulse cron job. If the task is duplicated, all instances are removed and replaced with the newly defined task. See <a href=\"#api-Actinium-Pulse_define\">Pulse.define()</a> for deatils.</p>",
    "filename": "src/app/documentation/pulse.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Pulse.start(id)",
    "title": "Pulse.start()",
    "version": "3.0.3",
    "group": "Actinium",
    "name": "Pulse_start",
    "description": "<p>Start a Pulse cron job. If the task is duplicated, all instances are started.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the cron job.</p>"
          }
        ]
      }
    },
    "filename": "src/app/documentation/pulse.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Pulse.stop(id)",
    "title": "Pulse.stop()",
    "version": "3.0.3",
    "group": "Actinium",
    "name": "Pulse_stop",
    "description": "<p>Stop a Pulse cron job. If the task is duplicated, all instances are stoped.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the cron job.</p>"
          }
        ]
      }
    },
    "filename": "src/app/documentation/pulse.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronus",
    "url": "Actinium.Recycle",
    "title": "Recycle",
    "version": "3.1.7",
    "name": "Recycle",
    "group": "Actinium",
    "description": "<p>Recycle allows you to temporarily store a <code>Actinium.Object</code> and is useful for archiving and creating revisions of collection data.</p>",
    "filename": ".core/plugin/recycle/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronus",
    "url": "Actinium.Recycle.archive(params,options)",
    "title": "Recycle.archive()",
    "version": "3.1.7",
    "group": "Actinium",
    "name": "Recycle_archive",
    "description": "<p>Move a <code>Actinium.Object</code> to the <code>Recycle</code> collection and mark it as an <code>archve</code> type.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>Parameters object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "params.collection",
            "description": "<p>The Actinium.Object type.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params.object",
            "description": "<p>The Actinium.Object data.</p>"
          },
          {
            "group": "Parameter",
            "type": "Actinium.User",
            "optional": true,
            "field": "params.user",
            "description": "<p>The Actinium.User object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse options object.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Recycle.archive({\n  collection: '_User',\n  object: MyUserObject,\n});",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/recycle/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronus",
    "url": "Actinium.Recycle.purge(params,options)",
    "title": "Recycle.purge()",
    "version": "3.1.7",
    "group": "Actinium",
    "name": "Recycle_purge",
    "description": "<p>Clear the <code>Recycle</code> collection.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>Parameters object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "params.collection",
            "description": "<p>Purge specific collection objects.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "params.objectId",
            "description": "<p>Delete a specific collection object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "params.type",
            "description": "<p>Delete a specific type of Recycle objects. Valid options: <code>archive</code>, <code>delete</code>, <code>revision</code>.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse options object.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Recycle.purge({ collection: '_User' });",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/recycle/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronus",
    "url": "Actinium.Recycle.restore(params,options)",
    "title": "Recycle.restore()",
    "version": "3.1.7",
    "group": "Actinium",
    "name": "Recycle_restore",
    "description": "<p>Restore a <code>Actinium.Object</code> to it's original collection.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>Parameters object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "params.collection",
            "description": "<p>Restore the most recent specified collection object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "params.objectId",
            "description": "<p>Restore a specific collection object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse options object.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Recycle.restore({ object: 'atlk2wat88' });",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/recycle/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronus",
    "url": "Actinium.Recycle.retrieve(params,options)",
    "title": "Recycle.retrieve()",
    "version": "3.1.7",
    "group": "Actinium",
    "name": "Recycle_retrieve",
    "description": "<p>Retrieve a paginated list of <code>Recycle</code> objects.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>Parameters object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "params.collection",
            "description": "<p>Retrieve specific collection objects.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "params.page",
            "defaultValue": "1",
            "description": "<p>The results page to return.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "params.limit",
            "defaultValue": "1000",
            "description": "<p>The number of results to return per page.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "params.objectId",
            "description": "<p>Retrieve a specific Recycle object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "params.type",
            "description": "<p>Retrieve a specific type of Recycle objects. Valid options: <code>archive</code>, <code>delete</code>, <code>revision</code>.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse options object.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Recycle.retrieve({ collection: '_User' });",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/recycle/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronus",
    "url": "Actinium.Recycle.revision(params,options)",
    "title": "Recycle.revision()",
    "version": "3.1.7",
    "group": "Actinium",
    "name": "Recycle_revision",
    "description": "<p>Move a <code>Actinium.Object</code> to the <code>Recycle</code> collection and mark it as a <code>revision</code> type.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>Parameters object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "params.collection",
            "description": "<p>The Actinium.Object type.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params.object",
            "description": "<p>The Actinium.Object data.</p>"
          },
          {
            "group": "Parameter",
            "type": "Actinium.User",
            "optional": true,
            "field": "params.user",
            "description": "<p>The Actinium.User object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse options object.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Recycle.revision({\n  collection: 'SomeCollection',\n  object: SomeObject,\n});",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/recycle/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronus",
    "url": "Actinium.Recycle.trash(params,options)",
    "title": "Recycle.trash()",
    "version": "3.1.7",
    "group": "Actinium",
    "name": "Recycle_trash",
    "description": "<p>Move a <code>Actinium.Object</code> to the <code>Recycle</code> collection and mark it as a <code>delete</code> type.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>Parameters object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "params.collection",
            "description": "<p>The Actinium.Object type.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params.object",
            "description": "<p>The Actinium.Object data.</p>"
          },
          {
            "group": "Parameter",
            "type": "Actinium.User",
            "optional": true,
            "field": "params.user",
            "description": "<p>The Actinium.User object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse options object.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Recycle.trash({\n  collection: 'SomeCollection',\n  object: SomeObject,\n});",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/recycle/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Object",
    "url": "Registry",
    "title": "Registry",
    "group": "Actinium",
    "name": "Registry",
    "description": "<p>Actinium uses a number of registry objects used to register all sorts of objects that will be used elsewhere in the framework. New registry objects are generally instanciated as singletons on the overall SDK.</p> <p>There are many registry objects attached by default to the SDK, and developers can create new ones using <code>Utils.registryFactory()</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "list",
            "description": "<p>{Getter} get list of most recent (or highest order) registered objects, filtering out unregistered or banned objects.</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "registered",
            "description": "<p>{Getter} get list of all historically registrated objects, even duplicates, ordered by order property of object (defaults to 100).</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "protected",
            "description": "<p>{Getter} get list of protected registrations ids</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "unregistered",
            "description": "<p>{Getter} get list of all existing registered objects ids that have been subsequently unregistered.</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "banned",
            "description": "<p>{Getter} get list of all banned objects ids.</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "mode",
            "description": "<p>{Getter} get current mode (Default Utils.Registry.MODES.HISTORY)</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "isProtected",
            "description": "<p>{Method} pass the identifier of an object to see if it has been protected</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "isRegistered",
            "description": "<p>{Method} pass the identifier of an object to see if it has been registered</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "isBanned",
            "description": "<p>{Method} pass the identifier of an object to see if it has been banned</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "ban",
            "description": "<p>{Method} pass the identifier of an object to ban. Banned objects can not be registered and will not be show in list. Useful when you have code that needs to preempt the registration of an object from code you do not control. E.g. a plugin is introducing undesireable or disabled functionality</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "cleanup",
            "description": "<p>{Method} pass the identifier of an object to be purged from historical registrations (i.e. free up memory) Automatically performed in mode Utils.Registry.CLEAN</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "protect",
            "description": "<p>{Method} pass the identifier of an object to protect. Protected objects can not be overridden or cleaned up.</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "register",
            "description": "<p>{Method} pass an identifier and a data object to register the object. The identifier will be added if it is not already registered (but protected) and not banned.</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "unprotect",
            "description": "<p>{Method} pass an identifier to unprotect an object</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "unregister",
            "description": "<p>{Method} pass an identifier to unregister an object. When in HISTORY mode (default), previous registration will be retained, but the object will not be listed. In CLEAN mode, the previous registrations will be removed, unless protected.</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "flush",
            "description": "<p>{Method} clear all registrations. Resets registry to newly constructed state.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": ".core/lib/utils/registry.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Object",
    "url": "Actinium.Roles",
    "title": "Roles",
    "version": "3.1.2",
    "name": "Roles",
    "group": "Actinium",
    "description": "<p>A Role defines a set of permissions a user assigned the role is allowed to have.</p> <p>Actinium has 6 default roles:</p> <table> <thead> <tr> <th style=\"text-align:left\">Role</th> <th style=\"text-align:left\">ID</th> <th style=\"text-align:right\">Level</th> </tr> </thead> <tbody> <tr> <td style=\"text-align:left\">Banned User</td> <td style=\"text-align:left\">banned</td> <td style=\"text-align:right\">-1</td> </tr> <tr> <td style=\"text-align:left\">Standard User</td> <td style=\"text-align:left\">user</td> <td style=\"text-align:right\">1</td> </tr> <tr> <td style=\"text-align:left\">Contributor</td> <td style=\"text-align:left\">contributor</td> <td style=\"text-align:right\">10</td> </tr> <tr> <td style=\"text-align:left\">Moderator</td> <td style=\"text-align:left\">moderator</td> <td style=\"text-align:right\">100</td> </tr> <tr> <td style=\"text-align:left\">Administrator</td> <td style=\"text-align:left\">administrator</td> <td style=\"text-align:right\">1000</td> </tr> <tr> <td style=\"text-align:left\">Super Admin</td> <td style=\"text-align:left\">super-admin</td> <td style=\"text-align:right\">10000</td> </tr> </tbody> </table> <h2>Banned User</h2> <p>By default Banned users have zero capabilities and can no longer log in and manage their account. When using the role, you should also remove other roles to ensure that all role-based constraints are applied to the user.</p> <h2>Standard User</h2> <p>By default Standard Users have limited read capabilities of collections and can manage their own profile information.</p> <h2>Contributor</h2> <p>By default Contributors have read/write capabilities of collection content they have created.</p> <h2>Moderator</h2> <p>By default Moderators have read/write capabilities of collection content they have created and those of other Moderators and Contributors.</p> <h2>Administrator</h2> <p>By default Administrators have all default capabilities and any other defined capability unless they are expressly excluded from the capability. Administrators have control of all other roles except Super Admins.</p> <h2>Super Admin</h2> <p>By default Super Admins have all capabilities and complete control over all other roles.</p>",
    "filename": "src/app/documentation/roles.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Roles.User.add(user,role,options)",
    "title": "Roles.User.add()",
    "version": "3.1.2",
    "group": "Actinium",
    "name": "Roles_User_add",
    "description": "<p>Add a user to a role. Returns a <code>{Promise}</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>The user id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>The role id.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "options",
            "description": "<p>The Cloud Code options object. Used to determine if the current user can administer the role.</p>"
          }
        ],
        "Options": [
          {
            "group": "Options",
            "type": "String",
            "optional": true,
            "field": "sessionToken",
            "description": "<p>The session token of the current user.</p>"
          },
          {
            "group": "Options",
            "type": "Boolean",
            "optional": true,
            "field": "useMasterKey",
            "defaultValue": "true",
            "description": "<p>Bypass permissions and use the master key to</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Roles.User.add('kVI6HLSl', 'banned', { sessionToken: 'hQJsmKrGFgvbtyieHr8mvDfAx7X3wewS' });\nActinium.Roles.User.add('yg8yIUql', 'super-admin', { useMasterKey: true });",
        "type": "json"
      }
    ],
    "filename": "src/app/documentation/roles.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Roles.User.get(user)",
    "title": "Roles.User.get()",
    "version": "3.1.2",
    "group": "Actinium",
    "name": "Roles_User_get",
    "description": "<p>Retrieves roles of the specified user.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>The user id or username.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Roles.User.get('SuperAdmin');",
        "type": "json"
      },
      {
        "title": "Returns",
        "content": "{\n    \"super-admin\": 10000\n}",
        "type": "json"
      }
    ],
    "filename": "src/app/documentation/roles.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Roles.User.is(user,role)",
    "title": "Roles.User.is()",
    "version": "3.1.2",
    "group": "Actinium",
    "name": "Roles_User_is",
    "description": "<p>Check if a user is a member of a specific role. Returns <code>{Boolean}</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>The user id or username.</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "role",
            "description": "<p>The role name or level.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Roles.User.is('SuperAdmin', 'super-admin');\nActinium.Roles.User.is('SuperAdmin', 10000);\n// Returns true",
        "type": "json"
      }
    ],
    "filename": "src/app/documentation/roles.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Roles.User.remove(user,role,options)",
    "title": "Roles.User.remove()",
    "version": "3.1.2",
    "group": "Actinium",
    "name": "Roles_User_remove",
    "description": "<p>Remove a user from a role. Returns a <code>{Promise}</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>The user id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>The role id.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "options",
            "description": "<p>The Cloud Code options object. Used to determine if the current user can administer the role.</p>"
          }
        ],
        "Options": [
          {
            "group": "Options",
            "type": "String",
            "optional": true,
            "field": "sessionToken",
            "description": "<p>The session token of the current user.</p>"
          },
          {
            "group": "Options",
            "type": "Boolean",
            "optional": true,
            "field": "useMasterKey",
            "defaultValue": "true",
            "description": "<p>Bypass permissions and use the master key to</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Roles.User.remove('kVI6HLSl', 'banned', { sessionToken: 'hQJsmKrGFgvbtyieHr8mvDfAx7X3wewS' });",
        "type": "json"
      }
    ],
    "filename": "src/app/documentation/roles.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Roles.capabilities(role)",
    "title": "Roles.capabilities()",
    "version": "3.1.2",
    "group": "Actinium",
    "name": "Roles_capabilities",
    "description": "<p><em>Alias of <a href=\"#api-Actinium-Capabilities_Role_get\">Actinium.Capabilities.Role.get()</a></em></p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>The role name.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": " Actinium.Roles.capabilities('super-admin');\n // Retuns array of capabilities\n [\n    'user.view',\n    'user.create',\n    'user.edit',\n    'user.delete',\n    'user.ban',\n    'plugin.view',\n    'plugin.activate',\n    'plugin.deactivate'\n]",
        "type": "json"
      }
    ],
    "filename": "src/app/documentation/roles.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Roles.create(role,options)",
    "title": "Roles.create()",
    "version": "3.1.2",
    "group": "Actinium",
    "name": "Roles_create",
    "description": "<p>Create a new <code>Parse.Role</code> object. Returns a <code>{Promise}</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "role",
            "description": "<p>The new role to create.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "options",
            "description": "<p>The Cloud Code options object. Used to determine if the current user can administer the role.</p>"
          }
        ],
        "Options": [
          {
            "group": "Options",
            "type": "String",
            "optional": true,
            "field": "sessionToken",
            "description": "<p>The session token of the current user.</p>"
          },
          {
            "group": "Options",
            "type": "Boolean",
            "optional": true,
            "field": "useMasterKey",
            "defaultValue": "true",
            "description": "<p>Bypass permissions and use the master key to</p>"
          }
        ],
        "Role": [
          {
            "group": "Role",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The unique name of the role. This is how you identify the role in code.</p>"
          },
          {
            "group": "Role",
            "type": "String",
            "optional": false,
            "field": "label",
            "description": "<p>The readable label of the role. Used when listing details about the role.</p>"
          },
          {
            "group": "Role",
            "type": "Number",
            "optional": false,
            "field": "level",
            "description": "<p>The numeric value of the role. Used when doing broad evaluations.</p>"
          },
          {
            "group": "Role",
            "type": "Array",
            "optional": false,
            "field": "roles",
            "description": "<p>Array of role names that this role inherits.</p>"
          },
          {
            "group": "Role",
            "type": "Array",
            "optional": false,
            "field": "acl",
            "description": "<p>Array of role names that can administer the new role.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Roles.create(\n    {\n        name: 'subscriber',\n        label: 'Subscriber',\n        level: 5,\n        roles: ['user'],\n        acl: ['administrator', 'super-admin'],\n    },\n    {\n        sessionToken: 'hQJsmKrGFgvbtyieHr8mvDfAx7X3wewS'\n    }\n);",
        "type": "json"
      }
    ],
    "filename": "src/app/documentation/roles.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Roles.get(search)",
    "title": "Roles.get()",
    "version": "3.1.2",
    "group": "Actinium",
    "name": "Roles_get",
    "description": "<p>Retrieves the specified role. If no role search is specified, all roles are returned.</p>",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Roles.get(1000); // Returns the Administrator role.\nActinium.Roles.get('super-admin'); // Returns the Super Admin role.\nActinium.Roles.get(); // Returns all role objects;",
        "type": "json"
      },
      {
        "title": "Returns",
        "content": "{\n   \"super-admin\":{\n      \"name\":\"super-admin\",\n      \"label\":\"Super Administrator\",\n      \"level\":10000,\n      \"users\":{\n         \"yg8yIUql\":{\n            \"avatar\":\"https://scontent-ort2-1.xx.fbcdn.net/v/t1.0-9/avatar.jpg\",\n            \"objectId\":\"yg8yIUql\",\n            \"username\":\"SuperAdmin\"\n         }\n      },\n      \"roles\":{\n         \"6CX7sAaV1S\":{\n            \"level\":1,\n            \"name\":\"user\",\n            \"objectId\":\"6CX7sAaV1S\"\n         },\n         \"VHFAoFXSTz\":{\n            \"level\":100,\n            \"name\":\"moderator\",\n            \"objectId\":\"VHFAoFXSTz\"\n         },\n         \"XF7ByHfaEe\":{\n            \"level\":10,\n            \"name\":\"contributor\",\n            \"objectId\":\"XF7ByHfaEe\"\n         },\n         \"kDIUBqCNXW\":{\n            \"level\":1000,\n            \"name\":\"administrator\",\n            \"objectId\":\"kDIUBqCNXW\"\n         }\n      },\n      \"objectId\":\"Lxank79qjd\"\n   },\n   \"administrator\":{\n      \"name\":\"administrator\",\n      \"label\":\"Administrator\",\n      \"level\":1000,\n      \"users\":{},\n      \"roles\":{\n         \"6CX7sAaV1S\":{\n            \"level\":1,\n            \"name\":\"user\",\n            \"objectId\":\"6CX7sAaV1S\"\n         },\n         \"VHFAoFXSTz\":{\n            \"level\":100,\n            \"name\":\"moderator\",\n            \"objectId\":\"VHFAoFXSTz\"\n         },\n         \"XF7ByHfaEe\":{\n            \"level\":10,\n            \"name\":\"contributor\",\n            \"objectId\":\"XF7ByHfaEe\"\n         }\n      },\n      \"objectId\":\"kDIUBqCNXW\"\n   },\n   \"moderator\":{\n      \"name\":\"moderator\",\n      \"level\":100,\n      \"label\":\"Moderator\",\n      \"users\":{},\n      \"roles\":{},\n      \"objectId\":\"VHFAoFXSTz\"\n   },\n   \"contributor\":{\n      \"name\":\"contributor\",\n      \"label\":\"Contributor\",\n      \"level\":10,\n      \"users\":{},\n      \"roles\":{\n         \"6CX7sAaV1S\":{\n            \"level\":1,\n            \"name\":\"user\",\n            \"objectId\":\"6CX7sAaV1S\"\n         }\n      },\n      \"objectId\":\"XF7ByHfaEe\"\n   },\n   \"user\":{\n      \"name\":\"user\",\n      \"label\":\"Standard User\",\n      \"level\":1,\n      \"users\":{},\n      \"roles\":{},\n      \"objectId\":\"6CX7sAaV1S\"\n   },\n   \"banned\":{\n      \"name\":\"banned\",\n      \"level\":-1000,\n      \"label\":\"Banned User\",\n      \"users\":{},\n      \"roles\":{},\n      \"objectId\":\"1wJIKV5NFo\"\n   }\n}",
        "type": "json"
      }
    ],
    "filename": "src/app/documentation/roles.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Roles.remove(role,options)",
    "title": "Roles.remove()",
    "version": "3.1.2",
    "group": "Actinium",
    "name": "Roles_remove",
    "description": "<p>Remove a new <code>Parse.Role</code> object. Returns <code>{Object}</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "role",
            "description": "<p>The role name to remove.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "options",
            "description": "<p>The Cloud Code options object. Used to determine if the current user can administer the role.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Roles.remove('contributor', { useMasterKey: true });",
        "type": "json"
      }
    ],
    "filename": "src/app/documentation/roles.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Search.index(params)",
    "title": "Search.index()",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ]
      }
    },
    "description": "<p>Trigger index of a content type. User must have <code>Search.index</code> capability.</p>",
    "name": "Search_index",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/search/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Search.search(request)",
    "title": "Search.search()",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>Parse cloud request, or equivalent.</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "String",
            "optional": false,
            "field": "index",
            "description": "<p>The index to search. By default, the name of the collection of the indexed content type.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": false,
            "field": "search",
            "description": "<p>The search terms</p>"
          },
          {
            "group": "params",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>Page number of results</p>"
          },
          {
            "group": "params",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "1000",
            "description": "<p>Limit page results</p>"
          }
        ]
      }
    },
    "name": "Search_search",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/search/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Object",
    "url": "Actinium.Setting",
    "title": "Setting",
    "version": "3.1.1",
    "name": "Setting",
    "group": "Actinium",
    "description": "<p>Manage application setting key/value pairs. Actinium settings are provided to you can manage your running configuration for your application. By default, each setting is securely stored so that only users that should have access to a setting are permitted to set, get, or delete settings on the site.</p> <p>The following capabilities can be assigned to your roles for settings:</p> <table> <thead> <tr> <th>Capability</th> <th>Default Roles</th> <th>Description</th> </tr> </thead> <tbody> <tr> <td>Setting.create</td> <td>administrator,super-admin</td> <td>Ability to create a new setting.</td> </tr> <tr> <td>Setting.retrieve</td> <td>administrator,super-admin</td> <td>Ability to retrieve any/all settings.</td> </tr> <tr> <td>Setting.update</td> <td>administrator,super-admin</td> <td>Ability to edit any existing setting.</td> </tr> <tr> <td>Setting.delete</td> <td>administrator,super-admin</td> <td>Ability to delete any existing setting.</td> </tr> <tr> <td>setting.${group}-get</td> <td>administrator,super-admin</td> <td>Ability to retrieve the setting with <code>group</code> setting group. e.g. setting.foo-get to allow get of setting group <code>foo</code></td> </tr> <tr> <td>setting.${group}-set</td> <td>administrator,super-admin</td> <td>Ability to edit the setting with <code>group</code> setting group. e.g. setting.foo-set to allow edit of setting group <code>foo</code></td> </tr> <tr> <td>setting.${group}-delete</td> <td>administrator,super-admin</td> <td>Ability to delete the setting with <code>group</code> setting group. e.g. setting.foo-delete to allow delete of setting group <code>foo</code></td> </tr> </tbody> </table>",
    "filename": ".core/plugin/settings/settings-plugin.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Actinium.Setting.get(key,default)",
    "title": "Setting.get()",
    "version": "3.1.1",
    "group": "Actinium",
    "name": "Setting_get",
    "description": "<p>Get a setting value.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>The unique setting key, in object path form (<code>group.path.to.leaf</code>).</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "default",
            "description": "<p>The default value if the key has not been set.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "// get hostname setting in site group\nActinium.Setting.get('site.hostname');\n\n// get object of all site settings\nActinium.Setting.get('site');",
        "type": "json"
      }
    ],
    "filename": ".core/lib/setting.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Setting.set(key,value)",
    "title": "Setting.set()",
    "version": "3.1.1",
    "group": "Actinium",
    "name": "Setting_set",
    "description": "<p>Create or update a setting value. Returns a <code>{Promise}</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>The unique setting key, in object path form (<code>group.path.to.leaf</code>).</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": true,
            "field": "value",
            "description": "<p>The setting value. If the value is an object, you can use dot notation to set a specific portion of the setting.</p>"
          },
          {
            "group": "Parameter",
            "type": "Parse.ACL",
            "optional": true,
            "field": "ACL",
            "description": "<p>The Parse ACL object to apply to the setting.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "// Save group of site settings\nActinium.Setting.set('site', { title: 'My Awesome Site', hostname: 'mysite.com' });\n\n// Save hostname setting in site group\nActinium.Setting.set('site.hostname', 'mysite.com');",
        "type": "json"
      }
    ],
    "filename": ".core/lib/setting.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.Setting.unset(key)",
    "title": "Setting.unset()",
    "version": "3.1.1",
    "group": "Actinium",
    "name": "Setting_unset",
    "description": "<p>Unset a setting value. Returns a <code>{Promise}</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>The unique setting key, in object path form (<code>group.path.to.leaf</code>).</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "// unsets the title setting in the site group\nActinium.Setting.unset('site.title');\n\n// remove the entire site setting group, including all settings and the capabilities associated\nActinium.Setting.unset('site');",
        "type": "json"
      }
    ],
    "filename": ".core/lib/setting.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Syndicate.Client.create(req,options)",
    "title": "Syndicate.Client.create()",
    "name": "Syndicate_Client_create",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/syndicate/sdk.js",
    "groupTitle": "Actinium",
    "description": "<p>Create a content syndication client record, which includes a refresh token for issuing new access tokens.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>The request containing params and sessionToken.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse options for creating the client.</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "String",
            "optional": false,
            "field": "client",
            "description": "<p>name of the client accessing the API.</p>"
          },
          {
            "group": "params",
            "type": "ParseUser",
            "optional": true,
            "field": "user",
            "description": "<p>Used if no sessionToken provided.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "SDK",
        "content": "Actinium.Client.create({\n    sessionToken,\n    params: {\n        client: 'My syndication client',\n    },\n}, Actinium.Utils.MasterOptions())\n.then(({ token: refreshToken, objectId: clientId }) => {\n    // later use refreshToken to issue accessToken\n})",
        "type": "json"
      },
      {
        "title": "Cloud",
        "content": "Actinium.Cloud.run('syndicate-client-create', {\n  client: 'My Syndicate client'\n}).then(({ token: refreshToken, objectId: clientId }) => {\n   // later use refreshToken to issue accessToken\n})",
        "type": "json"
      }
    ]
  },
  {
    "type": "Asynchronous",
    "url": "Syndicate.Client.delete(req,options)",
    "title": "Syndicate.Client.delete()",
    "name": "Syndicate_Client_delete",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/syndicate/sdk.js",
    "groupTitle": "Actinium",
    "description": "<p>Delete one syndication client record by objectId</p>",
    "parameter": {
      "fields": {
        "params": [
          {
            "group": "params",
            "optional": false,
            "field": "objectId",
            "description": "<p>the id of the client</p>"
          }
        ]
      }
    }
  },
  {
    "type": "Asynchronous",
    "url": "Syndicate.Client.list(req,options)",
    "title": "Syndicate.Client.list()",
    "name": "Syndicate_Client_list",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/syndicate/sdk.js",
    "groupTitle": "Actinium",
    "description": "<p>List syndication clients</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>Request params</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse options for request</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "collection",
            "description": "<p>Parse collection name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "queryHook",
            "defaultValue": "hooked-query-query",
            "description": "<p>hook name to be invoked before running query</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "outputHook",
            "defaultValue": "hooked-query-output",
            "description": "<p>hook name to be invoked before returning results</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "resultsKey",
            "defaultValue": "results",
            "description": "<p>property where list of results will be found</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "req",
            "description": "<p>Parse cloud request object, optional.</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "order",
            "defaultValue": "ascending",
            "description": "<p>list order</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "limit",
            "defaultValue": "100",
            "description": "<p>number of items per page</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "page",
            "defaultValue": "-1",
            "description": "<p>current page, if &lt; 0, all pages will be loaded</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "orderBy",
            "defaultValue": "name",
            "description": "<p>field to order by</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "outputType",
            "defaultValue": "JSON",
            "description": ""
          }
        ]
      }
    }
  },
  {
    "type": "Asynchronous",
    "url": "Syndicate.Client.retrieve(req,options)",
    "title": "Syndicate.Client.retrieve()",
    "name": "Syndicate_Client_retrieve",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/syndicate/sdk.js",
    "groupTitle": "Actinium",
    "description": "<p>Retrieve one syndication client record by objectId</p>",
    "parameter": {
      "fields": {
        "params": [
          {
            "group": "params",
            "optional": false,
            "field": "objectId",
            "description": "<p>the id of the client</p>"
          }
        ]
      }
    }
  },
  {
    "type": "Asynchronous",
    "url": "Syndicate.Client.token(req)",
    "title": "Syndicate.Client.token()",
    "name": "Syndicate_Client_token",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/syndicate/sdk.js",
    "groupTitle": "Actinium",
    "description": "<p>Retrieve a new access token for a client, for use with other syndication REST calls.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>The request containing request params.</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>the refresh token associate with the client.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "SDK",
        "content": "Actinium.Client.token({\n    params: {\n        // Secret refresh token\n        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpkaWxsaWNrIiwiY2xpZW50IjoiYXBpIHRlc3QiLCJpYXQiOjE1OTE3MTUzMjJ9.pdttR2PPmDzDg6zzy5TEHcp2rkuYgNiqaZjahBITv4Y',\n    },\n})\n.then(({ token: accessToken }) => {\n    // access token is used for remote api call, and will expire\n})",
        "type": "json"
      },
      {
        "title": "POST /functions/syndicate-client-token",
        "content": "{\n    \"_ApplicationId\": \"Actinium\",\n    \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpkaWxsaWNrIiwiY2xpZW50IjoiYXBpIHRlc3QiLCJpYXQiOjE1OTE3MTUzMjJ9.pdttR2PPmDzDg6zzy5TEHcp2rkuYgNiqaZjahBITv4Y\"\n}",
        "type": "json"
      }
    ]
  },
  {
    "type": "Asynchronous",
    "url": "Syndicate.Client.token(req)",
    "title": "Syndicate.Client.token()",
    "name": "Syndicate_Client_token",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/syndicate/sdk.js",
    "groupTitle": "Actinium",
    "description": "<p>Verify an access token (See if it is expired)</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>The request containing request params.</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>the API access token from syndicate-client-token</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "SDK",
        "content": "// from previous token() call\nconst accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpkaWxsaWNrIiwiY2xpZW50IjoiYXBpIHRlc3QiLCJpYXQiOjE1OTE3MTgyODMsImV4cCI6MTU5MTcxODM0M30.R1ASB71ab-TwZVi9OuB6ovOcTsC5SOpJ4UqPUzvcnKs';\nActinium.Client.verify({\n    params: {\n        // Possibly expired access token\n        token: accessToken\n    },\n})\n.then((payload = false) => {\n    // if not valid, fetch a new one from refreshToken (created with client)\n    if (!payload) return Actinium.Client.token({ params: { token: refreshToken } }).then(({token}) => token);\n    return accessToken;\n})\n.then(accessToken => {\n    // use accessToken\n})",
        "type": "json"
      },
      {
        "title": "POST /functions/syndicate-client-verify",
        "content": "{\n    \"_ApplicationId\": \"Actinium\",\n    \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpkaWxsaWNrIiwiY2xpZW50IjoiYXBpIHRlc3QiLCJpYXQiOjE1OTE3MTgyODMsImV4cCI6MTU5MTcxODM0M30.R1ASB71ab-TwZVi9OuB6ovOcTsC5SOpJ4UqPUzvcnKs\"\n}",
        "type": "json"
      }
    ]
  },
  {
    "type": "Asynchronous",
    "url": "Syndicate.Content.list(req,options)",
    "title": "Syndicate.Content.list()",
    "name": "Syndicate_Content_list",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/syndicate/sdk.js",
    "groupTitle": "Actinium",
    "description": "<p>Get list of syndicated list</p>"
  },
  {
    "type": "Asynchronous",
    "url": "Syndicate.Content.media(req,options)",
    "title": "Syndicate.Content.media()",
    "name": "Syndicate_Content_media",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/syndicate/sdk.js",
    "groupTitle": "Actinium",
    "description": "<p>Get syndicated list of media</p>"
  },
  {
    "type": "Asynchronous",
    "url": "Syndicate.Content.mediaDirectories(req,options)",
    "title": "Syndicate.Content.mediaDirectories()",
    "name": "Syndicate_Content_mediaDirectories",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/syndicate/sdk.js",
    "groupTitle": "Actinium",
    "description": "<p>Get list of media directories</p>"
  },
  {
    "type": "Asynchronous",
    "url": "Syndicate.Content.taxonomies(req,options)",
    "title": "Syndicate.Content.taxonomies()",
    "name": "Syndicate_Content_taxonomies",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/syndicate/sdk.js",
    "groupTitle": "Actinium",
    "description": "<p>Get syndicated list of taxonomies</p>"
  },
  {
    "type": "Asynchronous",
    "url": "Syndicate.Content.taxonomiesAttached(req,options)",
    "title": "Syndicate.Content.taxonomiesAttached()",
    "name": "Syndicate_Content_taxonomiesAttached",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/syndicate/sdk.js",
    "groupTitle": "Actinium",
    "description": "<p>Get attached taxononmies for an item of syndicated content.</p>"
  },
  {
    "type": "Asynchronous",
    "url": "Syndicate.Content.taxonomyTypes(req,options)",
    "title": "Syndicate.Content.taxonomyTypes()",
    "name": "Syndicate_Content_taxonomyTypes",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/syndicate/sdk.js",
    "groupTitle": "Actinium",
    "description": "<p>Get syndicated list of taxonomy types</p>"
  },
  {
    "type": "Asynchronous",
    "url": "Syndicate.Content.types(req,options)",
    "title": "Syndicate.Content.types()",
    "name": "Syndicate_Content_types",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/syndicate/sdk.js",
    "groupTitle": "Actinium",
    "description": "<p>Get list of syndicated types</p>"
  },
  {
    "type": "Asynchronous",
    "url": "Type.create(params,options)",
    "title": "Type.create()",
    "description": "<p>Save a content type definition.</p>",
    "parameter": {
      "fields": {
        "params": [
          {
            "group": "params",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>unique label of content type. On save, this will be used to generate the machineName and label of the type.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "namespace",
            "description": "<p>the optional uuid to be used as the uuid/v5 namespace of to create the uuid of the new type. This will use the api's configured namespace by default.</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "regions",
            "description": "<p>indexed by region id, this object contains multiple region objects, each with the same id ('default' by default), a label, and a slug. Each field in the <code>fields</code> has a <code>region</code> property with the id of the region to which it belongs.</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "fields",
            "description": "<p>indexed by fieldId (an uuid), a <code>field</code> object. Except for required <code>fieldId</code>, <code>fieldName</code>, <code>fieldType</code> and <code>region</code> properties, each field object may contain free-form variants that aid in the presentation of the editor/configuration of Content Editor. e.g. fieldType &quot;Text&quot; has a &quot;defaultValue&quot; property which is used for the Content Editor to display the default value in the field editor. fieldType &quot;Publisher&quot; has a boolean &quot;simple&quot; property that changes the behavior of the publishing feature in the Content Editor.</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": true,
            "field": "meta",
            "description": "<p>largely free-form metadata object associated with this content type. Actinium will use this to store the current label of the type.</p>"
          }
        ],
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse query options object</p>"
          }
        ],
        "field": [
          {
            "group": "field",
            "type": "String",
            "optional": false,
            "field": "fieldId",
            "description": "<p>(uuid) unique id of field in content type</p>"
          },
          {
            "group": "field",
            "type": "String",
            "optional": false,
            "field": "fieldName",
            "description": "<p>unique name of field in content type, in general becomes slugified column name for storing the field data.</p>"
          },
          {
            "group": "field",
            "type": "String",
            "optional": false,
            "field": "fieldType",
            "description": "<p>field identifier used in <code>content-schema-field-types</code> and <code>content-schema</code> hooks, describing how the schema should store data submitted for this field using the Content SDK.</p>"
          },
          {
            "group": "field",
            "type": "String",
            "optional": false,
            "field": "region",
            "description": "<p>id of the region where the field will appear in the Content Editor</p>"
          }
        ]
      }
    },
    "name": "Type_create",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/type/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Type.delete(params,options)",
    "title": "Type.delete()",
    "description": "<p>Delete a content type configuration. Note that this will not delete the content or its schema, only the content type configuration.</p>",
    "parameter": {
      "fields": {
        "params": [
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "namespace",
            "description": "<p>optional namespace. Will be used to derive the uuid from the machine name if the uuid is not known. By default, the current APIs content namespace will be used, and this will not be needed.</p>"
          }
        ]
      }
    },
    "name": "Type_delete",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/type/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Type.getCollection(params,options)",
    "title": "Type.getCollection()",
    "description": "<p>Get collection of a content type. You must provide either the id|ID|objectId, uuid or the machineName.</p>",
    "parameter": {
      "fields": {
        "params": [
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "id",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "ID",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "namespace",
            "description": "<p>optional namespace. Will be used to derive the uuid from the machine name if the uuid is not known. By default, the current APIs content namespace will be used, and this will not be needed.</p>"
          }
        ],
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse query options object</p>"
          }
        ]
      }
    },
    "name": "Type_getCollection",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/type/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Type.list(params,options)",
    "title": "Type.list()",
    "description": "<p>Retrieve a list of the existing content types.</p>",
    "name": "Type_list",
    "group": "Actinium",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "schema",
            "description": "<p>Whether to include the schema object of the Type.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": ".core/plugin/type/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Type.retrieve(params,options)",
    "title": "Type.retrieve()",
    "description": "<p>Retrieve configuration for one content type. You must provide either the id|ID|objectId, uuid or the machineName.</p>",
    "parameter": {
      "fields": {
        "params": [
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "id",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "ID",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "collection",
            "description": "<p>the collection associated with the content type</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "namespace",
            "description": "<p>optional namespace. Will be used to derive the uuid from the machine name if the uuid is not known. By default, the current APIs content namespace will be used, and this will not be needed.</p>"
          }
        ],
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse query options object</p>"
          }
        ]
      }
    },
    "name": "Type_retrieve",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/type/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Type.status(params,options)",
    "title": "Type.status()",
    "description": "<p>Get content type collection, content count, field slugs.</p>",
    "parameter": {
      "fields": {
        "params": [
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "namespace",
            "description": "<p>optional namespace. Will be used to derive the uuid from the machine name if the uuid is not known. By default, the current APIs content namespace will be used, and this will not be needed.</p>"
          }
        ],
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse query options object</p>"
          }
        ]
      }
    },
    "name": "Type_status",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/type/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Type.update(params,options)",
    "title": "Type.update()",
    "description": "<p>Save an existing content type definition. To target the existing content type, you must provide either the uuid or the machineName and optionally the content namespace used during the creation of the type.</p>",
    "parameter": {
      "fields": {
        "params": [
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "namespace",
            "description": "<p>optional namespace. Will be used to derive the uuid from the machine name if the uuid is not known. By default, the current APIs content namespace will be used, and this will not be needed.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>unique label of content type. Only the label will be modified, and the machineName will remain the same.</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "regions",
            "description": "<p>indexed by region id, this object contains multiple region objects, each with the same id ('default' by default), a label, and a slug. Each field in the <code>fields</code> has a <code>region</code> property with the id of the region to which it belongs.</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "fields",
            "description": "<p>indexed by fieldId (an uuid), a <code>field</code> object. Except for required <code>fieldId</code>, <code>fieldName</code>, <code>fieldType</code> and <code>region</code> properties, each field object may contain free-form variants that aid in the presentation of the editor/configuration of Content Editor. e.g. fieldType &quot;Text&quot; has a &quot;defaultValue&quot; property which is used for the Content Editor to display the default value in the field editor. fieldType &quot;Publisher&quot; has a boolean &quot;simple&quot; property that changes the behavior of the publishing feature in the Content Editor.</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": true,
            "field": "meta",
            "description": "<p>largely free-form metadata object associated with this content type. Actinium will use this to store the current label of the type.</p>"
          }
        ],
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse query options object</p>"
          }
        ],
        "field": [
          {
            "group": "field",
            "type": "String",
            "optional": false,
            "field": "fieldId",
            "description": "<p>(uuid) unique id of field in content type</p>"
          },
          {
            "group": "field",
            "type": "String",
            "optional": false,
            "field": "fieldName",
            "description": "<p>unique name of field in content type, in general becomes slugified column name for storing the field data.</p>"
          },
          {
            "group": "field",
            "type": "String",
            "optional": false,
            "field": "fieldType",
            "description": "<p>field identifier used in <code>content-schema-field-types</code> and <code>content-schema</code> hooks, describing how the schema should store data submitted for this field using the Content SDK.</p>"
          },
          {
            "group": "field",
            "type": "String",
            "optional": false,
            "field": "region",
            "description": "<p>id of the region where the field will appear in the Content Editor</p>"
          }
        ]
      }
    },
    "name": "Type_update",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/type/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Actinium.User.Meta.save(params,options)",
    "title": "User.Meta.save()",
    "group": "Actinium",
    "name": "User_Meta_save",
    "description": "<p>Mutate the Parse.User.meta object.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>Object containing parameters for retrieving a user and the key value pair to apply to the user meta object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse cloud options object.</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Look up the user object by the objectId field. See <a href=\"#api-Actinium-User_retrieve\">User.retrieve()</a>.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "username",
            "description": "<p>Look up the user object by the username field. See <a href=\"#api-Actinium-User_retrieve\">User.retrieve()</a>.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>Look up the user object by the email field. See <a href=\"#api-Actinium-User_retrieve\">User.retrieve()</a>.</p>"
          },
          {
            "group": "params",
            "type": "Array",
            "optional": false,
            "field": "keys",
            "description": "<p>List of object path keys as strings to delete.</p>"
          }
        ],
        "hooks": [
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-sensative-fields",
            "description": "<p>Mutate the list of sensative (non-public) fields.</p> <pre><code>Arguments: fields:Array, params, options </code></pre>"
          },
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-before-meta-save",
            "description": "<p>Triggered before the user update is executed.</p> <pre><code>Arguments: meta:Object, prev:Object, user:Parse.User, params, options </code></pre>"
          },
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-meta-save-response",
            "description": "<p>Triggered before the updated user object is returned.</p> <pre><code>Arguments: meta:Object, prev:Object, user:Parse.User, params, options </code></pre>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Usage",
        "content": "Actinium.User.Meta.delete({ objectId: 'aetlkq25', keys: ['testing', 'out']});",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": ".core/plugin/users/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Actinium.User.Meta.update(params,options)",
    "title": "User.Meta.update()",
    "group": "Actinium",
    "name": "User_Meta_update",
    "description": "<p>Mutate the Parse.User.meta object.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>Object containing parameters for retrieving a user and the key value pair to apply to the user meta object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse cloud options object.</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Look up the user object by the objectId field. See <a href=\"#api-Actinium-User_retrieve\">User.retrieve()</a>.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "username",
            "description": "<p>Look up the user object by the username field. See <a href=\"#api-Actinium-User_retrieve\">User.retrieve()</a>.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>Look up the user object by the email field. See <a href=\"#api-Actinium-User_retrieve\">User.retrieve()</a>.</p>"
          }
        ],
        "hooks": [
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-sensative-fields",
            "description": "<p>Mutate the list of sensative (non-public) fields.</p> <pre><code>Arguments: fields:Array, params, options </code></pre>"
          },
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-before-meta-save",
            "description": "<p>Triggered before the user update is executed.</p> <pre><code>Arguments: meta:Object, prev:Object, user:Parse.User, params, options </code></pre>"
          },
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-meta-save-response",
            "description": "<p>Triggered before the updated user object is returned.</p> <pre><code>Arguments: meta:Object, prev:Object, user:Parse.User, params, options </code></pre>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Usage",
        "content": "Actinium.User.Meta.update({ objectId: 'aetlkq25', test: 123, out: 456 });",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": ".core/plugin/users/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Actinium.User.Pref.save(params,options)",
    "title": "User.Pref.save()",
    "group": "Actinium",
    "name": "User_Pref_save",
    "description": "<p>Mutate the Parse.User.pref object.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>Object containing parameters for retrieving a user and the key value pair to apply to the user pref object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse cloud options object.</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Look up the user object by the objectId field. See <a href=\"#api-Actinium-User_retrieve\">User.retrieve()</a>.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "username",
            "description": "<p>Look up the user object by the username field. See <a href=\"#api-Actinium-User_retrieve\">User.retrieve()</a>.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>Look up the user object by the email field. See <a href=\"#api-Actinium-User_retrieve\">User.retrieve()</a>.</p>"
          },
          {
            "group": "params",
            "type": "Array",
            "optional": false,
            "field": "keys",
            "description": "<p>List of object path keys as strings to delete.</p>"
          }
        ],
        "hooks": [
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-sensative-fields",
            "description": "<p>Mutate the list of sensative (non-public) fields.</p> <pre><code>Arguments: fields:Array, params, options </code></pre>"
          },
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-before-pref-save",
            "description": "<p>Triggered before the user update is executed.</p> <pre><code>Arguments: pref:Object, prev:Object, user:Parse.User, params, options </code></pre>"
          },
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-pref-save-response",
            "description": "<p>Triggered before the updated user object is returned.</p> <pre><code>Arguments: pref:Object, prev:Object, user:Parse.User, params, options </code></pre>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Usage",
        "content": "Actinium.User.Pref.delete({ objectId: 'aetlkq25', keys: ['testing', 'out']});",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": ".core/plugin/users/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Actinium.User.Pref.update(params,options)",
    "title": "User.Pref.update()",
    "group": "Actinium",
    "name": "User_Pref_update",
    "description": "<p>Mutate the Parse.User.pref object.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>Object containing parameters for retrieving a user and the key value pair to apply to the user pref object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse cloud options object.</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Look up the user object by the objectId field. See <a href=\"#api-Actinium-User_retrieve\">User.retrieve()</a>.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "username",
            "description": "<p>Look up the user object by the username field. See <a href=\"#api-Actinium-User_retrieve\">User.retrieve()</a>.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>Look up the user object by the email field. See <a href=\"#api-Actinium-User_retrieve\">User.retrieve()</a>.</p>"
          }
        ],
        "hooks": [
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-sensative-fields",
            "description": "<p>Mutate the list of sensative (non-public) fields.</p> <pre><code>Arguments: fields:Array, params, options </code></pre>"
          },
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-before-pref-save",
            "description": "<p>Triggered before the user update is executed.</p> <pre><code>Arguments: pref:Object, prev:Object, user:Parse.User, params, options </code></pre>"
          },
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-pref-save-response",
            "description": "<p>Triggered before the updated user object is returned.</p> <pre><code>Arguments: pref:Object, prev:Object, user:Parse.User, params, options </code></pre>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Usage",
        "content": "Actinium.User.Pref.update({ objectId: 'aetlkq25', test: 123, out: 456 });",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": ".core/plugin/users/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.User.can(capability,user)",
    "title": "User.can()",
    "version": "3.1.2",
    "group": "Actinium",
    "name": "User_can",
    "description": "<p>Determines if a user has the specified capability. If the user is a Super Admin this will always return true. If the user is an Administrator this will almost always return true except in cases where the Administrator has been expressly excluded capability. Returns <code>{Boolean}</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "capability",
            "description": "<p>The capability name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>The user id or username. Alternatively you can pass a request object. If the request object has the master key specified, role and capabilities are bipassed and <code>true</code> is returned.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.User.can('user.edit', 'SuperAdmin');\n// Returns true",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.User.capabilities(user)",
    "title": "User.capabilities()",
    "version": "3.1.2",
    "group": "Actinium",
    "name": "User_capabilities",
    "description": "<p>Get the capabilities of the specified user. Returns an <code>{Array}</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>The user id or username.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.User.capabilities('yg8yIUql');\nActinium.User.capabilities('username');",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Actinium.User.currentUser(options)",
    "title": "User.currentUser()",
    "group": "Actinium",
    "name": "User_currentUser",
    "description": "<p>Get the current user from the options object.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse options object containing a <code>sessionToken</code> property.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "serialize",
            "defaultValue": "false",
            "description": "<p>Whether to serialize the response.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Usage:",
        "content": "const currentUser = await Actinium.User.currentUser({ sessionToken: 'alketjaTelB23tjalejtljgvae' });",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": ".core/plugin/users/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Actinium.User.init()",
    "title": "User.init()",
    "group": "Actinium",
    "name": "User_init",
    "description": "<p>Create the initial <code>Parse.User</code> object as a Super Admin if there are no users found in the User collection.</p>",
    "version": "0.0.0",
    "filename": ".core/plugin/users/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.User.isRole(user,role)",
    "title": "User.isRole()",
    "version": "3.1.2",
    "group": "Actinium",
    "name": "User_isRole",
    "description": "<p>Check if a user is a member of a specific role. Returns <code>{Boolean}</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>The user id or username.</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "role",
            "description": "<p>The role name or level.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.User.isRole('SuperAdmin', 'super-admin');\nActinium.User.isRole('SuperAdmin', 10000);\n// Returns true",
        "type": "json"
      }
    ],
    "filename": "src/app/documentation/roles.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Actinium.User.list(params,options)",
    "title": "User.list()",
    "group": "Actinium",
    "name": "User_list",
    "description": "<p>Retrieve a list of <code>Parse.User</code> objects.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>Query parameters.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse cloud options object.</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "role",
            "description": "<p>Filter the results to the specified <code>Parse.Role</code> name.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "search",
            "description": "<p>Search using logical <code>or</code>. The query will RegExp compare to the default fields: <code>username</code>, <code>email</code>, <code>fname</code>, <code>lname</code>.</p> <p><em>Note:</em> You can add or remove fields via the <code>user-search-fields</code> hook.</p>"
          },
          {
            "group": "params",
            "type": "Mixed",
            "optional": true,
            "field": "objectId",
            "description": "<p><code>{String|Array}</code> Search for a specific objectId or array of objectIds.</p> <p><em>Note:</em> If <code>search</code> is specified, this value is ignored.</p>"
          },
          {
            "group": "params",
            "type": "Mixed",
            "optional": true,
            "field": "email",
            "description": "<p><code>{String|Array}</code> Search for a specific email address or array of email addresses.</p> <p><em>Note:</em> If <code>search</code> is specified, this value is ignored.</p>"
          },
          {
            "group": "params",
            "type": "Mixed",
            "optional": true,
            "field": "username",
            "description": "<p><code>{String|Array}</code> Search for a specific username or array of usernames.</p> <p><em>Note:</em> If <code>search</code> is specified, this value is ignored.</p>"
          },
          {
            "group": "params",
            "type": "Boolean",
            "optional": true,
            "field": "optimize",
            "defaultValue": "false",
            "description": "<p>If the count of the results is less than or equal to 1000, all objects will be returned. The page number will be set to 1 and the number of pages will also be 1.</p>"
          },
          {
            "group": "params",
            "type": "Boolean",
            "optional": true,
            "field": "refresh",
            "defaultValue": "false",
            "description": "<p>By default the results are cached for 90 seconds. You can flush the cache with this parameter.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "indexBy",
            "description": "<p>Index the results by the specified field and return them as an Object.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "order",
            "description": "<p>Order the results <code>ascending</code> or <code>descending</code>.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "orderBy",
            "defaultValue": "username",
            "description": "<p>Order the results by the specified field.</p>"
          },
          {
            "group": "params",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>The page number of results to return.</p>"
          },
          {
            "group": "params",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "20",
            "description": "<p>The number of results to return per page.</p>"
          }
        ],
        "hooks": [
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-list-search-fields",
            "description": "<p>Mutate the fields used when searching or exact match lookups.</p> <pre><code>Arguments: fields:Array, params, options </code></pre>"
          },
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-list-query",
            "description": "<p>Mutate the <code>Parse.Query</code> object.</p> <pre><code>Arguments: query:Parse.Query, params, options </code></pre>"
          },
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-list-response",
            "description": "<p>Mutate the response object before it is returned.</p> <pre><code>Arguments: response:Object, params, options </code></pre>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": ".core/plugin/users/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Actinium.User.retrieve(params,options)",
    "title": "User.retrieve()",
    "group": "Actinium",
    "name": "User_retrieve",
    "description": "<p>Retrieve a single <code>Parse.User</code> object.</p> <p>Search parameters or limited to exact match look up fields specified by the <code>user-retrieve-search-fields</code> hook. The order in which the fields are defined will also apply to their hierachy when weighting which field to search by when more than one param is supplied.</p> <p>Defaults: <code>objectId</code>, <code>username</code>, <code>email</code></p> <p><em>Note:</em> User.list() hooks will be run with the exception of <code>user-retrieve-search-fields</code> running in place of <code>user-list-search-fields</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>Query parameters. See <a href=\"#api-Actinium-User_list\">User.list()</a> for more details.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse cloud options object.</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Retrieve by the objectId field.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "username",
            "description": "<p>Retrieve by the username field.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>Retrieve by the email address field.</p>"
          }
        ],
        "hooks": [
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-retrieve-search-fields",
            "description": "<p>Mutate the search fields.</p> <pre><code>Arguments: fields:Array, params, options </code></pre>"
          },
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-retrieve-response",
            "description": "<p>Mutate the <code>Parse.User</code> object before it is returned.</p> <pre><code>Arguments: user:Object, params, options </code></pre>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": ".core/plugin/users/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Actinium.User.save(params,options)",
    "title": "User.save()",
    "group": "Actinium",
    "name": "User_save",
    "description": "<p>Save a <code>Parse.User</code> object.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>Key value pairs to apply to the <code>Parse.User</code> object.</p> <p><em>Note:</em> Any additional key value pairs will be added to the user object as a new column.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse cloud options object.</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>The unique username used when signing in.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>The email address to associate with the user account.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>The password used when signing in.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "role",
            "description": "<p>The <code>Parse.Role</code> name to add the user to.</p>"
          }
        ],
        "hooks": [
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-before-save",
            "description": "<p>Mutate the <code>Parse.User</code> object before save is complete.</p> <pre><code>Arguments:  req:Object:Parse.User </code></pre>"
          },
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-after-save",
            "description": "<p>Take action after the <code>Parse.User</code> object has been saved.</p> <pre><code>Arguments: req:Object:Parse.User </code></pre>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": ".core/plugin/users/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Actinium.User.trash(params,options)",
    "title": "User.trash()",
    "group": "Actinium",
    "name": "User_trash",
    "description": "<p>Send a single <code>Parse.User</code> object to the recycle bin.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>Object containing parameters for deleting a user.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse cloud options object.</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "String",
            "optional": false,
            "field": "objectId",
            "description": "<p>The Parse.User objectId.</p>"
          }
        ],
        "hooks": [
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-before-delete",
            "description": "<p>Triggered before the <code>Parse.User</code> object is deleted.</p> <pre><code>Arguments: req:Object:Parse.User </code></pre>"
          },
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-after-delete",
            "description": "<p>Triggered after the <code>Parse.User</code> object is deleted.</p> <pre><code>Arguments: req:Object:Parse.User </code></pre>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": ".core/plugin/users/sdk.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Utils.CloudCapOptions(req,capabilities,strict,match)",
    "title": "Utils.CloudCapOptions",
    "description": "<p>Given a Parse Cloud request option, will determine if the request should have certain capabilities. Returns true if capabilities are permitted. Like <code>Utils.CloudRunOptions()</code>, but with additional escalation based on permitted capabilities.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>Parse Cloud function request object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "capabilities",
            "description": "<p>List of capability to check.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "strict",
            "defaultValue": "true",
            "description": "<p>if true, all capabilities must be allowed, otherwise at least one must be allowed to escalate permission to use master key.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "match",
            "description": "<p>semver-style query on the user's level. If satisfied escalates the query to master key user.</p>"
          }
        ]
      }
    },
    "name": "Utils_CloudCapOptions",
    "group": "Actinium",
    "examples": [
      {
        "title": "Usage",
        "content": "Actinium.Cloud.define('MyPlugin', 'do-something-privileged', async req => {\n    const options = Actinium.Utils.CloudCapOptions(req, [\n       'can-do',\n       'can-do-everything',\n      ],\n      false,\n      '>1000'\n    );\n\n    // query will succeed if:\n    // 1. ACL/CLP is satisfied by logged in user session token\n    // 2. user is a super-admin\n    // 3. user has either \"can-do\" or \"can-do-everything\" capabilities\n    // 4. user's \"level\" is greater than 1000\n    const query = new Parse.Query('MySecrets');\n    return query.find(options);\n})",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": ".core/lib/utils/options.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Utils.CloudHasCapabilities(req,capabilities,strict)",
    "title": "Utils.CloudHasCapabilities",
    "description": "<p>Given a Parse Cloud request option, will determine if the request should have certain capabilities. Returns true if capabilities are permitted.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>Parse Cloud function request object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "capabilities",
            "description": "<p>List of capability to check.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "strict",
            "defaultValue": "true",
            "description": "<p>if true, all capabilities must be allowed, otherwise at least one must be allowed</p>"
          }
        ]
      }
    },
    "name": "Utils_CloudHasCapabilities",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/lib/utils/options.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Utils.CloudMasterOptions(req)",
    "title": "Utils.CloudMasterOptions",
    "description": "<p>Provides Parse query options appropriate for the cloud request, with guaranteed escalated privileges to master key usage. Use with extreme caution.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>Parse Cloud function request object.</p>"
          }
        ]
      }
    },
    "name": "Utils_CloudMasterOptions",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/lib/utils/options.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Utils.CloudRunOptions(req,match)",
    "title": "Utils.CloudRunOptions",
    "description": "<p>Provides Parse query options appropriate for the cloud request. If user is logged in, will escalate to master key if the user is of role <code>super-admin</code>. Otherwise, user session token is passed along.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>Parse Cloud function request object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "match",
            "description": "<p>semver-style query on the user's level. If satisfied escalates the query to master key user.</p>"
          }
        ]
      }
    },
    "name": "Utils_CloudRunOptions",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/lib/utils/options.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Utils.MasterOptions(options)",
    "title": "Utils.MasterOptions",
    "description": "<p>Creates or updates a Parse request options object to useMasterKey:true</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "options",
            "description": "<p>options object to add master to, if applicable</p>"
          }
        ]
      }
    },
    "name": "Utils_MasterOptions",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/lib/utils/options.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Utils.UserFromSession(sessionToken)",
    "title": "Utils.UserFromSession",
    "description": "<p>Given a session token, will return a promise for the user logged into that session.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sessionToken",
            "description": "<p>the Parse session token</p>"
          }
        ]
      }
    },
    "name": "Utils_UserFromSession",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/lib/utils/options.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Utils.serialize(ParseObject)",
    "title": "Utils.serialize()",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ParseObject",
            "optional": false,
            "field": "data",
            "description": "<p>Parse object you wish to serialize to JSON.</p>"
          }
        ]
      }
    },
    "name": "Utils_serialize",
    "group": "Actinium",
    "examples": [
      {
        "title": "Usage",
        "content": "const serialize = require(`${ACTINIUM_DIR}/lib/utils/serialize`);\n\nActinium.Cloud.define('MY_PLUGIN', 'some-function', async req => {\n    const object = new Parse.Object('SomeObject');\n    object.id = 'lL1SfyzHiE';\n    await object.fetch({useMasterKey: true});\n\n    return serialize(object);\n});",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": ".core/lib/utils/serialize.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "changelog",
    "title": "changelog",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "orderBy",
            "defaultValue": "createdAt",
            "description": "<p>Field to order the results by.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "direction",
            "defaultValue": "descending",
            "description": "<p>Order &quot;descending&quot; or &quot;ascending&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "1000",
            "description": "<p>Limit page results</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "userId",
            "description": "<p>Parse user object id (alternative)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "contentId",
            "description": "<p>objectId of the content</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "collection",
            "description": "<p>the Parse collection of the content</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "changeType",
            "description": "<p>the type of change being logged</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "meta",
            "description": "<p>meta data for the change log</p>"
          }
        ]
      }
    },
    "name": "changelog",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/changelog-plugin.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "content-list",
    "title": "content-list",
    "description": "<p>Get list of content of a specific Type.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "refresh",
            "defaultValue": "false",
            "description": "<p>skip cache check when true</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "optimize",
            "defaultValue": "false",
            "description": "<p>if optimize is true, and collection contains less than 1000 records, the entire set will be delivered in one page for application-side pagination.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "status",
            "description": "<p>&quot;PUBLISHED&quot; or &quot;DRAFT&quot;, or other custom status of the content</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "orderBy",
            "defaultValue": "updatedAt",
            "description": "<p>Field to order the results by.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "direction",
            "defaultValue": "descending",
            "description": "<p>Order &quot;descending&quot; or &quot;ascending&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "20",
            "description": "<p>Limit page results</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ]
      }
    },
    "name": "content_list",
    "group": "Actinium",
    "examples": [
      {
        "title": "Usage",
        "content": "Actinium.Cloud.run('content-list', {\n    \"type\": {\n        \"machineName\": \"article\"\n    },\n    \"orderBy\":\"title\",\n    \"direction\": \"ascending\",\n    \"limit\": 1,\n    \"status\": \"DRAFT\"\n});",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": ".core/plugin/content/content-plugin.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "content-publish",
    "title": "content-publish",
    "description": "<p>Set revision to current version and publish content.</p>",
    "parameter": {
      "fields": {
        "params": [
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The Parse object id of the content.</p>"
          },
          {
            "group": "params",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid of the content.</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": true,
            "field": "history",
            "description": "<p>revision history to retrieve, containing branch and revision index.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "String",
            "optional": true,
            "field": "branch",
            "defaultValue": "master",
            "description": "<p>the revision branch of current content</p>"
          },
          {
            "group": "history",
            "type": "Number",
            "optional": true,
            "field": "revision",
            "description": "<p>index in branch history to update (defaults to most recent in branch).</p>"
          }
        ]
      }
    },
    "name": "content_publish",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/content-plugin.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "content-set-status",
    "title": "content-set-status",
    "description": "<p>Set revision to current version and set the status of the content.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The Parse object id of the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid of the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "history",
            "description": "<p>revision history to retrieve, containing branch and revision index.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "userId",
            "description": "<p>User objectId that set the status of the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "reason",
            "description": "<p>Change log change reason. Cause of setStatus action, default ENUMS.CHANGES.SET_STATUS</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "String",
            "optional": true,
            "field": "branch",
            "defaultValue": "master",
            "description": "<p>the revision branch of current content</p>"
          },
          {
            "group": "history",
            "type": "Number",
            "optional": true,
            "field": "revision",
            "description": "<p>index in branch history to update (defaults to most recent in branch).</p>"
          }
        ]
      }
    },
    "name": "content_set_status",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/plugin/content/content-plugin.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Cloud",
    "url": "acl-targets",
    "title": "acl-targets",
    "version": "3.1.7",
    "group": "Cloud",
    "name": "acl_targets",
    "description": "<p>Get a list of roles and users that can be used for deriving an ACL object.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "search",
            "description": "<p>You can search by a multitude of things such as the role name, role label, username, user first name, user last name, and user email.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "cache",
            "description": "<p>Cache the results of the query. You cannot supply a search value. The master key is used when searching cached data so beware that you may get results that are outside of the user's level.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "fresh",
            "description": "<p>Force a search of the database instead of cached values.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "// Get all ACL targets and cache the results\nActinium.Cloud.run('acl-targets', { cache: true });\n\n// Get a specific role\nActinium.Cloud.run('acl-targets', { search: 'super-admin' });\n\n// Search a user from the database\nActinium.Cloud.run('acl-targets', { search: 'han', fresh: true });",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/users/users-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "blueprints",
    "title": "blueprints",
    "version": "3.1.2",
    "group": "Cloud",
    "name": "blueprints",
    "description": "<p>Get all blueprints.</p>",
    "examples": [
      {
        "title": "All Example:",
        "content": "// get all blueprints\nActinium.Cloud.run('blueprints');",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/blueprint/blueprint-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "capability-bulk-check",
    "title": "capability-bulk-check",
    "version": "3.5.0",
    "group": "Cloud",
    "name": "capability_bulk_check",
    "description": "<p>Check groups of capabilities in bulk.</p>",
    "parameter": {
      "fields": {
        "check": [
          {
            "group": "check",
            "type": "Array",
            "optional": false,
            "field": "capabilities",
            "description": "<p>one or more string capabilities to check together</p>"
          },
          {
            "group": "check",
            "type": "Boolean",
            "optional": true,
            "field": "strict",
            "defaultValue": "true",
            "description": "<p>if [true] all capabilities in the check must be permitted for request user, else only one must match</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage",
        "content": "const checks = {\n canPublish: {\n  capabilities: ['Content_article.publish', 'publish-content'],\n  strict: false,\n },\n canUnpublish: {\n  capabilities: ['Content_article.unpublish', 'unpublish-content'],\n  strict: false,\n },\n canSetStatusDRAFT: {\n  capabilities: [\"Content_article.setStatus-DRAFT\", \"set-content-status\"],\n  strict: false,\n },\n canSetStatusTEST: {\n  capabilities: [\"Content_article.setStatus-TEST\", \"set-content-status\"],\n  strict: false,\n },\n canSetStatusREVIEW: {\n  capabilities: [\"Content_article.setStatus-REVIEW\", \"set-content-status\"],\n  strict: false,\n },\n};\n\nReactium.Cloud.run('capability-bulk-check', { checks });",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "response",
            "description": "<p>{ canPublish: false canUnpublish: false, canSetStatusDRAFT: true, canSetStatusTEST: true, canSetStatusREVIEW: true, }</p>"
          }
        ]
      }
    },
    "filename": ".core/plugin/capability/capability-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "capability-check",
    "title": "capability-check",
    "version": "3.1.2",
    "group": "Cloud",
    "name": "capability_check",
    "description": "<p>Check one or more capabilities for the request user.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "capability",
            "description": "<p>string capability name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "capabilities",
            "description": "<p>list of string capabilities. if multiple are provided, <code>strict</code> will apply</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "strict",
            "defaultValue": "true",
            "description": "<p>if [true] all capabilities must be permitted for request user, else only one must match</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage",
        "content": "Reactium.Cloud.run('capability-check', { capability: 'user.view', strict: false})",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "permitted",
            "description": ""
          }
        ]
      }
    },
    "filename": ".core/plugin/capability/capability-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "capability-create",
    "title": "capability-create",
    "version": "3.1.2",
    "group": "Cloud",
    "name": "capability_create",
    "description": "<p>Alias for capability-edit</p>",
    "filename": ".core/plugin/capability/capability-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "capability-delete",
    "title": "capability-delete",
    "version": "3.1.2",
    "group": "Cloud",
    "name": "capability_delete",
    "description": "<p>Delete a capability.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "group",
            "description": "<p>capability name in object path form <code>group.action</code> (e.g. user.edit)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage",
        "content": "Reactium.Cloud.run('capability-delete', { capability: 'user.view'})",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/capability/capability-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "capability-edit",
    "title": "capability-edit",
    "version": "3.1.2",
    "group": "Cloud",
    "name": "capability_edit",
    "description": "<p>Create new capability or edit an existing one.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "group",
            "description": "<p>capability name in object path form <code>group.action</code> (e.g. user.edit)</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "perms",
            "description": "<p><code>allowed</code> roles and <code>excluded</code> roles.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage",
        "content": "// only administrators and super-admin users can \"mail.send\"\nReactium.Cloud.run('capability-edit', 'mail.send', {\n    \"allowed\": [\n        \"administrator\",\n        \"super-admin\"\n    ],\n    \"excluded\": [\n        \"banned\"\n    ]\n})",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/capability/capability-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "capability-get",
    "title": "capability-get",
    "version": "3.1.2",
    "group": "Cloud",
    "name": "capability_get",
    "description": "<p>Get list of registered capabilities.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "capability",
            "description": "<p>Optional capability name to get allowed and excluded roles for a registered capability. If not provided, returns a list of names of registered capabilities. (Note: capabilities not listed may be enforced with defaults)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Single Capability Usage",
        "content": "Reactium.Cloud.run('capability-get', { capability: 'user.view'})",
        "type": "json"
      },
      {
        "title": "Single Capability Response",
        "content": "{\n        \"allowed\": [\n            \"administrator\",\n            \"super-admin\"\n        ],\n        \"excluded\": [\n            \"banned\"\n        ]\n    }",
        "type": "json"
      },
      {
        "title": "List Usage",
        "content": "Reactium.Cloud.run('capability-get')",
        "type": "json"
      },
      {
        "title": "List Response Example",
        "content": "[\n       \"Capability.addField\",\n       \"Capability.create\",\n       \"Capability.delete\",\n       \"Capability.retrieve\",\n       \"Capability.update\",\n       \"Media.addField\",\n       \"Media.create\",\n       \"Media.delete\",\n       \"Media.retrieve\",\n       \"Media.update\",\n       \"Plugin.addField\",\n       \"Plugin.create\",\n       \"Plugin.delete\",\n       \"Plugin.retrieve\",\n       \"Plugin.update\",\n       \"Route.addField\",\n       \"Route.create\",\n       \"Route.delete\",\n       \"Route.retrieve\",\n       \"Route.update\",\n       \"Setting.addField\",\n       \"Setting.create\",\n       \"Setting.delete\",\n       \"Setting.retrieve\",\n       \"Setting.update\",\n       \"Token.addField\",\n       \"Token.create\",\n       \"Token.delete\",\n       \"Token.retrieve\",\n       \"Token.update\",\n       \"_Role.addField\",\n       \"_Role.create\",\n       \"_Role.delete\",\n       \"_Role.retrieve\",\n       \"_Role.update\",\n       \"blueprint.retrieve\",\n       \"user.admin\",\n       \"user.ban\",\n       \"user.view\"\n   ]",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/capability/capability-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Asynchronous",
    "url": "content-clone-branch",
    "title": "content-clone-branch",
    "description": "<p>Clone a branch / specific revision as a new branch.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "branchLabel",
            "description": "<p>New branch label.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "current",
            "defaultValue": "false",
            "description": "<p>When true, get the currently committed content (not from revision system). otherwise, construct the content from the provided history (branch and revision index).</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "history",
            "description": "<p>revision history to retrieve, containing branch and revision index.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The objectId for the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid for the content.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "String",
            "optional": true,
            "field": "branch",
            "defaultValue": "master",
            "description": "<p>the revision branch of current content</p>"
          }
        ]
      }
    },
    "name": "content_clone_branch",
    "group": "Cloud",
    "version": "0.0.0",
    "filename": ".core/plugin/content/content-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Asynchronous",
    "url": "content-create",
    "title": "content-create",
    "description": "<p>Create new content of a defined Type. In addition to the required parameters of <code>type</code> and <code>slug</code>, you can provide any parameter's that conform to the runtime fields saved for that type.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "slug",
            "description": "<p>The unique slug for the new content.</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "permissions",
            "defaultValue": "Array",
            "description": "<p>List of permissions to apply to content. If not provided, no ACL will be set.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "permission": [
          {
            "group": "permission",
            "type": "Object",
            "optional": false,
            "field": "permission",
            "description": "<p>Read or write</p>"
          },
          {
            "group": "permission",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>role or user</p>"
          },
          {
            "group": "permission",
            "type": "Object",
            "optional": true,
            "field": "objectId",
            "description": "<p>objectId of user</p>"
          },
          {
            "group": "permission",
            "type": "Object",
            "optional": true,
            "field": "name",
            "description": "<p>name of role</p>"
          }
        ]
      }
    },
    "name": "content_create",
    "group": "Cloud",
    "version": "0.0.0",
    "filename": ".core/plugin/content/content-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Asynchronous",
    "url": "content-delete",
    "title": "content-delete",
    "description": "<p>Delete content of a defined Type. To identify the content, you must provided the <code>type</code> object, and one of <code>slug</code>, <code>objectId</code>, or <code>uuid</code> of the content.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The Parse object id of the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid of the content.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ]
      }
    },
    "name": "content_delete",
    "group": "Cloud",
    "version": "0.0.0",
    "filename": ".core/plugin/content/content-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Asynchronous",
    "url": "content-delete-branch",
    "title": "content-delete-branch",
    "description": "<p>Delete a branch and mark its revisions for deletion.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "current",
            "defaultValue": "false",
            "description": "<p>When true, get the currently committed content (not from revision system). otherwise, construct the content from the provided history (branch and revision index).</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "history",
            "description": "<p>revision history to retrieve, containing branch and revision index.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The objectId for the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid for the content.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "String",
            "optional": true,
            "field": "branch",
            "defaultValue": "master",
            "description": "<p>the revision branch of current content</p>"
          }
        ]
      }
    },
    "name": "content_delete_branch",
    "group": "Cloud",
    "version": "0.0.0",
    "filename": ".core/plugin/content/content-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Asynchronous",
    "url": "content-label-branch",
    "title": "content-label-branch",
    "description": "<p>Clone a branch / specific region as a new branch.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "branchLabel",
            "description": "<p>New branch label.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "current",
            "defaultValue": "false",
            "description": "<p>When true, get the currently committed content (not from revision system). otherwise, construct the content from the provided history (branch and revision index).</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "history",
            "description": "<p>revision history to retrieve, containing branch and revision index.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The objectId for the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid for the content.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "String",
            "optional": true,
            "field": "branch",
            "defaultValue": "master",
            "description": "<p>the revision branch of current content</p>"
          }
        ]
      }
    },
    "name": "content_label_branch",
    "group": "Cloud",
    "version": "0.0.0",
    "filename": ".core/plugin/content/content-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Asynchronous",
    "url": "content-permissions",
    "title": "content-permissions",
    "description": "<p>Update permissions for content.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The Parse object id of the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid of the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "permissions",
            "description": "<p>List of permissions to apply to content. If unset, ACL will not be updated. If empty array, public read access will be applied.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "permission": [
          {
            "group": "permission",
            "type": "Object",
            "optional": false,
            "field": "permission",
            "description": "<p>Read or write</p>"
          },
          {
            "group": "permission",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>role or user</p>"
          },
          {
            "group": "permission",
            "type": "Object",
            "optional": true,
            "field": "objectId",
            "description": "<p>objectId of user</p>"
          },
          {
            "group": "permission",
            "type": "Object",
            "optional": true,
            "field": "name",
            "description": "<p>name of role</p>"
          }
        ]
      }
    },
    "name": "content_permissions",
    "group": "Cloud",
    "version": "0.0.0",
    "filename": ".core/plugin/content/content-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Asynchronous",
    "url": "content-restore",
    "title": "content-restore",
    "description": "<p>Restore deleted content of a defined Type (if still in recycle). To identify the content, you must provided the <code>type</code> object, and <code>objectId</code> of the content. Restores main record for content as well as any revisions.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "objectId",
            "description": "<p>The Parse object id of the deleted content.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ]
      }
    },
    "name": "content_restore",
    "group": "Cloud",
    "version": "0.0.0",
    "filename": ".core/plugin/content/content-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Asynchronous",
    "url": "content-retrieve",
    "title": "content-retrieve",
    "description": "<p>Retrieve one item of content.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "current",
            "defaultValue": "false",
            "description": "<p>When true, get the currently committed content (not from revision system). otherwise, construct the content from the provided history (branch and revision index).</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "history",
            "description": "<p>revision history to retrieve, containing branch and revision index.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The objectId for the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid for the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "attach",
            "defaultValue": "false",
            "description": "<p>boolean flag to attach Pointers and Relations.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "String",
            "optional": true,
            "field": "branch",
            "defaultValue": "master",
            "description": "<p>the revision branch of current content</p>"
          },
          {
            "group": "history",
            "type": "Number",
            "optional": true,
            "field": "revision",
            "description": "<p>index in branch history to retrieve (default index of latest revision)</p>"
          }
        ]
      }
    },
    "name": "content_retrieve",
    "group": "Cloud",
    "version": "0.0.0",
    "filename": ".core/plugin/content/content-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Asynchronous",
    "url": "content-revisions",
    "title": "content-revisions",
    "description": "<p>Retrieve branch history of some content.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "current",
            "defaultValue": "false",
            "description": "<p>When true, get the currently committed content (not from revision system). otherwise, construct the content from the provided history (branch and revision index).</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "history",
            "description": "<p>revision history to retrieve, containing branch and revision index.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The objectId for the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid for the content.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "String",
            "optional": true,
            "field": "branch",
            "defaultValue": "master",
            "description": "<p>the revision branch of current content</p>"
          }
        ]
      }
    },
    "name": "content_revisions",
    "group": "Cloud",
    "version": "0.0.0",
    "filename": ".core/plugin/content/content-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Asynchronous",
    "url": "content-schedule",
    "title": "content-schedule",
    "description": "<p>Schedule the publishing / unpublishing of content. If <code>history</code> is provided, that revision will be made current and published on optional <code>sunrise</code>. On optional <code>sunset</code>, the current version of the content will be unpublished. The requesting user must have publish and unpublish capabilities.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The Parse object id of the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid of the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "sunrise",
            "description": "<p>Optional ISO8601 + UTC Offset datetime string (moment.format()) for sunrise of content. e.g. 2020-02-07T11:15:04-05:00</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "sunset",
            "description": "<p>Optional ISO8601 + UTC Offset datetime string (moment.format()) for sunset of content. e.g. 2020-02-07T11:15:04-05:00</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "history",
            "description": "<p>revision history to retrieve, containing branch and revision index.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "String",
            "optional": true,
            "field": "branch",
            "defaultValue": "master",
            "description": "<p>the revision branch of current content</p>"
          },
          {
            "group": "history",
            "type": "Number",
            "optional": true,
            "field": "revision",
            "description": "<p>index in branch history to update (defaults to most recent in branch).</p>"
          }
        ]
      }
    },
    "name": "content_schedule",
    "group": "Cloud",
    "examples": [
      {
        "title": "Usage",
        "content": "const moment = require('moment');\nconst now = moment();\n\n// publish version 3 of master branch a month from now\n// unpublish the article in 2 months\nActinium.Cloud.run(\n  'content-schedule',\n  {\n    type: { machineName: 'article' },\n    slug: 'my-article',\n    history: { branch: 'master', revision: 3 },\n    sunrise: now.clone().add(1, 'month').format(),\n    sunset: now.clone().add(2, 'month').format(),\n  }\n);",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": ".core/plugin/content/content-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Asynchronous",
    "url": "content-set-current",
    "title": "content-set-current",
    "description": "<p>Take content from a specified branch or revision, and make it the &quot;official&quot; version of the content. If no <code>history</code> is param is specified the latest master branch revision will be used.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The Parse object id of the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid of the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "history",
            "description": "<p>revision history to retrieve, containing branch and revision index.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "String",
            "optional": true,
            "field": "branch",
            "defaultValue": "master",
            "description": "<p>the revision branch of current content</p>"
          },
          {
            "group": "history",
            "type": "Number",
            "optional": true,
            "field": "revision",
            "description": "<p>index in branch history to update (defaults to most recent in branch).</p>"
          }
        ]
      }
    },
    "name": "content_set_current",
    "group": "Cloud",
    "examples": [
      {
        "title": "Usage",
        "content": "Actinium.Cloud.run('content-set-current', {\n    // Type object required to look up content\n    // i.e. the collection is determined by the parent Type\n    type: {\n        // one of these 3 required to look up content\n        objectId: 'MvAerDoRQN',\n        machineName: 'article',\n        uuid: '975776a5-7070-5c23-bee6-4e9bba84a431',\n    },\n\n    // one of these 3 required to look up content\n    objectId: 'tEiojmmHA1',\n    slug: 'test-article1',\n    uuid: '5320803c-b709-5327-a06f-b482c8f41b92',\n\n    history: { branch: 'master' }\n});",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": ".core/plugin/content/content-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Asynchronous",
    "url": "content-update",
    "title": "content-update",
    "description": "<p>Update content of a defined Type. In addition to the required parameters of <code>type</code> and <code>slug</code>, you can provide any parameter's that conform to the runtime fields saved for that type. Changes to content will be staged as a new delta revision. If no <code>history</code> (branch and revision index) are provided A new revision will be added in the master branch. To commit a revision to your content collection, use <code>content-set-current</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Type object, or at minimum the properties required <code>type-retrieve</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "slug",
            "description": "<p>The unique slug for the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The Parse object id of the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>The uuid of the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "history",
            "description": "<p>revision history to retrieve, containing branch and revision index.</p>"
          }
        ],
        "type": [
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "type",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "String",
            "optional": true,
            "field": "branch",
            "defaultValue": "master",
            "description": "<p>the revision branch of current content</p>"
          },
          {
            "group": "history",
            "type": "Number",
            "optional": true,
            "field": "revision",
            "description": "<p>index in branch history to update (defaults to most recent in branch). If you select a revision before the latest revision, a new branch will be created.</p>"
          }
        ]
      }
    },
    "name": "content_update",
    "group": "Cloud",
    "examples": [
      {
        "title": "Usage",
        "content": "Actinium.Cloud.run('content-update', {\n    // Type object required to look up content\n    // i.e. the collection is determined by the parent Type\n    type: {\n        // one of these 3 required to look up content\n        objectId: 'MvAerDoRQN',\n        machineName: 'article',\n        uuid: '975776a5-7070-5c23-bee6-4e9bba84a431',\n    },\n\n    // one of these 3 required to look up content\n    objectId: 'tEiojmmHA1',\n    slug: 'test-article1',\n    uuid: '5320803c-b709-5327-a06f-b482c8f41b92',\n\n    // optionally set meta data for the content\n    meta: {},\n\n    // Any additional field as defined in the Type object `fields`.\n    // Can be different from one type to another.\n    title: 'Test Article',\n    body: {\n       children: [\n           {\n               text: 'simple text',\n           },\n       ],\n    },\n\n    // Update the latest master revision\n    history: { branch: 'master' }\n});",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": ".core/plugin/content/content-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "directories",
    "title": "directories",
    "version": "3.1.3",
    "group": "Cloud",
    "name": "directories",
    "description": "<p>Retrieves the complete list of Media directories. Runs the <code>directory-query</code> hook allowing you to change or replace the default query. The results are reduced based on the capabilities applied to each directory and the current user request.</p> <p>Permission: <code>Media.retrieve</code> <em>(use the <strong>media.capabilities.list</strong> setting to change)</em>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "search",
            "description": "<p>Search for a specific directory. Uses <code>Parse.Query.startsWith()</code> to execute the query.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "verbose",
            "description": "<p>Return an Array of ParseObjects instead of the default array of strings.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "Actinium.Cloud.run('directories').then(directories => {\n    console.log(directories);\n});",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/media/plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "directory-delete",
    "title": "directory-delete",
    "version": "3.1.3",
    "group": "Cloud",
    "name": "directory_delete",
    "description": "<p>Delete a directory from the <code>MediaDirectory</code> table.</p> <p>This will NOT delete the files within the directory.</p> <p><em>Use the <code>media-delete</code> function for deleting a directory of files.</em></p> <p>Permission: <code>Media.create</code> <em>(use the <strong>media.capabilities.directory</strong> setting to change)</em></p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "directory",
            "description": "<p>The directory path.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "Actinium.Cloud.run('directory-delete', { directory: 'avatars' });",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/media/plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "directory-save",
    "title": "directory-save",
    "version": "3.1.3",
    "group": "Cloud",
    "name": "directory_save",
    "description": "<p>Create or update a new Media directory.</p> <p>Permission: <code>Media.create</code> <em>(use the <strong>media.capabilities.directory</strong> setting to change)</em>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "directory",
            "description": "<p>The directory path.</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "capabilities",
            "defaultValue": "[Media.create]",
            "description": "<p>The capabilities array.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "objectId",
            "description": "<p>Used when updating an existing directory object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "permissions",
            "description": "<p>List of permissions to apply to the directory. If empty the directory is read/write for all users.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "Actinium.Cloud.run('directory-save', {\n    directory: 'uploads',\n    capabilities: ['Media.create']\n    permissions: [\n      { objectId: \"Lxank79qjx\", type: \"role\", permission: \"write\", name: \"super-admin\" },\n      { objectId: \"s0UJ2Hk7XC\", type: \"user\", permission: \"write\" }\n    ]\n}).then(result => {\n    console.log(result);\n});",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/media/plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "media",
    "title": "media",
    "version": "3.1.3",
    "group": "Cloud",
    "name": "media",
    "description": "<p>Retrieves a paginated list of <code>Media</code> objects.</p> <p>Permission: <code>Media.retrieve</code> <em>(use the <strong>media.capabilities.retrieve</strong> setting to change)</em></p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "directory",
            "description": "<p>Retrieve a specific directory.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "search",
            "description": "<p>Search for a specific <code>url</code> or <code>filename</code>.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>Return the specified page of the results.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "50",
            "description": "<p>Number of objections to return per page.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "Actinium.Cloud.run('media', { page: 1, limit: 20 directory: 'avatars', search: 'user-123.jpg'});",
        "type": "json"
      },
      {
        "title": "Returns",
        "content": "{\n    files: Object,\n    directories: Array,\n    count: Number\n    page: Number,\n    pages: Number,\n    index: Number,\n    limit: Number,\n    next: Number,\n    prev: Number\n}",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/media/plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "media-delete",
    "title": "media-delete",
    "version": "3.1.3",
    "group": "Cloud",
    "name": "media_delete",
    "description": "<p>Delete a single file or directory containing multiple files.</p> <p>The file to search for will be matched against the following fields: <code>url, objectId, uuid, filename, directory</code></p> <p>When deleting based on <code>filename</code> or <code>directory</code> There are a couple protections built in:</p> <ol> <li>You must specify <code>useMasterKey</code> in the run <code>options</code> object.</li> <li>Only 50 files will be deleted per request.</li> </ol> <p>Permission: <code>Media.create</code> <em>(use the <strong>media.capabilities.upload</strong> setting to change)</em></p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "match",
            "description": "<p>The search string.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "// URL delete\nActinium.Cloud.run('media-delete', { match: '/uploads/some-file.txt' });\n\n// Directory Delete\nActinium.Cloud.run('media-delete', { match: '/uploads' }, { useMasterKey: true });",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/media/plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Asynchronous",
    "url": "media-image-crop",
    "title": "media-image-crop",
    "version": "3.1.3",
    "group": "Cloud",
    "name": "media_image_crop",
    "description": "<p>Generate a cropped version of the specified image from an <code>Actinium.File</code> object or image URL. Useful for creating thumbnails or responsive image sizes. Returns: <code>Actinium.File</code> object.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "url",
            "description": "<p><code>String</code> or <code>Actinium.File</code> object. The source image url. If the value is an <code>Actinium.File</code> object, the <code>Actinium.File.url()</code> value used to fetch the image.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>The Parse Object to attach the cropped image to.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "field",
            "defaultValue": "thumbnail",
            "description": "<p>The field to attach the new image to. Used when the <code>objectId</code> parameter is set.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "options",
            "description": "<p>Sharp image <a href=\"https://sharp.pixelplumbing.com/api-resize\">resize</a> options. By default, <code>width</code> and <code>height</code> are set to <code>400</code>.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "...\nconst thumbnail = await Actinium.Cloud.run('media-image-crop', {\n    url: 'http://somesite/someimage.jpg',\n    options: { width: 200, height: 200 }\n});\n...",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/media/plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "media-retrieve",
    "title": "media-retrieve",
    "version": "3.1.7",
    "group": "Cloud",
    "name": "media_retrieve",
    "description": "<p>Retrieves a specific <code>Media</code> object.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "directory",
            "description": "<p>Retrieve a file by it's directory value. You must also specify <code>filename</code>.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "filename",
            "description": "<p>Retrieve a file by it's filename value. You must also specify <code>directory</code>.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Retrieve a file by it's objectId value.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>Retrieve a file by it's uuid value.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "url",
            "description": "<p>Retrieve a file by it's url value.</p>"
          }
        ]
      }
    },
    "filename": ".core/plugin/media/plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "media-update",
    "title": "media-update",
    "version": "3.1.3",
    "group": "Cloud",
    "name": "media_update",
    "description": "<p>Function that updates a Media Object.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>The Media Object data to update.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": ".objectId",
            "description": "<p>The <code>objectId</code> field is required and is used to fetch the Media Object to update.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": ".filedata",
            "description": "<p>If you're trying replace the <code>file</code> object via dataurl, you can pass the <code>filedata</code> property to accomplish this.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Parse options object.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "const updatedMediaObj = await Parse.Cloud.run('media-update', {\n    objectId: 'tP66wMkNPx',\n    filename: 'different-file-name.jpg',\n    meta: {\n        title: 'A new title',\n        description: 'A new decription',\n    }\n}, {\n    useMasterKey: true,\n});",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/media/plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "media-upload",
    "title": "media-upload",
    "version": "3.1.3",
    "group": "Cloud",
    "name": "media_upload",
    "description": "<p>Cloud function that creates a file and adds it to the Media Library.</p> <p>Permission: <code>Media.create</code> <em>(use the <strong>media.capabilities.upload</strong> setting to change)</em></p> <p>Returns: <code>Parse.Object('Media')</code></p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "data",
            "description": "<p>The contents of the file. This can be any valid <code>Actinium.File</code> file data value.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "meta",
            "description": "<p>The meta object for the file upload.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": ".directory",
            "description": "<p>The directory where the file will be saved. Required.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": ".filename",
            "description": "<p>The file name. Required.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": ".size",
            "description": "<p>The number of bytes the file contains.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": ".ID",
            "description": "<p>Unique ID of the file. If empty, a new UUID will be created.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Base64 Example:",
        "content": "const upload = {\n    data: { base64: \"V29ya2luZyBhdCBQYXJzZSBpcyBncmVhdCE=\" }\n    meta: {\n        directory: 'uploads',\n        filename: 'avatar.png',\n        size: 139894\n    }\n};\n\nActinium.Cloud.run('media-upload', upload);",
        "type": "json"
      },
      {
        "title": "ByteArray Example:",
        "content": "const upload = {\n    data: [ 0xBE, 0xEF, 0xCA, 0xFE ],\n    meta: {\n        directory: 'uploads',\n        filename: 'avatar.png',\n        size: 139894\n    }\n};\n\nActinium.Cloud.run('media-upload', upload);",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/media/plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "plugin-activate",
    "title": "plugin-activate",
    "version": "3.0.5",
    "group": "Cloud",
    "name": "plugin_activate",
    "description": "<p>Activate a plugin</p> <p>The <code>activate</code> hook will be run when a plugin is activated.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "plugin",
            "description": "<p>The ID of the plugin to activate.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Cloud.run('plugin-activate', { plugin: 'TEST-PLUGIN' });\n\n// Returns the Plugin object on success",
        "type": "json"
      }
    ],
    "filename": ".core/cloud/actinium-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "plugin-deactivate",
    "title": "plugin-deactivate",
    "version": "3.0.5",
    "group": "Cloud",
    "name": "plugin_deactivate",
    "description": "<p>Deactivate a plugin.</p> <p>The <code>deactivate</code> hook will be run when a plugin is deactivated.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "plugin",
            "description": "<p>The ID of the plugin to deactivate.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Cloud.run('plugin-deactivate', { plugin: 'TEST-PLUGIN' });\n\n// Returns the Plugin object on success",
        "type": "json"
      }
    ],
    "filename": ".core/cloud/actinium-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "plugin-uninstall",
    "title": "plugin-uninstall",
    "version": "3.0.5",
    "group": "Cloud",
    "name": "plugin_uninstall",
    "description": "<p>Uninstall a plugin.</p> <p>The <code>deactivate</code> and <code>uninstall</code> hooks will be run when a plugin is uninstalled.</p> <p><em>If the server restarts, the plugin will be installed again unless you remove it from the server by either.</em></p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "plugin",
            "description": "<p>The ID of the plugin to uninstall.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Cloud.run('plugin-deactivate', { plugin: 'TEST-PLUGIN' });\n\n// Returns the Plugin object on success",
        "type": "json"
      }
    ],
    "filename": ".core/cloud/actinium-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "plugins",
    "title": "plugins",
    "version": "3.0.5",
    "group": "Cloud",
    "name": "plugins",
    "description": "<p>Retrieves the list of plugins.</p>",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Cloud.run('plugins');",
        "type": "json"
      }
    ],
    "filename": ".core/cloud/actinium-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "recycle",
    "title": "recycle",
    "version": "3.1.7",
    "group": "Cloud",
    "name": "recycle",
    "description": "<p>Move a <code>Parse.Object</code> to the <code>Recycle</code> collection and mark it as a <code>delete</code> type.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "collection",
            "description": "<p>The Parse.Object type.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "object",
            "description": "<p>The Parse.Object data.</p>"
          },
          {
            "group": "Parameter",
            "type": "Parse.User",
            "optional": true,
            "field": "user",
            "description": "<p>The Parse.User object.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Cloud.run('recycle', {\n  collection: 'SomeCollection',\n  object: SomeObject,\n});",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/recycle/recycle-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "recycle-archive",
    "title": "recycle-archive",
    "version": "3.1.7",
    "group": "Cloud",
    "name": "recycle_archive",
    "description": "<p>Move a <code>Parse.Object</code> to the <code>Recycle</code> collection and mark it as an <code>archve</code> type.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "collection",
            "description": "<p>The Parse.Object type.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "object",
            "description": "<p>The Parse.Object data.</p>"
          },
          {
            "group": "Parameter",
            "type": "Parse.User",
            "optional": true,
            "field": "user",
            "description": "<p>The Parse.User object.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Cloud.run('recycle-archive', {\n  collection: '_User',\n  object: MyUserObject,\n});",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/recycle/recycle-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "recycle-archived",
    "title": "recycle-archived",
    "version": "3.1.7",
    "group": "Cloud",
    "name": "recycle_archived",
    "description": "<p>Retrieve a paginated list of archived <code>Recycle</code> objects.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "collection",
            "description": "<p>Retrieve specific collection objects.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>The results page to return.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "1000",
            "description": "<p>The number of results to return per page.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Cloud.run('recycle-archived', { collection: '_User' });",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/recycle/recycle-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "recycle-purge",
    "title": "recycle-purge",
    "version": "3.1.7",
    "group": "Cloud",
    "name": "recycle_purge",
    "description": "<p>Clear the <code>Recycle</code> collection.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "collection",
            "description": "<p>Purge specific collection objects.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Delete a specific collection object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "type",
            "description": "<p>Delete a specific type of Recycle objects. Valid options: <code>archive</code>, <code>delete</code>, <code>revision</code>.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Cloud.run('recycle-purge', { collect: '_User' });",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/recycle/recycle-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "recycle-restore",
    "title": "recycle-restore",
    "version": "3.1.7",
    "group": "Cloud",
    "name": "recycle_restore",
    "description": "<p>Restore a <code>Parse.Object</code> to it's original collection.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "collection",
            "description": "<p>Restore the most recent specified collection object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Restore a specific collection object.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Cloud.run('recycle-restore', { object: 'aetkalq43r'});",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/recycle/recycle-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "recycle-revision",
    "title": "recycle-revision",
    "version": "3.1.7",
    "group": "Cloud",
    "name": "recycle_revision",
    "description": "<p>Move a <code>Parse.Object</code> to the <code>Recycle</code> collection and mark it as a <code>revision</code> type.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "collection",
            "description": "<p>The Parse.Object type.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "object",
            "description": "<p>The Parse.Object data.</p>"
          },
          {
            "group": "Parameter",
            "type": "Parse.User",
            "optional": true,
            "field": "user",
            "description": "<p>The Parse.User object.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Cloud.run('recycle-revision', {\n  collection: 'SomeCollection',\n  object: SomeObject,\n});",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/recycle/recycle-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "recycle-revisions",
    "title": "recycle-revisions",
    "version": "3.1.7",
    "group": "Cloud",
    "name": "recycle_revisions",
    "description": "<p>Retrieve a paginated list of revision <code>Recycle</code> objects.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "collection",
            "description": "<p>Retrieve specific collection objects.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>The results page to return.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "1000",
            "description": "<p>The number of results to return per page.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Cloud.run('recycle-revisions', { collection: '_User' });",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/recycle/recycle-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "recycled",
    "title": "recycled",
    "version": "3.1.7",
    "group": "Cloud",
    "name": "recycled",
    "description": "<p>Retrieve a paginated list of trashed <code>Recycle</code> objects.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "collection",
            "description": "<p>Retrieve specific collection objects.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>The results page to return.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "1000",
            "description": "<p>The number of results to return per page.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Cloud.run('recycled', { collection: '_User' });",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/recycle/recycle-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "role",
    "title": "role",
    "version": "3.0.5",
    "group": "Cloud",
    "name": "role",
    "description": "<p>Get a role.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "search",
            "description": "<p>The role ID, level, or name.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Cloud.run('role', { search: 'super-admin' });",
        "type": "json"
      },
      {
        "title": "Returns",
        "content": "{\n    \"super-admin\": {\n        \"name\": \"super-admin\",\n        \"label\": \"Super Administrator\",\n        \"level\": 10000,\n        \"users\": {\n            \"HrIE319DdZ\": {\n                \"avatar\": \"https://media.licdn.com/dms/image/C4E03AQED89TDXv9FgA/profile-displayphoto-shrink_200_200/0?e=1578528000&v=beta&t=As6LzG8uZNA2eqq6KcrEAzfxhtRJxmSRTMZEw-nss7A\",\n                \"objectId\": \"HrIE319DdZ\",\n                \"username\": \"cam\"\n            }\n        },\n        \"roles\": {\n            \"6CX7sAaV1S\": {\n                \"label\": \"Standard User\",\n                \"level\": 1,\n                \"name\": \"user\",\n                \"objectId\": \"6CX7sAaV1S\"\n            },\n            \"VHFAoFXSTz\": {\n                \"label\": \"Moderator\",\n                \"level\": 100,\n                \"name\": \"moderator\",\n                \"objectId\": \"VHFAoFXSTz\"\n            },\n            \"XF7ByHfaEe\": {\n                \"label\": \"Contributor\",\n                \"level\": 10,\n                \"name\": \"contributor\",\n                \"objectId\": \"XF7ByHfaEe\"\n            },\n            \"kDIUBqCNXW\": {\n                \"label\": \"Administrator\",\n                \"level\": 1000,\n                \"name\": \"administrator\",\n                \"objectId\": \"kDIUBqCNXW\"\n            }\n        },\n        \"objectId\": \"Lxank79qjd\"\n    }\n}",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/roles/roles-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "roles",
    "title": "roles",
    "version": "3.0.5",
    "group": "Cloud",
    "name": "roles",
    "description": "<p>Get the list of roles.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "search",
            "description": "<p>The role ID, level, or name.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Cloud.run('roles', { search: 'super-admin' });",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/roles/roles-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "routes",
    "title": "routes",
    "version": "3.1.2",
    "group": "Cloud",
    "name": "route",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "1000",
            "description": "<p>Limit of routes to return.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "0",
            "description": "<p>The results page to return. If value is less than 1, all routes are returned.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "route",
            "description": "<p>The name of an existing route.</p>"
          }
        ]
      }
    },
    "description": "<p>Retrieve list of routes. Routes are access controlled by user capabilities.</p>",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "// Get first page of routes\nActinium.Cloud.run('routes', { page: 1 });\n\n// Get all routes\nActinium.Cloud.run('routes');",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/route/plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "routes",
    "title": "routes",
    "version": "3.1.2",
    "group": "Cloud",
    "name": "route",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "1000",
            "description": "<p>Limit number of routes to return.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "0",
            "description": "<p>The results page to return. If page is less than 1, all routes are returned.</p>"
          }
        ]
      }
    },
    "description": "<p>Retrieve list of routes. Routes are access controlled by user capabilities.</p>",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "// Get first page of routes\nActinium.Cloud.run('routes', { page: 1 });\n\n// Get all routes\nActinium.Cloud.run('routes');",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/route/plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "route-delete",
    "title": "route-delete",
    "version": "3.1.2",
    "group": "Cloud",
    "name": "route_delete",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>the object id of the existing route</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "route",
            "description": "<p>The the existing route string.</p>"
          }
        ]
      }
    },
    "description": "<p>Delete existing route. Built-in routes can not be deleted by default.</p>",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Cloud.run('route-delete', {\n    route: '/hello-world',\n});",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/route/plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "route-retrieve",
    "title": "route-retrieve",
    "version": "3.1.2",
    "group": "Cloud",
    "name": "route_retrieve",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "route",
            "description": "<p>The name of an existing route.</p>"
          }
        ]
      }
    },
    "description": "<p>Retrieve the specified route.</p>",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "// Get the /hello-world route\nActinium.Cloud.run('route-retrieve', { route: '/hello-world'});",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/route/plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "route-save",
    "title": "route-save",
    "version": "3.5.5",
    "group": "Cloud",
    "name": "route_save",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "route",
            "description": "<p>The route string.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "blueprint",
            "description": "<p>The blueprint id of the associated blueprint.</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "capabilities",
            "defaultValue": "[",
            "description": "<p>Array of capabilities (object-path format)</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "meta",
            "description": "<p>free-form metadata object</p>"
          }
        ]
      }
    },
    "description": "<p>Create a new route for use in a front-end application.</p>",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Cloud.run('route-save', {\n        route: '/hello-world',\n        blueprint: 'Simple',\n        capabilities: ['admin-ui.view'],\n        meta: {\n            foo: 'bar',\n        },\n    },\n);",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/route/plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Asynchronous",
    "url": "search",
    "title": "search",
    "description": "<p>Search content.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "index",
            "description": "<p>The index to search</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "search",
            "description": "<p>The search terms</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>Page number of results</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "1000",
            "description": "<p>Limit page results</p>"
          }
        ]
      }
    },
    "name": "search",
    "group": "Cloud",
    "version": "0.0.0",
    "filename": ".core/plugin/search/search-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Asynchronous",
    "url": "search-index",
    "title": "search-index",
    "description": "<p>Trigger index of a content type. User must have <code>Search.index</code> capability.</p>",
    "name": "search_index",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>Params required to lookup content type with <code>type-retrieve</code></p>"
          }
        ]
      }
    },
    "group": "Cloud",
    "version": "0.0.0",
    "filename": ".core/plugin/search/search-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "setting-get",
    "title": "setting-get",
    "version": "3.1.1",
    "group": "Cloud",
    "name": "setting_get",
    "description": "<p>Retrieves a specifc setting object. Capabilities will be enforced.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>The unique setting key.</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "`Setting.retrieve` or `setting.${key}-get` capabilities."
      }
    ],
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Cloud.run('setting-get', { key: 'site'});",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/settings/settings-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "setting-set",
    "title": "setting-set",
    "version": "3.1.1",
    "group": "Cloud",
    "name": "setting_set",
    "description": "<p>Create or update a setting object. Capabilities will be enforced.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>The unique setting key.</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "value",
            "description": "<p>The setting value.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "public",
            "description": "<p>When true, the setting will be made publicly readable, otherwise reads will be restricted.</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "`Setting.create`, `Setting.update` or `setting.${key}-set` capabilities."
      }
    ],
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Cloud.run('setting-set', { key: 'site', value: {title: 'My Site', hostname: 'mysite.com'}, public: true});",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/settings/settings-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "setting-unset",
    "title": "setting-unset",
    "version": "3.1.1",
    "group": "Cloud",
    "name": "setting_unset",
    "description": "<p>Unsets a setting value. Capabilities will be enforced.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>The unique setting key.</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "`Setting.delete` or `setting.${key}-delete` capabilities."
      }
    ],
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Cloud.run('setting-unset', { key: 'site' });",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/settings/settings-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "settings",
    "title": "settings",
    "version": "3.1.1",
    "group": "Cloud",
    "name": "settings",
    "description": "<p>Retrieves the list of settings. Capabilities will be enforced.</p>",
    "permission": [
      {
        "name": "`Setting.retrieve` or individual `setting.${key}-get` permissions."
      }
    ],
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Cloud.run('settings');",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/settings/settings-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "syndicate-satellite-sync",
    "title": "syndicate-satellite-sync",
    "description": "<p>Manually trigger a content synchronization from root site as administrator.</p>",
    "permission": [
      {
        "name": "Syndicate.ManualSync"
      }
    ],
    "group": "Cloud",
    "name": "syndicate_satellite_sync",
    "version": "0.0.0",
    "filename": ".core/plugin/syndicate-client/plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "syndicate-satellite-sync-reset",
    "title": "syndicate-satellite-sync-reset",
    "description": "<p>Reset sync status to idle, allowing a manual sync.</p>",
    "permission": [
      {
        "name": "Syndicate.ManualSync"
      }
    ],
    "group": "Cloud",
    "name": "syndicate_satellite_sync_reset",
    "version": "0.0.0",
    "filename": ".core/plugin/syndicate-client/plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Asynchronous",
    "url": "type-create",
    "title": "type-create",
    "description": "<p>Save a content type definition.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>unique label of content type. On save, this will be used to generate the machineName and label of the type.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "namespace",
            "description": "<p>the optional uuid to be used as the uuid/v5 namespace of to create the uuid of the new type. This will use the api's configured namespace by default.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "regions",
            "description": "<p>indexed by region id, this object contains multiple region objects, each with the same id ('default' by default), a label, and a slug. Each field in the <code>fields</code> has a <code>region</code> property with the id of the region to which it belongs.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "fields",
            "description": "<p>indexed by fieldId (an uuid), this object contains 1 or more objects that describe the configuration for one &quot;field type&quot; in the content type. The only required properties in each object are <code>fieldId</code>, which matches the index, a string <code>fieldType</code> which identifies a supported Actinium field type, a string <code>region</code>id (&quot;default&quot; region id by default), and a unique <code>fieldName</code> which will ultimately be the name of the field in the content schema.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "meta",
            "description": "<p>largely free-form metadata object associated with this content type. Actinium will use this to store the current label of the type.</p>"
          }
        ]
      }
    },
    "name": "type_create",
    "group": "Cloud",
    "version": "0.0.0",
    "filename": ".core/plugin/type/type-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Asynchronous",
    "url": "type-delete",
    "title": "type-delete",
    "description": "<p>Delete a content type configuration. Note that this will not delete the content or its schema, only the content type configuration.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "namespace",
            "description": "<p>optional namespace. Will be used to derive the uuid from the machine name if the uuid is not known. By default, the current APIs content namespace will be used, and this will not be needed.</p>"
          }
        ]
      }
    },
    "name": "type_delete",
    "group": "Cloud",
    "version": "0.0.0",
    "filename": ".core/plugin/type/type-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Asynchronous",
    "url": "type-retrieve",
    "title": "type-retrieve",
    "description": "<p>Retrieve configuration for one content type. You must provide either the id|ID|objectId, uuid or the machineName.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "id",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "ID",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "objectId",
            "description": "<p>Parse objectId of content type</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "collection",
            "description": "<p>the collection associated with the content type</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "namespace",
            "description": "<p>optional namespace. Will be used to derive the uuid from the machine name if the uuid is not known. By default, the current APIs content namespace will be used, and this will not be needed.</p>"
          }
        ]
      }
    },
    "name": "type_retrieve",
    "group": "Cloud",
    "version": "0.0.0",
    "filename": ".core/plugin/type/type-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Asynchronous",
    "url": "type-status",
    "title": "type-status",
    "description": "<p>Get content type collection, content count, field slugs.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "namespace",
            "description": "<p>optional namespace. Will be used to derive the uuid from the machine name if the uuid is not known. By default, the current APIs content namespace will be used, and this will not be needed.</p>"
          }
        ]
      }
    },
    "name": "type_status",
    "group": "Cloud",
    "version": "0.0.0",
    "filename": ".core/plugin/type/type-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Asynchronous",
    "url": "type-update",
    "title": "type-update",
    "description": "<p>Save an existing content type definition. To target the existing content type, you must provide either the uuid or the machineName and optionally the content namespace used during the creation of the type.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "uuid",
            "description": "<p>UUID of content type</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "namespace",
            "description": "<p>optional namespace. Will be used to derive the uuid from the machine name if the uuid is not known. By default, the current APIs content namespace will be used, and this will not be needed.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>unique label of content type. Only the label will be modified, and the machineName will remain the same.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "regions",
            "description": "<p>indexed by region id, this object contains multiple region objects, each with the same id ('default' by default), a label, and a slug. Each field in the <code>fields</code> has a <code>region</code> property with the id of the region to which it belongs.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "fields",
            "description": "<p>indexed by fieldId (an uuid), this object contains 1 or more objects that describe the configuration for one &quot;field type&quot; in the content type. The only required properties in each object are <code>fieldId</code>, which matches the index, a string <code>fieldType</code> which identifies a supported Actinium field type, a string <code>region</code>id (&quot;default&quot; region id by default), and a unique <code>fieldName</code> which will ultimately be the name of the field in the content schema.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "meta",
            "description": "<p>largely free-form metadata object associated with this content type. Actinium will use this to store the current label of the type.</p>"
          }
        ]
      }
    },
    "name": "type_update",
    "group": "Cloud",
    "version": "0.0.0",
    "filename": ".core/plugin/type/type-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Asynchronous",
    "url": "types",
    "title": "types",
    "description": "<p>Retrieve a list of the existing content types.</p>",
    "name": "types",
    "group": "Cloud",
    "version": "0.0.0",
    "filename": ".core/plugin/type/type-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "user-find",
    "title": "user-find",
    "version": "3.0.5",
    "group": "Cloud",
    "name": "user_find",
    "description": "<p>Find a user. Triggers the <code>user-before-find</code> hook.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "objectId",
            "description": "<p>Search by the objectId field.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Search by the username field.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Search by the email field.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>The results page.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "1000",
            "description": "<p>The number of results per page.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "Actinium.Cloud.run('user-find', { objectId: 'HrIE319Ddx' });",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/users/users-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "user-save",
    "title": "user-save",
    "version": "3.0.5",
    "group": "Cloud",
    "name": "user_save",
    "description": "<p>Save a <code>Parse.User</code> object. If the user does not exist, it will be created. The following parameters are default. You can supply additional parameters that will alter the User collection. Triggers the <code>user-before-save</code> and <code>user-after-save</code> hooks.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "objectId",
            "description": "<p>The unique objectId. Required when updating a user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>The unique username.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>The unique email address.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>The user password used when signing in.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "role",
            "description": "<p>The user role. Used when determining access to certain features.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "fname",
            "description": "<p>The user's first name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "lname",
            "description": "<p>The user's last name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "avatar",
            "description": "<p>The url to the user's profile picture. If the avatar value is a base64 encoded string, a new Actinium.File object will be created and the Actinium.File.url() value will be used as the avatar url.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "Actinium.Cloud.run('user-save', {\n    username: 'FalconPilot',\n    email: 'hansoff@falcon.net',\n    password: 'Gr33d0Sh0tF!rst',\n    role: 'administrator',\n    fname: 'Han',\n    lname: 'Solo',\n    avatar: 'https://media.giphy.com/media/3ornjSL2sBcPflIDiU/giphy.gif'\n});",
        "type": "json"
      }
    ],
    "filename": ".core/plugin/users/users-plugin.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Hook",
    "url": "content-before-save",
    "title": "content-before-save",
    "description": "<p>Called after content saved with <code>Content.create()</code> or <code>Content.update()</code></p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "contentObj",
            "description": "<p>the Content Actinium.Object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "typeObj",
            "description": "<p>the content Type Actinium.Object</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "isNew",
            "description": "<p>If the content object is new or existing.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>The request.params object.</p>"
          }
        ]
      }
    },
    "name": "content_before_save",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "content-default-change-types",
    "title": "content-default-change-types",
    "description": "<p>Hook during <code>start</code> if content plugin is active. You can use this to add additional change log reasons.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "STATUS",
            "description": "<p>pass by reference, built-in statuses</p>"
          }
        ]
      }
    },
    "name": "content_default_change_types",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/plugin/content/content-plugin.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "content-default-statuses",
    "title": "content-default-statuses",
    "description": "<p>Hook during <code>start</code> if content plugin is active. You can use this to add additional default content statuses (e.g. DRAFT, PUBLISHED)</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "STATUS",
            "description": "<p>pass by reference, built-in statuses</p>"
          }
        ]
      }
    },
    "name": "content_default_statuses",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/plugin/content/content-plugin.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "content-deleted",
    "title": "content-deleted",
    "description": "<p>Called after <code>Content.delete()</code></p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "contentObj",
            "description": "<p>The Content Object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "typeObj",
            "description": "<p>The Type Object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "trash",
            "description": "<p>The Trash Object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>The request.params object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>The Cloud run options</p>"
          }
        ]
      }
    },
    "name": "content_deleted",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "content-field-sanitize",
    "title": "content-field-sanitize",
    "description": "<p>Triggered during <code>Content.sanitize()</code> (content creation / updates). Used to sanitize data into sane fieldSlug=&gt;fieldValue key pairs, which will be set on content object. Useful for normalizing data before it is stored in Parse column. Note this will only be called for fields that have a defined schema. See <code>content-schema-field-types</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>the params object passed to the hook</p>"
          }
        ],
        "params": [
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "field",
            "description": "<p><code>{fieldSlug, fieldValue}</code> the key-pair for this field</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "fieldConfig",
            "description": "<p>the configuration of this field (including <code>fieldType</code>) stored in the type</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "fieldData",
            "description": "<p>object of all permitted field data, indexed by fieldSlug.</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>object passed to <code>Content.sanitize()</code></p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "fieldSchema",
            "description": "<p>The schema of the field in DB</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "fullSchema",
            "description": "<p>The full schema of all fields in DB</p>"
          },
          {
            "group": "params",
            "type": "Object",
            "optional": false,
            "field": "permittedFields",
            "description": "<p>Field types that are registered for schema.</p>"
          },
          {
            "group": "params",
            "type": "ActiniumObject",
            "optional": false,
            "field": "object",
            "description": "<p>the Actinium.Object to be saved</p>"
          }
        ]
      }
    },
    "name": "content_field_sanitize",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "content-list",
    "title": "content-list",
    "description": "<p>Called before the response object is return from Content.list()</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "response",
            "description": "<p>Response object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>The request.params object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>The request options object</p>"
          }
        ]
      }
    },
    "name": "content_list",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "content-published",
    "title": "content-published",
    "description": "<p>Called after <code>Content.publish()</code></p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "contentObj",
            "description": "<p>the published content object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "typeObj",
            "description": "<p>the type of the content</p>"
          }
        ]
      }
    },
    "name": "content_published",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "content-query",
    "title": "content-query",
    "description": "<p>Called before a content query has taken place via Content.list() function.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "query",
            "description": "<p>Actinium Query object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>The request.params object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>The request options object</p>"
          }
        ]
      }
    },
    "name": "content_query",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "content-query-results",
    "title": "content-query-results",
    "description": "<p>Called after a content query has taken place via Content.list() function.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "results",
            "description": "<p>Array of Actinium Objects</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>The request.params object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>The request options object</p>"
          }
        ]
      }
    },
    "name": "content_query_results",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "content-restored",
    "title": "content-restored",
    "group": "Hooks",
    "name": "content_restored",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "contentObj",
            "description": "<p>The content marked trash</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "typeObj",
            "description": "<p>The type of the content</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>The request.params object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>The options object</p>"
          }
        ]
      }
    },
    "description": "<p>Called after <code>Content.restore()</code></p>",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "content-retrieve",
    "title": "content-retrieve",
    "description": "<p>Called after a content object is retrieved via Content.retrieve() function.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "contentObject",
            "description": "<p>Serialized Actinium Content Object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>The request.params object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>The request options object</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "isCurrent",
            "description": "<p>Will be true if this response represents the current full version of the content, or a revision.</p>"
          }
        ]
      }
    },
    "name": "content_retrieve",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "content-saved",
    "title": "content-saved",
    "description": "<p>Called after content saved with <code>Content.create()</code> or <code>Content.update()</code></p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "contentObj",
            "description": "<p>the saved content object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "typeObj",
            "description": "<p>the type of the content</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "isNew",
            "description": "<p>If the content object is new or existing.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>The request.params object.</p>"
          }
        ]
      }
    },
    "name": "content_saved",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "content-schema",
    "title": "content-schema",
    "description": "<p>Hook called during content type schema creation/updates. Useful for changing default base fields/columns that will be created for one or more content types.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "schema",
            "description": "<p>pass by reference base schema (not including those provided by Type fields).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "machineName",
            "description": "<p>machine name of the type.</p>"
          }
        ]
      }
    },
    "name": "content_schema",
    "group": "Hooks",
    "examples": [
      {
        "title": "Usage",
        "content": "Actinium.Hook.register('content-schema', async (schema, machineName) => {\n    if (machineName === 'my_custom_type') {\n        // retrieve the type\n        const type = await Actinium.Type.retrieve({\n            machineName,\n        }, { useMasterKey: true });\n\n        // find any fields of fieldType: \"Pointer\"\n        const fields = Object.values(fields)\n        .filter(field => field.fieldType === 'Pointer')\n        .map(field => {\n            field.fieldSlug = Actinium.Utils.slugify(field.fieldName);\n            return field;\n        })\n\n        // create one or more custom Parse pointer fields, based on the\n        // type configuration\n        for (const field of fields) {\n            if (field.targetClass) {\n                schema[field.fieldSlug] = {\n                    type: 'Pointer',\n                    targetClass: field.targetClass\n                };\n            }\n        }\n    }\n})",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "content-schema-field-types",
    "title": "content-schema-field-types",
    "description": "<p>Hook called during content type schema creation/updates. Useful for defining Parse column type mapping for a given custom field type. Only use the hook if you intend to create a new field type to store content. Any Parse column type can be used (e.g. Boolean, String, Number, Date, Object, Array, etc.) You <strong>must</strong> implement this hook if you wish to store content in a custom column in your content type, otherwise, you can tried your custom field as content type specific configuration.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "fieldTypes",
            "description": "<p>pass by reference of the current field type mappings.</p>"
          }
        ]
      }
    },
    "name": "content_schema_field_types",
    "group": "Hooks",
    "examples": [
      {
        "title": "Usage",
        "content": "Actinium.Hook.register('content-schema-field-types', async fieldTypes => {\n    // If Content Type is created with one or more fields of fieldType 'MyCustomType'\n    // a column in your content collection of type \"Object\" will be created.\n    fieldTypes['MyCustomType'] = { type: 'Object' };\n})",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "content-schema-indexes",
    "title": "content-schema-indexes",
    "description": "<p>Hook called during content type schema creation/updates. Useful for changing/adding which database indexes will be created by <code>Actinium.Collection.register()</code> for your content type schema.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "indexes",
            "description": "<p>pass by reference of the index configuration</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "machineName",
            "description": "<p>machine name of the type.</p>"
          }
        ]
      }
    },
    "name": "content_schema_field_types",
    "group": "Hooks",
    "examples": [
      {
        "title": "Usage",
        "content": "Actinium.Hook.register('content-schema-indexes', async (indexes, machineName) => {\n    if (machineName = 'my_custom_type') {\n        // index the \"slug\" column in my type.\n        indexes.push('slug');\n    }\n})",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "content-schema-permissions",
    "title": "content-schema-permissions",
    "description": "<p>Hook called during content type schema creation/updates. Useful for changing default permissions used during <code>Actinium.Collection.register()</code> for content schemas only. Governs the creation and maintenance, of the Class Level Permissions of a content collection. By default, all actions are private but <code>retrieve</code>. Because this is content, the assumption is that unless otherwise specified, you would like the content to be publicly readable. Note that content can <strong>may</strong> still be restricted by individual object Access Control List, (if using Parse REST api) or additional capability check (if using Actinium.Cloud functions), even if the CLP allows public retrieve.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "permissions",
            "description": "<p>pass by reference of the permission defaults.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "machineName",
            "description": "<p>machine name of the type.</p>"
          }
        ]
      }
    },
    "name": "content_schema_permissions",
    "group": "Hooks",
    "examples": [
      {
        "title": "Usage",
        "content": "Actinium.Hook.register('content-schema-permissions', async (permissions, machineName) => {\n    if (machineName === 'my_sensitive_content') {\n        // public create (like an anonymous contact form submission)\n        permissions['create'] = true;\n\n        // not publicly readable, unless logged in / escalated user\n        permissions['retrieve'] = false;\n    }\n})",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "content-slug-changed",
    "title": "content-slug-changed",
    "description": "<p>Called after slug/uuid changed with <code>Content.changeSlug()</code></p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "contentObj",
            "description": "<p>the saved content object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "typeObj",
            "description": "<p>the type of the content</p>"
          }
        ]
      }
    },
    "name": "content_slug_changed",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "content-status-changed",
    "title": "content-status-changed",
    "description": "<p>Hook called before return of <code>Content.setStatus()</code>. Useful for responding to changes of content status.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "contentObj",
            "description": "<p>the content object after status change.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "typeObj",
            "description": "<p>the type object of the content.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>the new status.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "previousStatus",
            "description": "<p>the previous status.</p>"
          }
        ]
      }
    },
    "name": "content_status_changed",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "content-trashed",
    "title": "content-trashed",
    "description": "<p>Called after <code>Content.trash()</code></p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "contentObj",
            "description": "<p>the content marked trash</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "typeObj",
            "description": "<p>the type of the content</p>"
          }
        ]
      }
    },
    "name": "content_trashed",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "content-unpublished",
    "title": "content-unpublished",
    "description": "<p>Hook called before return of <code>Content.unpublish()</code>. Useful for responding to unpublishing of content.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "contentObj",
            "description": "<p>the content object after unpublished.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "typeObj",
            "description": "<p>the type object of the content</p>"
          }
        ]
      }
    },
    "name": "content_unpublished",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "recycle-query",
    "title": "recycle-query",
    "group": "Hooks",
    "name": "recycle_query",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Query",
            "optional": false,
            "field": "query",
            "description": "<p>The Actinium.Query object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>The request.params object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>The options object</p>"
          }
        ]
      }
    },
    "description": "<p>Triggered before the query is executed as a result of calling the Actinium.Recycle.retrieve function.</p>",
    "version": "0.0.0",
    "filename": ".core/plugin/recycle/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "search-index",
    "title": "search-index",
    "description": "<p>Hook called in <code>Actinium.Search.index()</code> to trigger actual indexing of content. Implement this hook to perform indexing.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "items",
            "description": "<p>Normalized items for indexing, if indexConfig.prefetchItems is true. Otherwise your implementation will need to fetch items if appropriate.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>original params passed to <code>Actinium.Search.index()</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>content type of the content being indexed</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "permittedFields",
            "description": "<p>fieldType information for the content type</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "indexConfig",
            "description": "<p>final indexing configuration passed to <code>search-index</code> hook</p>"
          }
        ]
      }
    },
    "name": "search_index",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/plugin/search/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "search-index-config",
    "title": "search-index-config",
    "description": "<p>Hook called in <code>Actinium.Search.index()</code> before indexing content. You can use this to prevent indexing, or to prevent prefetching items by default, or to provide configuration for a custom indexing plugin.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "indexConfig",
            "description": "<p>pass by reference. mutate this configuration object in your hook implementation</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>params passed to <code>Actinium.Search.index()</code></p>"
          }
        ],
        "indexConfig": [
          {
            "group": "indexConfig",
            "type": "Boolean",
            "optional": true,
            "field": "shouldIndex",
            "defaultValue": "true",
            "description": "<p>if changed to false, skips indexing job for request. <code>search-index</code> hook will not be triggered.</p>"
          },
          {
            "group": "indexConfig",
            "type": "Boolean",
            "optional": true,
            "field": "prefetchItems",
            "defaultValue": "true",
            "description": "<p>if changed to false, skips prefetching content items, and prevents triggering <code>search-index-item-normalize</code> hook.</p>"
          }
        ]
      }
    },
    "name": "search_index_config",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/plugin/search/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "search-index-item-normalize",
    "title": "search-index-item-normalize",
    "description": "<p>Hook called in <code>Actinium.Search.index()</code> before indexing content. If content was prefetched, each item will be passed through this hook to be normalized prior to being added to search index.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "item",
            "description": "<p>one prefetched item of content before indexing. Mutate the item appropriately for indexing. e.g. Extract plain-text from RichText fields.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>original params passed to <code>Actinium.Search.index()</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>content type of the content being indexed</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "permittedFields",
            "description": "<p>fieldType information for the content type</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "indexConfig",
            "description": "<p>final indexing configuration passed to <code>search-index</code> hook</p>"
          }
        ]
      }
    },
    "name": "search_index_item_normalize",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/plugin/search/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "type-maintenance",
    "title": "type-maintenance",
    "description": "<p>Hook called on each scheduled Pulse type-maintenance job. Useful for regular jobs that must be run on content types or their content.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "typeObj",
            "description": "<p>the type object of the content</p>"
          }
        ]
      }
    },
    "name": "type_maintenance",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/plugin/content/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "url-attached",
    "title": "url-attached",
    "group": "Hooks",
    "name": "url_attached",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "attached",
            "description": "<p>The Array of url Route objects attached</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>The request.params object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>The options object</p>"
          }
        ]
      }
    },
    "description": "<p>Triggered after url Route objects have been attached to a Content object as a result of calliing Actinium.URL.attach() function.</p>",
    "version": "0.0.0",
    "filename": ".core/plugin/content/URLWidget/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "url-before-delete",
    "title": "url-before-delete",
    "group": "Hooks",
    "name": "url_before_delete",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "urls",
            "description": "<p>The Array of url Route objects to delete</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>The request.params object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>The options object</p>"
          }
        ]
      }
    },
    "description": "<p>Triggered after urls have been deleted as a result of calling Actinium.URL.delete() function.</p>",
    "version": "0.0.0",
    "filename": ".core/plugin/content/URLWidget/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "url-before-trashed",
    "title": "url-before-trashed",
    "group": "Hooks",
    "name": "url_before_trashed",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "urls",
            "description": "<p>Array of url Route Objects.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>The request.params object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>The options object</p>"
          }
        ]
      }
    },
    "description": "<p>Triggered before a url is trashed as a result of calling Actinium.URL.trash() function.</p>",
    "version": "0.0.0",
    "filename": ".core/plugin/content/URLWidget/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "url-created",
    "title": "url-created",
    "group": "Hooks",
    "name": "url_created",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>The request.params object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>The options object</p>"
          }
        ]
      }
    },
    "description": "<p>Triggered after url Route objects have been created as a result of calling the Actinium.URL.create() function.</p>",
    "version": "0.0.0",
    "filename": ".core/plugin/content/URLWidget/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "url-deleted",
    "title": "url-deleted",
    "group": "Hooks",
    "name": "url_deleted",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "urls",
            "description": "<p>The Array of url Route objects to delete</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "deleted",
            "description": "<p>Array of deleted url Route objects</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>The request.params object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>The options object</p>"
          }
        ]
      }
    },
    "description": "<p>Triggered after urls have been deleted as a result of calling Actinium.URL.delete() function.</p>",
    "version": "0.0.0",
    "filename": ".core/plugin/content/URLWidget/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "url-query",
    "title": "url-query",
    "group": "Hooks",
    "name": "url_query",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Query",
            "optional": false,
            "field": "query",
            "description": "<p>The Actinium.Query object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>The request.params object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>The options object</p>"
          }
        ]
      }
    },
    "description": "<p>Triggered before the url query is executed as a result of calling Actinium.URL.retrieve() function</p>",
    "version": "0.0.0",
    "filename": ".core/plugin/content/URLWidget/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "url-retrieved",
    "title": "url-retrieved",
    "group": "Hooks",
    "name": "url_retrieved",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "route",
            "description": "<p>the serialized Actinium.Route object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>The request.params object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>The request options object</p>"
          }
        ]
      }
    },
    "description": "<p>Triggered after the url query is executed as a result of calling Actinium.URL.retrieve() function</p>",
    "version": "0.0.0",
    "filename": ".core/plugin/content/URLWidget/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "url-trashed",
    "title": "url-trashed",
    "group": "Hooks",
    "name": "url_trashed",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "urls",
            "description": "<p>Array of url Route Objects.</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "trash",
            "description": "<p>Array of Recycle Objects.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>The request.params object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>The options object</p>"
          }
        ]
      }
    },
    "description": "<p>Triggered after a url is trashed as a result of calling Actinium.URL.trash() function.</p>",
    "version": "0.0.0",
    "filename": ".core/plugin/content/URLWidget/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "urls",
    "title": "urls",
    "description": "<p>Called before the urls response is returned.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "response",
            "description": "<p>Serialized response object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>The request.params object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>The request options object</p>"
          }
        ]
      }
    },
    "name": "urls",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/plugin/content/URLWidget/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "urls-query",
    "title": "urls-query",
    "description": "<p>Called before the urls query is executed.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "query",
            "description": "<p>Actinium.Query object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>The request.params object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>The request options object</p>"
          }
        ]
      }
    },
    "name": "urls_query",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/plugin/content/URLWidget/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "urls-restored",
    "title": "urls-restored",
    "group": "Hooks",
    "name": "urls_restored",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "restored",
            "description": "<p>Array of url Route Objects.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>The request.params object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>The options object</p>"
          }
        ]
      }
    },
    "description": "<p>Triggered when a url is restored as a result of calling the Actinium.URL.resotre() function.</p>",
    "version": "0.0.0",
    "filename": ".core/plugin/content/URLWidget/sdk.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "ReactHook",
    "url": "useAsyncEffect(cb,dependencies)",
    "title": "useAsyncEffect()",
    "description": "<p>Just like React's built-in <code>useEffect</code>, but can use async/await. If the return is a promise for a function, the function will be used as the unmount callback.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "cb",
            "description": "<p>Just like callback provided as first argument of <code>useEffect</code>, but takes as its own first argument a method to see if the component is mounted. This is useful for deciding if your async response (i.e. one that would attempt to change state) should happen.</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "deps",
            "description": "<p>Deps list passed to <code>useEffect</code></p>"
          }
        ]
      }
    },
    "name": "useAsyncEffect",
    "group": "ReactHook",
    "examples": [
      {
        "title": "Reactium Usage",
        "content": "import React, { useState } from 'react';\nimport { useAsyncEffect } from 'reactium-core/sdk';\n\nconst MyComponent = props => {\n    const [show, setShow] = useState(false);\n\n    // change state allowing value to show\n    // asynchrounously, but only if component is still mounted\n    useAsyncEffect(async isMounted => {\n        setShow(false);\n        await new Promise(resolve => setTimeout(resolve, 3000));\n        if (isMounted()) setShow(true);\n\n        // unmount callback\n        return () => {};\n    }, [ props.value ]);\n\n    return (\n        {show && <div>{props.value}</div>}\n    );\n};",
        "type": "json"
      },
      {
        "title": "StandAlone Import",
        "content": "import { useAsyncEffect } from '@atomic-reactor/reactium-sdk-core';",
        "type": "json"
      },
      {
        "title": "Wrong Usage",
        "content": "import React, { useState } from 'react';\nimport { useAsyncEffect } from 'reactium-core/sdk';\n\nconst MyComponent = props => {\n    const [show, setShow] = useState(false);\n\n    // change state allowing value to show\n    // asynchrounously, but only if component is still mounted\n    useAsyncEffect(async isMounted => {\n        // Warning: don't do this, wait until promise resolves to check isMounted()!!\n        if (isMounted()) { // this may be true *before* promise resolves and false *after*\n            setShow(false);\n            await new Promise(resolve => setTimeout(resolve, 3000));\n            setShow(true);\n        }\n\n        // unmount callback\n        return () => {};\n    }, [ props.value ]);\n\n    return (\n        {show && <div>{props.value}</div>}\n    );\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/async-effect.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useDerivedState(props,subscriptions,updateAll)",
    "title": "useDerivedState()",
    "description": "<p>Sometimes you would like to derive state from your component props, and also allow either a prop change, or an internal state change either to take effect. This hook will allow you to create a state object from your component props, and subscribe (by array of object-paths) only to those prop changes you would like to see reflected in a rendering updates to your component state. This hook returns an array similar in nature to the return of React's built-in <code>useState()</code> hook (<code>[state,setState]</code>), with some differences.</p> <ol> <li>The initial value coming from props (on first render) will contain all that was present in the props object passed to it. Note that any values that are not present in your component props on first render, or that which are explicitly subscribed to, will not exist in the returned state element.</li> <li>The setState callback can receive whole or partial state objects, and will be merged with the existing state.</li> <li>There is a third element function <code>forceRefresh</code></li> </ol>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "props",
            "description": "<p>the component props</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "subscriptions",
            "description": "<p>Array of string object-paths in your component props you would like to update your component state for. By default, this is empty, and if left empty you will get only the initial props, and no updates. Each selected property is shallow compared with the previous version of that prop (not the current state). Only a change of prop will trigger a prop-based update and rerender.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "updateAll",
            "defaultValue": "false",
            "description": "<p>When true, an update to any subscribed object-path on your props will cause <em>all</em> the props to imprint on your component state.</p>"
          }
        ]
      }
    },
    "version": "0.0.14",
    "name": "useDerivedState",
    "group": "ReactHook",
    "examples": [
      {
        "title": "Returns",
        "content": "// The hook returns an array containing [state, setState, forceRefresh]\nconst [state, setState, forceRefresh] = useDerivedState(props, ['path.to.value1', 'path.to.value2']);",
        "type": "json"
      },
      {
        "title": "Usage",
        "content": "import React from 'react';\nimport { useDerivedState } from 'reactium-core/sdk';\nimport op from 'object-path';\n\nconst MyComponent = props => {\n    const [state, setState] = useDerivedState(props, ['path.to.value1', 'path.to.value2']);\n    const value1 = op.get(state, 'path.to.value1', 'Default value 1');\n    const value2 = op.get(state, 'path.to.value2', 'Default value 2');\n\n    // setState merges this object with previous state\n    const updateValue1 = () => setState({\n        path: {\n            to: {\n                value1: 'foo',\n            }\n        }\n    });\n\n    return (<div>\n        <div>Value 1: {value1}</div>\n        <div>Value 2: {value2}</div>\n        <button onClick={updateValue1}>Update Value 1</button>\n    </div>);\n}\n\nexport default MyComponent;",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/derived-state.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useEventHandle(handle)",
    "title": "useEventHandle()",
    "description": "<p>React hook to create an imperative handle that is also an implementation of EventTarget. Can be used in conjunction with useImperativeHandle (React built-in) or useRegisterHandle/useHandle (Reactium SDK hooks).</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "handle",
            "description": "<p>Interface for interacting with your component.</p>"
          }
        ]
      }
    },
    "name": "useEventHandle",
    "group": "ReactHook",
    "examples": [
      {
        "title": "EventHandleComponent.js",
        "content": "import React, { useEffect } from 'react';\nimport { useRegisterHandle, useEventHandle } from 'reactium-core/sdk';\n\nconst EventHandleComponent = () => {\n     const [ value, setValue ] = useState(1);\n     const createHandle = () => ({\n         value, setValue,\n     });\n\n     const [ handle, setHandle ] = useEventHandle(createHandle());\n\n     useEffect(() => {\n         setHandle(createHandle());\n     }, [value]);\n\n     useRegisterHandle('EventHandleComponent', () => handle);\n\n     const onClick = () => {\n         if (handle) {\n            setValue(value + 1);\n            handle.dispatchEvent(new CustomEvent('do-something'));\n         }\n     }\n\n     return (<button onClick={onClick}>Click Me ({value})</button>);\n };\n\n export default EventHandleComponent;",
        "type": "json"
      },
      {
        "title": "EventHandleConsumer.js",
        "content": "import React, { useEffect, useState } from 'react';\nimport { useHandle } from 'reactium-core/sdk';\n\nconst EventHandleConsumer = props => {\n    const [state, setState] = useState();\n    const handleEventTarget = useHandle('EventHandleComponent');\n\n    // when 'do-something' event occurs on\n    // EventHandleComponent, this component can react\n    const onDoSomething = e => {\n        setState(e.target.value);\n    };\n\n    useEffect(() => {\n        if (handleEventTarget) {\n            handleEventTarget.addEventListener('do-something', onDoSomething);\n        }\n        return () => handleEventTarget.removeEventListener('do-something', onDoSomething);\n    }, [handleEventTarget]);\n\n    return (\n        <div>\n            value: {state}\n        </div>\n    );\n};\n\nexport default EventHandleConsumer;",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/event-handle.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useFocusEffect(container,dependencies)",
    "title": "useFocusEffect()",
    "group": "ReactHook",
    "name": "useFocusEffect",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Element",
            "optional": false,
            "field": "container",
            "description": "<p>The DOM element to search for the 'data-focus' element.</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "dependencies",
            "description": "<p>Dependencies list passed to <code>useEffect</code>.</p>"
          }
        ],
        "Returns": [
          {
            "group": "Returns",
            "type": "Boolean",
            "optional": false,
            "field": "focused",
            "description": "<p>If the 'data-focus' element was found.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Reactium Usage",
        "content": "import cn from 'classnames';\nimport React, { useRef } from 'react';\nimport { useFocusEffect } from 'reactium-core/sdk';\n\nconst MyComponent = props => {\n    const containerRef = useRef();\n\n    const [focused] = useFocusEffect(containerRef.current);\n\n    return (\n        <form ref={containerRef}>\n            <input className={cn({ focused })} type='text' data-focus />\n            <button type='submit'>Submit</button>\n        </form>\n    );\n};",
        "type": "json"
      },
      {
        "title": "Returns",
        "content": "{Array} [focused:Element, setFocused:Function]",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/focus-effect.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useFulfilledObject(object,keys)",
    "title": "useFulfilledObject()",
    "name": "useFulfilledObject",
    "group": "ReactHook",
    "description": "<p>Asyncronous React hook that determines if the supplied object has values for the supplied keys. Useful when you have many <code>useEffect</code> calls and need to know if multiple pieces of the state are set and ready for rendering.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "object",
            "description": "<p>The object to check.</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "keys",
            "description": "<p>List of object paths to validate.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "\nimport React, { useEffect, useState } from 'react';\nimport { useFulfilledObject } from 'reactium-core/sdk';\n\nconst MyComponent = () => {\n\n    const [state, setNewState] = useState({});\n    const [updatedState, ready, attempts] = useFulfilledObject(state, ['msg', 'timestamp']);\n\n    const setState = newState => {\n        newState = { ...state, ...newState };\n        setNewState(newState);\n    };\n\n    useEffect(() => {\n        if (!state.msg) {\n            setState({ msg: 'ok'});\n        }\n    }, [state]);\n\n    useEffect(() => {\n        if (!state.timestamp) {\n            setState({ timestamp: Date.now() });\n        }\n    }, [state]);\n\n    const render = () => {\n        return ready !== true ? null : <div>I'm READY!!</div>;\n    };\n\n    return render();\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/fulfilled-object.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useHandle(id,defaultValue)",
    "title": "useHandle()",
    "description": "<p>React hook to subscribe to a specific imperative handle reference. Useful for having one functional component control another.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "id",
            "description": "<p>Array of properties, or <code>.</code> separated object path. e.g. ['path','to','handle'] or 'path.to.handle'. Identifies the full path to an imperative handle.</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": true,
            "field": "defaultValue",
            "description": "<p>the value to use for the handle if it does not exist.</p>"
          }
        ]
      }
    },
    "name": "useHandle",
    "group": "ReactHook",
    "examples": [
      {
        "title": "Counter.js",
        "content": "import React, { useState } from 'react';\nimport { useRegisterHandle } from 'reactium-core/sdk';\n\nconst Counter = ({id = 1}) => {\n    const [count, setCount] = useState(Number(id));\n\n    // id 'counter.1' by default\n    useRegisterHandle(['counter', id], () => ({\n        increment: () => setCount(count + 1),\n    }), [count]);\n\n    return (\n        <div>\n            <h1>Counter {id}</h1>\n            Count: {count}\n        </div>\n    );\n};\n\nexport default Counter;",
        "type": "json"
      },
      {
        "title": "CounterControl.js",
        "content": "import React from 'react';\nimport { useHandle } from 'reactium-core/sdk';\n\nconst noop = () => {};\nconst CounterControl = () => {\n    // Get increment control on handle identified at path 'counter.1'\n    const { increment } = useHandle('counter.1', { increment: noop }});\n\n    return (\n        <div>\n            <h1>CounterControl</h1>\n            <button onClick={increment}>Increment Counter</button>\n        </div>\n    );\n};\n\nexport default CounterControl;",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/handle.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useHookComponent(hookName,defaultComponent,...params)",
    "title": "useHookComponent()",
    "description": "<p>A React hook used to define React component(s) that can be overrided by Reactium plugins, using the <code>Reactium.Component.register()</code> function.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "hookName",
            "description": "<p>the unique string used to register component(s).</p>"
          },
          {
            "group": "Parameter",
            "type": "Component",
            "optional": false,
            "field": "defaultComponent",
            "description": "<p>the default React component(s) to be returned by the hook.</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "params",
            "description": "<p>variadic list of parameters to be passed to the Reactium hook specified by hookName.</p>"
          }
        ]
      }
    },
    "name": "useHookComponent",
    "group": "ReactHook",
    "examples": [
      {
        "title": "parent.js",
        "content": "import React from 'react';\nimport { useHookComponent } from 'reactium-core/sdk';\n\n// component to be used unless overriden by Reactium.Component.register()\nconst DefaultComponent = () => <div>Default or Placeholder component</div>\n\nexport props => {\n    const MyComponent = useHookComponent('my-component', DefaultComponent);\n    return (\n        <div>\n            <MyComponent {...props} />\n        </div>\n    );\n};",
        "type": "json"
      },
      {
        "title": "reactium-hooks.js",
        "content": "import React from 'react';\nimport Reactium from 'reactium-core/sdk';\n\n// component to be used unless overriden by Reactium.Component.register()\nconst ReplacementComponent = () => <div>My Plugin's Component</div>\n\nReactium.Component.register('my-component', ReplacementComponent);",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/component.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useIsContainer(element,container)",
    "title": "useIsContainer()",
    "name": "useIsContainer",
    "group": "ReactHook",
    "description": "<p>React hook that determines if the element is a child of the container. Useful for traversing the DOM to find out if an event or action happened within the specified container.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Node",
            "optional": false,
            "field": "element",
            "description": "<p>The inner most element. Consider this the starting point.</p>"
          },
          {
            "group": "Parameter",
            "type": "Node",
            "optional": false,
            "field": "container",
            "description": "<p>The outer most element. Consider this the destination.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example",
        "content": "import { useIsContainer } from 'reactium-core/sdk';\nimport React, { useEffect, useRef, useState } from 'react';\n\nexport const Dropdown = props => {\n    const container = useRef();\n\n    const [expanded, setExpanded] = useState(props.expanded || false);\n\n    const isContainer = useIsContainer();\n\n    const dismiss = e => {\n        // already dismissed? -> do nothing!\n        if (!expanded) return;\n\n        // e.target is inside container.current? -> do nothing!\n        if (isContainer(e.target, container.current)) return;\n\n        // e.target is outside container.current? -> collapse the menu\n        setExpanded(false);\n    };\n\n    const toggle = () => setExpanded(!expanded);\n\n    useEffect(() => {\n        if (!container.current || typeof window === 'undefined') return;\n\n        window.addEventListener('mousedown', dismiss);\n        window.addEventListener('touchstart', dismiss);\n\n        return () => {\n            window.removeEventListener('mousedown', dismiss);\n            window.removeEventListener('touchstart', dismiss);\n        }\n\n    }, [container.current]);\n\n    return (\n        <div ref={container}>\n            <button onClick={toggle}>Toggle Dropdown</button>\n            {expanded && (\n                <ul>\n                    <li><a href='#item-1' onClick={toggle}>Item 1</a></li>\n                    <li><a href='#item-2' onClick={toggle}>Item 2</a></li>\n                    <li><a href='#item-3' onClick={toggle}>Item 3</a></li>\n                </ul>\n            )}\n        </div>\n    );\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/is-container.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useReduxState(select,shouldUpdate,domain)",
    "title": "useReduxState()",
    "description": "<p>Similar to React useState(), returns selected redux state, and action dispatching function, as the first and second elements of an array.</p> <p>Takes an optional shouldUpdate callback (see useSelect), which does a shallow comparison of previous and current selected state by default. The update callback returned expects to be called with an object, and will cause a dispatch: { type: 'DOMAIN_UPDATE', domain, // the passed domain update, // object passed to update }</p> <p>Note: the boilerplate redux reducer created with <code>arcli component</code> will target action dispatched from this hoook.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Function",
            "optional": true,
            "field": "select",
            "description": "<p>Optional select callback (see useSelect), which selects for the domain by default.</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": true,
            "field": "shouldUpdate",
            "description": "<p>Optional shouldUpdate callback (see useSelect), which does a shallow comparison of previous and current selected state by default.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "domain",
            "description": "<p>The targeted redux domain.</p>"
          }
        ]
      }
    },
    "name": "useReduxState",
    "group": "ReactHook",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/redux.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useRegisterHandle(id,cb,deps)",
    "title": "useRegisterHandle()",
    "description": "<p>React hook to create a new imperative handle reference, similar to <code>useImperativeHandle()</code> except that instead of using <code>React.forwardRef()</code> to attach the handle to a parent compenent ref. A ref is generated for you and is assigned the current value of the callback <code>cb</code>, is registered with <code>Reactium.Handle</code>, and made available to all other components at the object path <code>id</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "id",
            "description": "<p>Array of properties, or <code>.</code> separated object path. e.g. ['path','to','handle'] or 'path.to.handle'. Identifies the full path to an imperative handle.</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "cb",
            "description": "<p>Function that returns value to be assigned to the imperative handle reference.</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "deps",
            "description": "<p>Array of values to watch for changes. When changed, your reference will be updated by calling <code>cb</code> again. All <code>Reactium.Handle.subscribe()</code> subscribers will be called on updates, and relevant <code>useHandle()</code> hooks will trigger rerenders.</p>"
          }
        ]
      }
    },
    "name": "useRegisterHandle",
    "group": "ReactHook",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/handle.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useSelect(params)",
    "title": "useSelect()",
    "description": "<p>React hook for subscribing to only the updates from Redux store that you care about, and no more. This is superior to <code>react-redux</code> connect, in that your component will not update on every dispatch, only those state changes you have specifically targeted.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "params",
            "description": "<ol> <li>Callback function taking current state object from Redux store, and returning what you care about, or</li> <li>an Object with <code>select</code> and <code>shouldUpdate</code> props.</li> </ol>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "params.select",
            "description": "<p>Callback function taking current state object from Redux store, and returning what you care about.</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": true,
            "field": "params.shouldUpdate",
            "description": "<p>Callback function object with 2 properties <code>newState</code> and <code>prevState</code>, containing the current results of the select function, and the previous results of the select function, respectively. Returns true if your component should update, otherwise false. By default, <code>useSelect</code> will do a shallow comparison.</p>"
          }
        ]
      }
    },
    "name": "useSelect",
    "group": "ReactHook",
    "examples": [
      {
        "title": "Simple.js",
        "content": "import React from 'react';\nimport { useSelect } from 'reactium-core/sdk';\n\n// given a Redux state of { \"Simple\": {\"foo\": { \"bar\": \"baz\" }}}\nexport default () => {\n    // Simple select callback: will update the component only when state.Simple.foo.bar changes no more.\n    const baz = useSelect(state => state.Simple.foo.bar);\n    return (\n        <div>\n            {baz}\n        </div>\n    );\n};",
        "type": "json"
      },
      {
        "title": "Advanced.js",
        "content": "import React from 'react';\nimport { useSelect } from 'reactium-core/sdk';\n\n// given a Redux state of {\n//    \"Advanced\": {\n//      \"foo\": { \"bar\": \"baz\" },\n//      \"hello\": \"world\",\n//    }\n//}\nexport default () => {\n   // Advanced select callback: will update the component only conditions of shouldUpdate are true.\n   // All other Redux state changes are ignored.\n   const Advanced = useSelect({\n     select: state => state.Advanced,\n\n     shouldUpdate: ({newState, prevState}) => {\n       // newState and prevState are current and previous outcome of select callback above\n       return newState.foo.bar !== prevState.foo.bar || newState.hello !== prevState.hello;\n     },\n   });\n\n   return (\n       <div>\n           {Advanced.foo.bar}\n           {Advanced.hello}\n       </div>\n   );\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/redux.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useStore()",
    "title": "useStore()",
    "description": "<p>Just gimme the store damnit! This React hook provides the Redux store when used on a component declared within the Store Provider.</p>",
    "name": "useStore",
    "group": "ReactHook",
    "examples": [
      {
        "title": "MyComponent.js",
        "content": "import React, { useEffect } from 'react';\nimport { useStore } from 'reactium-core/sdk';\n\nexport default () => {\n    const { dispatch, getState, subscribe } = useStore();\n    let count = getState();\n\n    useEffect(() => {\n        const unsubscribe = subscribe(() => {\n            count = getState();\n        });\n\n        return unsubscribe;\n    });\n\n    return (\n        <div>\n            <button onClick={() => dispatch({ type: 'BUTTON_CLICK' })}>\n                Click {count}\n            </button>\n        </div>\n    );\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/redux.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useZoneComponents(zone)",
    "title": "useZoneComponents()",
    "description": "<p>A React hook used in the <code>Zone</code> component to determine what components should currently be rendered. Useful to observe a zone in another component. If you want to observe to the zone components without necessarily causing a rerender in your component, use <code>Reactium.Zone.getZoneComponents()</code> (to get a list of components in the zone), alone or in combination with <code>Reactium.Zone.subscribe()</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zone",
            "description": "<p>the zone id.</p>"
          }
        ]
      }
    },
    "name": "useZoneComponents",
    "group": "ReactHook",
    "examples": [
      {
        "title": "Example",
        "content": "import React from 'react';\nimport { useZoneComponents } from 'reactium-core/sdk';\n export props => {\n    const zoneComponents = useZoneComponents('my-zone');\n     return (\n        <div>\n            Components in Zone: {zoneComponents.length}\n        </div>\n    );\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/Zone.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "Object",
    "url": "Registry",
    "title": "Registry",
    "group": "Reactium",
    "name": "Registry",
    "description": "<p>Reactium uses a number of registry objects used to registering all sorts of objects that will be used elsewhere in the framework. New registry objects are generally instanciated as singletons on the overall SDK.</p> <p>There are many registry objects attached by default to the SDK, and developers can create new ones using <code>Utils.registryFactory()</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "list",
            "description": "<p>{Getter} get list of most recent (or highest order) registered objects, filtering out unregistered or banned objects.</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "registered",
            "description": "<p>{Getter} get list of all historically registrated objects, even duplicates, ordered by order property of object (defaults to 100).</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "protected",
            "description": "<p>{Getter} get list of protected registrations ids</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "unregistered",
            "description": "<p>{Getter} get list of all existing registered objects ids that have been subsequently unregistered.</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "banned",
            "description": "<p>{Getter} get list of all banned objects ids.</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "mode",
            "description": "<p>{Getter} get current mode (Default Utils.Registry.MODES.HISTORY)</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "isProtected",
            "description": "<p>{Method} pass the identifier of an object to see if it has been protected</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "isRegistered",
            "description": "<p>{Method} pass the identifier of an object to see if it has been registered</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "isBanned",
            "description": "<p>{Method} pass the identifier of an object to see if it has been banned</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "ban",
            "description": "<p>{Method} pass the identifier of an object to ban. Banned objects can not be registered and will not be show in list. Useful when you have code that needs to preempt the registration of an object from code you do not control. E.g. a plugin is introducing undesireable or disabled functionality</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "cleanup",
            "description": "<p>{Method} pass the identifier of an object to be purged from historical registrations (i.e. free up memory) Automatically performed in mode Utils.Registry.CLEAN</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "protect",
            "description": "<p>{Method} pass the identifier of an object to protect. Protected objects can not be overridden or cleaned up.</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "register",
            "description": "<p>{Method} pass an identifier and a data object to register the object. The identifier will be added if it is not already registered (but protected) and not banned.</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "unprotect",
            "description": "<p>{Method} pass an identifier to unprotect an object</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "unregister",
            "description": "<p>{Method} pass an identifier to unregister an object. When in HISTORY mode (default), previous registration will be retained, but the object will not be listed. In CLEAN mode, the previous registrations will be removed, unless protected.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/utils/registry.js",
    "groupTitle": "Reactium"
  },
  {
    "type": "Object",
    "url": "Cache",
    "title": "Cache",
    "version": "3.0.3",
    "name": "Cache",
    "group": "Reactium_Cache",
    "description": "<p>Cache allows you to easily store application data in memory.</p>",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/cache/index.js",
    "groupTitle": "Reactium_Cache"
  },
  {
    "type": "Function",
    "url": "Cache.clear()",
    "title": "Cache.clear()",
    "version": "3.0.3",
    "group": "Reactium_Cache",
    "name": "Cache_clear",
    "description": "<p>Delete all cached values.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>The key to delete. If the value is an <code>{Object}</code> you can use an object path to delete a specific part of the value. The updated value is then returned.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Reactium.Cache.clear();",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/cache/index.js",
    "groupTitle": "Reactium_Cache"
  },
  {
    "type": "Function",
    "url": "Cache.del(key)",
    "title": "Cache.del()",
    "version": "3.0.3",
    "group": "Reactium_Cache",
    "name": "Cache_del",
    "description": "<p>Delete the value for a given key. Returns <code>{Boolean}</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>The key to delete. If the value is an <code>{Object}</code> you can use an object path to delete a specific part of the value. The updated value is then returned.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "// Given the cached value: { foo: { bar: 123, blah: 'hahaha' } }\nReactium.Cache.del('foo.bar'); // returns: { blah: 'hahaha' }\nReactium.Cache.del('foo');     // returns: true",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/cache/index.js",
    "groupTitle": "Reactium_Cache"
  },
  {
    "type": "Function",
    "url": "Cache.get(key)",
    "title": "Cache.get()",
    "version": "3.0.3",
    "group": "Reactium_Cache",
    "name": "Cache_get",
    "description": "<p>Retrieves the value for a given key. If the value is not cached <code>null</code> is returned.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "key",
            "description": "<p>The key to retrieve. If the value is an <code>{Object}</code> you can use an object path for the key. If no key is specified the entire cache is returned.</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": true,
            "field": "default",
            "description": "<p>The default value to return if key is not found.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "// Given the cached value: { foo: { bar: 123 } }\nReactium.Cache.get('foo.bar'); // returns: 123;\nReactium.Cache.get('foo');     // returns: { bar: 123 }",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/cache/index.js",
    "groupTitle": "Reactium_Cache"
  },
  {
    "type": "Function",
    "url": "Cache.keys()",
    "title": "Cache.keys()",
    "version": "3.0.3",
    "group": "Reactium_Cache",
    "name": "Cache_keys",
    "description": "<p>Returns an array of the cached keys.</p>",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/cache/index.js",
    "groupTitle": "Reactium_Cache"
  },
  {
    "type": "Function",
    "url": "Cache.memsize()",
    "title": "Cache.memsize()",
    "version": "3.0.3",
    "group": "Reactium_Cache",
    "name": "Cache_memsize",
    "description": "<p>Returns the number of entries taking up space in the cache.</p>",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/cache/index.js",
    "groupTitle": "Reactium_Cache"
  },
  {
    "type": "Function",
    "url": "Cache.merge(values)",
    "title": "Cache.merge()",
    "version": "3.0.3",
    "group": "Reactium_Cache",
    "name": "Cache_merge",
    "description": "<p>Merges the supplied values object with the current cache. Any existing entries will remain in cache. Duplicates will be overwritten unless <code>option.skipDuplicates</code> is <code>true</code>. Entries that would have exipired since being merged will expire upon merge but their timeoutCallback will not be invoked. Returns the new size of the cache.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "values",
            "description": "<p>Key value pairs to merge into the cache.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "// Give the existing cache: { foo: 'bar' }\n\nReactium.Cache.merge({\n    test: {\n        value: 123,\n        expire: 5000,\n    },\n});\n\nReactium.Cache.get()\n// returns: { foo: 'bar', test: 123 }",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/cache/index.js",
    "groupTitle": "Reactium_Cache"
  },
  {
    "type": "Function",
    "url": "Cache.set(key,value,timeout,timeoutCallback)",
    "title": "Cache.set()",
    "version": "3.0.3",
    "group": "Reactium_Cache",
    "name": "Cache_set",
    "description": "<p>Sets the value for a given key. If the value is an <code>{Object}</code> and is already cached, you can use an object path to update a specific part of the value. Returns the cached value.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>The key to set. If the key is an object path and the key does not exist, it will be created.</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "value",
            "description": "<p>The value to cache.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "timeout",
            "description": "<p>Remove the value in the specified time in milliseconds. If no timeout value specified, the value will remain indefinitely.</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": true,
            "field": "timeoutCallback",
            "description": "<p>Function called when the timeout has expired. The timeoutCallback will be passed the key and value as arguments.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "// The following are equivalent\nReactium.Cache.set('foo', { bar: 123 });\nReactium.Cache.set('foo.bar', 123);\n\n// Set to expire in 5 seconds\nReactium.Cache.set('error', 'Ivnalid username or password', 5000);\n\n// Set to expire in 5 seconds and use a timeoutCallback\nReactium.Cache.set('foo', { bar: 456 }, 5000, (key, value) => console.log(key, value));",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/cache/index.js",
    "groupTitle": "Reactium_Cache"
  },
  {
    "type": "Function",
    "url": "Cache.size()",
    "title": "Cache.size()",
    "version": "3.0.3",
    "group": "Reactium_Cache",
    "name": "Cache_size",
    "description": "<p>Returns the current number of entries in the cache.</p>",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/cache/index.js",
    "groupTitle": "Reactium_Cache"
  },
  {
    "type": "Function",
    "url": "Cache.subscribe(key,cb)",
    "title": "Cache.subscribe()",
    "group": "Reactium_Cache",
    "name": "Cache_subscribe",
    "description": "<p>Subscribe to cache changes that impact a particular key. Returns an unsubscribe function.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "key",
            "description": "<p>object path of the cache value (array or string)</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "cb",
            "description": "<p>The callback function to call when impacting changes have been made to the subscribed cache. Changes include any set/put, delete, clear, merge, or expiration that <em>may</em> impact the value you care about.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "const foo = Reactium.Cache.get('values.foo');\nReactium.Cache.subscribe('values.foo', ({op, ...params}) => {\nswitch(op) {\n    case 'set': {\n        const { key, value } = params;\n        // do something with new value if applicable\n        // you can see the key that impacted the cache value\n        break;\n    }\n     case 'del': {\n        // the key that was deleted\n        const { key } = params;\n        // do something about the deletion\n        break;\n    }\n     case 'expire': {\n        // do something about expiration (which will have impacted your value for sure)\n        // this will never be called if your value doesn't expire\n        break;\n    }\n     case 'merge': {\n        // complete cache object after merge\n        // may impact you, you'll have to check\n        const { obj } = params;\n        if (op.get(obj, 'values.foo') !== foo) {\n            // do something\n        }\n        break;\n    }\n     default:\n    break;\n}\n});",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/cache/index.js",
    "groupTitle": "Reactium_Cache"
  },
  {
    "type": "Function",
    "url": "Component.register(hook,component,order,capabilities,strict)",
    "title": "Component.register()",
    "group": "Reactium_Component",
    "name": "Component_register",
    "description": "<p>Register a React component to be used with a specific useHookComponent hook. This must be called before the useHookComponent that defines the hook.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "hook",
            "description": "<p>The hook name</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "component",
            "description": "<p>component(s) to be output by useHookComponent</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "order",
            "description": "<p>precedent of this if Component.register is called multiple times (e.g. if you are trying to override core or another plugin)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "reactium-hooks.js",
        "content": "import React from 'react';\nimport Reactium from 'reactium-core/sdk';\n\n// component to be used unless overriden by Reactium.Component.register()\nconst ReplacementComponentA = () => <div>My Plugin's Component</div>\nconst ReplacementComponentB = () => <div>My Alternative Component</div>\n\n// Simple Version\nReactium.Component.register('my-component', ReplacementComponentA);\n\n// Advanced Form using Reactium.Hook SDK\nReactium.Hook.register('my-component', async (...params) => {\n    const context = params.pop(); // context is last argument\n    const [param] = params;\n    if (param === 'test') {\n        context.component = ReplacementComponentA;\n    } else {\n        context.component = ReplacementComponentB;\n    }\n}\n})",
        "type": "json"
      },
      {
        "title": "parent.js",
        "content": "import React from 'react';\nimport { useHookComponent } from 'reactium-core/sdk';\n\n// component to be used unless overriden by Reactium.Component.register()\nconst DefaultComponent = () => <div>Default or Placeholder component</div>\n\nexport props => {\n    const MyComponent = useHookComponent('my-component', DefaultComponent, 'test');\n    return (\n        <div>\n            <MyComponent {...props} />\n        </div>\n    );\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/component/index.js",
    "groupTitle": "Reactium_Component"
  },
  {
    "type": "Function",
    "url": "Component.unregister(uuid)",
    "title": "Component.unregister()",
    "group": "Reactium_Component",
    "name": "Component_unregister",
    "description": "<p>Unregister a component used in useHookComponent. This must be performed before useHookComponent is called. Alias for Reactium.Hook.unregister. See Hook.unregister()</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "uuid",
            "description": "<p>the registered component hook id provided to <code>Component.register()</code></p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/component/index.js",
    "groupTitle": "Reactium_Component"
  },
  {
    "type": "Function",
    "url": "Handle.get(id)",
    "title": "Handle.get()",
    "description": "<p>Get a specific imperative handle reference, by object path (id). If id is full object path to the handle, returns a React reference if it exists, otherwise <code>undefined</code>. If id is partial object path, returns object containing one or more references if the path exists, otherwise 'undefined'.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "id",
            "description": "<p>Array of properties, or <code>.</code> separated object path. e.g. ['path','to','handle'] or 'path.to.handle'</p>"
          }
        ]
      }
    },
    "name": "Handle_get",
    "group": "Reactium_Handle",
    "examples": [
      {
        "title": "CountList.js",
        "content": "import React from 'react';\nimport Counter from './Counter';\nimport CounterControl from './CounterControl';\n const CountList = props => {\n    return (\n        <>\n            <Counter id='1'/>\n            <Counter id='2'/>\n            <CounterControl />\n        </>\n    );\n};\n export default CountList;",
        "type": "json"
      },
      {
        "title": "Counter.js",
        "content": "import React, { useState } from 'react';\nimport { useRegisterHandle } from 'reactium-core/sdk';\n const Counter = ({id = 1}) => {\n    const [count, setCount] = useState(Number(id));\n     // hook form of Handle.register and Handle.unregister\n    // handles ref creation for you\n    useRegisterHandle(['counter', id], () => ({\n        increment: () => setCount(count + 1),\n    }), [count]);\n     return (\n        <div>\n            <h1>Counter {id}</h1>\n            Count: {count}\n        </div>\n    );\n};\n export default Counter;",
        "type": "json"
      },
      {
        "title": "CounterControl.js",
        "content": "import React from 'react';\nimport Reactium from 'reactium-core/sdk';\n const CounterControl = () => {\n   // get object with all handles in the \"counter\" partial path\n    const handles = Reactium.Handle.get('counter');\n     const click = () => {\n       // equivalent to getting handle 'counter.1' and `counter.2` separately\n       // loop through all counters and call increment on click\n        Object.values(handles).forEach(({current}) => current.increment())\n    };\n     return (\n        <div>\n            <h1>CounterControl</h1>\n            <button onClick={click}>Increment All Counters</button>\n        </div>\n    );\n};\n export default CounterControl;",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/handle/index.js",
    "groupTitle": "Reactium_Handle"
  },
  {
    "type": "Function",
    "url": "Handle.list()",
    "title": "Handle.list()",
    "description": "<p>Get full object containing all current reference handles.</p>",
    "name": "Handle_list",
    "group": "Reactium_Handle",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/handle/index.js",
    "groupTitle": "Reactium_Handle"
  },
  {
    "type": "Function",
    "url": "Handle.register(id,ref)",
    "title": "Handle.register()",
    "description": "<p>Register an imperative handle reference. See <code>useRegisterHandle()</code> React hook for easier pattern for functional components.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "id",
            "description": "<p>Array of properties, or <code>.</code> separated object path. e.g. ['path','to','handle'] or 'path.to.handle'</p>"
          },
          {
            "group": "Parameter",
            "type": "Ref",
            "optional": false,
            "field": "ref",
            "description": "<p>React reference created with <code>React.createRef()`` or</code>React.useRef()`.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "update",
            "defaultValue": "true",
            "description": "<p>Update <code>useHandle</code> subscribers of this handle id.</p>"
          }
        ]
      }
    },
    "name": "Handle_register",
    "group": "Reactium_Handle",
    "examples": [
      {
        "title": "MyControllableComponent.js",
        "content": "import React, {useEffect, useState, useRef} from 'react';\nimport Reactium from 'reactium-core/sdk';\n// This component is externally controllable on registered handle\n// with id: 'controlled.handle' or ['controlled', 'handle']\nexport default () => {\nconst [count, setCount] = useState(1);\nconst increment = () => setCount(count + 1);\nconst ref = useRef({\n    increment,\n});\n useEffect(() => {\n    Reactium.register('controlled.handle', ref);\n    return () => Reactium.unregister('controlled.handle');\n}, [count]);\n return (<div>Count is {count}</div>);\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/handle/index.js",
    "groupTitle": "Reactium_Handle"
  },
  {
    "type": "Function",
    "url": "Handle.subscribe(cb)",
    "title": "Handle.subscribe()",
    "description": "<p>Subscribe to changes in imperative handle references (registrations and unregistrations). Returns unsubscribe function.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "cb",
            "description": "<p>callback to be called when a handle is registered or unregistered</p>"
          }
        ]
      }
    },
    "name": "Handle_subscribe",
    "group": "Reactium_Handle",
    "examples": [
      {
        "title": "MyComponent.js",
        "content": "import React, {useState, useEffect} from 'react';\nimport Reactium from 'reactium-core/sdk';\nimport op from 'object-path'\nexport default () => {\nconst [handle, updateHandle] = useState(Reactium.Handle.get('path.to.handle'));\nuseEffect(() => Reactium.Handle.subscribe(() => {\n    const h = Reactium.Handle.get('path.to.handle');\n    if (handle.current !== h.current) updateHandle(h);\n}), []);\n const doSomething = () => {\n    if (op.has(handle, 'current.action')) handle.current.action;\n};\n return (<button onClick={doSomething}>Some Action</button>);\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/handle/index.js",
    "groupTitle": "Reactium_Handle"
  },
  {
    "type": "Function",
    "url": "Handle.unregister(id)",
    "title": "Handle.unregister()",
    "description": "<p>Unregister an imperative handle reference. See <code>Handle.register()</code> for example usage.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "id",
            "description": "<p>Array of properties, or <code>.</code> separated object path. e.g. ['path','to','handle'] or 'path.to.handle'</p>"
          }
        ]
      }
    },
    "name": "Handle_unregister",
    "group": "Reactium_Handle",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/handle/index.js",
    "groupTitle": "Reactium_Handle"
  },
  {
    "type": "Objectt",
    "url": "Reactium.Handle",
    "title": "Handle",
    "name": "Reactium_Handle",
    "description": "<p>Similar concept to an imperative handle created when using <code>React.forwardRef()</code> and the <code>useImperativeHandle()</code> React hook. Reactium provides the <code>Reactium.Handle</code> object to manage references created in your components to allow imperative control of your component from outside the component. This is used when you wish to change the internal state of your component from outside using a technique other than changing the component <code>props</code> (i.e. declarative control).</p> <p>This technique makes use of references created with <code>React.createRef()</code> or the <code>useRef()</code> hook for functional components. The developer can then assign the <code>current</code> property of this reference to be an object containing methods or callbacks (i.e. methods that can invoke <code>this.setState()</code> or the update callback returned by <code>useState()</code> hook) that will cause the state of the component to change (and rerender).</p> <p>By registering this &quot;handle reference&quot; on the <code>Reactium.Handle</code> singleton, other distant components can exercise imperative control over your component.</p> <p>For developers that prefer the use of React hooks, Reactium provides two hooks for your use: <code>useRegisterHandle()</code> and <code>useHandle()</code> to register and use these handles respectively.</p>",
    "group": "Reactium_Handle",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/handle/index.js",
    "groupTitle": "Reactium_Handle"
  },
  {
    "type": "Function",
    "url": "Hook.flush(name)",
    "title": "Hook.flush()",
    "name": "Hook_flush",
    "description": "<p>Clear all registered callbacks for a hook.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the hook name</p>"
          }
        ]
      }
    },
    "group": "Reactium_Hook",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/hook/index.js",
    "groupTitle": "Reactium_Hook"
  },
  {
    "type": "Function",
    "url": "Hook.list()",
    "title": "Hook.list()",
    "name": "Hook_list",
    "description": "<p>Register a hook callback.</p>",
    "group": "Reactium_Hook",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/hook/index.js",
    "groupTitle": "Reactium_Hook"
  },
  {
    "type": "Function",
    "url": "Hook.register(name,callback,order,id)",
    "title": "Hook.register()",
    "name": "Hook_register",
    "description": "<p>Register a hook callback.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the hook name</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "callback",
            "description": "<p>async function (or returning promise) that will be called when the hook is run. The hook callback will receive any parameters provided to Hook.run, followed by a context object (passed by reference to each callback).</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": true,
            "field": "order",
            "defaultValue": "Enums.priority.neutral",
            "description": "<p>order of which the callback will be called when this hook is run.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "id",
            "description": "<p>the unique id. If not provided, a uuid will be generated</p>"
          }
        ]
      }
    },
    "group": "Reactium_Hook",
    "examples": [
      {
        "title": "Example Usage",
        "content": "import Reactium from 'reactium-core/sdk';\nReactium.Hook.register('plugin-init', async context => {\n// mutate context object asynchrounously here\n    console.log('Plugins initialized!');\n}, Enums.priority.highest);",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/hook/index.js",
    "groupTitle": "Reactium_Hook"
  },
  {
    "type": "Function",
    "url": "Hook.registerSync(name,callback,order,id)",
    "title": "Hook.registerSync()",
    "name": "Hook_registerSync",
    "description": "<p>Register a sync hook callback.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the hook name</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "callback",
            "description": "<p>function returning promise that will be called when the hook is run. The hook callback will receive any parameters provided to Hook.run, followed by a context object (passed by reference to each callback).</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": true,
            "field": "order",
            "defaultValue": "Enums.priority.neutral",
            "description": "<p>order of which the callback will be called when this hook is run.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "id",
            "description": "<p>the unique id. If not provided, a uuid will be generated</p>"
          }
        ]
      }
    },
    "group": "Reactium_Hook",
    "examples": [
      {
        "title": "Example Usage",
        "content": "import Reactium from 'reactium-core/sdk';\nReactium.Hook.registerSync('my-sync-hook', context => {\n    // mutate context object synchrounously here\n    console.log('my-sync-hook run!');\n}, Enums.priority.highest);",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/hook/index.js",
    "groupTitle": "Reactium_Hook"
  },
  {
    "type": "Function",
    "url": "Hook.run(name,...params)",
    "title": "Hook.run()",
    "name": "Hook_run",
    "description": "<p>Run hook callbacks.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the hook name</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "...params",
            "description": "<p>any number of arbitrary parameters (variadic)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "context",
            "description": "<p>context object passed to each callback (after other variadic parameters)</p>"
          }
        ]
      }
    },
    "group": "Reactium_Hook",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/hook/index.js",
    "groupTitle": "Reactium_Hook"
  },
  {
    "type": "Function",
    "url": "Hook.runSync(name,...params)",
    "title": "Hook.runSync()",
    "name": "Hook_runSync",
    "description": "<p>Run hook callbacks sychronously.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the hook name</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "...params",
            "description": "<p>any number of arbitrary parameters (variadic)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "context",
            "description": "<p>context object passed to each callback (after other variadic parameters)</p>"
          }
        ]
      }
    },
    "group": "Reactium_Hook",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/hook/index.js",
    "groupTitle": "Reactium_Hook"
  },
  {
    "type": "Function",
    "url": "Hook.unregister(id)",
    "title": "Hook.unregister()",
    "name": "Hook_unregister",
    "description": "<p>Unregister a registered callback by id.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the unique id provided by Hook.register() or Hook.list()</p>"
          }
        ]
      }
    },
    "group": "Reactium_Hook",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/hook/index.js",
    "groupTitle": "Reactium_Hook"
  },
  {
    "type": "Function",
    "url": "Plugin.register(ID,order)",
    "title": "Plugin.register()",
    "name": "Plugin_register",
    "description": "<p>Register a Reactium plugin.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>the plugin id</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": true,
            "field": "order",
            "defaultValue": "Enums.priority.neutral",
            "description": "<p>Priority of the plugin initialization respective to other existing plugins.</p>"
          }
        ]
      }
    },
    "group": "Reactium_Plugin",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "import Reactium from 'reactium-core/sdk';\n\nconst newReducer = (state = { active: false }, action) => {\n    if (action.type === 'ACTIVATE') {\n        return {\n            ...state,\n            active: true,\n        };\n    }\n    return state;\n};\n\nconst register = async () => {\n    await Reactium.Plugin.register('myPlugin');\n    Reactium.Reducer.register('myPlugin', newReducer);\n};\n\nregister();",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/plugin/index.js",
    "groupTitle": "Reactium_Plugin"
  },
  {
    "type": "Function",
    "url": "Plugin.unregister(ID)",
    "title": "Plugin.unregister()",
    "name": "Plugin_unregister",
    "description": "<p>Unregister a Reactium plugin by unique id. This can only be called prior to the <code>plugin-dependencies</code> hook, or <code>Reactium.Plugin.ready === true</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>the plugin id</p>"
          }
        ]
      }
    },
    "group": "Reactium_Plugin",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "import Reactium from 'reactium-core/sdk';\n\n// Before Reactium.Plugin.ready\nReactium.Hook.register('plugin-dependencies', () => {\n    // Prevent myPlugin registration callback from occurring\n    Reactium.Plugin.unregister('myPlugin');\n    return Promise.resolve();\n}, Enums.priority.highest)",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/plugin/index.js",
    "groupTitle": "Reactium_Plugin"
  },
  {
    "type": "Function",
    "url": "Prefs.clear(key)",
    "title": "Prefs.clear()",
    "version": "0.0.17",
    "description": "<p>Clear one or more preferences.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "key",
            "description": "<p>If specified as an object-path, will unset a specific preference path. Otherwise, all preferences will be cleared.</p>"
          }
        ]
      }
    },
    "name": "Prefs_clear",
    "group": "Reactium_Prefs",
    "examples": [
      {
        "title": "Example",
        "content": "import Reactium from 'reactium-core/sdk';\n\nReactium.Prefs.clear();",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/prefs/index.js",
    "groupTitle": "Reactium_Prefs"
  },
  {
    "type": "Function",
    "url": "Prefs.get(key,defaultValue)",
    "title": "Prefs.get()",
    "version": "0.0.17",
    "description": "<p>Get one or more preferences by object path.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "key",
            "description": "<p>If specified as an object-path, will get a specific preference by this path. Otherwise, all preferences will be returned.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "defaultValue",
            "description": "<p>The value to return if the preference has not been set.</p>"
          }
        ]
      }
    },
    "name": "Prefs_get",
    "group": "Reactium_Prefs",
    "examples": [
      {
        "title": "Example",
        "content": "import Reactium from 'reactium-core/sdk';\n\nconst myPref = Reactium.Prefs.get('my.object.path', { someDefault: 'foo' });",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/prefs/index.js",
    "groupTitle": "Reactium_Prefs"
  },
  {
    "type": "Function",
    "url": "Prefs.set(key,value)",
    "title": "Prefs.set()",
    "version": "0.0.17",
    "description": "<p>Get one or more preferences by object path.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>The object-path to use to set the value.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "value",
            "description": "<p>The value to set to the key.</p>"
          }
        ]
      }
    },
    "name": "Prefs_set",
    "group": "Reactium_Prefs",
    "examples": [
      {
        "title": "Example",
        "content": "import Reactium from 'reactium-core/sdk';\n\nReactium.Prefs.set('my.object.path', { value: 'foo' });",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/prefs/index.js",
    "groupTitle": "Reactium_Prefs"
  },
  {
    "type": "Function",
    "url": "Pulse.get(ID)",
    "title": "Pulse.get()",
    "group": "Reactium_Pulse",
    "name": "Pulse_get",
    "description": "<p>Retrieve a registered task. Returns a <code>Pulse.Task</code> object.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>The ID of the task.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "const task = Reactium.Pulse.get('MyTask');",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse"
  },
  {
    "type": "Function",
    "url": "Pulse.register(ID,callback,options,params)",
    "title": "Pulse.register()",
    "group": "Reactium_Pulse",
    "name": "Pulse_register",
    "description": "<p>Register a new task. The callback function can be any function and supports returning a <code>Promise</code> from the function. If a <code>Promise</code> is rejected, or the callback function returns an <code>Error</code> object or <code>false</code>, a retry will be triggered if possible. In cases where no more retries can be executed, the task will fail.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>The unique ID of the task.</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "callback",
            "description": "<p>The function to execute when the task is run. The first parameter passed to the callback function will be a reference to the current task object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "options",
            "description": "<p>The <code>Pulse.Task</code> configuration object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "..attempts",
            "defaultValue": "-1",
            "description": "<p>Number of times to retry a task. By default the task will retry indefinitely.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "..autostart",
            "defaultValue": "true",
            "description": "<p>Start the task when it is registered.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "..delay",
            "defaultValue": "1000",
            "description": "<p>Time in milliseconds before the task is run again. The task will not run again until after it's callback has been executed.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "..repeat",
            "defaultValue": "-1",
            "description": "<p>Number of times to repeat the task. Used in determining if the task is complete. A task with -1 as the value will never complete.</p>"
          },
          {
            "group": "Parameter",
            "type": "Arguments",
            "optional": true,
            "field": "params",
            "description": "<p>Additional parameters to pass to the callback function.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "import React, { useEffect } from 'react';\nimport Reactium from 'reactium-core/sdk';\n\nconst MyComponent = () => {\n  const myFunction = (task, ...params) => {\n      // Do something here\n      const result = 1 === 2;\n\n      if (task.failed) { // Attempted the task 5 times\n          console.log('myFunction FAILED after', task.attempts, 'attempts with the following parameters:', ...params);\n      }\n\n      if (task.complete) { // Succeeded 5 times\n          console.log('myFunction COMPLETED after', task.attempts, 'attempts with the following parameters:', ...params);\n      }\n\n      // Trigger a retry because we're returning `false`\n      return result;\n  };\n\n  useEffect(() => {\n      // Register myFunction as a task\n      Reactium.Pulse.register('MyComponent', myFunction, {\n          attempts: 5,\n          delay: 1000,\n          repeat: 5\n      }, 'param 1', 'param 2', 'param 3');\n\n      // Unregister task when the component unmounts\n      return () => Reactium.Pulse.unregister('MyComponent');\n  }, [Reactium.Pulse]);\n\n  return <div>MyComponent</div>;\n};\n\nexport default MyComponent;",
        "type": "json"
      },
      {
        "title": "Persist",
        "content": "// For cases where you want the task to persist even after the component has\n// been unmounted or the route has changed causing a rerender:\n\n\nimport React, { useEffect } from 'react';\nimport Reactium from 'reactium-core/sdk';\n\nconst MyComponent = () => {\n\n  useEffect(() => {\n      Reactium.Pulse.register('MyComponent', MyComponent.staticTask);\n  }, [Reactium.Pulse]);\n\n  return <div>MyComponent</div>\n};\n\nMyComponent.staticTask = (task, ...params) => new Promise((resolve, reject) => {\n  // Perform an async task\n  setTimeout(() => resolve('this is awkward...'), 10000);\n});\n\nexport default MyComponent;",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse"
  },
  {
    "type": "Function",
    "url": "Pulse.start(ID)",
    "title": "Pulse.start()",
    "group": "Reactium_Pulse",
    "name": "Pulse_start",
    "description": "<p>Start a registered task if it is stopped.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>The task unique ID.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "Reactium.Pulse.start('MyTask');",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse"
  },
  {
    "type": "Function",
    "url": "Pulse.startAll()",
    "title": "Pulse.startAll()",
    "group": "Reactium_Pulse",
    "name": "Pulse_startAll",
    "description": "<p>Start all stopped tasks.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "Reactium.Pulse.startAll();",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse"
  },
  {
    "type": "Function",
    "url": "Pulse.stop(ID)",
    "title": "Pulse.stop()",
    "group": "Reactium_Pulse",
    "name": "Pulse_stop",
    "description": "<p>Stop a registered task if it is running.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>The task unique ID.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "Reactium.Pulse.stop('MyTask');",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse"
  },
  {
    "type": "Function",
    "url": "Pulse.stopAll()",
    "title": "Pulse.stopAll()",
    "group": "Reactium_Pulse",
    "name": "Pulse_stopAll",
    "description": "<p>Stop all running registered tasks.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "Reactium.Pulse.stopAll();",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse"
  },
  {
    "type": "Function",
    "url": "Pulse.unregister(ID)",
    "title": "Pulse.unregister()",
    "group": "Reactium_Pulse",
    "name": "Pulse_unregister",
    "description": "<p>Stop and unregister a task. If the task is running, it's current attempt will resolve before the task is removed.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>The task unique ID.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "useEffect(() => {\n   // Register myFunction as a task\n   Reactium.Pulse.register('MyComponent', myFunction, {\n       attempts: 5,\n       delay: 1000,\n       repeat: 5\n   }, 'param 1', 'param 2', 'param 3');\n\n   // Unregister task when the component unmounts\n   return () => Reactium.Pulse.unregister('MyComponent');\n}, [Reactium.Pulse]);",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse"
  },
  {
    "type": "Object",
    "url": "Reactium.Pulse",
    "title": "Pulse",
    "group": "Reactium_Pulse",
    "name": "Reactium_Pulse",
    "description": "<p>Simple interface for creating long or short polls.</p> <h3>Motivation</h3> <p>Often is the case where you find yourself sprinkling <code>setTimeout</code> or <code>setInterval</code> all over your code and before you know it, you have so many or rewrite the same structures over and over with a slight twist here and there. The Pulse API is designed to lighten the load on those situations and give a clean interface to easily create and manage polls.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.reset()",
    "title": "Pulse.Task.reset()",
    "group": "Reactium_Pulse",
    "name": "Reactium_Pulse_Task_reset",
    "description": "<p>Resets the task's attempt count and run count. Useful for catastrophic failures in your callback function.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse"
  },
  {
    "type": "Object",
    "url": "Reactium.Pulse.Task",
    "title": "Pulse.Task",
    "group": "Reactium_Pulse_Task",
    "name": "Reactium_Pulse_Task",
    "description": "<p>Pulse Task object that performs the heavy lifting for the Pulse API.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse_Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.ID",
    "title": "Pulse.Task.ID",
    "group": "Reactium_Pulse_Task",
    "name": "Reactium_Pulse_Task_ID",
    "description": "<p>[read-only] The unique ID of the task. Returns: <code>String</code>.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse_Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.attempt",
    "title": "Pulse.Task.attempt",
    "group": "Reactium_Pulse_Task",
    "name": "Reactium_Pulse_Task_attempt",
    "description": "<p>[read-only] The current attempt for the active task. Returns: <code>Number</code>.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse_Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.delay",
    "title": "Pulse.Task.delay",
    "group": "Reactium_Pulse_Task",
    "name": "Reactium_Pulse_Task_attempt",
    "description": "<p>The current attempt for the active task. Returns: <code>Number</code>.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse_Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.attempts",
    "title": "Pulse.Task.attempts",
    "group": "Reactium_Pulse_Task",
    "name": "Reactium_Pulse_Task_attempts",
    "description": "<p>The number of times a task will retry before it fails. Default: <code>-1</code>. You can set this value after the task has started.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse_Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.autostart",
    "title": "Pulse.Task.autostart",
    "group": "Reactium_Pulse_Task",
    "name": "Reactium_Pulse_Task_autostart",
    "description": "<p>[read-only] If the task autastarted upon creation. Default: <code>true</code>.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse_Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.complete",
    "title": "Pulse.Task.complete",
    "group": "Reactium_Pulse_Task",
    "name": "Reactium_Pulse_Task_complete",
    "description": "<p>[read-only] Relevant only when the <code>repeat</code> property is higher than 1. Returns: <code>Boolean</code>.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse_Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.count",
    "title": "Pulse.Task.count",
    "group": "Reactium_Pulse_Task",
    "name": "Reactium_Pulse_Task_count",
    "description": "<p>[read-only] The current number of times the task has succeeded. Returns: <code>Number</code>.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse_Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.error",
    "title": "Pulse.Task.error",
    "group": "Reactium_Pulse_Task",
    "name": "Reactium_Pulse_Task_error",
    "description": "<p>[read-only] The current error message if applicable. Returns: <code>string</code>.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse_Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.failed",
    "title": "Pulse.Task.failed",
    "group": "Reactium_Pulse_Task",
    "name": "Reactium_Pulse_Task_failed",
    "description": "<p>[read-only] Expresses if the current task has reached the maximum attempts. Returns: <code>Boolean</code>.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse_Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.now()",
    "title": "Pulse.Task.now()",
    "group": "Reactium_Pulse_Task",
    "name": "Reactium_Pulse_Task_now",
    "description": "<p>Force run the task without waiting for it's delay. If the task is running this is a <code>noop</code>.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse_Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.progress",
    "title": "Pulse.Task.progress",
    "group": "Reactium_Pulse_Task",
    "name": "Reactium_Pulse_Task_progress",
    "description": "<p>[read-only] The current amount of the repeat that has been completed. Relevant only when <code>repeat</code> is higher than 1. Returns: <code>0-1</code>.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse_Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.repeat",
    "title": "Pulse.Task.repeat",
    "group": "Reactium_Pulse_Task",
    "name": "Reactium_Pulse_Task_repeat",
    "description": "<p>The current number of times to run the task. Returns: <code>Number</code>.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse_Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.retry()",
    "title": "Pulse.Task.retry()",
    "group": "Reactium_Pulse_Task",
    "name": "Reactium_Pulse_Task_retry",
    "description": "<p>Force a retry of the task. Useful for when you want to manually handle retries within your callback function.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse_Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.start()",
    "title": "Pulse.Task.start()",
    "group": "Reactium_Pulse_Task",
    "name": "Reactium_Pulse_Task_start",
    "description": "<p>Start the task. Useful for when you want manually start a task in your callback function.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse_Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.status",
    "title": "Pulse.Task.status",
    "group": "Reactium_Pulse_Task",
    "name": "Reactium_Pulse_Task_status",
    "description": "<p>[read-only] The current status of the task. For comparing the status use the Pulse.ENUMS.STATUS values</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "const task = Pulse.get('MyTask');\nif (task.status === Pulse.ENUMS.STATUS.STOPPED) {\ntask.start();\n}",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse_Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.stop()",
    "title": "Pulse.Task.stop()",
    "group": "Reactium_Pulse_Task",
    "name": "Reactium_Pulse_Task_stop",
    "description": "<p>Stop the task</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse_Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.timer",
    "title": "Pulse.Task.timer",
    "group": "Reactium_Pulse_Task",
    "name": "Reactium_Pulse_Task_timer",
    "description": "<p>[read-only] The reference to the current setTimeout. This value will change for each task run. Returns: <code>Number</code>.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium_Pulse_Task"
  },
  {
    "type": "Registry",
    "url": "Middleware",
    "title": "Middleware",
    "version": "0.0.0",
    "name": "Server_Middleware",
    "group": "Reactium_Server",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/server/index.js",
    "groupTitle": "Reactium_Server"
  },
  {
    "type": "Class",
    "url": "Fullscreen",
    "title": "Fullscreen",
    "group": "Reactium_Utilities",
    "name": "Fullscreen",
    "description": "<p>Cross browser utility for toggling fullscreen mode.</p>",
    "parameter": {
      "fields": {
        "Event": [
          {
            "group": "Event",
            "type": "Event",
            "optional": false,
            "field": "fullscreenchange",
            "description": "<p>Triggered when the browser's fullscreen state changes.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Usage:",
        "content": " // isExpanded()\n Reactium.Utils.Fullscreen.isExpanded();\n\n // isCollapsed()\n Reactium.Utils.Fullscreen.isCollapsed();\n\n // collapse()\n Reactium.Utils.Fullscreen.collapse();\n\n // expand()\n Reactium.Utils.Fullscreen.expand();\n\n // toggle()\n Reactium.Utils.Fullscreen.toggle();\n\n // Event: fullscreenchange\nimport React, { useEffect, useState } from 'react';\nimport Reactium from 'reactium-core/sdk';\n\nconst MyComponent = () => {\n    const [state, setState] = useState(Reactium.Utils.Fullscreen.isExpanded());\n\n    const update = () => {\n        setState(Reactium.Utils.Fullscreen.isExpanded());\n    }\n\n    useEffect(() => {\n        // ssr safety\n        if (typeof document === 'undefined') return;\n\n        // listen for fullscreenchange\n        document.addEventListener('fullscreenchange', update);\n\n        // prevent memory leak\n        return () => {\n            document.removeEventListener('fullscreenchange', update);\n        };\n    });\n\n    return (<div>{state}</div>);\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/fullscreen.js",
    "groupTitle": "Reactium_Utilities"
  },
  {
    "type": "Function",
    "url": "Reactium.Utils.abbreviatedNumber(number)",
    "title": "Utils.abbreviatedNumber()",
    "version": "3.1.14",
    "group": "Reactium_Utilities",
    "name": "Utils_abbreviatedNumber",
    "description": "<p>Abbreviate a long number to a string.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "number",
            "description": "<p>The number to abbreviate.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Reactium.Utils.abbreviatedNumber(5000);\n// Returns: 5k\n\nReactium.Utils.abbreviatedNumber(500000);\n// Returns .5m",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/utils/index.js",
    "groupTitle": "Reactium_Utilities"
  },
  {
    "type": "Function",
    "url": "Reactium.Utils.breakpoint(width)",
    "title": "Utils.breakpoint()",
    "version": "3.1.14",
    "group": "Reactium_Utilities",
    "name": "Utils_breakpoint",
    "description": "<p>Get the breakpoint of a window width.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "width",
            "defaultValue": "window.innerWidth",
            "description": "<p>Custom width to check. Useful if you have a resize event and want to skip the function from looking up the value again. Reactium.Utils.breakpoint(); // Returns: the current window.innerWidth breakpoint.</p> <p>Reactium.Utils.breakpoint(1024); // Returns: sm</p>"
          }
        ]
      }
    },
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/utils/index.js",
    "groupTitle": "Reactium_Utilities"
  },
  {
    "type": "Function",
    "url": "Reactium.Utils.breakpoints()",
    "title": "Utils.breakpoints",
    "version": "3.1.14",
    "group": "Reactium_Utilities",
    "name": "Utils_breakpoints",
    "description": "<p>Get breakpoints from browser body:after psuedo element or <code>Utils.BREAKPOINTS_DEFAULT</code> if unset or node.</p> <table> <thead> <tr> <th>Breakpoint</th> <th>Range</th> </tr> </thead> <tbody> <tr> <td>xs</td> <td>0 - 640</td> </tr> <tr> <td>sm</td> <td>641 - 990</td> </tr> <tr> <td>md</td> <td>991 - 1280</td> </tr> <tr> <td>lg</td> <td>1281 - 1440</td> </tr> <tr> <td>xl</td> <td>1600+</td> </tr> </tbody> </table>",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/utils/index.js",
    "groupTitle": "Reactium_Utilities"
  },
  {
    "type": "Function",
    "url": "Reactium.Utils.isElectron(iframeWindow)",
    "title": "Utils.isElectron()",
    "version": "3.1.14",
    "group": "Reactium_Utilities",
    "name": "Utils_isElectron",
    "description": "<p>Determine if window is an electron window. Useful for detecting electron usage.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Window",
            "optional": true,
            "field": "iframeWindow",
            "description": "<p>iframe window reference.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Reactium.Utils.isElectron();\n// Returns: true if executed in electron.\n// Returns: false if executed in node or browser.",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/utils/index.js",
    "groupTitle": "Reactium_Utilities"
  },
  {
    "type": "Function",
    "url": "Reactium.Utils.isWindow(iframeWindow)",
    "title": "Utils.isWindow()",
    "version": "3.1.14",
    "group": "Reactium_Utilities",
    "name": "Utils_isWindow",
    "description": "<p>Determine if the window object has been set. Useful when developing for server side rendering.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Window",
            "optional": true,
            "field": "iframeWindow",
            "description": "<p>iframe window reference.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Reactium.Utils.isWindow();\n// Returns: true if executed in a browser.\n// Returns: false if executed in node (server side rendering).",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/utils/index.js",
    "groupTitle": "Reactium_Utilities"
  },
  {
    "type": "Function",
    "url": "ec(Component)",
    "title": "ec()",
    "description": "<p>ec, short for &quot;easy connect&quot; is a stripped down version of the redux <code>connect</code> function, which will provide your component with any Redux state properties under the name matching your component class (if applicable), as well as a <code>getState</code> function property.</p>",
    "name": "ec",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Component",
            "optional": false,
            "field": "Component",
            "description": "<p>the React component to be decorated with Redux state.</p>"
          },
          {
            "group": "Parameter",
            "type": "domain",
            "optional": true,
            "field": "domain",
            "description": "<p>domain or object path to get from state. if not provided, will used Component.name property.</p>"
          }
        ]
      }
    },
    "group": "Reactium_Utilities",
    "examples": [
      {
        "title": "MyComponent/index.js",
        "content": "import MyComponent from './MyComponent';\nimport { ec } from 'reactium-core/sdk';\n\nexport ec(MyComponent);",
        "type": "json"
      },
      {
        "title": "MyComponent/MyComponent.js",
        "content": "import React, { Component } from 'react';\n\nclass MyComponent extends Component {\n    render() {\n        // getState prop provided by ec\n        const state = this.props.getState();\n        // foo property provided by ec\n        const foo = this.props.foo;\n\n        // Given that Redux store has an property MyComponent with property `foo`\n        return (\n            <div>\n                {state.MyComponent.foo}\n                {foo}\n            </div>\n        );\n    }\n}\n\nMyComponent.defaultProps = {\n    getState: () => {},\n    foo: null,\n};\n\nexport default MyComponent;",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/redux.js",
    "groupTitle": "Reactium_Utilities"
  },
  {
    "type": "Utils.cxFactory",
    "url": "Utils.cxFactory",
    "title": "Utils.cxFactory",
    "description": "<p>Create a CSS classname namespace (prefix) to use on one or more sub-class. Uses the same syntax as the <code>classnames</code> library.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "namespace",
            "description": "<p>the CSS class prefix</p>"
          }
        ]
      }
    },
    "name": "Utils_cxFactory",
    "group": "Reactium_Utils",
    "examples": [
      {
        "title": "Usage:",
        "content": "import Reactium from 'reactium-core/sdk';\nimport React from 'react';\n\nconst MyComponent = props => {\n    const cx = Reactium.Utils.cxFactory('my-component');\n    const { foo } = props;\n\n    return (\n        <div className={cx()}>\n            <div className={cx('sub-1')}>\n                Classes:\n                .my-component-sub-1\n            </div>\n            <div className={cx('sub-2', { bar: foo === 'bar' })}>\n                Classes:\n                .my-component-sub-2\n                .my-component-foo\n            </div>\n        </div>\n    );\n};\n\nMyComponent.defaultProps = {\n    foo: 'bar',\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/utils/index.js",
    "groupTitle": "Reactium_Utils"
  },
  {
    "type": "Function",
    "url": "Utils.registryFactory(name,idField)",
    "title": "Utils.registryFactory()",
    "description": "<p>Creates a new instance of a simple registry object. Useful for creating an SDK registry for allowing plugins to register &quot;things&quot;. e.g. components that will render inside a component, callbacks that will run.</p> <p>More documentation needed:</p> <ul> <li>register method: used to register an object on registry</li> <li>unregister method: used to unregister an object on registry</li> <li>list property: getter for list of registered objects</li> <li>protect method: called to prevent overwriting an id on registry</li> <li>unprotect method: called to again allow overwriting on id</li> </ul>",
    "name": "Utils_registryFactory",
    "group": "Reactium_Utils",
    "examples": [
      {
        "title": "Basic Reactium Usage",
        "content": "import Reactium from 'reactium-core/sdk';\n\n// trivial example of creation of new registry\nconst myRegistryPlugin = async () => {\n    await Reactium.Plugin.register('MyRegistryPlugin', Reactium.Enums.priority.highest);\n\n    // Using Plugin API to extend the SDK\n    // Adds a new registry to the SDK called `MyRegistry`\n    Reactium.MyRegistry = Reactium.Utils.registryFactory('MyRegistry');\n};\nmyRegistryPlugin();\n\n// trivial example of registry usage\nconst anotherPlugin = async () => {\n    await Reactium.Plugin.register('AnotherPlugin');\n\n    // register object with id 'anotherId' on registry\n    Reactium.MyRegistry.register('anotherId', {\n        foo: 'bar',\n    });\n\n    // iterate through registered items\n    Reactium.MyRegistry.list.forEach(item => console.log(item));\n\n    // unregister object with id 'anotherId'\n    Reactium.MyRegistry.unregister('anotherId');\n};\nanotherPlugin();",
        "type": "json"
      },
      {
        "title": "Basic Core Usage",
        "content": "import SDK from '@atomic-reactor/reactium-sdk-core';\nexport default SDK.Utils.registryFactory('MyRegistry');",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/utils/index.js",
    "groupTitle": "Reactium_Utils"
  },
  {
    "type": "Function",
    "url": "Utils.splitParts(parts)",
    "title": "Utils.splitParts()",
    "description": "<p>Breaks formatted string (or array of strings), into flat array of parts/nodes, inserting an object in array in the place of <code>%key%</code>. Useful for tokenizing a translation string, and getting an array that can easily be mapped into React components. Returns an object with <code>replace</code> and <code>value</code> methods. Call <code>replace(key,value)</code> method (chaining) as many times as necessary to replace all tokens. Call <code>value()</code> method to get the final array of Part objects. Call <code>reset()</code> to reset the SlipParts object to the original string without replacements for reuse.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "parts",
            "description": "<p>String containing tokens like <code>%key%</code> to be replaced.</p>"
          }
        ],
        "replace": [
          {
            "group": "replace",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>when calling <code>replace(key,value)</code>, the token <code>%${key}%</code> will be replaced with an Part object key-&gt;value pair.</p>"
          },
          {
            "group": "replace",
            "type": "Mixed",
            "optional": false,
            "field": "value",
            "description": "<p>the value to use in the key-&gt;pair replacement</p>"
          }
        ],
        "Part": [
          {
            "group": "Part",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>the key in the keypair</p>"
          },
          {
            "group": "Part",
            "type": "Mixed",
            "optional": false,
            "field": "value",
            "description": "<p>the value in the keypair</p>"
          }
        ]
      }
    },
    "name": "Utils_splitParts",
    "group": "Reactium_Utils",
    "examples": [
      {
        "title": "Usage",
        "content": "import React from 'react';\nimport Reactium, { __ } from 'reactium-core/sdk';\nimport moment from 'moment';\nimport md5 from 'md5';\n\nconst Gravatar = props => {\n    const { email } = props;\n    return (\n        <img\n            className='gravatar'\n            src={`https://www.gravatar.com/avatar/${md5(\n                email.toLowerCase(),\n            )}?size=50`}\n            alt={email}\n        />\n    );\n};\n\nexport default props => {\n    const description = __('%username% updated post %slug% at %time%');\n    const parts = Reactium.Utils.splitParts(description)[\n        ('email', 'slug', 'time')\n    ].forEach(key => parts.replace(key, props[key]));\n\n    return (\n        <span className='by-line'>\n            {parts.value().map(part => {\n                // arbitrary React component possible\n                const { key, value } = part;\n\n                switch (key) {\n                    case 'email': {\n                        return <Gravatar key={key} email={value} />;\n                    }\n                    case 'time': {\n                        return (\n                            <span key={key} className='time'>\n                                {moment(value).fromNow()}\n                            </span>\n                        );\n                    }\n                    default: {\n                        // plain string part\n                        return <span key={key}>{value}</span>;\n                    }\n                }\n            })}\n        </span>\n    );\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/utils/index.js",
    "groupTitle": "Reactium_Utils"
  },
  {
    "type": "Function",
    "url": "Zone.addComponent(component,capabilities,strict)",
    "title": "Zone.addComponent()",
    "name": "Zone_addComponent",
    "description": "<p>Register a component to a component zone.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "zone",
            "description": "<p>component object, determines what component renders in a zone, what order and additional properties to pass to the component.</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "capabilities",
            "description": "<p>list of capabilities to check before adding component to zone. Can also be added as property of zone component object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "strict",
            "defaultValue": "true",
            "description": "<p>true to only add component if all capabilities are allowed, otherwise only one capability is necessary</p>"
          }
        ]
      }
    },
    "group": "Reactium_Zone",
    "examples": [
      {
        "title": "plugin-example.js",
        "content": "import SomeComponent from './path/to/SomeComponent';\nimport Reactium from 'reactium-core/sdk';\n\nReactium.Plugin.register('myPlugin').then(() => {\n    // When the component is initialized, `<SomeComponent>` will render in\n    // `\"zone-1\"`\n    Reactium.Zone.addComponent({\n        // Required - Component to render. May also be a string, if the component\n        // has been registered with Reactium.Component.register().\n        // @type {Component|String}\n        component: SomeComponent,\n\n        // Required - One or more zones this component should render.\n        // @type {String|Array}\n        zone: ['zone-1'],\n\n        // By default components in zone are rendering in ascending order.\n        // @type {Number}\n        order: {{order}},\n\n        // [Optional] - additional search subpaths to use to find the component,\n        // if String provided for component property.\n        // @type {[type]}\n        //\n        // e.g. If component is a string 'TextInput', uncommenting the line below would\n        // look in components/common-ui/form/inputs and components/general to find\n        // the component 'TextInput'\n        // paths: ['common-ui/form/inputs', 'general']\n\n        // [Optional] - Additional params:\n        //\n        // Any arbitrary free-form additional properties you provide below, will be provided as params\n        // to the component when rendered.\n        //\n        // e.g. Below will be provided to the MyComponent, <MyComponent pageType={'home'} />\n        // These can also be used to help sort or filter components, or however you have your\n        // component use params.\n        // @type {Mixed}\n        // pageType: 'home',\n    })\n})",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/index.js",
    "groupTitle": "Reactium_Zone"
  },
  {
    "type": "Function",
    "url": "Zone.addFilter(zone,filter,order)",
    "title": "Zone.addFilter()",
    "name": "Zone_addFilter",
    "description": "<p>Add a component zone filter function, used to filter which components will appear in <code>&lt;Zone /&gt;</code> Returns unique id.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zone",
            "description": "<p>the zone this filter will apply to</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "filter",
            "description": "<p>the filter function that will be passed each zone component object</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "order",
            "defaultValue": "Enums.priority.neutral",
            "description": "<p>the priority your filter will take in list of filters in this zone</p>"
          }
        ]
      }
    },
    "group": "Reactium_Zone",
    "examples": [
      {
        "title": "reactium-hooks.js",
        "content": "import Reactium from 'reactium-core/sdk';\n\nconst registerPlugin = async () => {\n    await Reactium.Plugin.register('MyVIPView');\n    const permitted = await Reactium.User.can(['vip.view']);\n\n    // Hide this component if current user shouldn't see vip components\n    const filter = component => {\n      return component.type !== 'vip' || !permitted\n    };\n\n    const id = Reactium.Zone.addFilter('zone-1', filter)\n}\nregisterPlugin();",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/index.js",
    "groupTitle": "Reactium_Zone"
  },
  {
    "type": "Function",
    "url": "Zone.addMapper(zone,mapper,order)",
    "title": "Zone.addMapper()",
    "name": "Zone_addMapper",
    "description": "<p>Add a component zone mapping function, used to augment the zone component object before passed to <code>&lt;Zone /&gt;</code>. Returns unique id.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zone",
            "description": "<p>the zone this mapper will apply to</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mapper",
            "description": "<p>the mapper function that will be passed each component object</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "order",
            "defaultValue": "Enums.priority.neutral",
            "description": "<p>the priority your mapper will take in list of mappers in this zone</p>"
          }
        ]
      }
    },
    "group": "Reactium_Zone",
    "examples": [
      {
        "title": "Example Usage",
        "content": "import Reactium from 'reactium-core/sdk';\nimport React from 'react';\nimport VIPBadge from './some/path/Vip';\n// for this zone, if component is of type \"vip\", add a VIPBage component to the component\n// components children property\nconst mapper = (component) => {\n    if (component.type === 'vip')\n    component.children = [\n        <VIPBadge />\n    ];\n    return component;\n};\nconst id = Reactium.Zone.addMapper('zone-1', mapper)",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/index.js",
    "groupTitle": "Reactium_Zone"
  },
  {
    "type": "Function",
    "url": "Zone.addSort(zone,sortBy,reverse,order)",
    "title": "Zone.addSort()",
    "name": "Zone_addSort",
    "description": "<p>Add a component zone sort critera, used to augment the zone component object before passed to <code>&lt;Zone /&gt;</code></p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zone",
            "description": "<p>the zone this sort will apply to</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "sortBy",
            "defaultValue": "order",
            "description": "<p>zone component object property to sort the list of components by</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "reverse",
            "defaultValue": "false",
            "description": "<p>reverse sort order</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "order",
            "defaultValue": "Enums.priority.neutral",
            "description": "<p>the priority your sort will take in list of sorts in this zone</p>"
          }
        ]
      }
    },
    "group": "Reactium_Zone",
    "examples": [
      {
        "title": "Example Usage",
        "content": "import Reactium from 'reactium-core/sdk';\n\n// sort by zone component.type property\nReactium.Zone.addSort('zone-1', 'type')",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/index.js",
    "groupTitle": "Reactium_Zone"
  },
  {
    "type": "Function",
    "url": "Zone.removeComponent(ID)",
    "title": "Zone.removeComponent()",
    "name": "Zone_removeComponent",
    "description": "<p>Removes a component added by <code>Zone.addComponent()</code> from a component zone by id.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>the unique component object id.</p>"
          }
        ]
      }
    },
    "group": "Reactium_Zone",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/index.js",
    "groupTitle": "Reactium_Zone"
  },
  {
    "type": "Function",
    "url": "Zone.removeFilter(id)",
    "title": "Zone.removeFilter()",
    "name": "Zone_removeFilter",
    "description": "<p>Remove filter functions for a component zone for this component.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the filter to remove</p>"
          }
        ]
      }
    },
    "group": "Reactium_Zone",
    "examples": [
      {
        "title": "Example Usage",
        "content": "import Reactium from 'reactium-core/sdk';\nReactium.Zone.removeFilter(filterId);",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/index.js",
    "groupTitle": "Reactium_Zone"
  },
  {
    "type": "Function",
    "url": "Zone.removeMapper(id)",
    "title": "Zone.removeMapper()",
    "name": "Zone_removeMapper",
    "description": "<p>Remove mapping functions for a zone..</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the mapper to remove from the zone</p>"
          }
        ]
      }
    },
    "group": "Reactium_Zone",
    "examples": [
      {
        "title": "Example Usage",
        "content": "import Reactium from 'reactium-core/sdk';\nReactium.Zone.removeMapper(mapperId);",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/index.js",
    "groupTitle": "Reactium_Zone"
  },
  {
    "type": "Function",
    "url": "Zone.removeSort(componentName,zone)",
    "title": "Zone.removeSort()",
    "name": "Zone_removeSort",
    "description": "<p>Remove sort critera for a component zone for this component. This should be called only: //   * @apiParam {String} zone the zone to remove this sort from</p>",
    "group": "Reactium_Zone",
    "examples": [
      {
        "title": "Example Usage",
        "content": "import Reactium from 'reactium-core/sdk';\nReactium.Zone.removeSort('myPlugin', 'zone-1');",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/index.js",
    "groupTitle": "Reactium_Zone"
  },
  {
    "type": "Function",
    "url": "Zone.subscribe(zone,cb)",
    "title": "Zone.subscribe()",
    "name": "Zone_subscribe",
    "description": "<p>Subscribe to components added, removed, or updated in a particular rendering zone. Returns an unsubscribe function. Call this function to unsubscribe from changes.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zone",
            "description": "<p>the zone to subscribe to</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "callback",
            "description": "<p>a function that will be called when a change occurs to zone.</p>"
          }
        ]
      }
    },
    "group": "Reactium_Zone",
    "examples": [
      {
        "title": "useZoneComponents.js",
        "content": "import Reactium from 'reactium-core/sdk';\nimport { useState, useEffect } from 'react';\n\nexport const useZoneComponents = zone => {\n    const [components, updateComponents] = useState(Reactium.Zone.getZoneComponents(zone));\n\n    useEffect(() => Reactium.Zone.subscribe(zone, zoneComponents => {\n        updateComponents(zoneComponents)\n    }), [zone]);\n\n    return components;\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/index.js",
    "groupTitle": "Reactium_Zone"
  },
  {
    "type": "Function",
    "url": "Zone.updateComponent(id,updatedComponent)",
    "title": "Zone.updateComponent()",
    "name": "Zone_updateComponent",
    "description": "<p>Register a component to a component zone.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>the unique component object id.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "updatedComponent",
            "description": "<p>updated zone component object, will be merged with existing.</p>"
          }
        ]
      }
    },
    "group": "Reactium_Zone",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/index.js",
    "groupTitle": "Reactium_Zone"
  },
  {
    "type": "RegisteredComponent",
    "url": "Zone",
    "title": "Zone",
    "version": "3.1.19",
    "name": "Zone",
    "description": "<p>Component used to identify a &quot;zone&quot; in your application where any arbitrary components will render. Plugin components registered for this zone will dynamically render in the zone. Plugins can be registered statically in Reactium by creating a <code>plugin.js</code> file that exports a component definition (<code>arcli plugin component</code> to generate boilerplate for one), or using the Reactium SDK <code>Reactium.Zone.addComponent()</code> call.</p> <p>See also the Zone SDK for filtering, sorting, or mapping over plugin components for a zone.</p> <p>To generate an exportable plugin module, use the <code>arcli plugin module</code> command.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zone",
            "description": "<p>Identifier of the zone where plugin components will be rendered.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "passThrough",
            "defaultValue": "false",
            "description": "<p>When true, will provide a <code>components</code> property to children of Zone instead of rendering plugin components directly as siblings. This is useful when you wish to make plugin components available, but take more control over how they render.</p> <p>Example Passthrough Usage: Using the <code>jsx-parser</code> module, components could be provided to a JSXParser component, and the actual render of those components could be dictated by a string of JSX and data context provided by a CMS.</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "...params",
            "description": "<p>any number of arbitrary parameters (variadic) can be provided to the Zone, and will be passed automatically as props on your plugin components when they are rendered.</p>"
          }
        ]
      }
    },
    "group": "Registered_Component",
    "examples": [
      {
        "title": "PageHeader.js",
        "content": "import React from 'react';\nimport { useHookComponent } from 'reactium-core/sdk';\n\n// PageHeader is not hard-coded, but adaptable by plugins\nexport default props => {\n    const Zone = useHookComponent('Zone');\n    return (\n        <div class='page-header'>\n            <Zone zone={'page-header'} />\n        </div>\n    );\n};",
        "type": "json"
      },
      {
        "title": "src/app/components/plugin-src/MyHeaderPlugin/index.js",
        "content": "import Reactium from 'reactium-core/sdk';\nimport MyHeaderWidget from './MyHeaderWidget';\n\nconst registerPlugin = async () => {\n    await Reactium.Plugin.register('MyHeaderPlugin');\n    Reactium.Zone.addComponent({\n        id: 'MyHeaderWidget',\n        zone: 'page-header',\n        component: MyHeaderWidget,\n    });\n};\nregisterPlugin();",
        "type": "json"
      },
      {
        "title": "src/app/components/plugin-src/MyHeaderPlugin/MyHeaderWidget.js",
        "content": "import React from 'react';\n\nexport default props => {\n   return (\n       <div class='my-header-widget'>\n           I will end up in the header zone\n       </div>\n   );\n};",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/Zone.js",
    "groupTitle": "Registered_Component"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": ".core/middleware/docs/content/main.js",
    "group": "_Development_Atomic_Reactor_Actinium__core_middleware_docs_content_main_js",
    "groupTitle": "_Development_Atomic_Reactor_Actinium__core_middleware_docs_content_main_js",
    "name": ""
  }
] });
