const chalk = require('chalk');
const _ = require('underscore');
const op = require('object-path');
const slugify = require('slugify');
const {
    hookedQuery,
    Registry,
    serialize,
} = require(`${ACTINIUM_DIR}/lib/utils`);

const COLLECTION = 'Capability';

const getRelation = async (cap, field, queryParams = {}) => {
    const limit = op.get(queryParams, 'limit', 100);
    const useMasterKey = true;
    const rel = cap.relation(field);
    let results = await rel
        .query()
        .limit(limit)
        .ascending('name')
        .find({ useMasterKey });

    const outputType = String(
        op.get(queryParams, 'outputType', 'OBJECT'),
    ).toUpperCase();

    if (outputType === 'LIST') {
        results = _.pluck(
            results.map(item => item.toJSON()),
            'name',
        ).map(role => String(role).toLowerCase());
    }

    return outputType === 'JSON' ? results.map(item => item.toJSON()) : results;
};

const getRoles = async () => {
    const { results } = await hookedQuery(
        { limit: 100, outputType: 'JSON' },
        { useMasterKey: true },
        Parse.Role,
        'capability-role-query',
        'capability-roles',
        'results',
        'ARRAY',
    );

    return results;
};

const normalizeCapability = (capabilityObj = {}) => {
    let allowed = op.get(capabilityObj, 'allowed', []) || [];
    let excluded = op.get(capabilityObj, 'excluded', []) || [];

    // banned is always excluded. super-admin may not be excluded, administrator may.
    excluded = _.uniq(_.flatten([excluded, 'banned'])).filter(
        role => role !== 'super-admin',
    );

    // administrator and super admin are always added to allowed
    allowed = _.uniq(
        _.flatten([allowed, 'administrator', 'super-admin']).filter(
            role => !excluded.includes(role),
        ),
    );

    return {
        ...capabilityObj,
        allowed,
        excluded,
    };
};

const updateCapabilityRoles = async (
    params = {},
    options = { useMasterKey: true },
) => {
    let { action, capability, field, role, roleList } = params;

    if (!options) return new Error('Permission denied 2');

    let err;
    const requiredParams = ['action', 'capability', 'field', 'role'];
    requiredParams.forEach(key => {
        if (!op.get(params, key)) {
            err = new Error(`${key} is a required parameter`);
        }
    });
    if (err) return err;

    action = String(action).toLowerCase();

    // Get the Capability Object
    let cap = await new Actinium.Query(COLLECTION)
        .equalTo('group', capability)
        .first(options);

    // Create if no cap found
    if (!cap) {
        cap = await new Actinium.Object(COLLECTION).set('group', capability);
    }

    // Get relation
    const rel = cap.relation(field);

    // Normalize the role parameter into an array adding or removing iconic roles.
    let roles =
        field === 'allowed'
            ? _.chain([role, 'super-admin', 'administrator'])
                  .flatten()
                  .uniq()
                  .value()
            : _.chain([role])
                  .without('super-admin')
                  .flatten()
                  .uniq()
                  .value();

    // Add the roles to the relation
    roles.forEach(name => {
        let role = _.findWhere(roleList, { name });

        if (!role) return;

        role = new Actinium.Role().set('id', role.objectId);

        if (action === 'add') rel.add(role);
        if (action === 'remove') rel.remove(role);
    });

    // Save the capability
    cap = await cap.save(null, options);

    // get the relations
    const [allowed, excluded] = await Promise.all([
        getRelation(cap, 'allowed', {
            limit: roleList.length,
            outputType: 'LIST',
        }),
        getRelation(cap, 'excluded', {
            limit: roleList.length,
            outputType: 'LIST',
        }),
    ]);

    // output new object
    return normalizeCapability({
        group: capability,
        objectId: cap.id,
        allowed,
        excluded,
    });
};

