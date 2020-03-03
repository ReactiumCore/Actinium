const lunr = require('lunr');
const _ = require('underscore');
const op = require('object-path');

const PLUGIN = {
    ID: 'LunrSearch',
    description: 'Simple Lunr Search Plugin.',
    meta: {
        group: 'search',
        builtIn: true,
    },
};

Actinium.Plugin.register(PLUGIN, true);

const indexes = {};
Actinium.Hook.register(
    'search-index',
    async (items, params, type, permittedFields) => {
        if (Actinium.Plugin.isActive(PLUGIN.ID)) {
            const { collection } = type;
            const builder = new lunr.Builder();
            builder.ref('slug');
            Object.keys(permittedFields).forEach(field => builder.field(field));

            for (const item of items) {
                builder.add(item);
            }

            indexes[collection] = builder.build();
        }
    },
);

Actinium.Hook.register('search', async (req, context) => {
    if (Actinium.Plugin.isActive(PLUGIN.ID)) {
        const options = Actinium.Utils.CloudRunOptions(req);

        const index = op.get(req, 'params.index', '');
        const search = op.get(req, 'params.search', '');

        if (!(index in indexes)) throw 'No such index';
        const page = Math.max(op.get(req, 'params.page', 1), 1);
        const limit = Math.max(
            Math.min(op.get(req, 'params.limit', 1000), 1000),
            1,
        );

        const searchResult = indexes[index].search(search);
        const resultPages = _.chunk(searchResult, limit);
        const resultPage = op.get(resultPages, page - 1, []);
        const count = searchResult.length;

        const bySlug = _.indexBy(resultPage, 'ref');
        const qry = new Parse.Query(index);
        qry.containedIn('slug', Object.keys(bySlug));

        const pages = Math.ceil(count / limit);
        const next = page + 1 <= pages ? page + 1 : null;
        const prev = page - 1 > 0 && page <= pages ? page - 1 : null;
        const results = _.sortBy(await qry.find(options))
            .map(
                item => ({
                    ...Actinium.Utils.serialize(item),
                    score: bySlug[item.get('slug')].score,
                }),
                'score',
            )
            .reverse();

        context.results = {
            count,
            next,
            page,
            pages,
            prev,
            results,
        };
    }
});
