const CoreManager = Parse.CoreManager;
const unsavedChildren = require('./unsavedChildren');

class ParseObject extends Parse.Object {
    async save(arg1, arg2, arg3) {
        let attrs;
        let options;
        if (typeof arg1 === 'object' || typeof arg1 === 'undefined') {
            attrs = arg1;
            if (typeof arg2 === 'object') {
                options = arg2;
            }
        } else {
            attrs = {};
            attrs[arg1] = arg2;
            options = arg3;
        }

        // Support save({ success: function() {}, error: function() {} })
        if (!options && attrs) {
            options = {};
            if (typeof attrs.success === 'function') {
                options.success = attrs.success;
                delete attrs.success;
            }
            if (typeof attrs.error === 'function') {
                options.error = attrs.error;
                delete attrs.error;
            }
        }

        if (attrs) {
            const validation = this.validate(attrs);
            if (validation) {
                if (options && typeof options.error === 'function') {
                    options.error(this, validation);
                }
                //return Promise.reject(validation);
                throw validation;
            }
            this.set(attrs, options);
        }

        options = options || {};
        const saveOptions = {};
        if (options.hasOwnProperty('useMasterKey')) {
            saveOptions.useMasterKey = !!options.useMasterKey;
        }
        if (
            options.hasOwnProperty('sessionToken') &&
            typeof options.sessionToken === 'string'
        ) {
            saveOptions.sessionToken = options.sessionToken;
        }
        if (
            options.hasOwnProperty('installationId') &&
            typeof options.installationId === 'string'
        ) {
            saveOptions.installationId = options.installationId;
        }
        if (
            options.hasOwnProperty('context') &&
            typeof options.context === 'object'
        ) {
            saveOptions.context = options.context;
        }
        const controller = CoreManager.getObjectController();

        const req = { object: this, options: saveOptions };
        await Actinium.Hook.run('beforeSave', req, arg1, arg2, arg3);
        await Actinium.Hook.run(
            `beforeSave_${this.className}`,
            req,
            arg1,
            arg2,
            arg3,
        );

        const unsaved =
            options.cascadeSave !== false ? unsavedChildren(this) : null;

        await controller.save(unsaved, saveOptions);

        const result = await controller.save(this, saveOptions);

        await Actinium.Hook.run('afterSave', req, arg1, arg2, arg3);
        await Actinium.Hook.run(
            `afterSave_${this.className}`,
            req,
            arg1,
            arg2,
            arg3,
        );

        return result;
    }
}

module.exports = ParseObject;
