const DEFAULTS = [
    {
        sections: {
            main: {
                zones: ['content'],
                meta: {},
            },
        },
        meta: {
            builtIn: true,
            admin: true,
        },
        ID: 'Simple',
        description: 'Blueprint with one simple content section',
        className: 'Blueprint',
    },
    {
        sections: {
            sidebar: {
                zones: ['admin-sidebar'],
                meta: {},
            },
            main: {
                zones: ['admin-header', 'admin-dashboard', 'admin-actions'],
                meta: {},
            },
        },
        meta: {
            builtIn: true,
            admin: true,
            namespace: 'admin-page',
        },
        ID: 'Admin',
        description: 'Admin blueprint',
        className: 'Blueprint',
    },
    {
        sections: {
            sidebar: {
                zones: ['admin-sidebar'],
                meta: {},
            },
            main: {
                zones: ['admin-header', 'admin-profile', 'admin-actions'],
                meta: {},
            },
        },
        meta: {
            builtIn: true,
            admin: true,
            namespace: 'admin-page',
        },
        ID: 'Profile',
        description: 'Profile blueprint',
        className: 'Blueprint',
    },
];

const Blueprint = new Actinium.Utils.Registry(
    'BLUEPRINTS',
    'ID',
    Actinium.Utils.Registry.MODES.CLEAN,
);
DEFAULTS.forEach(bp => Blueprint.register(bp.ID, bp));

module.exports = Blueprint;
