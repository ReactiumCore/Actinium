const schemaTemplate = require('./schema-template');
const slugify = name => require('slugify')(name).toLowerCase();
const _ = require('underscore');

const fieldTypeSchema = {
    Text: {
        type: 'String',
    },
    RichText: {
        type: 'Object',
    },
    List: {
        type: 'Array',
    },
    Number: {
        type: 'Number',
    },
};

const Content = {};

Content.initFieldSchemaTypes = async () => {
    await Actinium.Hook.run('content-schema-field-types', fieldTypeSchema);
};

Content.loadSchema = async typeId => {
    const options = { useMasterKey: true };
    await Content.initFieldSchemaTypes();

    const schema = {
        ...schemaTemplate.schema,
    };

    const type = new Parse.Object('Type');
    type.id = typeId;
    await type.fetch(options);

    if (type) {
        const typeObj = type.toJSON();
        const { collection, machineName, fields } = typeObj;
        const sample = await new Parse.Query(collection).first(options);
        let sampleObj = {};
        if (sample) sampleObj = sample.toJSON();

        for (const { fieldType, fieldName } of Object.values(fields)) {
            const fieldSlug = slugify(fieldName);
            // fieldType is known to Actinium
            if (fieldType in fieldTypeSchema) {
                // content does not already populate this field
                if (!sample || !(fieldSlug in sampleObj)) {
                    schema[fieldSlug] = fieldTypeSchema[fieldType];
                }
            }
        }

        // TODO: delete unspecified fields from existing schema if no content in collection

        await Actinium.Hook.run(
            'content-schema-permissions',
            schemaTemplate.permissions,
            machineName,
        );
        await Actinium.Hook.run(
            'content-schema-indexes',
            schemaTemplate.indexes,
            machineName,
        );

        Actinium.Collection.register(
            collection,
            schemaTemplate.permissions,
            schema,
            schemaTemplate.indexes,
        );
    }
};

module.exports = Content;
