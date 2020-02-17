const chalk = require('chalk');
const _ = require('underscore');
const op = require('object-path');
const flatten = require('tree-flatten');

const PLUGIN = {
    ID: 'Search',
    description: 'Default search indexing plugin.',
    meta: {
        group: 'search',
        builtIn: true,
    },
};

Actinium.Plugin.register(PLUGIN, true);

const indexContent = async () => {
    const options = Actinium.Utils.MasterOptions();
    const { types } = await Actinium.Type.list({}, options);
    LOG(' ');
    LOG(chalk.cyan.bold('Indexing Content:'));
    for (const type of types) {
        LOG(' -', type.collection);
        await Actinium.Search.index({ type }, options);
    }
};

const CRON_SETTING = 'index-frequency';
Actinium.Hook.register('start', async () => {
    Actinium.Search = require('./sdk');
    indexContent();

    // By default, index at midnight everyday
    Actinium.Pulse.define(
        'content-search-indexing',
        {
            schedule: Actinium.Setting.get(CRON_SETTING, '0 0 * * *'),
        },
        indexContent,
    );
});

Actinium.Hook.register('setting-set', async (key, value) => {
    if (key === CRON_SETTING) {
        Actinium.Pulse.replace(
            'content-search-indexing',
            {
                schedule: Actinium.Setting.get(CRON_SETTING, '0 0 * * *'),
            },
            indexContent,
        );
    }
});

Actinium.Hook.register(
    'search-index-item-normalize',
    async (item, params, type, permittedFields, indexConfig) => {
        for (const [fieldName, fieldValue] of Object.entries(item)) {
            if (op.has(permittedFields, fieldName)) {
                const { fieldType } = op.get(permittedFields, fieldName);
                switch (fieldType) {
                    case 'RichText': {
                        const children = op.get(fieldValue, 'children', []);
                        const plaintext = _.chain(
                            flatten({ children }, 'children'),
                        )
                            .pluck('text')
                            .compact()
                            .value()
                            .join(' ');

                        item[fieldName] = plaintext;
                        break;
                    }
                }
            }
        }
    },
);

/**
 * @api {Asynchronous} search-index search-index
 * @apiDescription Trigger index of a content type. User must have `Search.index` capability.
 * @apiName search-index
 * @apiParam {Object} type Params required to lookup content type with `type-retrieve`
 * @apiGroup Cloud
 */
Actinium.Cloud.define(PLUGIN.ID, 'search-index', async req => {
    if (!Actinium.Utils.CloudHasCapabilities(req, ['Search.index']))
        throw 'Unauthorized';

    return Actinium.Search.index(req.params);
});

/**
 * @api {Asynchronous} search search
 * @apiDescription Search content.
 * @apiParam {String} index The index to search
 * @apiParam {String} search The search terms
 * @apiParam {Number} [page=1] Page number of results
 * @apiParam {Number} [limit=1000] Limit page results
 * @apiName search
 * @apiGroup Cloud
 */
Actinium.Cloud.define(PLUGIN.ID, 'search', async req => {
    return Actinium.Search.search(req);
});
