const _ = require('underscore');
const PLUGIN = require('./info');
const op = require('object-path');

const Taxonomy = {
    Content: {},
    Type: {},
    warning: false,
};

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

Taxonomy.Content.attach = async (params, options) => {
    options = options || { useMasterKey: true };
    let { content, field, taxonomy, type, update = true } = params;

    let contentObj = content;

    if (!op.has(content, 'toJSON')) {
        contentObj = await Actinium.Content.retrieve(content, options);

        if (!contentObj) return new Error('Content not found');

        contentObj = await new Actinium.Query(contentObj.type.collection)
            .equalTo(contentObj.objectId)
            .first(options);
    }

    if (!op.has(contentObj, 'id')) {
        return new Error('Cannot attach taxonomy to an unsaved object');
    }

    const tax = await Taxonomy.retrieve(
        { type, slug: taxonomy, outputType: 'OBJECT' },
        options,
    );

    if (!tax) return new Error(`${type} ${taxonomy} not found`);

    contentObj.relation(field).add(tax);

    return update === true ? contentObj.save(null, options) : contentObj;
};

Taxonomy.Content.detach = async (params, options) => {
    let { content, field, taxonomy, type, update = true } = params;

    let collection, contentObj;

    if (!op.has(content, 'toJSON')) {
        collection = op.get(contentObj, 'type.collection');
        contentObj = await Actinium.Content.retrieve(content, options);

        if (!contentObj) return new Error('Content not found');

        contentObj = new Actinium.Query(contentObj.type.collection)
            .equalTo(contentObj.objectId)
            .first(options);
    } else {
        contentObj = await content.fetch();
        collection = op.get(contentObj.toPointer(), 'className');
    }

    const tax = await Taxonomy.retrieve({ type, slug: taxonomy }, options);

    if (!tax) return new Error(`${type} ${taxonomy} not found`);

    contentObj.relation(field).remove(tax);

    return update === true ? contentObj.save(null, options) : contentObj;
};

Taxonomy.Content.fields = content =>
    _.compact(
        Object.entries(content).map(([field, value]) => {
            if (op.has(value, 'className')) {
                return op.get(value, 'className') === 'Taxonomy' ? field : null;
            }

            if (Array.isArray(value)) {
                return _.findWhere(value, { isTaxonomy: true }) ? field : null;
            }
        }),
    );

Taxonomy.Content.retrieve = async (params, options) => {
    let { content, type } = params;

    const contentId = op.get(content, 'objectId');
    const collection = op.get(type, 'collection');

    const fields = Taxonomy.Content.fields(content);

    if (fields.length < 1) return {};

    const taxonomies = {};
    const obj = new Actinium.Object(collection).set('objectId', contentId);

    for (field of fields) {
        const rel = obj.relation(field);
        const count = await rel.query().count({ useMasterKey: true });

        let tax =
            count > 0
                ? await rel
                      .query()
                      .skip(0)
                      .limit(count)
                      .find(options)
                : [];

        tax = tax.map(item => ({ ...item.toJSON(), field, isTaxonomy: true }));
        op.set(taxonomies, field, tax);
    }

    return taxonomies;
};

module.exports = Taxonomy;
