const PLUGIN = require('./info');

const Taxonomy = {};

Taxonomy.install = async () => {
    const { count = 0 } = await Taxonomy.Type.list({ page: 1, limit: 1 });
    if (count > 0) return;

    const options = { useMasterKey: true };

    Taxonomy.warning = true;

    const [cat, tag] = await Promise.all([
        Taxonomy.Type.create(
            {
                name: 'Category',
                slug: 'category',
                description: 'Default content taxonomy',
                outputType: 'OBJECT',
            },
            options,
        ),
        Taxonomy.Type.create(
            {
                name: 'Tag',
                slug: 'tag',
                description: 'Default content taxonomy',
                outputType: 'OBJECT',
            },
            options,
        ),
    ]);

    const [blog, featured] = await Promise.all([
        Taxonomy.create(
            { name: 'Blog', slug: 'blog', type: cat, outputType: 'OBJECT' },
            options,
        ),
        Taxonomy.create(
            {
                name: 'Featured',
                slug: 'featured',
                type: tag,
                outputType: 'OBJECT',
            },
            options,
        ),
    ]);

    cat.relation('taxonomies').add(blog);
    tag.relation('taxonomies').add(featured);

    return Promise.all([cat.save(null, options), tag.save(null, options)]);
};

Taxonomy.create = (params, options) =>
    Actinium.Utils.hookedSave(params, options, 'Taxonomy');

Taxonomy.update = (params, options) =>
    Actinium.Utils.hookedSave(params, options, 'Taxonomy');

Taxonomy.delete = async (params, options) => {
    op.set(params, 'outputType', 'OBJECT');
    const { results = {} } = await Taxonomy.list(params, options);
    return Actinium.Object.destroyAll(Object.values(results));
};

Taxonomy.retrieve = (params, options) =>
    Actinium.Utils.hookedRetrieve(
        params,
        options,
        'Taxonomy',
        'taxonomy-retrieve-query',
        'taxonomy-retrieved',
    );

Taxonomy.list = (params, options) =>
    Actinium.Utils.hookedQuery(
        params,
        options,
        'Taxonomy',
        'taxonomy-query',
        'taxonomy-list',
    );

Taxonomy.warning = false;

Taxonomy.Type = {};

Taxonomy.Type.create = (params, options) =>
    Actinium.Utils.hookedSave(params, options, 'Type_taxonomy');

Taxonomy.Type.update = (params, options) =>
    Actinium.Utils.hookedSave(params, options, 'Type_taxonomy');

Taxonomy.Type.delete = async (params, options) => {
    op.set(params, 'outputType', 'OBJECT');
    const { results = {} } = await Taxonomy.Type.list(params, options);
    return Actinium.Object.destroyAll(Object.values(results), options);
};

Taxonomy.Type.retrieve = (params, options) =>
    Actinium.Utils.hookedRetrieve(
        params,
        options,
        'Type_taxonomy',
        'taxonomy-type-retrieve-query',
        'taxonomy-type-retrieved',
    );

Taxonomy.Type.list = (params, options) =>
    Actinium.Utils.hookedQuery(
        params,
        options,
        'Type_taxonomy',
        'taxonomy-type-query',
        'taxonomy-type-list',
    );

module.exports = Taxonomy;
