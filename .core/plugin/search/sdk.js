const op = require('object-path');
const _ = require('underscore');

const Search = {};

/**
 * @api {Asynchronous} Search.index(params) Search.index()
 * @apiParam {Object} type Type object, or at minimum the properties required `type-retrieve`
 * @apiDescription Trigger index of a content type. User must have `Search.index` capability.
 * @apiName Search.index
 * @apiParam {Object} type Params required to lookup content type with `type-retrieve`
 * @apiParam (type) {String} [objectId] Parse objectId of content type
 * @apiParam (type) {String} [uuid] UUID of content type
 * @apiParam (type) {String} [machineName] the machine name of the existing content type
 * @apiGroup Actinium
 */
/**
 * @api {Hook} search-index-config search-index-config
 * @apiDescription Hook called in `Actinium.Search.index()` before indexing content.
 You can use this to prevent indexing, or to prevent prefetching items by default,
 or to provide configuration for a custom indexing plugin.
 * @apiParam {Object} indexConfig pass by reference. mutate this configuration object in your hook implementation
 * @apiParam {Object} params params passed to `Actinium.Search.index()`
 * @apiParam (indexConfig) {Boolean} [shouldIndex=true] if changed to false,
 skips indexing job for request. `search-index` hook will not be triggered.
 * @apiParam (indexConfig) {Boolean} [prefetchItems=true] if changed to false,
 skips prefetching content items,
 and prevents triggering `search-index-item-normalize` hook.
 * @apiName search-index-config
 * @apiGroup Hooks
 */
/**
 * @api {Hook} search-index-item-normalize search-index-item-normalize
 * @apiDescription Hook called in `Actinium.Search.index()` before indexing content.
 If content was prefetched, each item will be passed through this hook to be normalized
 prior to being added to search index.
 * @apiParam {Object} item one prefetched item of content before indexing. Mutate
 the item appropriately for indexing. e.g. Extract plain-text from RichText fields.
 * @apiParam {Object} params original params passed to `Actinium.Search.index()`
 * @apiParam {Object} type content type of the content being indexed
 * @apiParam {Object} permittedFields fieldType information for the content type
 * @apiParam {Object} indexConfig final indexing configuration passed to `search-index` hook
 * @apiName search-index-item-normalize
 * @apiGroup Hooks
 */
/**
 * @api {Hook} search-index search-index
 * @apiDescription Hook called in `Actinium.Search.index()` to trigger actual
 indexing of content. Implement this hook to perform indexing.
 * @apiParam {Object} items Normalized items for indexing, if indexConfig.prefetchItems is true.
 Otherwise your implementation will need to fetch items if appropriate.
 * @apiParam {Object} params original params passed to `Actinium.Search.index()`
 * @apiParam {Object} type content type of the content being indexed
 * @apiParam {Object} permittedFields fieldType information for the content type
 * @apiParam {Object} indexConfig final indexing configuration passed to `search-index` hook
 * @apiName search-index
 * @apiGroup Hooks
 */
Search.index = async params => {
    const indexConfig = { shouldIndex: true, prefetchItems: true };
    await Actinium.Hook.run('search-index-config', indexConfig, params);

    if (op.get(indexConfig, 'shouldIndex', true)) {
        const options = Actinium.Utils.MasterOptions();
        const type = await Actinium.Type.retrieve(params.type, options);
        const { collection } = type;
        const {
            existingSchema,
            permittedFields,
        } = await Actinium.Content.getSchema(type);

        let items = [];
        if (op.get(indexConfig, 'prefetchItems', true)) {
            const qry = new Parse.Query(collection);
            let results = await qry.find(options);

            while (results.length > 0) {
                for (let item of results) {
                    item = Actinium.Utils.serialize(item);
                    await Actinium.Hook.run(
                        'search-index-item-normalize',
                        item,
                        params,
                        type,
                        permittedFields,
                        indexConfig,
                    );
                    items.push(item);
                }

                qry.skip(items.length);
                results = await qry.find(options);
            }
        }

        return Actinium.Hook.run(
            'search-index',
            items,
            params,
            type,
            permittedFields,
            indexConfig,
        );
    }
};

/**
 * @api {Asynchronous} Search.search(request) Search.search()
 * @apiName Search.search
 * @apiGroup Actinium
 * @apiParam {Object} request Parse cloud request, or equivalent.
 * @apiParam (params) {String} index The index to search. By default, the name of the collection of the indexed content type.
 * @apiParam (params) {String} search The search terms
 * @apiParam (params) {Number} [page=1] Page number of results
 * @apiParam (params) {Number} [limit=1000] Limit page results
 * @apiParam (params) {Float} [threshold=0] Minimum score value. Used to shake out lower ranking search results.
 */
Search.search = async req => {
    const { threshold = 0 } = req.params;
    const context = await Actinium.Hook.run('search', req);
    let { results = [] } = op.get(context, 'results');
    results = results.filter(({ score }) => score >= threshold);
    op.set(context, 'results.results', results);
    return op.get(context, 'results');
};

module.exports = Search;
