import ko from 'knockout';
import { find } from 'lodash';

/**
 * Adds a find method to the global KO object.
 * Find matching objects in a list.
 *
 * @param source { Array } The source array to search through.
 * @param matchParams { Object } An object to match against.
 *
 * Additional Params
 * -----------------
 * @param recursive { Boolean } (Default true) Whether or not to search
 * recursively through objects and return children in the result set.
 * @param shortCircuit { Boolean } (Default true) Return the first result that
 * matches. Otherwise return a list of all matches.
 *
 * Usage
 * -----
 * const array = ko.observableArray([ some data ]);
 * ko.find(array, { 'someKey': true });
 */
ko.find = (source, predicate, recursive=true, shortCircuit=true) => {
    const keys = Object.keys(predicate);
    const value = ko.unwrap(source);
    const results = [];

    for (let i=0; i<value.length; i++) {
        let result = null;
        const item = ko.unwrap(value[i]);

        if (Array.isArray(item)) {
            // If item is a list, recursively crawl it.
            result = ko.find(item, predicate, recursive, shortCircuit);
            results.concat(result);
        } else if (item !== null && typeof item === 'object') {
            // Check object values.
            const matches = keys.every(key => (predicate[key] === ko.unwrap(item[key])));
            if (matches) {
                result = item;
                results.push(result);
            }
        }

        // Just skip the rest. We have a value.
        if (shortCircuit && result !== null) {
            return result;
        }
    }

    if (shortCircuit && results.length === 0) {
        return null;
    }
    return results;
};
