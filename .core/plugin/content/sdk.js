const schemaTemplate = require('./schema-template');
const slugify = require(`${ACTINIUM_DIR}/lib/utils/slugify`);
const _ = require('underscore');
const op = require('object-path');
const serialize = require(`${ACTINIUM_DIR}/lib/utils/serialize`);
const equal = require('fast-deep-equal');

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

    if (op.has(content, 'meta') && typeof content.meta === 'object') {
        fieldData.push({
            fieldSlug: 'meta',
            fieldValue: content.meta,
        });
    }

    return fieldData;
};

Content.diff = async (contentObj, changes) => {
    const sanitized = await Actinium.Content.sanitize({
        ...changes,
        type: contentObj.type,
    });
    const diff = {};
    for (const { fieldSlug, fieldValue } of sanitized) {
        if (!equal(op.get(contentObj, fieldSlug), fieldValue)) {
            op.set(diff, fieldSlug, fieldValue);
        }
    }

    // No changes
    if (Object.keys(diff).length < 1) return false;

    op.set(diff, 'objectId', contentObj.objectId);
    op.set(diff, 'history', contentObj.history);
    op.set(diff, 'branches', contentObj.branches);

    return diff;
};

Content.getVersion = async (contentObj, branch, revisionIndex, options) => {
    if (!op.has(contentObj, ['branches', branch]))
        throw 'No such branch in history';

    const history = op.get(contentObj, ['branches', branch, 'history'], []);

    const range = [0];
    if (typeof revisionIndex !== 'undefined' && revisionIndex < history.length)
        range.push(revisionIndex + 1);
    if (!history.length) throw 'No revision history in branch';

    const revisionIds = history.slice(...range);

    const revisions = await Parse.Object.fetchAll(
        revisionIds.map(id => {
            const rev = new Parse.Object('Recycle');
            rev.id = id;
            return rev;
        }),
        options,
    );

    const revsById = _.indexBy(revisions, 'id');
    const version = revisionIds.reduce((version, id) => {
        const rev = serialize(op.get(revsById, [id]));
        version = {
            ...version,
            ...op.get(rev, 'object', {}),
        };

        return version;
    }, contentObj);

    version.branches = contentObj.branches;
    version.history = {
        branch,
        revision: revisionIds.length - 1,
    };

    return version;
};

module.exports = Content;