const User = Capability => ({
    /**
     * @api {Function} Capability.User.can(capability,user) Capability.User.can()
     * @apiVersion 3.1.2
     * @apiGroup Capability
     * @apiName Capability.User.can()
     * @apiDescription Synchronously evaluate if a user has the specified capability.
     * @apiParam {String} capability The Capability group name.
     * @apiParam {Mixed} user The user objectId String or an Actinium.User object.
     * @apiExample Example Usage
     // Using a user objectId
     if (Actinium.Capability.User.can('user.view', 'KqBNgFPG2h')) {
        console.log('Yep, you got it!');
     }

     // Inside a cloud function:
     if (Actinium.Capability.User.can('user.view', req.user)) {
        console.log('All good buddy!');
     }
     */
    can: (cap, user) =>
        _.intersection(Capability.User.roles(user), Capability.granted(cap))
            .length > 0,

    /**
     * @api {Function} Capability.User.get(user) Capability.User.get()
     * @apiVersion 3.1.2
     * @apiGroup Capability
     * @apiName Capability.User.get()
     * @apiDescription Synchronously retrieve a user's capabilites.
     * @apiParam {Mixed} user The user objectId String for an Actinium.User object.
     * @apiExample Example Usage
    Actinium.Capability.User.get(req.user);
     */
    get: user => _.intersection(Capability.User.roles(user), Capability.get()),

    roles: user => {
        // Get the user ID
        if (_.isObject(user)) {
            // parse user object
            user = op.get(user, 'id', user);

            // json user object
            user = _.isObject(user) ? op.get(user, 'objectId', user) : user;

            // request object
            user = _.isObject(user) ? op.get(user, 'user.id', user) : user;
        }

        // Get the user roles
        const roleObj = Actinium.Roles.User.get(user);

        let roles = Object.keys(roleObj).map(role =>
            String(role).toLowerCase(),
        );

        // Add the anonymous role
        roles.push('anonymous');

        // Clean up the roles and output
        return _.uniq(roles);
    },
});

const Role = Capability => ({
    /**
     * @api {Function} Capability.Role.can(capability,role) Capability.Role.can()
     * @apiVersion 3.1.2
     * @apiGroup Capability
     * @apiName Capability.Role.can()
     * @apiDescription Synchronously evaluate if a role has the specified capability.
     * @apiParam {String} capability The Capability group name.
     * @apiParam {String} role The Role name.
     * @apiExample Example Usage
    if (Actinium.Capability.Role.can('user.view', 'contributor')) {
        console.log('Looks like you got it!');
    }
     */
    can: (cap, role) => {
        const roles = _.flatten([role]);
        const granted = Capability.granted(cap);
        return _.intersection(granted, roles).length > 0;
    },

    /**
     * @api {Function} Capability.Role.get(role) Capability.Role.get()
     * @apiVersion 3.1.2
     * @apiGroup Capability
     * @apiName Capability.Role.get()
     * @apiDescription Synchronously retrieve a Role object capabilites.
     * @apiParam {String} role Role name.
     * @apiExample Example Usage
    Actinium.Capability.Role.get('contributor');
     */
    get: role =>
        _.compact(
            Capability.get().map(cap => {
                const { group } = cap;
                const granted = Capability.granted(group);
                return granted.includes(role) ? group : null;
            }),
        ),
});

class Capability {
    constructor() {
        this.roleList = [];
        this.Registry = new Registry('capability', 'group');
        this.Role = Role(this);
        this.User = User(this);
    }

    /**
     * @api {Array} Capability.list Capability.list
     * @apiVersion 3.1.2
     * @apiGroup Capability
     * @apiName Capability.list
     * @apiDescription Immutable array of registered capabilites.
     * @apiExample Example Usage
     console.log(Actinium.Capability.list);
     */
    get list() {
        return this.Registry.list;
    }

    /**
     * @api {Async} Capability.delete(capabilites) Capability.delete()
     * @apiVersion 3.1.2
     * @apiGroup Capability
     * @apiName Capability.delete()
     * @apiDescription Delete a single or multiple Capability objects. Returns an Actinium.Object array of the deleted Capability objects. Triggers the `before-capability-delete` and `capability-deleted` hooks.
     * @apiParam {Mixed} capabilities String or Array of capability group names.
     * @apiExample Example Usage
     Actinium.Capability.delete('user.view');
     Actinium.Capability.delete(['user.view']);
     */
    delete(capabilities = []) {
        capabilities = _.compact(
            _.flatten([capabilities]).map(cap => {
                cap = this.get(cap);
                if (!cap) return;
                return new Actinium.Object(COLLECTION).set('id', cap.objectId);
            }),
        );

        return capabilities.length > 0
            ? Actinium.Object.destroyAll(capabilities, { useMasterKey: true })
            : [];
    }

