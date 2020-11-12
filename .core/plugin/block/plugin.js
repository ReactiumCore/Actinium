const PLUGIN = require('./meta');
const { ensureContentType } = require('./content-type');

Actinium.Plugin.register(PLUGIN, true);

/**
 * ----------------------------------------------------------------------------
 * Hooks
 * ----------------------------------------------------------------------------
 */
Actinium.Hook.register('activate', ensureContentType);
Actinium.Hook.register('install', ensureContentType);
Actinium.Hook.register('update', ensureContentType);
