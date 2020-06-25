const CoreManager = Parse.CoreManager;
const unsavedChildren = require('./unsavedChildren');

class ParseObject extends Parse.Object {
    async save(arg1, arg2, arg3, context) {
        context = context || {};

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

        const hooksToRun = {
            before: ['beforeSave', `beforeSave_${this.className}`],
            after: ['afterSave', `afterSave_${this.className}`],
        };

        if (
            String(this.className)
                .toLowerCase()
                .startsWith('content_')
        ) {
            hooksToRun.before.push('beforeSave_content');
            hooksToRun.after.push('afterSave_content');
        }

        const req = { object: this, options: saveOptions, context };

        for (let hook of hooksToRun.before) {
            await Actinium.Hook.run(hook, req, arg1, arg2, arg3);
        }

        const unsaved =
            options.cascadeSave !== false ? unsavedChildren(this) : null;

        await controller.save(unsaved, saveOptions);

        const result = await controller.save(this, saveOptions);

        for (let hook of hooksToRun.after) {
            await Actinium.Hook.run(hook, req, arg1, arg2, arg3);
        }

        return result;
    }

    async destroy(options, context) {
        options = options || {};
        context = context || {};

        const destroyOptions = {};
        if (options.hasOwnProperty('useMasterKey')) {
            destroyOptions.useMasterKey = options.useMasterKey;
        }
        if (options.hasOwnProperty('sessionToken')) {
            destroyOptions.sessionToken = options.sessionToken;
        }
        if (!this.id) {
            //return Promise.resolve();
            throw new Error();
        }

        const controller = CoreManager.getObjectController();

        const hooksToRun = {
            before: ['beforeDelete', `beforeDelete_${this.className}`],
            after: ['afterDelete', `afterDelete_${this.className}`],
        };

        if (
            String(this.className)
                .toLowerCase()
                .startsWith('content_')
        ) {
            hooksToRun.before.push('beforeDelete_content');
            hooksToRun.after.push('afterDelete_content');
        }

        const req = { object: this, options: destroyOptions, context };

        for (let hook of hooksToRun.before) {
            await Actinium.Hook.run(hook, req);
        }

        const result = await controller.destroy(this, destroyOptions);

        for (let hook of hooksToRun.after) {
            await Actinium.Hook.run(hook, req);
        }

        return result;
    }
}

module.exports = ParseObject;
