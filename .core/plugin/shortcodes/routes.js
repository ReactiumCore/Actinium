module.exports = [
    {
        blueprint: 'shortcodes',
        route: '/admin/shortcodes',
        meta: {
            builtIn: false,
            app: 'admin',
        },
        capabilities: ['shortcodes.create'],
    },
];
