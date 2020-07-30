module.exports = {
    collection: 'Capability',
    actions: {
        create: false,
        retrieve: true,
        update: false,
        delete: false,
        addField: false,
    },
    schema: {
        group: {
            type: 'String',
        },
        allowed: {
            type: 'Relation',
            targetClass: '_Role',
        },
        excluded: {
            type: 'Relation',
            targetClass: '_Role',
        },
    },
    indexes: ['group'],
};
