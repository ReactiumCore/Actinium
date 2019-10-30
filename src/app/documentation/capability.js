/**
 * @api {Object} Actinium.Capability Capabilities
 * @apiVersion 3.1.2
 * @apiName Capabilities
 * @apiGroup Actinium
 * @apiDescription Actinium uses a concept of Roles, Levels, and Capabilities,
designed to give the developer the ability to control what users can and cannot
do within the application.

A capability is permission to perform one or more types of task. Each user might have some capabilities but not others, depending on their role.

Actinium comes with the default capabilities:

| Capability | Roles |
| ---------- | ----- |
| user.admin | super-admin, administrator, moderator, contributor |
| user.ban | super-admin, administrator, moderator |
| user.view | super-admin, administrator, moderator |
| user.create | super-admin, administrator |
| user.edit | super-admin, administrator |
| user.delete | super-admin, administrator |
| plugin.view | super-admin, administrator |
| plugin.activate | super-admin, administrator |
| plugin.deactivate | super-admin, administrator |
| plugin.uninstall | super-admin, administrator |

### user.admin
Ability to view the /admin pages.

### user.ban
Ability to ban a user.

### user.view
Ability to view the user list and other user profiles.

### user.create
Ability to create a new user.

### user.edit
Ability to edit a user.

### user.delete
Ability to delete a user.

### plugin.view
Ability to view the plugin list.

### plugin.activate
Ability to activate a plugin.

### plugin.deactivate
Ability to deactivate a plugin.

### plugin.uninstall
Ability to uninstall a plugin.

 */

/**
  * @api {Function} Actinium.Capability.register(group,roles,order) Capability.register()
  * @apiVersion 3.1.2
  * @apiGroup Actinium
  * @apiName Capability.register
  * @apiDescription Registers a new capability.
  * @apiParam {String} [group=global] The capability group. Specifying a group namespaces your capability so that it doesn't collide with other plugins. For instance you may have a `view` capability. Adding this to the global group would potentially cause conflicts but adding it to _your-plugin-group_ can avoid this.
  * @apiParam {Object} roles Allowed or excluded roles of the capability.
  * @apiParam {Number} [order=100] The order index to register your capability. Useful when trying to overwrite an existing capability.
  * @apiParam (Roles) {Array} [allowed] Array of role names that are allowed the capability.
  * @apiParam (Roles) {Array} [excluded] Array or role names that are expressly not allowed the capability.
  * @apiExample Example Usage:
// Give only super-admin the ability to ban a user:

Actinium.Capability.register(
  'user.ban',
  {
    allowed: ['super-admin'],
    excluded: ['administrator'],
  },
  1000,
);
  */

/**
 * @api {Function} Actinium.Capability.unregister(capability) Capability.unregister()
 * @apiVersion 3.1.2
 * @apiGroup Actinium
 * @apiName Capability.unregister
 * @apiDescription Unregisters a capability.
 * @apiParam {String} capability The capability to unregister.
 * @apiExample Example Usage:
Actinium.Capability.unregister('sample.edit');
 */

/**
  * @api {Function} Actinium.Capability.get(capability) Capability.get()
  * @apiVersion 3.1.2
  * @apiGroup Actinium
  * @apiName Capability.get
  * @apiDescription Retrieves the specified capability. If no capability is specified a list of all capability names will be returned.
  * @apiParam {String} [capability] The capability to retrieve.
  * @apiExample Example Usage:
Actinium.Capability.get('user.edit');
Actinium.Capability.get();
  */

/**
 * @api {Function} Actinium.Capability.Role.can(role,capability) Capability.Role.can()
 * @apiVersion 3.1.2
 * @apiGroup Actinium
 * @apiName Capability.Role.can
 * @apiDescription Determines if the role has the specified capability. Returns `{Boolean}`.
 * @apiParam {String} role The role name.
 * @apiParam {String} capability The capability.
 * @apiExample Example Usage:
Actinium.Capability.Role.can('banned', 'user.edit');
// Retuns false
 */

