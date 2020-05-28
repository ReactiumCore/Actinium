const PLUGIN = {
    ID: 'URLWidget',
    name: 'URL Widget',
};

Actinium.Plugin.register(PLUGIN, true);

Actinium.Hook.register('content-schema-field-types', fieldTypes => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
    fieldTypes['URLS'] = { type: 'Relation', targetClass: 'Route' };
});
