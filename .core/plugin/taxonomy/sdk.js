const _ = require('underscore');
const op = require('object-path');

const saveTaxonomy = async (params, options) => {
    if (op.get(params, 'type')) {
        if (typeof params.type === 'string') {
            const type = await new Actinium.Query('Type_taxonomy')
                .equalTo('slug', params.type)
                .first(options);
            params.type = type;
        }
    }
    return Actinium.Utils.hookedSave(params, options, 'Taxonomy');
};

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

Taxonomy.create = saveTaxonomy;

Taxonomy.update = saveTaxonomy;

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

Taxonomy.exists = (params, options) =>
    Actinium.Utils.hookedRetrieve(
        params,
        options,
        'Taxonomy',
        'taxonomy-retrieve-query',
        'taxonomy-exists',
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

Taxonomy.Type.exists = (params, options) =>
    Actinium.Utils.hookedRetrieve(
        params,
        options,
        'Type_taxonomy',
        'taxonomy-type-retrieve-query',
        'taxonomy-type-exists',
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
    let {
        content,
        contentId,
        contentType,
        field,
        slug,
        type,
        update = true,
    } = params;

    if (!content && contentId && contentType) {
        try {
            content = await Actinium.Content.retrieve(
                { type: contentType, objectId: contentId },
                options,
            );
        } catch (err) {
            return new Error('Content not found');
        }
    }

    let contentObj = content;

    if (!content.id) {
        contentObj = await Actinium.Content.retrieve(content, options);

        if (!contentObj) return new Error('Content not found');

        contentObj = await new Actinium.Query(contentObj.type.collection)
            .equalTo('objectId', contentObj.objectId)
            .first(options);
    }

    if (!op.has(contentObj, 'id')) {
        return new Error('Cannot attach taxonomy of an unsaved object');
    }

    const tax = await Taxonomy.retrieve(
        { type, slug, outputType: 'OBJECT' },
        options,
    );

    if (!tax) return new Error(`${type} ${field} ${slug} not found`);

    contentObj.relation(field).add(tax);

    return update === true ? contentObj.save(null, options) : contentObj;
};

Taxonomy.Content.detach = async (params, options) => {
    options = options || { useMasterKey: true };
    let {
        content,
        contentId,
        contentType,
        field,
        slug,
        type,
        update = true,
    } = params;

    if (!content && contentId && contentType) {
        try {
            content = await Actinium.Content.retrieve(
                { type: contentType, objectId: contentId },
                options,
            );
        } catch (err) {
            return new Error('Content not found');
        }
    }

    let contentObj = content;

    if (!content.id) {
        contentObj = await Actinium.Content.retrieve(content, options);

        if (!contentObj) return new Error('Content not found');

        contentObj = await new Actinium.Query(contentObj.type.collection)
            .equalTo('objectId', contentObj.objectId)
            .first(options);
    }

    if (!op.has(contentObj, 'id')) {
        return new Error('Cannot detach taxonomy of an unsaved object');
    }

    const tax = await Taxonomy.retrieve(
        { type, slug, outputType: 'OBJECT' },
        options,
    );

    if (!tax) return new Error(`${type} ${field} ${slug} not found`);

    contentObj.relation(field).remove(tax);

    return update === true ? contentObj.save(null, options) : contentObj;
};

Taxonomy.Content.fields = content => {
    content = op.get(content, 'id') ? content.toJSON() : content;

    return _.chain(Object.values(content.type.fields))
        .where({ fieldType: 'Taxonomy' })
        .pluck('fieldName')
        .value()
        .map(Actinium.Utils.slugify);
};

Taxonomy.Content.retrieve = async (params, options) => {
    options = options || { useMasterKey: true };

    let { collection, content, contentId, type } = params;

    if (content && !contentId) {
        contentId = op.get(content, 'objectId', op.get(content, 'id'));
    }

    if (type && !collection) {
        collection = op.get(type, 'collection');
    }

    if (!content && contentId && type) {
        try {
            content = await Actinium.Content.retrieve(
                { type, objectId: contentId },
                options,
            );
        } catch (err) {
            return {};
        }
    }

    if (!content) {
        return {};
    }

    let fields;
    try {
        fields = Taxonomy.Content.fields(content, options) || [];
    } catch (err) {
        fields = [];
    }

    if (fields.length < 1) {
        return {};
    }

    const taxonomies = {};
    const obj = new Actinium.Object(collection).set('objectId', contentId);

    for (const field of fields) {
        const rel = obj.relation(field);
        const count = await rel.query().count({ useMasterKey: true });

        let tax =
            count > 0
                ? await rel
                      .query()
                      .skip(0)
                      .limit(count)
                      .include('type')
                      .find(options)
                : [];

        tax = tax.map(item => ({
            ...item.toJSON(),
            field,
            isTaxonomy: true,
            type: item.get('type').toJSON(),
        }));
        op.set(taxonomies, field, tax);
    }

    return taxonomies;
};

module.exports = Taxonomy;
