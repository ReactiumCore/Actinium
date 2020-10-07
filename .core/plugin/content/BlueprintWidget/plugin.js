const PLUGIN = {
    ID: 'BlueprintWidget',
    name: 'Blueprint Widget',
    meta: {
        group: 'Editing',
    },
};

Actinium.Plugin.register(PLUGIN, true);

Actinium.Hook.register('content-schema-field-types', fieldTypes => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
    fieldTypes['Blueprint'] = { type: 'String' };
});
