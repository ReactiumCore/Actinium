define({ "api": [
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
    "group": "/Development/Atomic Reactor/Actinium/.core/middleware/docs/content/main.js",
    "groupTitle": "/Development/Atomic Reactor/Actinium/.core/middleware/docs/content/main.js",
    "name": ""
  },
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
    "name": "Cache.clear",
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
    "name": "Cache.del",
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
    "name": "Cache.get",
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
    "name": "Cache.keys",
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
    "name": "Cache.memsize",
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
    "name": "Cache.merge",
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
    "name": "Cache.set",
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
    "name": "Cache.size",
    "description": "<p>Returns the current number of entries in the cache.</p>",
    "filename": "src/app/documentation/cache.js",
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
    "name": "Collection.register",
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
    "name": "Collection.unregister",
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
    "type": "Function",
    "url": "File.create(filePath,targetPath)",
    "title": "File.create()",
    "version": "3.1.2",
    "group": "Actinium",
    "name": "File.create",
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
    "name": "FilesAdapter.register",
    "filename": ".core/lib/files-adapter.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Harness.test(description,cb,setup,teardown)",
    "title": "Harness.test()",
    "version": "3.1.2",
    "group": "Actinium",
    "name": "Harness.test",
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
    "description": "<p>Hooks are a way for one piece of code to interact/modify another piece of code. They make up the foundation for how plugins interact with Actinium.</p> <h2>Using Hooks</h2> <p>Simply create a callback function that returns a <code>{Promise}</code> and register it with Actinium.</p> <pre class=\"prettyprint lang-js\">Actinium.Hook.register('start', myFunction); </pre> <p><em>See: <a href=\"#api-Actinium-Hook_register\">Hook.register</a> for full example.</em></p> <h2>Custom Hooks</h2> <p>You can create custom hooks in your plugins so that other developers can extend and modify it. Just create a function and implement the hook using:</p> <pre class=\"prettyprint lang-js\">Hook.run('myHook', param1, param2) </pre> <p><em>See: <a href=\"#api-Actinium-Hook_run\">Hook.run</a> for full example.</em></p> <h2>Behavior</h2> <p>Hooks are synchronous and will execute in the order they are registered unless the <code>order</code> parameter is specified.</p>",
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
    "name": "Hook.flush",
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
    "name": "Hook.list",
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
    "name": "Hook.register",
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
    "name": "Hook.run",
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
    "name": "Hook.unregister",
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
    "name": "Middleware.register",
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
    "name": "Middleware.replace",
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
    "name": "Middleware.unregister",
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
    "filename": ".core/lib/user.js",
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
    "name": "Plugin.activate",
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
    "name": "Plugin.addLogo",
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
    "name": "Plugin.addMetaAsset",
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
    "name": "Plugin.addScript",
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
    "name": "Plugin.addStylesheet",
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
    "name": "Plugin.deactivate",
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
    "name": "Plugin.get",
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
    "name": "Plugin.isActive",
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
    "name": "Plugin.isValid",
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
    "name": "Plugin.register",
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
    "type": "Function",
    "url": "Actinium.Plugin.updateHookHelper(ID,migrations)",
    "title": "Plugin.updateHookHelper()",
    "version": "3.6.2",
    "group": "Actinium",
    "description": "<p>Helper for creating multiple update scripts and walking through version appropriate updates for your plugin. For example, if you are running a plugin Foo version 3.1.0, and startup Actinium with new plugin version 3.1.7, it will be possible to run multiple update scripts in order appropriate for the new version. By default, all the scripts will run that are newer than the old version of the plugin, but you can specify your own test callback for abolute control.</p>",
    "name": "Plugin.updateHookHelper",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>the plugin id.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "migrations",
            "description": "<p>object with key matching one version and value with an object containing a migration object</p>"
          }
        ],
        "migration": [
          {
            "group": "migration",
            "type": "Asynchronous",
            "optional": true,
            "field": "test",
            "description": "<p>optional test function that will return a promise resolving to true or false, whether the migration function should be run or not respectively. By default it will run if the version of the migration script is newer than the old version of the plugin.</p>"
          },
          {
            "group": "migration",
            "type": "Asynchronous",
            "optional": false,
            "field": "migration",
            "description": "<p>migration function, given the same parameters as the update hook (plugin, request, oldPlugin)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "plugin.js",
        "content": "const semver = require('semver');\n// if new version is 1.0.6 and old was 1.0.3, both 1.0.4, 1.0.5, and 1.0.6 updates will run by default\n// if new version is 1.0.6 and old was 1.0.5, only the 1.0.5 and 1.0.6 updates will run\nconst migrations = {\n    '1.0.6': {\n        migration: async (plugin, req, oldPlugin) => {\n            console.log('do things appropriate for upgrade from <1.0.6')\n        }\n    },\n    '1.0.5': {\n        migration: async (plugin, req, oldPlugin) => {\n            console.log('do things appropriate for upgrade from <1.0.5')\n        }\n    },\n   '1.0.4': {\n       migration: async (plugin, req, oldPlugin) => {\n           console.log('do things appropriate for upgrade from <1.0.4')\n       }\n   },\n   '1.0.3': {\n       test: (version, oldVersion) => version === '1.0.3' && semver.gt(oldVersion, '>=1.0.1'),\n       migration: async (plugin, req, oldPlugin) => {\n          console.log('this will only run for version 1.0.3, and only if upgrading from 1.0.1 or 1.0.2')\n       }\n   },\n};\n\nActinium.Hook.register('update', Actinium.Plugin.updateHookHelper('MY_PLUGIN', migrations));",
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
    "name": "Pulse.define",
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
    "name": "Pulse.definitions",
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
    "name": "Pulse.log",
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
    "name": "Pulse.remove",
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
    "name": "Pulse.replace",
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
    "name": "Pulse.start",
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
    "name": "Pulse.stop",
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
    "name": "Roles.User.add",
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
    "name": "Roles.User.get",
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
    "name": "Roles.User.is",
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
    "name": "Roles.User.remove",
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
    "name": "Roles.capabilities",
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
    "name": "Roles.create",
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
    "name": "Roles.get",
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
    "name": "Roles.remove",
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
    "url": "Actinium.Setting.get(key,default)",
    "title": "Setting.get()",
    "version": "3.1.1",
    "group": "Actinium",
    "name": "Setting.get",
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
    "name": "Setting.set",
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
    "name": "Setting.unset",
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
    "name": "Type.create",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/lib/type/index.js",
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
    "name": "Type.delete",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/lib/type/index.js",
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
    "name": "Type.getCollection",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/lib/type/index.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Type.list(params,options)",
    "title": "Type.list()",
    "description": "<p>Retrieve a list of the existing content types.</p>",
    "name": "Type.list",
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
    "filename": ".core/lib/type/index.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Type.register(template)",
    "title": "Type.register()",
    "description": "<p>Utility for plugin developers to programattically ensure a content type definition exists. WARNING: do not use or expose this function to the CLOUD/REST API. Has similar object argument to Type.create or Type.update, however type label and machineName are required parameters, and type uuid is not allowed.</p>",
    "parameter": {
      "fields": {
        "template": [
          {
            "group": "template",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>String label of the content type to programmatically maintain.</p>"
          },
          {
            "group": "template",
            "type": "String",
            "optional": false,
            "field": "machineName",
            "description": "<p>the machine name of the existing content type</p>"
          },
          {
            "group": "template",
            "type": "String",
            "optional": true,
            "field": "namespace",
            "description": "<p>optional namespace. Will be used to derive the uuid from the machine name. By default, the current APIs content namespace will be used, and this will not be needed.</p>"
          },
          {
            "group": "template",
            "type": "Object",
            "optional": false,
            "field": "regions",
            "description": "<p>indexed by region id, this object contains multiple region objects, each with the same id ('default' by default), a label, and a slug. Each field in the <code>fields</code> has a <code>region</code> property with the id of the region to which it belongs.</p>"
          },
          {
            "group": "template",
            "type": "Object",
            "optional": false,
            "field": "fields",
            "description": "<p>indexed by fieldId (an uuid), a <code>field</code> object. Except for required <code>fieldId</code>, <code>fieldName</code>, <code>fieldType</code> and <code>region</code> properties, each field object may contain free-form variants that aid in the presentation of the editor/configuration of Content Editor. e.g. fieldType &quot;Text&quot; has a &quot;defaultValue&quot; property which is used for the Content Editor to display the default value in the field editor. fieldType &quot;Publisher&quot; has a boolean &quot;simple&quot; property that changes the behavior of the publishing feature in the Content Editor.</p>"
          },
          {
            "group": "template",
            "type": "Object",
            "optional": true,
            "field": "meta",
            "description": "<p>largely free-form metadata object associated with this content type. Actinium will use this to store the current label of the type.</p>"
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
    "name": "Type.register",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/lib/type/index.js",
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
    "name": "Type.retrieve",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/lib/type/index.js",
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
    "name": "Type.status",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/lib/type/index.js",
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
    "name": "Type.update",
    "group": "Actinium",
    "version": "0.0.0",
    "filename": ".core/lib/type/index.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Actinium.User.Meta.save(params,options)",
    "title": "User.Meta.save()",
    "group": "Actinium",
    "name": "User.Meta.save",
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
            "description": "<p>Mutate the list of sensative (non-public) fields.</p> <pre class=\"prettyprint\">Arguments: fields:Array, params, options </code></pre>"
          },
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-before-meta-save",
            "description": "<p>Triggered before the user update is executed.</p> <pre class=\"prettyprint\">Arguments: meta:Object, prev:Object, user:Parse.User, params, options </code></pre>"
          },
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-meta-save-response",
            "description": "<p>Triggered before the updated user object is returned.</p> <pre class=\"prettyprint\">Arguments: meta:Object, prev:Object, user:Parse.User, params, options </code></pre>"
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
    "filename": ".core/lib/user.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Actinium.User.Meta.update(params,options)",
    "title": "User.Meta.update()",
    "group": "Actinium",
    "name": "User.Meta.update",
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
            "description": "<p>Mutate the list of sensative (non-public) fields.</p> <pre class=\"prettyprint\">Arguments: fields:Array, params, options </code></pre>"
          },
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-before-meta-save",
            "description": "<p>Triggered before the user update is executed.</p> <pre class=\"prettyprint\">Arguments: meta:Object, prev:Object, user:Parse.User, params, options </code></pre>"
          },
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-meta-save-response",
            "description": "<p>Triggered before the updated user object is returned.</p> <pre class=\"prettyprint\">Arguments: meta:Object, prev:Object, user:Parse.User, params, options </code></pre>"
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
    "filename": ".core/lib/user.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Actinium.User.Pref.save(params,options)",
    "title": "User.Pref.save()",
    "group": "Actinium",
    "name": "User.Pref.save",
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
            "description": "<p>Mutate the list of sensative (non-public) fields.</p> <pre class=\"prettyprint\">Arguments: fields:Array, params, options </code></pre>"
          },
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-before-pref-save",
            "description": "<p>Triggered before the user update is executed.</p> <pre class=\"prettyprint\">Arguments: pref:Object, prev:Object, user:Parse.User, params, options </code></pre>"
          },
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-pref-save-response",
            "description": "<p>Triggered before the updated user object is returned.</p> <pre class=\"prettyprint\">Arguments: pref:Object, prev:Object, user:Parse.User, params, options </code></pre>"
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
    "filename": ".core/lib/user.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Actinium.User.Pref.update(params,options)",
    "title": "User.Pref.update()",
    "group": "Actinium",
    "name": "User.Pref.update",
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
            "description": "<p>Mutate the list of sensative (non-public) fields.</p> <pre class=\"prettyprint\">Arguments: fields:Array, params, options </code></pre>"
          },
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-before-pref-save",
            "description": "<p>Triggered before the user update is executed.</p> <pre class=\"prettyprint\">Arguments: pref:Object, prev:Object, user:Parse.User, params, options </code></pre>"
          },
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-pref-save-response",
            "description": "<p>Triggered before the updated user object is returned.</p> <pre class=\"prettyprint\">Arguments: pref:Object, prev:Object, user:Parse.User, params, options </code></pre>"
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
    "filename": ".core/lib/user.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Actinium.User.currentUser(options)",
    "title": "User.currentUser()",
    "group": "Actinium",
    "name": "User.currentUser",
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
    "filename": ".core/lib/user.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Actinium.User.init()",
    "title": "User.init()",
    "group": "Actinium",
    "name": "User.init",
    "description": "<p>Create the initial <code>Parse.User</code> object as a Super Admin if there are no users found in the User collection.</p>",
    "version": "0.0.0",
    "filename": ".core/lib/user.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Function",
    "url": "Actinium.User.isRole(user,role)",
    "title": "User.isRole()",
    "version": "3.1.2",
    "group": "Actinium",
    "name": "User.isRole",
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
    "name": "User.list",
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
            "description": "<p>Mutate the fields used when searching or exact match lookups.</p> <pre class=\"prettyprint\">Arguments: fields:Array, params, options </code></pre>"
          },
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-list-query",
            "description": "<p>Mutate the <code>Parse.Query</code> object.</p> <pre class=\"prettyprint\">Arguments: query:Parse.Query, params, options </code></pre>"
          },
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-list-response",
            "description": "<p>Mutate the response object before it is returned.</p> <pre class=\"prettyprint\">Arguments: response:Object, params, options </code></pre>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": ".core/lib/user.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Actinium.User.retrieve(params,options)",
    "title": "User.retrieve()",
    "group": "Actinium",
    "name": "User.retrieve",
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
            "description": "<p>Mutate the search fields.</p> <pre class=\"prettyprint\">Arguments: fields:Array, params, options </code></pre>"
          },
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-retrieve-response",
            "description": "<p>Mutate the <code>Parse.User</code> object before it is returned.</p> <pre class=\"prettyprint\">Arguments: user:Object, params, options </code></pre>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": ".core/lib/user.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Actinium.User.save(params,options)",
    "title": "User.save()",
    "group": "Actinium",
    "name": "User.save",
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
            "description": "<p>Mutate the <code>Parse.User</code> object before save is complete.</p> <pre class=\"prettyprint\">Arguments:  req:Object:Parse.User </code></pre>"
          },
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-after-save",
            "description": "<p>Take action after the <code>Parse.User</code> object has been saved.</p> <pre class=\"prettyprint\">Arguments: req:Object:Parse.User </code></pre>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": ".core/lib/user.js",
    "groupTitle": "Actinium"
  },
  {
    "type": "Asynchronous",
    "url": "Actinium.User.trash(params,options)",
    "title": "User.trash()",
    "group": "Actinium",
    "name": "User.trash",
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
            "description": "<p>Triggered before the <code>Parse.User</code> object is deleted.</p> <pre class=\"prettyprint\">Arguments: req:Object:Parse.User </code></pre>"
          },
          {
            "group": "hooks",
            "type": "Hook",
            "optional": false,
            "field": "user-after-delete",
            "description": "<p>Triggered after the <code>Parse.User</code> object is deleted.</p> <pre class=\"prettyprint\">Arguments: req:Object:Parse.User </code></pre>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": ".core/lib/user.js",
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
    "name": "Utils.CloudCapOptions",
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
    "name": "Utils.CloudHasCapabilities",
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
    "name": "Utils.CloudMasterOptions",
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
    "name": "Utils.CloudRunOptions",
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
    "name": "Utils.MasterOptions",
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
    "name": "Utils.UserFromSession",
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
    "name": "Utils.serialize",
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
    "type": "Function",
    "url": "Capability.Role.can(capability,role)",
    "title": "Capability.Role.can()",
    "version": "3.1.2",
    "group": "Capability",
    "name": "Capability.Role.can",
    "description": "<p>Synchronously evaluate if a role has the specified capability.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "capability",
            "description": "<p>The Capability group name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>The Role name.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage",
        "content": "if (Actinium.Capability.Role.can('user.view', 'contributor')) {\n    console.log('Looks like you got it!');\n}",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Capability"
  },
  {
    "type": "Function",
    "url": "Capability.Role.get(role)",
    "title": "Capability.Role.get()",
    "version": "3.1.2",
    "group": "Capability",
    "name": "Capability.Role.get",
    "description": "<p>Synchronously retrieve a Role object capabilites.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Role name.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage",
        "content": "Actinium.Capability.Role.get('contributor');",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Capability"
  },
  {
    "type": "Function",
    "url": "Capability.User.can(capability,user)",
    "title": "Capability.User.can()",
    "version": "3.1.2",
    "group": "Capability",
    "name": "Capability.User.can",
    "description": "<p>Synchronously evaluate if a user has the specified capability.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "capability",
            "description": "<p>The Capability group name.</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "user",
            "description": "<p>The user objectId String or an Actinium.User object.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage",
        "content": "// Using a user objectId\nif (Actinium.Capability.User.can('user.view', 'KqBNgFPG2h')) {\n   console.log('Yep, you got it!');\n}\n\n// Inside a cloud function:\nif (Actinium.Capability.User.can('user.view', req.user)) {\n   console.log('All good buddy!');\n}",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Capability"
  },
  {
    "type": "Function",
    "url": "Capability.User.get(user)",
    "title": "Capability.User.get()",
    "version": "3.1.2",
    "group": "Capability",
    "name": "Capability.User.get",
    "description": "<p>Synchronously retrieve a user's capabilites.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "user",
            "description": "<p>The user objectId String for an Actinium.User object.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage",
        "content": "Actinium.Capability.User.get(req.user);",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Capability"
  },
  {
    "type": "Array",
    "url": "Capability.anonymous",
    "title": "Capability.anonymous",
    "version": "3.1.2",
    "group": "Capability",
    "name": "Capability.anonymous",
    "description": "<p>Returns an array of Capability group names where the anonymous role is allowed and not excluded.</p>",
    "examples": [
      {
        "title": "Example Usage",
        "content": "console.log(Actinium.Capability.anonymous);",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Capability"
  },
  {
    "type": "Async",
    "url": "Capability.delete(capabilites)",
    "title": "Capability.delete()",
    "version": "3.1.2",
    "group": "Capability",
    "name": "Capability.delete",
    "description": "<p>Delete a single or multiple Capability objects. Returns an Actinium.Object array of the deleted Capability objects. Triggers the <code>before-capability-delete</code> and <code>capability-deleted</code> hooks.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "capabilities",
            "description": "<p>String or Array of capability group names.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage",
        "content": "Actinium.Capability.delete('user.view');\nActinium.Capability.delete(['user.view']);",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Capability"
  },
  {
    "type": "Function",
    "url": "Capability.get(capability)",
    "title": "Capability.get()",
    "version": "3.1.2",
    "group": "Capability",
    "name": "Capability.get",
    "description": "<p>Synchronously retrieve a single capability or multiple. If the capability value is a String, a single Capability object is returned. If the capability value is an Array or empty, an Array of capabilites is returned. Triggers the synchronus <code>capabilites</code> hook with the return value as the only parameter.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": true,
            "field": "capability",
            "description": "<p>String or Array of capability group names.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage",
        "content": "console.log(Actinium.Capability.get());\nconsole.log(Actinium.Capability.get('user.view'));\nconsole.log(Actinium.Capability.get(['user.view']));",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Capability"
  },
  {
    "type": "Async",
    "url": "Capability.getAsync(capability)",
    "title": "Capability.getAsync()",
    "version": "3.1.2",
    "group": "Capability",
    "name": "Capability.getAsync",
    "description": "<p>Asynchronously retrieve a single capability or multiple. If the capability value is a String, a single Capability object is returned. If the capability value is an Array or empty, an Array of capabilites is returned. Triggers the synchronus <code>capabilites</code> hook with the return value as the only parameter.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": true,
            "field": "capability",
            "description": "<p>String or Array of capability group names.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage",
        "content": "const MyFunction = async () => {\n    const capabilites = await Actinium.Capability.getSync();\n    console.log(capabilites);\n    return capabilites;\n}",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Capability"
  },
  {
    "type": "Async",
    "url": "Capability.grant(params,options)",
    "title": "Capability.grant()",
    "version": "3.1.2",
    "group": "Capability",
    "name": "Capability.grant",
    "description": "<p>Asynchronously grant a capability to a role.</p>",
    "parameter": {
      "fields": {
        "params": [
          {
            "group": "params",
            "type": "String",
            "optional": false,
            "field": "capability",
            "description": "<p>The Capability group name.</p>"
          },
          {
            "group": "params",
            "type": "Mixed",
            "optional": false,
            "field": "role",
            "description": "<p>String or Array of Role names.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage",
        "content": "Actinium.Capability.grant(\n    { capability: 'user.view', role: ['moderator', 'contributor'] },\n    { useMasterKey: true }\n);",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Capability"
  },
  {
    "type": "Function",
    "url": "Capability.granted(capability,role)",
    "title": "Capability.granted()",
    "version": "3.1.2",
    "group": "Capability",
    "name": "Capability.granted",
    "description": "<p>Synchronously returns an Array of Actinium.Role names granted the capability. If the role parameter is specified, returns <code>Boolean</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "capability",
            "description": "<p>The capability group name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "role",
            "description": "<p>The role name to check.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage",
        "content": "console.log(Actinium.Capability.granted('user.view'));\nconsole.log(Actinium.Capability.granted('user.view', 'administrator'))",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Capability"
  },
  {
    "type": "Function",
    "url": "Capability.isRegistered(capability)",
    "title": "Capability.isRegistered()",
    "version": "3.1.2",
    "group": "Capability",
    "name": "Capability.isRegistered",
    "description": "<p>Synchronously check if a capability has been registered.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "capability",
            "description": "<p>The capability group name to check for.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage",
        "content": "Actinium.Capability.isRegistered('user.view');",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Capability"
  },
  {
    "type": "Array",
    "url": "Capability.list",
    "title": "Capability.list",
    "version": "3.1.2",
    "group": "Capability",
    "name": "Capability.list",
    "description": "<p>Immutable array of registered capabilites.</p>",
    "examples": [
      {
        "title": "Example Usage",
        "content": "console.log(Actinium.Capability.list);",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Capability"
  },
  {
    "type": "Function",
    "url": "Capability.register(id,capability,order)",
    "title": "Capability.register()",
    "version": "3.1.2",
    "group": "Capability",
    "name": "Capability.register",
    "description": "<p>Synchronously register a new Capability object. If the capability exists this is a noop. Returns the results of <code>Capability.get()</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The unique Capability group name.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "capability",
            "description": "<p>Data associated with Capability object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "order",
            "defaultValue": "100",
            "description": "<p>The index where the capability is registered. Used when applying a sort on the <code>Capability.list</code> array.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage",
        "content": "Actinium.Capability.register('my-admin-ui.view', {\n  allowed: ['moderator', 'contributor'],\n  excluded: ['banned'],\n});",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Capability"
  },
  {
    "type": "Async",
    "url": "Capability.restrict(params,options)",
    "title": "Capability.restrict()",
    "version": "3.1.2",
    "group": "Capability",
    "name": "Capability.restrict",
    "description": "<p>Asynchronously restrict a role from a capability.</p>",
    "parameter": {
      "fields": {
        "params": [
          {
            "group": "params",
            "type": "String",
            "optional": false,
            "field": "capability",
            "description": "<p>The Capability group name.</p>"
          },
          {
            "group": "params",
            "type": "Mixed",
            "optional": false,
            "field": "role",
            "description": "<p>String or Array of Role names.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage",
        "content": "Actinium.Capability.restrict(\n    { capability: 'user.view', role: ['moderator', 'contributor'] },\n    { useMasterKey: true }\n);",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Capability"
  },
  {
    "type": "Function",
    "url": "Capability.restricted(capability,role)",
    "title": "Capability.restricted()",
    "version": "3.1.2",
    "group": "Capability",
    "name": "Capability.restricted",
    "description": "<p>Synchronously returns an Array of Actinium.Role names restricted from the capability. If the role parameter is specified, returns <code>Boolean</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "capability",
            "description": "<p>The capability group name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "role",
            "description": "<p>The role name to check.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage",
        "content": "console.log(Actinium.Capability.restricted('user.view'));\nconsole.log(Actinium.Capability.restricted('user.view', 'administrator'))",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Capability"
  },
  {
    "type": "Async",
    "url": "Capability.revoke(params,options)",
    "title": "Capability.revoke()",
    "version": "3.1.2",
    "group": "Capability",
    "name": "Capability.revoke",
    "description": "<p>Asynchronously revoke a capability from a role.</p>",
    "parameter": {
      "fields": {
        "params": [
          {
            "group": "params",
            "type": "String",
            "optional": false,
            "field": "capability",
            "description": "<p>The Capability group name.</p>"
          },
          {
            "group": "params",
            "type": "Mixed",
            "optional": false,
            "field": "role",
            "description": "<p>String or Array of Role names.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage",
        "content": "Actinium.Capability.revoke(\n    { capability: 'user.view', role: [''contributor'] },\n    { useMasterKey: true }\n);",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Capability"
  },
  {
    "type": "Async",
    "url": "Capability.unrestrict(params,options)",
    "title": "Capability.unrestrict()",
    "version": "3.1.2",
    "group": "Capability",
    "name": "Capability.unrestrict",
    "description": "<p>Asynchronously unrestrict a role from a capability.</p>",
    "parameter": {
      "fields": {
        "params": [
          {
            "group": "params",
            "type": "String",
            "optional": false,
            "field": "capability",
            "description": "<p>The Capability group name.</p>"
          },
          {
            "group": "params",
            "type": "Mixed",
            "optional": false,
            "field": "role",
            "description": "<p>String or Array of Role names.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage",
        "content": "Actinium.Capability.unrestrict(\n    { capability: 'user.view', role: ['user'] },\n    { useMasterKey: true }\n);",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Capability"
  },
  {
    "type": "Function",
    "url": "Capability.update(id,capability,order)",
    "title": "Capability.update()",
    "version": "3.1.2",
    "group": "Capability",
    "name": "Capability.update",
    "description": "<p>Synchronously update a new Capability object. Returns the results of <code>Capability.get()</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The unique Capability group name.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "capability",
            "description": "<p>Data associated with Capability object.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage",
        "content": "Actinium.Capability.update('my-admin-ui.view', {\n  allowed: ['moderator', 'contributor'],\n  excluded: ['banned'],\n});",
        "type": "json"
      }
    ],
    "filename": ".core/lib/capability.js",
    "groupTitle": "Capability"
  },
  {
    "type": "Cloud",
    "url": "plugin-activate",
    "title": "plugin-activate",
    "version": "3.0.5",
    "group": "Cloud",
    "name": "plugin-activate",
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
    "name": "plugin-deactivate",
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
    "name": "plugin-uninstall",
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
    "type": "Hook",
    "url": "before-capability-delete",
    "title": "before-capability-delete",
    "version": "3.1.2",
    "group": "Hooks",
    "name": "before-capability-delete",
    "description": "<p>Triggered before a Capability object is deleted.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>The request object.</p>"
          }
        ]
      }
    },
    "filename": ".core/lib/capability.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "before-capability-save",
    "title": "before-capability-save",
    "version": "3.1.2",
    "group": "Hooks",
    "name": "before-capability-save",
    "description": "<p>Triggered before a Capability object is saved.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>The request object.</p>"
          }
        ]
      }
    },
    "filename": ".core/lib/capability.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "capability-change",
    "title": "capability-change",
    "version": "3.1.2",
    "group": "Hooks",
    "name": "capability-change",
    "description": "<p>Triggered when a Capability object is changed.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>The request object.</p>"
          }
        ]
      }
    },
    "filename": ".core/lib/capability.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "capability-deleted",
    "title": "capability-deleted",
    "version": "3.1.2",
    "group": "Hooks",
    "name": "capability-deleted",
    "description": "<p>Triggered after a Capability object is deleted.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>The request object.</p>"
          }
        ]
      }
    },
    "filename": ".core/lib/capability.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "capability-saved",
    "title": "capability-saved",
    "version": "3.1.2",
    "group": "Hooks",
    "name": "capability-saved",
    "description": "<p>Triggered after a Capability object is saved.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "request",
            "description": "<p>The request object.</p>"
          }
        ]
      }
    },
    "filename": ".core/lib/capability.js",
    "groupTitle": "Hooks"
  }
] });
