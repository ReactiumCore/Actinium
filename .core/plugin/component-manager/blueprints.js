module.exports = [
    {
        ID: 'components',
        description: 'Components Blueprint',
        className: 'blueprint-components',
        sections: {
            sidebar: {
                zones: ['admin-sidebar'],
                meta: {},
            },
            main: {
                zones: ['admin-header', 'admin-components', 'admin-actions'],
                meta: {},
            },
        },
        meta: {
            admin: true,
            builtIn: false,
            namespace: 'admin-page',
        },
    },
];
