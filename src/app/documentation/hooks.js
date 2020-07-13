/**
 * @api {Object} Actinium.Hook Hook
 * @apiVersion 3.0.5
 * @apiGroup Actinium
 * @apiName Hook
 * @apiDescription
Hooks are a way for one piece of code to interact/modify another piece of code. They make up the foundation for how plugins interact with Actinium.

## Using Hooks
Simply create a callback function that returns a `{Promise}` and register it with Actinium.
```js
Actinium.Hook.register('start', myFunction);
```

_See: [Hook.register](#api-Actinium-Hook_register) for full example._

## Custom Hooks
You can create custom hooks in your plugins so that other developers can extend and modify it. Just create a function and implement the hook using:
```js
Hook.run('myHook', param1, param2)
```

_See: [Hook.run](#api-Actinium-Hook_run) for full example._

## Behavior
Hooks are synchronous and will execute in the order they are registered unless the `order` parameter is specified.
 * @apiParam (Hooks) activate Triggered when a plugin has been activated. The `Plugin` object is passed to the hook.
 * @apiParam (Hooks) add-meta-asset Triggered when a new Plugable meta asset is added with addMetaAsset(). The hook is passed the metaAsset object used to create the file asset.
 * @apiParam (Hooks) afterDelete-plugin
 * @apiParam (Hooks) afterDelete-route
 * @apiParam (Hooks) afterSave
 * @apiParam (Hooks) afterSave-route
 * @apiParam (Hooks) beforeDelete-plugin
 * @apiParam (Hooks) beforeSave-plugin
 * @apiParam (Hooks) blueprint-list Triggered when the list of Blueprints is retrieved from `Blueprint.list()` or the cloud function `blueprints`
 * @apiParam (Hooks) capability-edit
 * @apiParam (Hooks) capability-loaded
 * @apiParam (Hooks) capability-loading
 * @apiParam (Hooks) capability-registered Run when a new capability is created. The
 * @apiParam (Hooks) capability-unregistered
 * @apiParam (Hooks) capability-updated
 * @apiParam (Hooks) content-schema-field-types Triggered when content type fields are mapped to Parse field types. Use this hook when you defined custom field types.
 * @apiParam (Hooks) content-schema-permissions Triggered when content schemas are created, sets default class level permissions.
 * @apiParam (Hooks) content-schema-indexes Triggered when content schemas are created, sets default indexes.
 * @apiParam (Hooks) content-field-sanitize Triggered when field data is sanitized.
 * @apiParam (Hooks) content-saved Triggered when content is edited.
 * @apiParam (Hooks) collection-before-permissions
 * @apiParam (Hooks) deactivate Triggered when a plugin has been deactivated. The `Plugin` object is passed to the hook.
 * @apiParam (Hooks) directories Triggered after the list of upload directories is retrieved. Passes the `Array` of directories as the only paramter.
 * @apiParam (Hooks) directory-create Triggered after a directory is created. Passes the `Parse.Object('MediaDirectory')` object as the only parameter.
 * @apiParam (Hooks) directory-query Triggered when the query for a directory is created. Passes the `Parse.Query` object as the only parameter.
 * @apiParam (Hooks) init Triggered after Actinium has initialized Express, Middleware, and Plugins. `init` is the very first hook triggered. If you have any pre-configuration that needs to take place, this is an optimal time to do it. This will execute regardless of the plugin's active state.
 * @apiParam (Hooks) install Triggered after a plugin has been installed. The `Plugin` object is passed to the hook.
 * @apiParam (Hooks) live-query-classnames Triggered before he server starts and after `init`. The ENV.LIVE_QUERY_SETTINGS.classNames value is passed allow you to mutate the list of classNames before the server starts. This will execute regardless of the plugin's active state.
 * @apiParam (Hooks) login Triggered when a user has logged in. The user object will be saved after changes have been made. The `Parse.User` object is passed to the hook.
 * @apiParam (Hooks) mailer-transport
 * @apiParam (Hooks) plugin-load Triggered after a plugin has been loaded. This hook runs before `start` making it a good place to extend the Actinium SDK or do any before-start but after init actions.
 * @apiParam (Hooks) reset-request-context Triggered when the context object is created for a password reset request. Use this hook to add additional context data to a reset request email.
 * @apiParam (Hooks) reset-request-email-html Triggered when the password reset request email is generating the HTML version of the message. Use this hook to replace or edit the output of the html email message.
 * @apiParam (Hooks) reset-request-email-text Triggered when the password reset request email is generating the text version of the message. Use this hook to replace or edit the output of the text email message.
 * @apiParam (Hooks) role-created Run when a role is created. The new role and updated role list is passed to the hook.
 * @apiParam (Hooks) role-find Run when a role is fetched from the server. The fetched `Parse.Role` object is passed to the hook.
 * @apiParam (Hooks) role-removed Run when a role is removed. The removed role and updated role ist is passed to the hook.
 * @apiParam (Hooks) roles Triggered when roles are fetched from the server. The roles object is passed to the hook.
 * @apiParam (Hooks) route-defaults Triggered when the list of default Routes is generated. Introduces a way to add to the default Routes. The Route Array is passed to the hook.
 * @apiParam (Hooks) route-list
 * @apiParam (Hooks) route-retrieve
 * @apiParam (Hooks) running Triggered before the end of the Actinium bootstrap after warnings and tests have run.
 * @apiParam (Hooks) setting-capability
 * @apiParam (Hooks) setting-change Triggered when the value of a setting has been changed. The setting key and value are passed to the hook.
 * @apiParam (Hooks) setting-set Triggered when a new setting has been registered. The setting key and value are passed to the hook.
 * @apiParam (Hooks) setting-unset Triggered when a setting has been deleted. The setting key and value are passed to the hook.
 * @apiParam (Hooks) settings Triggered when the settings have been fetched from the server. The settings object is passed to the hook.
 * @apiParam (Hooks) settings-acl
 * @apiParam (Hooks) settings-acl-roles
 * @apiParam (Hooks) settings-sync Triggered when the settings are synced across multiple instances.
 * @apiParam (Hooks) start Triggered when the server starts up. If you have any database seeding or schema to construct, this is the optimal time to do it.
 * @apiParam (Hooks) uninstall Triggered after a plugin has been uninstalled. The `Plugin` object is passed to the hook.
 * @apiParam (Hooks) update
 * @apiParam (Hooks) user-after-save Triggered after a Parse.User object is saved.
 * @apiParam (Hooks) user-before-find Triggered when the `user-find` cloud function is called.
 * @apiParam (Hooks) user-before-login Triggered before a sign in attempt.
 * @apiParam (Hooks) user-before-save Triggered after a Parse.User object is saved.
 * @apiParam (Hooks) user-fetch Triggered when a user is fetched from the server. The fetched `Parse.User` object is passed to the hook.
 * @apiParam (Hooks) warning Triggered when the startup warnings are logged.
 */

