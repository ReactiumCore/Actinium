/**
 * @api {Object} Actinium.Cache Cache
 * @apiVersion 3.0.3
 * @apiName Cache
 * @apiGroup Actinium
 * @apiDescription Cache allows you to easily store application data in memory.
 */

/**
 * @api {Function} Actinium.Cache.get(key) Cache.get()
 * @apiVersion 3.0.3
 * @apiGroup Actinium
 * @apiName Cache.get
 * @apiDescription Retrieves the value for a given key. If the value is not cached `null` is returned.
 *
 * @apiParam {String} [key] The key to retrieve. If the value is an `{Object}` you can use an object path for the key. If no key is specified the entire cache is returned.
 * @apiParam {Mixed} [default] The default value to return if key is not found.
 *
 * @apiExample Example Usage:
 * // Given the cached value: { foo: { bar: 123 } }
 * Actinium.Cache.get('foo.bar'); // returns: 123;
 * Actinium.Cache.get('foo');     // returns: { bar: 123 }
 */

/**
 * @api {Function} Actinium.Cache.set(key,value,timeout,timeoutCallback) Cache.set()
 * @apiVersion 3.0.3
 * @apiGroup Actinium
 * @apiName Cache.set
 * @apiDescription Sets the value for a given key. If the value is an `{Object}` and is already cached, you can use an object path to update a specific part of the value. Returns the cached value.
 *
 * @apiParam {String} key The key to set. If the key is an object path and the key does not exist, it will be created.
 * @apiParam {Mixed} value The value to cache.
 * @apiParam {Number} [timeout] Remove the value in the specified time in milliseconds. If no timeout value specified, the value will remain indefinitely.
 * @apiParam {Function} [timeoutCallback] Function called when the timeout has expired. The timeoutCallback will be passed the key and value as arguments.
 *
 * @apiExample Example Usage:
 * // The following are equivalent
 * Actinium.Cache.set('foo', { bar: 123 });
 * Actinium.Cache.set('foo.bar', 123);
 *
 * // Set to expire in 5 seconds
 * Actinium.Cache.set('error', 'Ivnalid username or password', 5000);
 *
 * // Set to expire in 5 seconds and use a timeoutCallback
 * Actinium.Cache.set('foo', { bar: 456 }, 5000, (key, value) => console.log(key, value));
 */

/**
 * @api {Function} Actinium.Cache.del(key) Cache.del()
 * @apiVersion 3.0.3
 * @apiGroup Actinium
 * @apiName Cache.del
 * @apiDescription Delete the value for a given key. Returns `{Boolean}`.
 *
 * @apiParam {String} key The key to delete. If the value is an `{Object}` you can use an object path to delete a specific part of the value. The updated value is then returned.
 *
 * @apiExample Example Usage:
 * // Given the cached value: { foo: { bar: 123, blah: 'hahaha' } }
 * Actinium.Cache.del('foo.bar'); // returns: { blah: 'hahaha' }
 * Actinium.Cache.del('foo');     // returns: true
 */

/**
 * @api {Function} Actinium.Cache.clear() Cache.clear()
 * @apiVersion 3.0.3
 * @apiGroup Actinium
 * @apiName Cache.clear
 * @apiDescription Delete all cached values.
 *
 * @apiParam {String} key The key to delete. If the value is an `{Object}` you can use an object path to delete a specific part of the value. The updated value is then returned.
 *
 * @apiExample Example Usage:
 * Actinium.Cache.clear();
 */

/**
 * @api {Function} Actinium.Cache.size() Cache.size()
 * @apiVersion 3.0.3
 * @apiGroup Actinium
 * @apiName Cache.size
 * @apiDescription Returns the current number of entries in the cache.
 */

/**
 * @api {Function} Actinium.Cache.memsize() Cache.memsize()
 * @apiVersion 3.0.3
 * @apiGroup Actinium
 * @apiName Cache.memsize
 * @apiDescription Returns the number of entries taking up space in the cache.
 */

/**
 * @api {Function} Actinium.Cache.merge(values) Cache.merge()
 * @apiVersion 3.0.3
 * @apiGroup Actinium
 * @apiName Cache.merge
 * @apiDescription Merges the supplied values object with the current cache. Any existing entries will remain in cache. Duplicates will be overwritten unless `option.skipDuplicates` is `true`. Entries that would have exipired since being merged will expire upon merge but their timeoutCallback will not be invoked. Returns the new size of the cache.
 *
 * @apiParam {Object} values Key value pairs to merge into the cache.
 *
 * @apiExample Example Usage:
 * // Give the existing cache: { foo: 'bar' }
 *
 * Actinium.Cache.merge({
 *     test: {
 *         value: 123,
 *         expire: 5000,
 *     },
 * });
 *
 * Actinium.Cache.get()
 * // returns: { foo: 'bar', test: 123 }
 */

/**
 * @api {Function} Actinium.Cache.keys() Cache.keys()
 * @apiVersion 3.0.3
 * @apiGroup Actinium
 * @apiName Cache.keys
 * @apiDescription Returns an array of the cached keys.
 */
