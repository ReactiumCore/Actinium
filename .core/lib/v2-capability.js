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
    return rel
        .query()
        .limit(limit)
        .ascending('name')
        .find({ useMasterKey });
};

const getRoles = async () => {
    const { results } = await hookedQuery(
        { limit: 100, outputType: 'JSON' },
        { useMasterKey: true },
        Parse.Role,
        'capability-role-query',
        'capability-roles',
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

const Role = registry => ({
    list: [],
    add: (capability, role, exclude = false) => {},
});

class Capability {
    constructor() {
        this.Registry = new Registry('capability', 'group');
        this.Role = Role(this);
    }

    get list() {
        return this.Registry.list;
    }

    get(capability) {
        const capabilities = _.chain([capability])
            .flatten()
            .compact()
            .uniq()
            .value();

        const results =
            capabilities.length > 0
                ? _.compact(
                      capabilities.map(group =>
                          _.findWhere(this.list, { group }),
                      ),
                  )
                : this.list;

        return _.isArray(capability)
            ? _.indexBy(results, 'group')
            : _.first(results);
    }

    async getAsync(capability) {
        await this.load(true);
        return this.get(capability);
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

    get roles() {
        return op.get(this, 'Role.list');
    }

    set roles(newRoles = []) {
        op.set(this, 'Role.list', newRoles);
        return this.Role.list;
    }

    async fetch() {
        // 1.0 - Get roles
        this.roles = op.get(this, 'roles') || (await getRoles());

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
                    limit: Object.keys(this.roles).length,
                }),
                getRelation(cap, 'excluded', {
                    limit: Object.keys(this.roles).length,
                }),
            ]);

            // prettier-ignore
            output.push(normalizeCapability({
                group,
                objectId: cap.id,
                allowed: allowed.map(item => item.get('name')),
                excluded: excluded.map(item => item.get('name')),
            }));
        }

        return output;
    }

    async load(refresh = false) {
        if (refresh !== true && this.list.length > 0) {
            return _.sortBy(this.list, 'group');
        }
        const capabilities = await this.fetch();
        capabilities.forEach(cap => this.register(cap.group, cap));
    }

    async propagate() {
        const caps = this.Registry.list.filter(item => {
            if (!op.get(item, 'objectId')) return true;
            return op.get(item, 'pending');
        });

        let roleEntries = {};
        if (caps.length > 0) {
            this.roles = await getRoles();
            roleEntries = Object.values(this.roles).reduce((entries, role) => {
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

            saves.push(obj.save(null, { useMasterKey: true }));
        }

        saves = await Promise.all(saves);

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
        if (caps.length > 0) {
            await this.load(true);
        }

        Actinium.Cache.set('capability-propagated', Date.now(), 250, () =>
            this.propagate(),
        );
    }
}

module.exports = new Capability();
