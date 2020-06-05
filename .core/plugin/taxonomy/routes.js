module.exports = [
    {
        blueprint: 'taxonomy-blueprint',
        route: '/admin/taxonomy/:type/:slug',
        meta: {
            admin: true,
            builtIn: true,
        },
        capabilities: [],
    },
    {
        blueprint: 'taxonomy-blueprint',
        route: '/admin/taxonomy/:type',
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
