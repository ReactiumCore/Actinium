/**
 * @api {Object} Actinium.Roles Roles
 * @apiVersion 3.1.2
 * @apiName Roles
 * @apiGroup Actinium
 * @apiDescription A Role defines a set of permissions a user assigned the role is allowed to have.

Actinium has 6 default roles:

| Role | ID | Level |
| :---- | :-- | -----: |
| Banned User | banned | -1 |
| Standard User | user | 1 |
| Contributor | contributor | 10 |
| Moderator | moderator | 100 |
| Administrator | administrator | 1000 |
| Super Admin | super-admin | 10000 |

## Banned User
By default Banned users have zero capabilities and can no longer log in and
manage their account. When using the role, you should also remove other roles to ensure that all role-based constraints are applied to the user.

## Standard User

By default Standard Users have limited read capabilities of collections and can
manage their own profile information.

## Contributor

By default Contributors have read/write capabilities of collection content they
have created.

## Moderator

By default Moderators have read/write capabilities of collection content they
have created and those of other Moderators and Contributors.

## Administrator

By default Administrators have all default capabilities and any other defined
capability unless they are expressly excluded from the capability.
Administrators have control of all other roles except Super Admins.

## Super Admin

By default Super Admins have all capabilities and complete control over all
other roles.

 */

/**
 * @api {Function} Actinium.Roles.get(search) Roles.get()
 * @apiVersion 3.1.2
 * @apiGroup Actinium
 * @apiName Roles.get
 * @apiDescription Retrieves the specified role. If no role search is specified, all roles are returned.
 * @apiExample Example Usage:
Actinium.Roles.get(1000); // Returns the Administrator role.
Actinium.Roles.get('super-admin'); // Returns the Super Admin role.
Actinium.Roles.get(); // Returns all role objects;
 * @apiExample Returns
 {
    "super-admin":{
       "name":"super-admin",
       "label":"Super Administrator",
       "level":10000,
       "users":{
          "yg8yIUql":{
             "avatar":"https://scontent-ort2-1.xx.fbcdn.net/v/t1.0-9/avatar.jpg",
             "objectId":"yg8yIUql",
             "username":"SuperAdmin"
          }
       },
       "roles":{
          "6CX7sAaV1S":{
             "level":1,
             "name":"user",
             "objectId":"6CX7sAaV1S"
          },
          "VHFAoFXSTz":{
             "level":100,
             "name":"moderator",
             "objectId":"VHFAoFXSTz"
          },
          "XF7ByHfaEe":{
             "level":10,
             "name":"contributor",
             "objectId":"XF7ByHfaEe"
          },
          "kDIUBqCNXW":{
             "level":1000,
             "name":"administrator",
             "objectId":"kDIUBqCNXW"
          }
       },
       "objectId":"Lxank79qjd"
    },
    "administrator":{
       "name":"administrator",
       "label":"Administrator",
       "level":1000,
       "users":{},
       "roles":{
          "6CX7sAaV1S":{
             "level":1,
             "name":"user",
             "objectId":"6CX7sAaV1S"
          },
          "VHFAoFXSTz":{
             "level":100,
             "name":"moderator",
             "objectId":"VHFAoFXSTz"
          },
          "XF7ByHfaEe":{
             "level":10,
             "name":"contributor",
             "objectId":"XF7ByHfaEe"
          }
       },
       "objectId":"kDIUBqCNXW"
    },
    "moderator":{
       "name":"moderator",
       "level":100,
       "label":"Moderator",
       "users":{},
       "roles":{},
       "objectId":"VHFAoFXSTz"
    },
    "contributor":{
       "name":"contributor",
       "label":"Contributor",
       "level":10,
       "users":{},
       "roles":{
          "6CX7sAaV1S":{
             "level":1,
             "name":"user",
             "objectId":"6CX7sAaV1S"
          }
       },
       "objectId":"XF7ByHfaEe"
    },
    "user":{
       "name":"user",
       "label":"Standard User",
       "level":1,
       "users":{},
       "roles":{},
       "objectId":"6CX7sAaV1S"
    },
    "banned":{
       "name":"banned",
       "level":-1000,
       "label":"Banned User",
       "users":{},
       "roles":{},
       "objectId":"1wJIKV5NFo"
    }
 }
 */

/**
 * @api {Function} Actinium.Roles.User.get(user) Roles.User.get()
 * @apiVersion 3.1.2
 * @apiGroup Actinium
 * @apiName Roles.User.get
 * @apiDescription Retrieves roles of the specified user.
 * @apiParam {String} user The user id or username.
 * @apiExample Example Usage:
Actinium.Roles.User.get('SuperAdmin');
 * @apiExample Returns
{
    "super-admin": 10000
}
 */