/**
 * @api {Function} Actinium.Capability.Role.get(role) Capability.Role.get()
 * @apiVersion 3.1.2
 * @apiGroup Actinium
 * @apiName Capability.Role.get
 * @apiDescription Get the capabilities of the specified role. Returns an `{Array}`.
 * @apiParam {String} role The role name.
 * @apiExample Example Usage:
Actinium.Capability.Role.get('super-admin');
// Retuns array of capabilities
[
   'user.view',
   'user.create',
   'user.edit',
   'user.delete',
   'user.ban',
   'plugin.view',
   'plugin.activate',
   'plugin.deactivate'
]
 */

/**
 * @api {Function} Actinium.Capability.User.get(user) Capability.User.get()
 * @apiVersion 3.1.2
 * @apiGroup Actinium
 * @apiName Capability.User.get
 * @apiDescription Get the capabilities of the specified user. Returns an `{Array}`.
 * @apiParam {String} user The user id or username.
 * @apiExample Example Usage:
Actinium.Capability.User.get('yg8yIUql');
Actinium.Capability.User.get('username');
 */

/**
 * @api {Function} Actinium.User.capabilities(user) User.capabilities()
 * @apiVersion 3.1.2
 * @apiGroup Actinium
 * @apiName User.capabilities
 * @apiDescription Get the capabilities of the specified user. Returns an `{Array}`.
 * @apiParam {String} user The user id or username.
 * @apiExample Example Usage:
 Actinium.User.capabilities('yg8yIUql');
 Actinium.User.capabilities('username');
 */

/**
 * @api {Function} Actinium.Capability.User.can(capability,user) Capability.User.can()
 * @apiVersion 3.1.2
 * @apiGroup Actinium
 * @apiName Capability.User.can
 * @apiDescription Determines if a user has the specified capability. If the user is a Super Admin this will always return true. If the user is an Administrator this will almost always return true except in cases where the Administrator has been expressly excluded from the capability. Returns `{Boolean}`.
 * @apiParam {String} capability The capability name.
 * @apiParam {String} user The user id or username. Alternatively you can pass a request object. If the request object has the master key specified, role and capabilities are bipassed and `true` is returned.
 * @apiExample Example Usage:
Actinium.Capability.User.can('user.edit', 'SuperAdmin');
// Returns true
 */

/**
 * @api {Function} Actinium.User.can(capability,user) User.can()
 * @apiVersion 3.1.2
 * @apiGroup Actinium
 * @apiName User.can
 * @apiDescription Determines if a user has the specified capability. If the user is a Super Admin this will always return true. If the user is an Administrator this will almost always return true except in cases where the Administrator has been expressly excluded capability. Returns `{Boolean}`.
 * @apiParam {String} capability The capability name.
 * @apiParam {String} user The user id or username. Alternatively you can pass a request object. If the request object has the master key specified, role and capabilities are bipassed and `true` is returned.
 * @apiExample Example Usage:
Actinium.User.can('user.edit', 'SuperAdmin');
// Returns true
 */

/**
 * @api {Cloud} capability-check capability-check
 * @apiVersion 3.1.2
 * @apiGroup Cloud
 * @apiName capability-check
 * @apiDescription Check one or more capabilities for the request user.
 * @apiParam {Mixed} capability string or array of strings for the group path for a capability.
 * @apiParam {Boolean} [strict=true] if [true] all capabilities must be permitted for request user, else only one must match
 * @apiExample Example Usage
Reactium.Cloud.run('capability-check', { capability: 'user.view', strict: false})
 * @apiSuccess {Boolean} permitted
 */

