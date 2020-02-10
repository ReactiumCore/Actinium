const op = require('object-path');
const _ = require('underscore');

const Search = {};

Search.index = async params => {
    const masterOptions = Actinium.Utils.MasterOptions();
    const type = await Actinium.Type.retrieve(params.type, masterOptions);
    const {
        existingSchema,
        permittedFields,
    } = await Actinium.Content.getSchema(type);

    const fieldConfigs = permittedFields;

    return Actinium.Hook.run('search-index', type, permittedFields);
};

Search.search = async req => {
    const index = op.get(req, 'params.index');
    const search = op.get(req, 'params.search', '');
    const context = await Actinium.Hook.run('search', index, search, req);
    return op.get(context, 'results');
};

module.exports = Search;
