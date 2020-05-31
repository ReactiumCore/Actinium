module.exports = [
    {
        ID: 'taxonomy-blueprint',
        description: 'Taxonomy Blueprint',
        className: 'blueprint-taxonomy',
        sections: {
            sidebar: {
                zones: ['admin-sidebar'],
                meta: {},
            },
            main: {
                zones: [
                    'admin-header',
                    'admin-taxonomy-blueprint-content',
                    'admin-actions',
                ],
                meta: {},
            },
        },
        meta: {
            admin: true,
            builtIn: true,
            namespace: 'admin-page',
        },
    },
];
