const PLUGIN = require('./meta');
const op = require('object-path');

Actinium.Hook.register('collection-before-load', async () => {
    Actinium.Type.register({
        type: PLUGIN.COLLECTION,
        machineName: String(PLUGIN.COLLECTION).toLowerCase(),
        regions: {
            default: {
                id: 'default',
                label: 'Default',
                slug: 'default',
                order: -1000,
            },
            sidebar: {
                id: 'sidebar',
                label: 'Sidebar',
                slug: 'sidebar',
                order: 1000,
            },
        },
        meta: {
            icon: 'Linear.MagicWand',
            label: 'Wizard',
        },
        fields: {
            wizard: {
                fieldName: 'Wizard',
                placeholder: {
                    title: 'Title',
                    content: 'Content',
                },
                fieldId: 'wizard',
                fieldType: 'Wizard',
                region: 'default',
            },
            publisher: {
                fieldName: 'Publish',
                statuses: 'DRAFT,PUBLISHED',
                simple: true,
                fieldId: 'publisher',
                fieldType: 'Publisher',
                region: 'sidebar',
            },
        },
    });
});
