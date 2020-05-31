module.exports = [
    {
        blueprint: 'taxonomy-blueprint',
        route: '/admin/taxonomy/:slug',
        meta: {
            admin: true,
            builtIn: true,
        },
        capabilities: [],
    },
    {
        blueprint: 'taxonomy-blueprint',
        route: '/admin/taxonomy',
        meta: {
            admin: true,
            builtIn: true,
        },
        capabilities: [],
    },
];
