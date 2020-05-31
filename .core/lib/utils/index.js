const slugify = require('./slugify');
const FileAPI = require('./file-api');
const serialize = require('./serialize');
const hookedSave = require('./hookedSave');
const hookedQuery = require('./hookedQuery');
const { CloudACL, AclTargets } = require('./acl');
const hookedRetrieve = require('./hookedRetrieve');

const {
    CloudRunOptions,
    CloudCapOptions,
    CloudHasCapabilities,
    MasterOptions,
    CloudMasterOptions,
    UserFromSession,
    userMeetsLevel,
} = require('./options');

module.exports = {
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
};
