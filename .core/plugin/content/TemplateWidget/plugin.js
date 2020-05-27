const PLUGIN = {
    ID: 'TemplateWidget',
    name: 'Template Widget',
};

Actinium.Plugin.register(PLUGIN, true);

Actinium.Hook.register('content-schema-field-types', fieldTypes => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
    fieldTypes['Templates'] = { type: 'String' };
});
