const UNINSTALLED_NAMESPACE = '9f85eb4d-777b-4213-b039-fced11c2dbae';
const ID_NAMESPACE = ENV.CONTENT_NAMESPACE || UNINSTALLED_NAMESPACE;
const PLUGIN = {
    ID: 'Type',
    name: 'Content Types',
    description: 'Manage your content types',
    meta: {
        builtIn: true,
        group: 'core',
        namespace: ID_NAMESPACE,
    },
};

const STATUS = {
    TRASH: 'TRASH',
    DRAFT: 'DRAFT',
    PUBLISHED: 'PUBLISHED',
};

const DEFAULT_TYPE_REGISTRY = Symbol('DEFAULT_TYPE_REGISTRY');

module.exports = {
    UNINSTALLED_NAMESPACE,
    DEFAULT_TYPE_REGISTRY,
    STATUS,
    PLUGIN,
};
