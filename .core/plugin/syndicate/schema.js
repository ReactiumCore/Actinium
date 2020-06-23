module.exports = {
    // Syndicate: {
    //     collection: 'Syndicate',
    //     actions: {
    //         addField: false,
    //         create: false,
    //         delete: false,
    //         retrieve: false,
    //         update: false,
    //     },
    //     schema: {
    //         type: {
    //             type: 'Pointer',
    //             targetClass: 'Type',
    //         },
    //     },
    // },
    SyndicateClient: {
        collection: 'SyndicateClient',
        actions: {
            addField: false,
            create: false,
            delete: false,
            retrieve: false,
            update: false,
        },
        schema: {
            user: {
                type: 'Pointer',
                targetClass: '_User',
            },
            client: {
                type: 'String',
            },
            token: {
                type: 'String',
            },
        },
    },
};
