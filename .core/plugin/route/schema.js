module.exports = [
    {
        collection: 'Route',
        actions: {
            addField: false,
            create: false,
            delete: false,
            retrieve: true,
            update: false,
        },
        schema: {
            route: {
                type: 'String',
            },
            blueprint: {
                type: 'String',
            },
            meta: {
                type: 'Object',
            },
            order: {
                type: 'Number',
            },
        },
        indexes: ['route'],
    },
];
