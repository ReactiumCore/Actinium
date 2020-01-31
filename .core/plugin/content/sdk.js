const schemaTemplate = require('./schema-template');
const slugify = require(`${ACTINIUM_DIR}/lib/utils/slugify`);
const _ = require('underscore');
const op = require('object-path');

const Content = {};

Content.initFieldSchemaTypes = async () => {
    await Actinium.Hook.run(
        'content-schema-field-types',
        schemaTemplate.fieldTypes,
    );
};

Content.saveSchema = async contentTypeObj => {
    const {
        collection,
        permissions,
        schema,
        indexes,
    } = await Content.getSchema(contentTypeObj);

    Actinium.Collection.register(collection, permissions, schema, indexes);
};

Content.getSchema = async contentTypeObj => {
    const typeId = op.get(
        contentTypeObj,
        'objectId',
        op.get(contentTypeObj, 'id'),
    );

    if (!typeId) throw new Error('Invalid content type.');

    const options = { useMasterKey: true };
    await Content.initFieldSchemaTypes();

    const schema = {
        ...schemaTemplate.schema,
    };

    let type = new Parse.Object('Type');
    type.id = typeId;
    type = await type.fetch(options);

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

        const permittedFields = _.indexBy(allFields, 'fieldSlug');
        for (const { fieldType, fieldName, fieldSlug } of allFields) {
            // Parse fieldType is known to Actinium (plugins implement 'content-schema-field-types' hook)
            if (fieldType in schemaTemplate.fieldTypes) {
                // content does not already populate this field
                if (!sample || !(fieldSlug in sampleObj)) {
                    schema[fieldSlug] = schemaTemplate.fieldTypes[fieldType];
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
            // console.log({ requiredFields, permittedFields, existing: Object.keys(existingSchema.fields)});
            for (const name of Object.keys(existingSchema.fields)) {
                if (requiredFields.includes(name)) continue;
                if (!op.has(permittedFields, [name])) {
                    schema[name] = { delete: true };
                }
            }
        } catch (error) {}

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

        return {
            collection,
            permissions: schemaTemplate.permissions,
            schema,
            existingSchema,
            indexes: schemaTemplate.indexes,
            permittedFields,
        };
    }
};

Content.sanitize = async content => {
    const { type } = content;
    const { existingSchema, permittedFields } = await Content.getSchema(type);
    const fieldConfigs = permittedFields;

    const fieldData = Object.entries(content)
        .map(([fieldName, fieldValue]) => ({
            fieldSlug: slugify(fieldName),
            fieldValue,
        }))

        // only custom fields in schema
        .filter(({ fieldSlug }) => {
            return (
                fieldSlug in permittedFields &&
                fieldSlug in op.get(existingSchema, 'fields', {})
            );
        });

    for (const fieldIndex in fieldData) {
        const field = fieldData[fieldIndex];
        const config = fieldConfigs[field.fieldSlug];
        await Actinium.Hook.run(
            'content-field-sanitize',
            field,
            config,
            fieldIndex,
            fieldData,
        );
    }

    return fieldData;
};

module.exports = Content;