    /**
     * @api {Function} Capability.get(capability) Capability.get()
     * @apiVersion 3.1.2
     * @apiGroup Capability
     * @apiName Capability.get()
     * @apiDescription Synchronously retrieve a single capability or multiple. If the capability value is a String, a single Capability object is returned. If the capability value is an Array or empty, an Array of capabilites is returned. Triggers the synchronus `capabilites` hook with the return value as the only parameter.
     * @apiParam {Mixed} [capability] String or Array of capability group names.
     * @apiExample Example Usage
     console.log(Actinium.Capability.get());
     console.log(Actinium.Capability.get('user.view'));
     console.log(Actinium.Capability.get(['user.view']));
     */
    get(capability) {
        const capabilities = _.chain([capability])
            .flatten()
            .compact()
            .uniq()
            .value()
            .map(cap => String(cap).toLowerCase());

        let results =
            capabilities.length > 0
                ? _.compact(
                      capabilities.map(group =>
                          _.findWhere(this.list, { group }),
                      ),
                  )
                : this.list;

        results = results.map(cap => normalizeCapability(cap));

        // prettier-ignore
        try { Actinium.Hook.runSync('capabilites', results); }
        catch (err) { /* empty on purpose */ }

        if (!capability) return results;

        return _.isArray(capability)
            ? _.indexBy(results, 'group')
            : _.first(results);
    }

    /**
     * @api {Function} Capability.granted(capability,role) Capability.granted()
     * @apiVersion 3.1.2
     * @apiGroup Capability
     * @apiName Capability.granted()
     * @apiDescription Synchronously returns an Array of Actinium.Role names granted the capability. If the role parameter is specified, returns `Boolean`.
     * @apiParam {String} capability The capability group name.
     * @apiParam {String} [role] The role name to check.
     * @apiExample Example Usage
     console.log(Actinium.Capability.granted('user.view'));
     console.log(Actinium.Capability.granted('user.view', 'administrator'))
     */
    granted(capability, role) {
        if (!_.isString(capability)) {
            throw new Error('capability must be of type String');
        }

        if (role && !_.isString(role)) {
            throw new Error('role must boe of type String');
        }

        let cap = this.get(capability) || {};
        cap = normalizeCapability(cap);

        const { allowed = [] } = cap;
        const roles = _.chain(allowed)
            .without(this.restricted(capability))
            .uniq()
            .compact()
            .value()
            .map(r => String(r).toLowerCase());

        if (role) return roles.includes(String(role).toLowerCase());

        return roles;
    }

    /**
     * @api {Function} Capability.isRegistered(capability) Capability.isRegistered()
     * @apiVersion 3.1.2
     * @apiGroup Capability
     * @apiName Capability.isRegistered()
     * @apiDescription Synchronously check if a capability has been registered.
     * @apiParam {String} capability The capability group name to check for.
     * @apiExample Example Usage
     Actinium.Capability.isRegistered('user.view');
     */
    isRegistered(capability) {
        return this.Registry.isRegistered(capability);
    }

    /**
     * @api {Function} Capability.register(id,capability,order) Capability.register()
     * @apiVersion 3.1.2
     * @apiGroup Capability
     * @apiName Capability.register()
     * @apiDescription Synchronously register a new Capability object. If the capability exists this is a noop. Returns the results of `Capability.get()`.
     * @apiParam {String} id The unique Capability group name.
     * @apiParam {Object} [capability] Data associated with Capability object.
     * @apiParam {Number} [order=100] The index where the capability is registered. Used when applying a sort on the `Capability.list` array.
     * @apiExample Example Usage
    Actinium.Capability.register('my-admin-ui.view', {
      allowed: ['moderator', 'contributor'],
      excluded: ['banned'],
    });
     */
    register(id, capability = {}, order) {
        id = String(id).toLowerCase();
        id = String(id).substr(0, 1) === '_' ? id.split('_').pop() : id;

        if (!this.Registry.isRegistered(id)) {
            capability = _.isObject(capability) ? capability : {};
            capability = normalizeCapability(capability);
            if (!op.get(capability, 'objectId')) {
                op.set(capability, 'pending', true);
            }
            this.Registry.register(id, capability, order);
        }

        return this.get();
    }

