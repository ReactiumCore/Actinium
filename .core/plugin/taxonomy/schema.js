module.exports = [
    {
        collection: 'Type_taxonomy',
        actions: {
            addField: true,
            create: true,
            delete: true,
            retrieve: true,
            update: true,
        },
        schema: {
            user: {
                type: 'Pointer',
                targetClass: '_User',
            },
            name: {
                type: 'String',
            },
            slug: {
                type: 'String',
            },
            description: {
                type: 'String',
            },
            taxonomies: {
                type: 'Relation',
                targetClass: 'Taxonomy',
            },
        },
    },
    {
        collection: 'Taxonomy',
        actions: {
            addField: true,
            create: true,
            delete: true,
            retrieve: true,
            update: true,
        },
        schema: {
            user: {
                type: 'Pointer',
                targetClass: '_User',
            },
            name: {
                type: 'String',
            },
            slug: {
                type: 'String',
            },
            description: {
                type: 'String',
            },
            type: {
                type: 'Pointer',
                targetClass: 'Type_taxonomy',
            },
        },
    },
];
