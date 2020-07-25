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
        );
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
    let allowed = op.get(capabilityObj, 'allowed') || [];
    let excluded = op.get(capabilityObj, 'excluded') || [];

    // banned is always excluded. super-admin may not be excluded, administrator may.
    excluded = _.uniq(excluded.concat('banned')).filter(
        role => role !== 'super-admin',
    );

    // administrator and super admin are always added to allowed
    allowed = _.uniq(
        allowed
            .concat('administrator', 'super-admin')
            .filter(role => !excluded.includes(role)),
    );

    return {
        ...capabilityObj,
        allowed,
        excluded,
    };
};

const updateCapabilityRoles = async (params = {}, options) => {
    let { action, capability, field, role, roleList } = params;

    if (!options) return new Error('Permission denied');

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

class Capability {
    constructor() {
        this.Registry = new Registry('capability', 'group');
        this.roleList = [];
        this.User = {
            can: () => true,
            get: () => [],
        };
    }

    get list() {
        return this.Registry.list;
    }

    register(id, capability = {}, order) {
        const idx = _.findIndex(this.Registry.list, { group: id });
        if (idx >= 0) {
            let current = op.get(this.Registry.list, [idx]);
            op.del(current, 'order');
            op.del(current, 'pending');
            op.del(capability, 'order');
            op.del(capability, 'pending');

            const updated = normalizeCapability({
                ...current,
                ...capability,
                pending:
                    _.difference(Object.keys(current), Object.keys(capability))
                        .length > 0,
            });

            this.Registry.list.splice(idx, 1, updated);
        } else {
            capability = _.isObject(capability) ? capability : {};
            capability = normalizeCapability(capability);
            if (!op.get(capability, 'objectId')) {
                op.set(capability, 'pending', true);
            }
            this.Registry.register(id, capability, order);
        }
    }

    relation(...args) {
        return getRelation(...args);
    }

    granted(capability) {
        const cap = this.get(capability) || normalizeCapability({});
        const { allowed = [] } = cap;
        const roles = _.chain(allowed)
            .without(this.restricted(capability))
            .uniq()
            .compact()
            .value();
        return roles;
    }

    restricted(capability) {
        const cap = this.get(capability) || {};
        const { excluded = [] } = cap;
        return _.chain([excluded, 'banned'])
            .flatten()
            .uniq()
            .compact()
            .value();
    }

    get(capability) {
        const capabilities = _.chain([capability])
            .flatten()
            .compact()
            .uniq()
            .value();

        let results =
            capabilities.length > 0
                ? _.compact(
                      capabilities.map(group =>
                          _.findWhere(this.list, { group }),
                      ),
                  )
                : this.list;

        results = results.map(cap => normalizeCapability(cap));

        if (!capability) return results;

        return _.isArray(capability)
            ? _.indexBy(results, 'group')
            : _.first(results);
    }

    async getAsync(capability) {
        await this.load(true);
        return this.get(capability);
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

    async load(refresh = false, flush = false) {
        // Return cached registry list
        if (refresh !== true && flush !== true && this.list.length > 0) {
            return _.sortBy(this.list, 'group');
        }

        // Flush registry
        if (flush === true) this.Registry.flush();

        // Get from DB
        const capabilities = await this.fetch();

        // Add to registry
        capabilities.forEach(cap => this.register(cap.group, cap));
    }

    async propagate() {
        const caps = this.Registry.list.filter(item => {
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
            const idx = _.findIndex(this.Registry.list, { group });
            if (idx < 0) return;
            const newObj = this.Registry.list[idx];
            op.set(newObj, 'objectId', obj.id);
            op.del(newObj, 'pending');
            this.Registry.list.splice(idx, 1, newObj);
        });

        // update registry
        if (caps.length > 0 && saves.length > 0) {
            await this.load(true);
        }

        Actinium.Cache.del('capability.propagating');
        Actinium.Cache.set('capability.propagated', Date.now(), 500, () =>
            this.propagate(),
        );
    }

    async grant(params = {}, options) {
        op.set(params, 'action', 'add');
        op.set(params, 'field', 'allowed');
        op.set(params, 'roleList', this.roleList);
        const cap = await updateCapabilityRoles(params, options);
        if (_.isError(cap)) throw cap;
        return cap;
    }

    async revoke(params = {}, options) {
        op.set(params, 'action', 'remove');
        op.set(params, 'field', 'allowed');
        op.set(params, 'roleList', this.roleList);
        const cap = await updateCapabilityRoles(params, options);
        if (_.isError(cap)) throw cap;
        return cap;
    }

    async restrict(params = {}, options) {
        op.set(params, 'action', 'add');
        op.set(params, 'field', 'excluded');
        op.set(params, 'roleList', this.roleList);
        const cap = await updateCapabilityRoles(params, options);
        if (_.isError(cap)) throw cap;
        return cap;
    }

    async unrestrict(params = {}, options) {
        op.set(params, 'action', 'remove');
        op.set(params, 'field', 'excluded');
        op.set(params, 'roleList', this.roleList);
        const cap = await updateCapabilityRoles(params, options);
        if (_.isError(cap)) throw cap;
        return cap;
    }
}

const instance = new Capability();

Actinium.User.can = instance.User.can;
Actinium.User.capabilities = instance.User.get;

module.exports = instance;