    relation(...args) {
        return getRelation(...args);
    }

    /**
     * @api {Function} Capability.restricted(capability,role) Capability.restricted()
     * @apiVersion 3.1.2
     * @apiGroup Capability
     * @apiName Capability.restricted()
     * @apiDescription Synchronously returns an Array of Actinium.Role names restricted from the capability. If the role parameter is specified, returns `Boolean`.
     * @apiParam {String} capability The capability group name.
     * @apiParam {String} [role] The role name to check.
     * @apiExample Example Usage
     console.log(Actinium.Capability.restricted('user.view'));
     console.log(Actinium.Capability.restricted('user.view', 'administrator'))
     */
    restricted(capability, role) {
        if (!_.isString(capability)) {
            throw new Error('capability must be of type String');
        }

        if (role && !_.isString(role)) {
            throw new Error('role must boe of type String');
        }

        let cap = this.get(capability) || {};
        cap = normalizeCapability(cap);

        const { excluded = [] } = cap;

        const roles = _.chain([excluded, 'banned'])
            .flatten()
            .uniq()
            .compact()
            .value()
            .map(r => String(r).toLowerCase());

        if (role) return roles.includes(String(role).toLowerCase());

        return roles;
    }

    /**
     * @api {Function} Capability.update(id,capability,order) Capability.update()
     * @apiVersion 3.1.2
     * @apiGroup Capability
     * @apiName Capability.update()
     * @apiDescription Synchronously update a new Capability object. Returns the results of `Capability.get()`.
     * @apiParam {String} id The unique Capability group name.
     * @apiParam {Object} [capability] Data associated with Capability object.
     * @apiExample Example Usage
    Actinium.Capability.update('my-admin-ui.view', {
      allowed: ['moderator', 'contributor'],
      excluded: ['banned'],
    });
     */
    update(id, capability = {}) {
        this.Registry.cleanup(id);
        return this.register(id, capability);
    }

    async _ensureContentTypeCapabilities() {
        const caps = ['create', 'retrieve', 'update', 'delete', 'addField'];
        const { types } = await Actinium.Type.list({}, { useMasterKey: true });
        types.forEach(({ type }) => {
            const group = `content.${String(type).toLowerCase()}`;
            const config = normalizeCapability({ group });
            caps.forEach(cap => {
                if (this.get(group)) return;
                this.register(`${group}.${cap}`, config);
            });
        });
    }

    async fetch() {
        // 1.0 - Get roles
        this.roleList = await getRoles();

        const output = [];

        // 2.0 - Create the query
        const { results = [] } = await hookedQuery(
            { limit: 200, outputType: 'OBJECT' },
            { useMasterKey: true },
            COLLECTION,
            'capability-query',
            'capabilities',
            'results',
            'ARRAY',
        );

        // 3.0 - Get relation fields and map the capability object
        for (const cap of results) {
            const group = cap.get('group');

            const [allowed, excluded] = await Promise.all([
                getRelation(cap, 'allowed', {
                    limit: this.roleList.length,
                    outputType: 'LIST',
                }),
                getRelation(cap, 'excluded', {
                    limit: this.roleList.length,
                    outputType: 'LIST',
                }),
            ]);

            // prettier-ignore
            output.push(normalizeCapability({
                group,
                objectId: cap.id,
                allowed,
                excluded,
            }));
        }

        return output;
    }

    /**
     * @api {Async} Capability.getAsync(capability) Capability.getAsync()
     * @apiVersion 3.1.2
     * @apiGroup Capability
     * @apiName Capability.getAsync()
     * @apiDescription Asynchronously retrieve a single capability or multiple. If the capability value is a String, a single Capability object is returned. If the capability value is an Array or empty, an Array of capabilites is returned. Triggers the synchronus `capabilites` hook with the return value as the only parameter.
     * @apiParam {Mixed} [capability] String or Array of capability group names.
     * @apiExample Example Usage
    const MyFunction = async () => {
        const capabilites = await Actinium.Capability.getSync();
        console.log(capabilites);
        return capabilites;
    }
     */
    async getAsync(capability) {
        await this.load(true, true, 'getAsync()');
        return this.get(capability);
    }

