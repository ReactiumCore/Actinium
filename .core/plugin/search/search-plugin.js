const lunr = require('lunr');
const _ = require('underscore');

const PLUGIN = {
    ID: 'Search',
    description: 'Default search indexing plugin.',
    meta: {
        group: 'search',
        builtIn: true,
    },
};

Actinium.Plugin.register(PLUGIN, true);

Actinium.Hook.register('start', async () => {
    Actinium.Search = require('./sdk');
});

const indexes = {};
Actinium.Hook.register('search-index', async (type, permittedFields) => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        const { collection } = type;

        const qry = new Parse.Query(collection);
        const options = Actinium.Utils.MasterOptions();
        const builder = new lunr.Builder();
        builder.ref('slug');
        Object.keys(permittedFields).forEach(field => builder.field(field));

        let results = await qry.find(options);
        let itemCount = 0;
        while (results.length > 0) {
            itemCount += results.length;
            results.forEach(item => {
                builder.add(Actinium.Utils.serialize(item));
            });
            qry.skip(itemCount);
            results = await qry.find(options);
        }

        indexes[collection] = builder.build();
    }
});

Actinium.Hook.register('search', async (index, search, req, context) => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        if (!(index in indexes)) throw 'No such index';
        const bySlug = _.indexBy(indexes[index].search(search), 'ref');
        const query = new Parse.Query(index);
        query.containedIn('slug', Object.keys(bySlug));
        const results = await query.find(Actinium.Utils.CloudRunOptions(req));
        context.results = results.map(item => ({
            ...Actinium.Utils.serialize(item),
            search: bySlug[item.get('slug')],
        }));
    }
});

Actinium.Cloud.define(PLUGIN.ID, 'search-index', async req => {
    if (!Actinium.Utils.CloudHasCapabilities(req, ['Search.index']))
        throw 'Unauthorized';

    return Actinium.Search.index(req.params);
});

Actinium.Cloud.define(PLUGIN.ID, 'search', async req => {
    return Actinium.Search.search(req);
});
