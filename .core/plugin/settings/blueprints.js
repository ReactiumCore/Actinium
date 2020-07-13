module.exports = [
    {
        sections: {
            sidebar: {
                zones: ['admin-sidebar'],
                meta: {},
            },
            main: {
                zones: ['admin-header', 'settings-groups', 'settings-actions'],
                meta: {},
            },
        },
        meta: {
            builtIn: true,
            admin: true,
            namespace: 'admin-page',
        },
        ID: 'Settings',
        description: 'Settings blueprint',
        className: 'Blueprint',
    },
];