/**
 * @api {Object} Actinium.Hook.register(name,callback,order) Hook.register()
 * @apiVersion 3.0.5
 * @apiGroup Actinium
 * @apiName Hook.register
 * @apiDescription Registering a hook queues your callback function to be executed when the hook is run.

The callback function is passed any parameters from `Hook.run()` as well as a `context` object that can be modified between hook callbacks. The context object will be the very last parameter.
 * @apiParam {String} name The hook you wish to register your callback function to.
 * @apiParam {Function} callback Function to execute when the hook is run. This function must return a `{Promise}`.
 * @apiParam {Number} [order=100] The index order in which to execute your callback function. The lower the number, the sooner it executes.
 * @apiParam (Returns) {String} hookID Returns the UUID of the registered hook. The hookID can be used when unregistering a hook with [Hook.unregister()](#api-Actinium-Hook_unregister);
 * @apiExample Example Usage:
const hookID = Actinium.Hook.register('activate', (plugin, context) => {
    const { ID } = plugin;

    // Exit if the activated plugin has nothing to do with my plugin
    if (ID !== 'TEST-PLUGIN') { return Promise.resolve(); }

    // Pass this along to the subsequent callbacks
    context[ID] = 'Yo.. we activated the TEST-PLUGIN bro!';

    // Resolve the promise after 5 seconds and log the activity
    return new Promise(resolve => setTimeout(() => {
        console.log(ID, 'activated');
        resolve();
    }, 5000));
});

// Returns 8c12574f-1dbc-496f-8125-371937acc716
 */

/**
 * @api {Object} Actinium.Hook.flush() Hook.flush()
 * @apiVersion 3.0.5
 * @apiGroup Actinium
 * @apiName Hook.flush
 * @apiDescription Unregister all callback functions for the specified hook.
 * @apiParam {String} hook The name of the hook to flush.
 * @apiExample Example Usage:
Actinium.Hook.flush('custom-hook');
 */

/**
 * @api {Array} Actinium.Hook.list() Hook.list()
 * @apiVersion 3.0.5
 * @apiGroup Actinium
 * @apiName Hook.list
 * @apiDescription Get a list of all the registered hooks.
 * @apiExample Example Usage:
console.log(Actinium.Hook.list());
 */

/**
 * @api {Object} Actinium.Hook.unregister(hookID) Hook.unregister()
 * @apiVersion 3.0.5
 * @apiGroup Actinium
 * @apiName Hook.unregister
 * @apiDescription Unregister a hook callback removing it from the Hook's action sequence.
 * @apiExample Example Usage:
Actinium.Hook.unregister('8c12574f-1dbc-496f-8125-371937acc716');
 */

/**
 * @api {Object} Actinium.Hook.run(name,[,params]) Hook.run()
 * @apiVersion 3.0.5
 * @apiGroup Actinium
 * @apiName Hook.run
 * @apiDescription Hook.Run is useful when implementing custom hooks in your plugins.

  Upon completion of the hook action sequence the `context` object is returned.

 * @apiParam {String} name Unique name of the hook you wish to run.
 * @apiParam {Arguments} params Any number of arguments you wish to pass on to the hook callback functions.
 * @apiExample Example Usage:
 // 1. Register a hook
Actinium.Hook.register('custom-hook', (stream, context) => {
    context['prevStream'] = { ...stream };
    stream['foo'] = 123;
    return Promise.resolve();
});

// 2. Create a function that implements Hook.run()
const myFunction = async () => {
    const stream = { foo: 'bar' };

    // Implement `custom-hook`
    return await Hook.run('custom-hook', stream).then(context => {
        return { context, stream };
    });
};

// 3. Results of myFunction() -> {Promise}
{
    context: {
        hook: 'custom-hook',
        prevStream: {
            foo: 'bar',
        },
    },
    stream: {
        foo: 123
    },
}
 */
