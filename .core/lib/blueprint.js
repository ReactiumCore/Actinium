const Hook = require('./hook');

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
            main: {
                zones: ['login'],
                meta: {},
            },
        },
        meta: {
            builtIn: true,
            admin: true,
        },
        ID: 'Login',
        description: 'Login blueprint',
        className: 'Blueprint',
    },
    {
        sections: {
            main: {
                zones: ['logout'],
                meta: {},
            },
        },
        meta: {
            builtIn: true,
            admin: true,
        },
        ID: 'Logout',
        description: 'Logout blueprint',
        className: 'Blueprint',
    },
    {
        sections: {
            main: {
                zones: ['forgot'],
                meta: {},
            },
        },
        meta: {
            builtIn: true,
            admin: true,
        },
        ID: 'Forgot',
        description: 'Forgot password blueprint',
        className: 'Blueprint',
    },
    {
        sections: {
            main: {
                zones: ['reset'],
                meta: {},
            },
        },
        meta: {
            builtIn: true,
            admin: true,
        },
        ID: 'ResetPassword',
        description: 'Reset password blueprint',
        className: 'Blueprint',
    },
    {
        sections: {
            sidebar: {
                zones: ['admin-sidebar'],
                meta: {},
            },
            main: {
                zones: ['admin-header', 'admin-content', 'admin-actions'],
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

const Blueprint = {
    blueprints: {},
};

Blueprint.init = async () => {
    const defaultBlueprints = DEFAULTS;
    await Actinium.Hook.run('blueprint-defaults', DEFAULTS);

    Blueprint.blueprints = defaultBlueprints.reduce((blueprints, blueprint) => {
        const { ID } = blueprint;
        if (ID) {
            blueprints[ID] = blueprint;
        }

        return blueprints;
    }, {});
};

Blueprint.list = async () => {
    const list = Object.values(Blueprint.blueprints);
    await Actinium.Hook.run('blueprint-list', list);
    return list;
};

module.exports = Blueprint;
