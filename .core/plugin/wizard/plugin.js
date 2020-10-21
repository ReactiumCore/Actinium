const PLUGIN = require('./info');

Actinium.Plugin.register(PLUGIN, true);

// content-schema-field-types hook
Actinium.Hook.register('content-schema-field-types', async fieldTypes => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
    fieldTypes['Wizard'] = { type: 'Array' };
});
