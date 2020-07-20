module.exports = [
    {
        route: '/admin/settings',
        blueprint: 'Settings',
        meta: {
            builtIn: true,
            app: 'admin',
        },
        capabilities: ['settings-ui.view'],
    },
];
