const PLUGIN = require('./meta');

Actinium.Plugin.register(PLUGIN, true);

/**
 * ----------------------------------------------------------------------------
 * Hooks
 * ----------------------------------------------------------------------------
 */

// content-schema-field-types hook
Actinium.Hook.register('content-schema-field-types', async fieldTypes => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;
    fieldTypes['Wizard'] = { type: 'Array' };
});

require('./content-type');
