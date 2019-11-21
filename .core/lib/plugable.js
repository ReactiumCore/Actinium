const path = require('path');
const chalk = require('chalk');
const _ = require('underscore');
const semver = require('semver');
const op = require('object-path');
const globby = require('globby').sync;
const appdir = path.normalize(`${APP_DIR}`);
const coredir = path.normalize(`${BASE_DIR}/.core`);
const npmdir = path.normalize(`${BASE_DIR}/node_modules`);
const config = require(`${BASE_DIR}/.core/actinium-config`);

const exp = {};
const blacklist = [];
const COLLECTION = 'Plugin';

const loader = p => {
    const plugin = require(path.normalize(p));
    const { ID, version } = plugin;

    // Validate plugin ID
    if (!ID || blacklist.includes(ID)) {
        return;
    }

    // Validate Actinium version
    const appVer = op.get(config, 'version');
    const ver = op.get(version, 'actinium', appVer);
    if (!semver.satisfies(appVer, ver)) {
        return;
    }

    exp[ID] = plugin;

    return plugin;
};

const Plugable = {};

Plugable.schema = async () => {
    const schema = new Parse.Schema(COLLECTION);
    let isSchema;

    try {
        isSchema = await schema.get({ useMasterKey: true });
    } catch (err) {
        schema.addArray('bundle');
        schema.addBoolean('active');
        schema.addNumber('order');
        schema.addObject('meta');
        schema.addString('description');
        schema.addString('ID');
        schema.addString('name');
        schema.addString('version');

        return schema.save(null, { useMasterKey: true });
    }

    return Promise.resolve(isSchema);
};

Plugable.capabilities = [
    {
        capability: 'Plugin.create',
        roles: {},
    },
    {
        capability: 'Plugin.retrieve',
        roles: {
            allowed: ['anonymous'],
        },
    },
    {
        capability: 'Plugin.update',
        roles: {},
    },
    {
        capability: 'Plugin.delete',
        roles: {},
    },
    {
        capability: 'Plugin.addField',
        roles: {},
    },
];

Plugable.exports = key => op.get(exp, key);

Plugable.register = (plugin, active = false) => {
    const ID = op.get(plugin, 'ID');
    plugin['active'] = active;

    if (ID) {
        Actinium.Cache.set(`plugins.${ID}`, plugin);
    }
};

Plugable.init = () => {
    Plugable.capabilities.forEach(({ capability, roles }) =>
        Actinium.Capability.register(
            capability,
            roles,
            Actinium.Enums.priority.highest,
        ),
    );

    Actinium.Collection.register('Plugin', {
        create: false,
        retrieve: false,
        update: false,
        delete: false,
        addField: false,
    });

    return globby(ENV.GLOB_PLUGINS).map(item => loader(item));
};

Plugable.load = async () => {
    await Plugable.schema();

    const pluginCache = _.sortBy(
        Object.values(Actinium.Cache.get('plugins', {})),
        'order',
    );

    LOG('');
    LOG(chalk.cyan('Loaded plugins...'));

    const objects = [];
    for (let i = 0; i < pluginCache.length; i++) {
        const plugin = pluginCache[i];

        const { ID, version } = plugin;
        LOG(chalk.cyan('  Plugin'), chalk.cyan('→'), chalk.magenta(ID));

        let obj = await new Parse.Query(COLLECTION)
            .equalTo('ID', ID)
            .first({ useMasterKey: true });

        if (!obj) {
            const objData = {
                active: false,
                ...plugin,
                version: op.get(version, 'plugin', '0.0.1'),
            };

            obj = new Parse.Object(COLLECTION);
            Object.keys(objData).forEach(key => obj.set(key, objData[key]));
        } else {
            obj.set('version', op.get(version, 'plugin'));
        }

        objects.push(obj);
    }

    let plugins = await Parse.Object.saveAll(objects, { useMasterKey: true });

    plugins = plugins
        .map(plugin => plugin.toJSON())
        .reduce((plugs, item) => {
            plugs[item.ID] = item;
            return plugs;
        }, {});

    Actinium.Cache.set('plugins', plugins);

    return Promise.resolve(plugins);
};

Plugable.get = ID =>
    ID
        ? Actinium.Cache.get(`plugins.${ID}`)
        : Actinium.Cache.get('plugins', {});

Plugable.isActive = ID => Actinium.Cache.get(`plugins.${ID}.active`, false);

Plugable.isValid = (ID, strict = false) => {
    if (blacklist.includes(ID)) {
        return false;
    }

    const plugin = Plugable.get(ID);

    // Validate if the plugin exists
    if (!plugin) {
        return false;
    }

    // Validate Actinium version
    const versionRange = op.get(plugin, 'version.actinium');
    if (versionRange) {
        const actiniumVer = op.get(config, 'version', '>=3.0.5');
        if (!semver.satisfies(actiniumVer, versionRange)) {
            return false;
        }
    }

    // Validate if the plugin is active
    if (strict === true && Plugable.isActive(ID) !== true) {
        return false;
    }

    return true;
};

Plugable.gate = async ({ req, ID, name, callback }) => {
    if (Plugable.isValid(ID, true) !== true) {
        return Promise.reject(`Plugin: ${ID} is not active.`);
    }

    return callback(req);
};

Plugable.deactivate = ID =>
    Parse.Cloud.run(
        'plugin-deactivate',
        { plugin: ID },
        { useMasterKey: true },
    );

Plugable.activate = ID =>
    Parse.Cloud.run('plugin-activate', { plugin: ID }, { useMasterKey: true });

module.exports = Plugable;
