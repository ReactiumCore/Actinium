module.exports = [
    {
        ID: 'shortcodes',
        description: 'Shortcodes Blueprint',
        className: 'blueprint-shortcodes',
        sections: {
            sidebar: {
                zones: ['admin-sidebar'],
                meta: {},
            },
            main: {
                zones: ['admin-header', 'admin-shortcodes', 'admin-actions'],
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
