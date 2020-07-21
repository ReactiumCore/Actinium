module.exports = [
    {
        blueprint: 'taxonomy-blueprint',
        route: '/admin/taxonomy/:type/:slug',
        meta: {
            builtIn: true,
            app: 'admin',
        },
        capabilities: ['taxonomy.update'],
    },
    {
        blueprint: 'taxonomy-blueprint',
        route: '/admin/taxonomy/:type',
        meta: {
            builtIn: true,
            app: 'admin',
        },
        capabilities: ['taxonomy.update'],
    },
    {
        blueprint: 'taxonomy-blueprint',
        route: '/admin/taxonomy',
        meta: {
            builtIn: true,
            app: 'admin',
        },
        capabilities: ['taxonomy.update'],
    },
];