    /**
     * @api {Async} Capability.grant(params,options) Capability.grant()
     * @apiVersion 3.1.2
     * @apiGroup Capability
     * @apiName Capability.grant()
     * @apiDescription Asynchronously grant a capability to a role.
     * @apiParam (params) {String} capability The Capability group name.
     * @apiParam (params) {Mixed} role String or Array of Role names.
     * @apiExample Example Usage
    Actinium.Capability.grant(
        { capability: 'user.view', role: ['moderator', 'contributor'] },
        { useMasterKey: true }
    );
     */
    async grant(params = {}, options) {
        op.set(params, 'action', 'add');
        op.set(params, 'field', 'allowed');
        op.set(params, 'roleList', this.roleList);
        const cap = await updateCapabilityRoles(params, options);
        if (_.isError(cap)) throw cap;
        return _.indexBy(this.list, 'group');
    }

    async load(refresh = false, flush = false, caller) {
        // Return cached registry list
        const loaded = Actinium.Cache.get('capability.loaded');
        if (
            loaded &&
            flush !== true &&
            refresh !== true &&
            this.list.length > 0
        ) {
            if (caller) console.log(caller, '\n', 'cached', loaded);
            return _.sortBy(this.list, 'group');
        }

        await Actinium.Hook.run('before-capability-load');

        // Flush registry
        if (flush === true) this.Registry.flush();

        // Get from DB
        const capabilities = await this.fetch();
        Actinium.Cache.set('capability.loaded', true);

        // Create Content Type capabilities if they don't exist
        this._ensureContentTypeCapabilities();

        // Add to registry
        capabilities.forEach(cap => {
            this.register(cap.group, cap);
        });
    }

    async propagate() {
        const caps = this.list.filter(item => {
            if (!op.get(item, 'objectId')) return true;
            return op.get(item, 'pending');
        });

        let roleEntries = {};
        if (caps.length > 0) {
            this.roleList = await getRoles();
            roleEntries = this.roleList.reduce((entries, role) => {
                const { name } = role;
                entries[name] = new Actinium.Role().set('id', role.objectId);
                return entries;
            }, {});
        }

        let saves = [];

        for (let item of caps) {
            item = normalizeCapability(item);

            const id = op.get(item, 'objectId');
            const allowed = item.allowed.map(name => op.get(roleEntries, name));
            const excluded = item.excluded.map(name =>
                op.get(roleEntries, name),
            );

            const data = { ...item };

            op.del(data, 'allowed');
            op.del(data, 'excluded');
            op.del(data, 'objectId');
            op.del(data, 'order');
            op.del(data, 'pending');

            let obj = await new Actinium.Query(COLLECTION)
                .equalTo('group', item.group)
                .first({ useMasterKey: true });

            obj = obj || new Actinium.Object(COLLECTION);
            if (id) obj.set('id', id);

            Object.entries(data).forEach(([key, value]) => obj.set(key, value));

            const allowedRel = obj.relation('allowed');
            allowed.forEach(role => allowedRel.add(role));

            const excludedRel = obj.relation('excluded');
            excluded.forEach(role => excludedRel.add(role));

            saves.push(obj);
        }

        if (caps.length > 0) {
            Actinium.Cache.set('capability.propagating', true);
        }

        saves = await Actinium.Object.saveAll(saves, { useMasterKey: true });

        saves.forEach(obj => {
            const group = obj.get('group');
            const idx = _.findIndex(this.list, { group });
            if (idx < 0) return;
            const newObj = this.list[idx];
            op.set(newObj, 'objectId', obj.id);
            op.del(newObj, 'pending');
            this.list.splice(idx, 1, newObj);
        });

        // update registry
        if (caps.length > 0 && saves.length > 0) {
            await this.load(true, true, 'propagate()');
        }

        Actinium.Cache.del('capability.propagating');
        Actinium.Cache.set('capability.propagated', Date.now(), 500, () =>
            this.propagate(),
        );
    }

