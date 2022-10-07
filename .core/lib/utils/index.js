const SDK = Actinium => {
    const isSDK = require('./isSDK')(Actinium);
    const slugify = require('./slugify');
    const FileAPI = require('./file-api');
    const Registry = require('./registry');
    const serialize = require('./serialize');
    const hookedSave = require('./hookedSave')(Actinium);
    const hookedQuery = require('./hookedQuery')(Actinium);
    const { CloudACL, AclTargets } = require('./acl')(Actinium);
    const hookedRetrieve = require('./hookedRetrieve')(Actinium);
    const { getCallStack, getCallerFile } = require('./stack');

    const {
        CloudRunOptions,
        CloudCapOptions,
        CloudHasCapabilities,
        MasterOptions,
        CloudMasterOptions,
        UserFromSession,
        userMeetsLevel,
    } = require('./options');

    return {
        AclTargets,
        CloudRunOptions,
        CloudCapOptions,
        CloudHasCapabilities,
        MasterOptions,
        CloudMasterOptions,
        UserFromSession,
        userMeetsLevel,
        CloudACL,
        serialize,
        slugify,
        FileAPI,
        hookedSave,
        hookedQuery,
        hookedRetrieve,
        Registry,
        getCallStack,
        getCallerFile,
        isSDK,
    };
};

module.exports = SDK;