/**
 * @api {Function} Actinium.Roles.User.add(user,role,options) Roles.User.add()
 * @apiVersion 3.1.2
 * @apiGroup Actinium
 * @apiName Roles.User.add
 * @apiDescription Add a user to a role. Returns a `{Promise}`.
 * @apiParam {String} user The user id.
 * @apiParam {String} role The role id.
 * @apiParam {Object} [options] The Cloud Code options object. Used to determine if the current user can administer the role.
 * @apiParam (Options) {String} [sessionToken] The session token of the current user.
 * @apiParam (Options) {Boolean} [useMasterKey=true] Bypass permissions and use the master key to
 * @apiExample Example Usage:
Actinium.Roles.User.add('kVI6HLSl', 'banned', { sessionToken: 'hQJsmKrGFgvbtyieHr8mvDfAx7X3wewS' });
Actinium.Roles.User.add('yg8yIUql', 'super-admin', { useMasterKey: true });
 */

/**
 * @api {Function} Actinium.Roles.User.remove(user,role,options) Roles.User.remove()
 * @apiVersion 3.1.2
 * @apiGroup Actinium
 * @apiName Roles.User.remove
 * @apiDescription Remove a user from a role. Returns a `{Promise}`.
 * @apiParam {String} user The user id.
 * @apiParam {String} role The role id.
 * @apiParam {Object} [options] The Cloud Code options object. Used to determine if the current user can administer the role.
 * @apiParam (Options) {String} [sessionToken] The session token of the current user.
 * @apiParam (Options) {Boolean} [useMasterKey=true] Bypass permissions and use the master key to
 * @apiExample Example Usage:
Actinium.Roles.User.remove('kVI6HLSl', 'banned', { sessionToken: 'hQJsmKrGFgvbtyieHr8mvDfAx7X3wewS' });
 */

/**
  * @api {Function} Actinium.Roles.User.is(user,role) Roles.User.is()
  * @apiVersion 3.1.2
  * @apiGroup Actinium
  * @apiName Roles.User.is
  * @apiDescription Check if a user is a member of a specific role. Returns `{Boolean}`.
  * @apiParam {String} user The user id or username.
  * @apiParam {Mixed} role The role name or level.
  * @apiExample Example Usage:
Actinium.Roles.User.is('SuperAdmin', 'super-admin');
Actinium.Roles.User.is('SuperAdmin', 10000);
// Returns true
  */

/**
 * @api {Function} Actinium.User.isRole(user,role) User.isRole()
 * @apiVersion 3.1.2
 * @apiGroup Actinium
 * @apiName User.isRole
 * @apiDescription Check if a user is a member of a specific role. Returns `{Boolean}`.
 * @apiParam {String} user The user id or username.
 * @apiParam {Mixed} role The role name or level.
 * @apiExample Example Usage:
Actinium.User.isRole('SuperAdmin', 'super-admin');
Actinium.User.isRole('SuperAdmin', 10000);
// Returns true
 */

/**
 * @api {Function} Actinium.Roles.create(role,options) Roles.create()
 * @apiVersion 3.1.2
 * @apiGroup Actinium
 * @apiName Roles.create
 * @apiDescription Create a new `Parse.Role` object. Returns a `{Promise}`.
 * @apiParam {Object} role The new role to create.
 * @apiParam {Object} [options] The Cloud Code options object. Used to determine if the current user can administer the role.
 * @apiParam (Options) {String} [sessionToken] The session token of the current user.
 * @apiParam (Options) {Boolean} [useMasterKey=true] Bypass permissions and use the master key to
 * @apiParam (Role) {String} name The unique name of the role. This is how you identify the role in code.
 * @apiParam (Role) {String} label The readable label of the role. Used when listing details about the role.
 * @apiParam (Role) {Number} level The numeric value of the role. Used when doing broad evaluations.
 * @apiParam (Role) {Array} roles Array of role names that this role inherits.
 * @apiParam (Role) {Array} acl Array of role names that can administer the new role.
 * @apiExample Example Usage:
Actinium.Roles.create(
    {
        name: 'subscriber',
        label: 'Subscriber',
        level: 5,
        roles: ['user'],
        acl: ['administrator', 'super-admin'],
    },
    {
        sessionToken: 'hQJsmKrGFgvbtyieHr8mvDfAx7X3wewS'
    }
);
 */

/**
 * @api {Function} Actinium.Roles.remove(role,options) Roles.remove()
 * @apiVersion 3.1.2
 * @apiGroup Actinium
 * @apiName Roles.remove
 * @apiDescription Remove a new `Parse.Role` object. Returns `{Object}`.
 * @apiParam {Object} role The role name to remove.
 * @apiParam {Object} [options] The Cloud Code options object. Used to determine if the current user can administer the role.
 * @apiExample Example Usage:
Actinium.Roles.remove('contributor', { useMasterKey: true });
 */

/**
  * @api {Function} Actinium.Roles.capabilities(role) Roles.capabilities()
  * @apiVersion 3.1.2
  * @apiGroup Actinium
  * @apiName Roles.capabilities
  * @apiDescription _Alias of [Actinium.Capabilities.Role.get()](#api-Actinium-Capabilities_Role_get)_
  * @apiParam {String} role The role name.
  * @apiExample Example Usage:
 Actinium.Roles.capabilities('super-admin');
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
