const ActiniumSDK = require('../.core/actinium');

const Test = new ActiniumSDK();
Test.start({ port: 9100 }).then(() => {
    console.log(Object.keys(Actinium).sort());
});

// Actinium.Object = require('./lib/ParseObject');
// Actinium.User = require('./lib/user');
// Actinium.Harness = require('./lib/harness');
// Actinium.Enums = require('./lib/enums');
// Actinium.Exp = require('./lib/express-settings');
// Actinium.Cache = require('./lib/cache');
// Actinium.FilesAdapter = require('./lib/files-adapter');
// Actinium.File = require('./lib/file');
// Actinium.Setting = require('./lib/setting');
// Actinium.Roles = require('./lib/roles');
// Actinium.Cloud = require('./lib/cloud');
// Actinium.Hook = require('./lib/hook');
// Actinium.Plugin = require('./lib/plugable');
// Actinium.Warnings = require('./lib/warnings');
// Actinium.Middleware = require('./lib/middleware');
// Actinium.Pulse = require('./lib/pulse');
// Actinium.Capability = require('./lib/capability');
// Actinium.Collection = require('./lib/collection');
// Actinium.Utils = require('./lib/utils');
// Actinium.Type = require('./lib/type');
