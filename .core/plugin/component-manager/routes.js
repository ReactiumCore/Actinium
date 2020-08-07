module.exports = [
    {
        blueprint: 'components',
        route: '/admin/components',
        meta: {
            admin: true,
            builtIn: false,
        },
        capabilities: ['components.write', 'components.delete'],
    },
];
