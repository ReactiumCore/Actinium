const schemaTemplate = require('./schema-template');
const slugify = require(`${ACTINIUM_DIR}/lib/utils/slugify`);
const _ = require('underscore');
const op = require('object-path');

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

Content.saveSchema = async typeId => {
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

        const ParseSchema = new Parse.Schema(collection);
        const schemaController = Parse.CoreManager.getSchemaController();
        const allFields = Object.values(fields).map(field => {
            field.fieldSlug = slugify(field.fieldName);
            return field;
        });

        for (const { fieldType, fieldName, fieldSlug } of allFields) {
            // Parse fieldType is known to Actinium (plugins implement 'content-schema-field-types' hook)
            if (fieldType in fieldTypeSchema) {
                // content does not already populate this field
                if (!sample || !(fieldSlug in sampleObj)) {
                    schema[fieldSlug] = fieldTypeSchema[fieldType];
                }
            }
        }

        // Remove fields that have been removed from schema
        // destructive operation
        let existingSchema;
        try {
            existingSchema = await ParseSchema.get(options);
            const requiredFields = [
                'objectId',
                'createdAt',
                'updatedAt',
                'ACL',
            ].concat(Object.keys(schemaTemplate.schema));
            const permittedFields = _.indexBy(allFields, 'fieldSlug');
            // console.log({ requiredFields, permittedFields, existing: Object.keys(existingSchema.fields)});
            for (const name of Object.keys(existingSchema.fields)) {
                if (requiredFields.includes(name)) continue;
                if (!op.has(permittedFields, [name])) {
                    schema[name] = { delete: true };
                }
            }
        } catch (error) {}
        // console.log({schema});

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
