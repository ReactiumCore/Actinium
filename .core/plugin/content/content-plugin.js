const _ = require('underscore');
const ENUMS = require('./enums');
const op = require('object-path');

const {
    CloudHasCapabilities,
    CloudRunOptions,
} = require(`${ACTINIUM_DIR}/lib/utils`);

const PLUGIN = require('./meta');
const PLUGIN_SDK = require('./sdk');
const PLUGIN_ROUTES = require('./routes');
const PLUGIN_SCHEMA = require('./schema-template');
const PLUGIN_BLUEPRINTS = require('./blueprints');

// Create SDK Singleton
Actinium.Content = PLUGIN_SDK;

// Register Plugin
Actinium.Plugin.register(PLUGIN, true);

Actinium.Hook.register('schema', async () => {
    const { types = [] } = await Actinium.Cloud.run(
        'types',
        {},
        { useMasterKey: true },
    );
    for (const { objectId, type } of types) {
        try {
            await Actinium.Content.loadSchema(objectId);
        } catch (error) {
            console.log(`Error updating content schema ${type}`, error);
        }
    }
});

/*
1. CLP (Class Level Permissions) is primarily guard against using Parse Cloud REST API improperly
- capabilities can be used to guard cloud functions, but not direct Parse API use (such as REST)
- Actinium.Collection.register() provides mapping from capabilities (COLLECTION.create, COLLECTION.retrieve, COLLECTION.update, COLLECTION.delete, COLLECTION.addFields) to role based CLP
- Granting a capability such as above will automatically update the appropriate CLP on that schema.

2. Content schema's (Content-{type}) should NOT use Content-{type}.create/retrieve/update/delete
in conjuction with CloudCapOptions(), which escalates the action to useMasterKey: true. Instead, use
CloudRunOptions() or equivalent only, and let the CLP naturally filter out responses.

3. ACLs will be required to protect any individual content from read/write.
- By default a REST interaction retrieve/update/delete of existing content will need to first pass CLP, and then read/write ACL check.

4. When we want to provide "super" retrieve, update, delete permission, we can use CloudCapOptions(), but for a different
set of permissions (COLLECTION.createAny, COLLECTION.retrieveAny, COLLECTION.updateAny, COLLECTION.deleteAny), and only
through cloud function. "super" operations should be impossible through ordinary Parse REST API calls.

Use Cases:
1. Publicly creatable, not publicly readable

  How:
  Content-{type}.create capability applied to anonymous role

  Check:
  CLP enforced

2. Publicly readable, not writable in any way, enforce ACL.

  How:
  Content-{type}.retrieve capability applied to anonymous role

  Check:
  CLP enforced, ACL enforced

3. Publicly readable, not writable in any way, ignore ACL.

  How:
  Content-{type}.retrieveAny capability applied to anonymous role.

  Check:
  Escalate to master read for cloud function if Content-{type}.retrieveAny using CloudCapOptions()
  Neither CLP nor ACL enforced on read of content type.

4. Role X has one or more CRUD permission, but only RUD "own" content

  How:
  Content-{type}.[create|update|retrieve|delete] for role X.

  Check:
  CLP enforced, ACL enforced

5. Role X is moderator, has one or more RUD permission, access to content owned by others, ACL not enforced.

  How:
  Content-{type}.[updateAny|retrieveAny|deleteAny] for role X.

  Check:
  Escalate to master for cloud function if Content-{type}.[updateAny|retrieveAny|deleteAny] using CloudCapOptions()
  CLP and ACL ignored

Cloud Pseudo:

# contents
options = CloudCapOptions([Content-{type}.retrieveAny])
perform fetch

# content-create:

options = CloudRunOptions()
perform creation

# content-retrieve: (1)

options = CloudCapOptions([Content-{type}.retrieveAny])
perform fetch

# content-update: (1)

options = CloudCapOptions([Content-{type}.updateAny])
perform fetch/update

# content-delete: (1)

options = CloudCapOptions([Content-{type}.deleteAny])
perform fetch/update

*/
