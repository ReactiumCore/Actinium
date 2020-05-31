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
            "field": "content",
            "description": "<p>content data to sanitize</p>"
          }
        ],
        "content": [
          {
            "group": "content",
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
            "field": "blueprint-defaults",
            "description": "<p>Triggered when the list of default Blueprints is generated. Introduces a way to add to the default Blueprints. The Blueprint array is passed to the hook.</p>"
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
            "field": "route-defaults",
            "description": "<p>Triggered when the list of default Routes is generated. Introduces a way to add to the default Routes. The Route Array is passed to the hook.</p>"
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
    "description": "<p>Function that creates a file and adds it to the Media Library.</p> <p>Returns: <code>Parse.Object('Media')</code></p>",
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
    "url": "Plugin.addLogo(ID,filePath)",
    "title": "Plugin.addLogo()",
    "version": "3.1.6",
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
            "type": "Boolean",
            "optional": true,
            "field": "static",
            "defaultValue": "false",
            "description": "<p>when true, file will be copied to static assets directory to be served as a static asset instead of attached as file object.</p>"
          }
        ]
      }
    },
    "filename": ".core/lib/plugable.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Plugin.addMetaAsset(ID,filePath,assetURLType)",
    "title": "Plugin.addMetaAsset()",
    "version": "3.1.6",
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
            "field": "assetURLType",
            "defaultValue": "assetURL",
            "description": "<p>string (object path relative to plugin.meta) to store in plugin meta the file URL for the asset. e.g. by default your file URL will be found at <code>plugin.meta.assetURL</code> object path.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "static",
            "defaultValue": "false",
            "description": "<p>when true, file will be copied to static assets directory to be served as a static asset instead of attached as file object.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "example-plugin.js",
        "content": "// A plugin object, see Actinium.Plugin.register() for more information.\nconst PLUGIN = {\n  ID: 'Example',\n  name: 'Example Plugin',\n  description: 'A generic plugin',\n  version: {\n      plugin: 0.0.1,\n      actinium: 3.1.6,\n  },\n};\n\nActinium.Plugin.register(PLUGIN);\n\n// all these execute on `activation` hook of your plugin\n// addLogo uses addMetaAsset with assetURLType='logoURL'\nActinium.Plugin.addLogo(\n    PLUGIN.ID,\n    path.resolve(__dirname, 'plugin-assets/reset-logo.svg'),\n);\n// addLogo uses addMetaAsset with assetURLType='scriptURL'\nActinium.Plugin.addScript(\n    PLUGIN.ID,\n    path.resolve(__dirname, 'plugin-assets/reset.js'),\n);\n// addLogo uses addMetaAsset with assetURLType='styleURL'\nActinium.Plugin.addStylesheet(\n    PLUGIN.ID,\n    path.resolve(__dirname, 'plugin-assets/reset-plugin.css'),\n);\nActinium.Plugin.addMetaAsset(PLUGIN.ID, 'plugin-assets/worker.js', 'webworkerURL');",
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
    "url": "Plugin.addScript(ID,filePath)",
    "title": "Plugin.addScript()",
    "version": "3.1.6",
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
            "type": "Boolean",
            "optional": true,
            "field": "static",
            "defaultValue": "false",
            "description": "<p>when true, file will be copied to static assets directory to be served as a static asset instead of attached as file object.</p>"
          }
        ]
      }
    },
    "filename": ".core/lib/plugable.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Plugin.addStylesheet(ID,filePath)",
    "title": "Plugin.addStylesheet()",
    "version": "3.1.6",
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
            "type": "Boolean",
            "optional": true,
            "field": "static",
            "defaultValue": "false",
            "description": "<p>when true, file will be copied to static assets directory to be served as a static asset instead of attached as file object.</p>"
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
    "filename": ".core/plugin/media/media-plugin.js",
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
    "filename": ".core/plugin/media/media-plugin.js",
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
    "filename": ".core/plugin/media/media-plugin.js",
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
    "filename": ".core/plugin/media/media-plugin.js",
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
    "filename": ".core/plugin/media/media-plugin.js",
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
    "filename": ".core/plugin/media/media-plugin.js",
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
    "filename": ".core/plugin/media/media-plugin.js",
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
    "filename": ".core/plugin/media/media-plugin.js",
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
    "filename": ".core/plugin/media/media-plugin.js",
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
    "filename": "src/app/documentation/route.js",
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
    "filename": "src/app/documentation/route.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "route-create",
    "title": "route-create",
    "version": "3.1.2",
    "group": "Cloud",
    "name": "route_create",
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
            "field": "blueprintId",
            "description": "<p>The name of the associated blueprint.</p>"
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
        "content": "Actinium.Cloud.run('route-create', {\n        route: '/hello-world',\n        blueprintId: 'Simple',\n        capabilities: ['admin-ui.view'],\n        meta: {\n            foo: 'bar',\n        },\n    },\n);",
        "type": "json"
      }
    ],
    "filename": "src/app/documentation/route.js",
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
            "description": "<p>The existing route string.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "blueprintId",
            "description": "<p>The name of the associated blueprint.</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "capabilities",
            "description": "<p>Array of capabilities (object-path format)</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "meta",
            "description": "<p>free-form metadata object</p>"
          }
        ]
      }
    },
    "description": "<p>Delete existing route. Built-in routes can not be deleted by default.</p>",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Cloud.run('route-update', {\n      route: '/hello-world',\n      blueprintId: 'Simple',\n      capabilities: ['admin-ui.view'],\n      meta: {\n          foo: 'bar',\n      },\n  },\n);\n\n/**",
        "type": "json"
      },
      {
        "title": "Example Usage:",
        "content": "Actinium.Cloud.run('route-delete', {\n    route: '/hello-world',\n});",
        "type": "json"
      }
    ],
    "filename": "src/app/documentation/route.js",
    "groupTitle": "Cloud"
  },
  {
    "type": "Cloud",
    "url": "route-generate",
    "title": "route-generate",
    "version": "3.1.2",
    "group": "Cloud",
    "name": "route_generate",
    "description": "<p>Generate the default Route objects.</p>",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Actinium.Cloud.run('route-generate');",
        "type": "json"
      }
    ],
    "filename": "src/app/documentation/route.js",
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
    "filename": "src/app/documentation/route.js",
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
            "field": "field",
            "description": "<p><code>{fieldSlug, fieldValue}</code> the key-pair for this field</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "config",
            "description": "<p>the configuration of this field (including <code>fieldType</code>) stored in the type</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "index",
            "description": "<p>the index in array of all FieldData</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "fieldData",
            "description": "<p>array of all permitted field data.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "content",
            "description": "<p>object passed to <code>Content.sanitize()</code></p>"
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