/**
 * @api {Cloud} capability-get capability-get
 * @apiVersion 3.1.2
 * @apiGroup Cloud
 * @apiName capability-get
 * @apiDescription Get current capabilities.
 * @apiExample Example Usage
Reactium.Cloud.run('capability-get')
 * @apiExample Example Response
 {
         "user.admin": {
             "allowed": [
                 "administrator",
                 "super-admin"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "user.view": {
             "allowed": [
                 "administrator",
                 "super-admin",
                 "moderator"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "user.create": {
             "allowed": [
                 "administrator",
                 "super-admin"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "user.edit": {
             "allowed": [
                 "administrator",
                 "super-admin"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "user.delete": {
             "allowed": [
                 "administrator",
                 "super-admin"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "user.ban": {
             "allowed": [
                 "administrator",
                 "super-admin",
                 "moderator"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "plugin.view": {
             "allowed": [
                 "administrator",
                 "super-admin"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "plugin.activate": {
             "allowed": [
                 "administrator",
                 "super-admin"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "plugin.deactivate": {
             "allowed": [
                 "administrator",
                 "super-admin"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "plugin.uninstall": {
             "allowed": [
                 "administrator",
                 "super-admin"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "setting.set": {
             "allowed": [
                 "administrator",
                 "super-admin"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "setting.get": {
             "allowed": [
                 "administrator",
                 "super-admin"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "setting.unset": {
             "allowed": [
                 "administrator",
                 "super-admin"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "Setting.create": {
             "allowed": [
                 "administrator",
                 "super-admin"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "Setting.update": {
             "allowed": [
                 "administrator",
                 "super-admin"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "Setting.delete": {
             "allowed": [
                 "administrator",
                 "super-admin"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "Setting.addField": {
             "allowed": [
                 "administrator",
                 "super-admin"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "Plugin.create": {
             "allowed": [
                 "administrator",
                 "super-admin"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "Plugin.update": {
             "allowed": [
                 "administrator",
                 "super-admin"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "Plugin.delete": {
             "allowed": [
                 "administrator",
                 "super-admin"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "Plugin.addField": {
             "allowed": [
                 "administrator",
                 "super-admin"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "Blueprint.create": {
             "allowed": [
                 "administrator",
                 "super-admin"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "Blueprint.retrieve": {
             "allowed": [
                 "administrator",
                 "super-admin"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "Blueprint.update": {
             "allowed": [
                 "administrator",
                 "super-admin"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "Blueprint.delete": {
             "allowed": [
                 "administrator",
                 "super-admin"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "Blueprint.addField": {
             "allowed": [
                 "administrator",
                 "super-admin"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "Route.create": {
             "allowed": [
                 "administrator",
                 "super-admin",
                 "contributor"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "Route.retrieve": {
             "allowed": [
                 "administrator",
                 "super-admin",
                 "contributor"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "Route.update": {
             "allowed": [
                 "administrator",
                 "super-admin",
                 "contributor"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "Route.delete": {
             "allowed": [
                 "administrator",
                 "super-admin",
                 "contributor"
             ],
             "excluded": [
                 "banned"
             ]
         },
         "Route.addField": {
             "allowed": [
                 "administrator",
                 "super-admin"
             ],
             "excluded": [
                 "banned"
             ]
         }
     }
 */

/**
 * @api {Cloud} capability-edit capability-edit
 * @apiVersion 3.1.2
 * @apiGroup Cloud
 * @apiName capability-edit
 * @apiDescription Create new capability or edit an existing one.
 * @apiParam {String} group capability name in object path form `group.action` (e.g. user.edit)
 * @apiParam {Object} perms `allowed` roles and `excluded` roles.
 * @apiExample Example Usage
// only administrators and super-admin users can "mail.send"
Reactium.Cloud.run('capability-edit', 'mail.send', {
    "allowed": [
        "administrator",
        "super-admin"
    ],
    "excluded": [
        "banned"
    ]
})
 */

/**
 * @api {Cloud} capability-create capability-create
 * @apiVersion 3.1.2
 * @apiGroup Cloud
 * @apiName capability-create
 * @apiDescription Alias for capability-edit
 */

/**
 * @api {Cloud} capability-delete capability-delete
 * @apiVersion 3.1.2
 * @apiGroup Cloud
 * @apiName capability-delete
 * @apiDescription Delete a capability.
 * @apiParam {String} group capability name in object path form `group.action` (e.g. user.edit)
 * @apiExample Example Usage
Reactium.Cloud.run('capability-delete', { capability: 'user.view'})
 */
