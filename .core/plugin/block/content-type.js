const PLUGIN = require('./meta');
const op = require('object-path');

/**
 * ----------------------------------------------------------------------------
 * Content Type generator
 * ----------------------------------------------------------------------------
 */
const ensureContentType = async ({ ID }) => {
    if (ID !== PLUGIN.ID) return;

    INFO(`Ensuring ${PLUGIN.COLLECTION} content type.`);

    const options = Actinium.Utils.MasterOptions();

    const ContentTypeTemplate = {
        type: String(PLUGIN.COLLECTION).toLowerCase(),
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
            icon: 'Linear.Cube',
            label: 'Block',
        },
        fields: {
            'cc5a47e7-58c0-4a69-98d6-3c272f4b0bf2': {
                fieldName: 'Content',
                label: 'Block Content',
                placeholder: null,
                helpText: null,
                fieldId: 'cc5a47e7-58c0-4a69-98d6-3c272f4b0bf2',
                fieldType: 'RichText',
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
    };

    let ContentType;
    try {
        ContentType = await Actinium.Type.retrieve(
            { machineName: PLUGIN.COLLECTION },
            options,
        );
    } catch (error) {}

    if (!ContentType) {
        ContentType = await Actinium.Type.create(ContentTypeTemplate, options);
    } else {
        const updatedContentType = {
            ...ContentType,
        };

        // ensure ContentType base fields exist
        op.set(updatedContentType, 'fields', {
            ...ContentType.fields,
            ...ContentTypeTemplate.fields,
        });

        ContentType = await Actinium.Type.update(updatedContentType, options);
    }
};

module.exports = { ensureContentType };
