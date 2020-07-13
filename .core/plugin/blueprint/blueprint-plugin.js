const {
    CloudRunOptions,
    CloudHasCapabilities,
} = require(`${ACTINIUM_DIR}/lib/utils`);
const ParseNode = require('parse/node');
const op = require('object-path');
const _ = require('underscore');

const PLUGIN = {
    ID: 'Blueprint',
    description: 'Blueprint plugin.',
    name: 'Blueprint Plugin',
    order: 0,
    version: {
        actinium: '>=3.0.5',
        plugin: '0.0.1',
    },
    meta: {
        group: 'core',
        builtIn: true,
    },
};

const SDK = require('./sdk');
Actinium.Blueprint = SDK;

Actinium.Plugin.register(PLUGIN, true);

Actinium.Capability.register(
    'blueprint.retrieve',
    {
        allowed: ['anonymous'],
        excluded: ['banned'],
    },
    1000,
);

// Add admin-tools zone when blueprint.meta.admin === true blueprints
Actinium.Hook.register('blueprints', async () => {
    const protected = Actinium.Blueprint.protected;
    for (const bp of Actinium.Blueprint.list) {
        if (
            op.get(bp, 'meta.admin', false) === true &&
            !op.has(bp, 'sections.tools')
        ) {
            op.set(bp, 'sections.tools', {
                zones: ['admin-tools'],
            });

            if (protected.includes(bp.ID)) Actinium.Blueprint.unprotect(bp.ID);
            Actinium.Blueprint.register(bp.ID, bp);
        }
    }
});

/**
* @api {Cloud} blueprints blueprints
* @apiVersion 3.1.2
* @apiGroup Cloud
* @apiName blueprints
* @apiDescription Get all blueprints.
* @apiExample All Example:
// get all blueprints
Actinium.Cloud.run('blueprints');
*/
Actinium.Cloud.define(PLUGIN.ID, 'blueprints', async req => {
    if (CloudHasCapabilities(req, ['blueprint.retrieve'])) {
        await Actinium.Hook.run('blueprints', Actinium.Blueprint);
        return Actinium.Blueprint.list;
    }

    throw 'Not permitted.';
});