    /**
     * @api {Async} Capability.restrict(params,options) Capability.restrict()
     * @apiVersion 3.1.2
     * @apiGroup Capability
     * @apiName Capability.restrict()
     * @apiDescription Asynchronously restrict a role from a capability.
     * @apiParam (params) {String} capability The Capability group name.
     * @apiParam (params) {Mixed} role String or Array of Role names.
     * @apiExample Example Usage
    Actinium.Capability.restrict(
        { capability: 'user.view', role: ['moderator', 'contributor'] },
        { useMasterKey: true }
    );
     */
    async restrict(params = {}, options) {
        op.set(params, 'action', 'add');
        op.set(params, 'field', 'excluded');
        op.set(params, 'roleList', this.roleList);
        const cap = await updateCapabilityRoles(params, options);
        if (_.isError(cap)) throw cap;
        return _.indexBy(this.list, 'group');
    }

    /**
     * @api {Async} Capability.revoke(params,options) Capability.revoke()
     * @apiVersion 3.1.2
     * @apiGroup Capability
     * @apiName Capability.revoke()
     * @apiDescription Asynchronously revoke a capability from a role.
     * @apiParam (params) {String} capability The Capability group name.
     * @apiParam (params) {Mixed} role String or Array of Role names.
     * @apiExample Example Usage
    Actinium.Capability.revoke(
        { capability: 'user.view', role: [''contributor'] },
        { useMasterKey: true }
    );
     */
    async revoke(params = {}, options) {
        op.set(params, 'action', 'remove');
        op.set(params, 'field', 'allowed');
        op.set(params, 'roleList', this.roleList);
        const cap = await updateCapabilityRoles(params, options);
        if (_.isError(cap)) throw cap;
        return _.indexBy(this.list, 'group');
    }

    /**
     * @api {Async} Capability.unrestrict(params,options) Capability.unrestrict()
     * @apiVersion 3.1.2
     * @apiGroup Capability
     * @apiName Capability.unrestrict()
     * @apiDescription Asynchronously unrestrict a role from a capability.
     * @apiParam (params) {String} capability The Capability group name.
     * @apiParam (params) {Mixed} role String or Array of Role names.
     * @apiExample Example Usage
    Actinium.Capability.unrestrict(
        { capability: 'user.view', role: ['user'] },
        { useMasterKey: true }
    );
     */
    async unrestrict(params = {}, options) {
        op.set(params, 'action', 'remove');
        op.set(params, 'field', 'excluded');
        op.set(params, 'roleList', this.roleList);
        const cap = await updateCapabilityRoles(params, options);
        if (_.isError(cap)) throw cap;
        return _.indexBy(this.list, 'group');
    }
}

const instance = new Capability();

Actinium.User.can = instance.User.can;
Actinium.User.capabilities = instance.User.get;

module.exports = instance;

/**
 * @api {Hook} before-capability-save before-capability-save
 * @apiVersion 3.1.2
 * @apiGroup Hooks
 * @apiName before-capability-save
 * @apiDescription Triggered before a Capability object is saved.
 * @apiParam {Object} request The request object.
 */

/**
 * @api {Hook} before-capability-delete before-capability-delete
 * @apiVersion 3.1.2
 * @apiGroup Hooks
 * @apiName before-capability-delete
 * @apiDescription Triggered before a Capability object is deleted.
 * @apiParam {Object} request The request object.
 */

/**
 * @api {Hook} capability-saved capability-saved
 * @apiVersion 3.1.2
 * @apiGroup Hooks
 * @apiName capability-saved
 * @apiDescription Triggered after a Capability object is saved.
 * @apiParam {Object} request The request object.
 */

/**
 * @api {Hook} capability-deleted capability-deleted
 * @apiVersion 3.1.2
 * @apiGroup Hooks
 * @apiName capability-deleted
 * @apiDescription Triggered after a Capability object is deleted.
 * @apiParam {Object} request The request object.
 */

/**
 * @api {Hook} capability-change capability-change
 * @apiVersion 3.1.2
 * @apiGroup Hooks
 * @apiName capability-change
 * @apiDescription Triggered when a Capability object is changed.
 * @apiParam {Object} request The request object.
 */
