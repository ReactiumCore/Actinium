const _ = require('underscore');
const uuid = require('uuid/v4');
const op = require('object-path');

/**
 * @api {Object} Registry Registry
 * @apiGroup Actinium
 * @apiName Registry
 * @apiDescription Actinium uses a number of registry objects used to register
 * all sorts of objects that will be used elsewhere in the framework. New registry
 * objects are generally instanciated as singletons on the overall SDK.
 *
 * There are many registry objects attached by default to the SDK, and developers can
 * create new ones using `Utils.registryFactory()`.
 * @apiParam list {Getter} get list of most recent (or highest order) registered objects, filtering out unregistered or banned objects.
 * @apiParam registered {Getter} get list of all historically registrated objects, even duplicates, ordered by order property of object (defaults to 100).
 * @apiParam protected {Getter} get list of protected registrations ids
 * @apiParam unregistered {Getter} get list of all existing registered objects ids that have been subsequently unregistered.
 * @apiParam banned {Getter} get list of all banned objects ids.
 * @apiParam mode {Getter} get current mode (Default Utils.Registry.MODES.HISTORY)
 * @apiParam mode {Setter} set current mode (Default Utils.Registry.MODES.HISTORY)
 * @apiParam isProtected {Method} pass the identifier of an object to see if it has been protected
 * @apiParam isRegistered {Method} pass the identifier of an object to see if it has been registered
 * @apiParam isBanned {Method} pass the identifier of an object to see if it has been banned
 * @apiParam ban {Method} pass the identifier of an object to ban. Banned objects can not be registered and will not be show in list. Useful when you have code
 * that needs to preempt the registration of an object from code you do not control. E.g. a plugin is introducing undesireable or disabled functionality
 * @apiParam cleanup {Method} pass the identifier of an object to be purged from historical registrations (i.e. free up memory) Automatically performed in mode Utils.Registry.CLEAN
 * @apiParam protect {Method} pass the identifier of an object to protect. Protected objects can not be overridden or cleaned up.
 * @apiParam register {Method} pass an identifier and a data object to register the object. The identifier will be added if it is not already registered (but protected) and not banned.
 * @apiParam unprotect {Method} pass an identifier to unprotect an object
 * @apiParam unregister {Method} pass an identifier to unregister an object. When in HISTORY mode (default), previous registration will be retained, but the object will not be listed. In CLEAN mode, the previous registrations will be removed, unless protected.
 */

class Registry {
    constructor(name, idField, mode = Registry.MODES.HISTORY) {
        this.__name = name || 'Registry';
        this.__idField = idField || 'id';
        this.__protected = [];
        this.__registered = [];
        this.__unregister = [];
        this.__banned = [];
        this.__mode = mode in Registry.MODES ? mode : Registry.MODES.HISTORY;
    }

    get protected() {
        return this.__protected;
    }

    get registered() {
        return this.__registered;
    }

    get unregistered() {
        return this.__unregister;
    }

    get banned() {
        return this.__banned;
    }

    get list() {
        const unregister = _.uniq(this.__unregister);
        const banned = _.uniq(this.__banned);
        const registered = Array.from(this.__registered).filter(
            item =>
                !unregister.includes(item[this.__idField]) &&
                !this.isBanned(item[this.__idField]),
        );

        return Object.values(
            _.chain(registered)
                .sortBy('order')
                .indexBy(this.__idField)
                .value(),
        );
    }

    set mode(newMode = Registry.MODES.HISTORY) {
        this.__mode =
            newMode in Registry.MODES ? newMode : Registry.MODES.HISTORY;
    }

    get mode() {
        return this.__mode;
    }

    isProtected(id) {
        return this.__protected.includes(id);
    }

    isRegistered(id) {
        return !!_.findWhere(this.__registered, { id });
    }

    isBanned(id) {
        return !!_.findWhere(this.__banned, { id });
    }

    ban(id) {
        this.__banned = _.chain([this.__banned, [id]])
            .flatten()
            .uniq()
            .value();

        if (this.__mode === Registry.MODES.CLEAN) {
            this.cleanup(id);
        }

        return this;
    }

    cleanup(id) {
        const [remove] = _.flatten([id]);
        if (this.isProtected(id)) return this;

        this.__registered = this.__registered.filter(
            item => item[this.__idField] !== remove,
        );

        return this;
    }

    protect(id) {
        this.__protected = _.chain([this.__protected, [id]])
            .flatten()
            .uniq()
            .value();

        return this;
    }

    register(id, data = {}) {
        if (!id) id = uuid();

        if (this.isBanned(id)) {
            return new Error(
                `${this.__name} unable to register banned item ${id}`,
            );
        }

        if (this.isProtected(id) && this.isRegistered(id)) {
            return new Error(
                `${this.__name} unable to replace protected item ${id}`,
            );
        }

        data['order'] = op.get(data, 'order', 100);
        const item = { ...data, [this.__idField]: id };

        if (this.__mode === Registry.MODES.CLEAN) {
            this.cleanup(id);
        }

        this.__registered.push(item);
        this.__unregister = _.without(this.__unregister, id);

        return this;
    }

    unprotect(id) {
        this.__protected = _.without(this.__protected, id);
        return this;
    }

    unregister(id) {
        if (!id) return this;

        id = _.chain([id])
            .flatten()
            .uniq()
            .value();

        id.forEach(() => {
            if (this.__protected.includes(id)) return;

            if (this.__mode === Registry.MODES.CLEAN) {
                this.cleanup(id);
                return;
            }

            this.__unregister = _.chain(this.__unregister.concat(id))
                .flatten()
                .uniq()
                .value();
        });

        return this;
    }
}

Registry.MODES = {
    HISTORY: 'HISTORY',
    CLEAN: 'CLEAN',
};

module.exports = Registry;
