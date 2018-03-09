/*eslint no-console:0*/
import coreapi from 'coreapi';

import FetchResponse from './fetch_response';

/**
 * TODO
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
export class PersistenceService {

    constructor(credentials, schema) {
        this.schema = schema;

        // Initialize the CoreAPI Client
        const auth = new coreapi.auth.TokenAuthentication(credentials);
        this.client = new coreapi.Client({ auth: auth });
    }

    /**
     * TODO
     */
    hash = (keys, params) => {
        // TODO: Implement hashing for caching purposes.
        return '';
    };

    /**
     * TODO
     */
    action = (keys, params, raw, ...rest) => (new Promise((resolve) => {
        this.client.action(this.schema, keys, params).then(response => {
            if (raw) {
                resolve(response);
            } else {
                const hash = this.hash(keys, params);
                resolve(new FetchResponse(response, keys, params, hash, ...rest));
            }
        });
    }));

    /**
     * API Operations Methods
     * ======================
     * The following methods allow for easy interaction with the backing API
     * using the provided API Schema.
     * If you need functionality beyond the scope of these methods, refer to
     * the lower-level `action` API which simply wraps the coreapi.Client and
     * returns a FetchResponse.
     *
     * Unmapped Responses
     * ------------------
     * To perform the query without mapping the results to a FetchResponse set
     * `raw` to true. This will return the JSON results of the query directly.
     *
     * Using Custom Models
     * -------------------
     * Most times it is easiest to use subclasses of the base `Model` type
     * (see Model for more information), and if you need to provide a custom
     * object, you can refer to the `Model` documentation to see what fields
     * are required in order to conform with the PersistenceService API.
     */

    /**
     * Given a model type and an optional set of parameters, perform a list query
     * against the backing API and return a promise of results in the form of a
     * FetchResponse (see FetchResponse for more information).
     *
     * Example
     * -------
     *
     *     PersistenceService.list(Book).then(response => {
     *         const books = response.objects;
     *         // Do stuff with books...
     *     });
     */
    list = (model, params={}, raw=false) => {
        const keys = [...model.__skeys__, 'list'];
        return this.action(keys, params, raw, model, true);
    };

    /**
     * Given a model type and an optional set of parameters, perform a retrieve
     * query against the backing API and return a promise of results in the
     * form of a FetchResponse (see FetchResponse for more information).
     *
     * Example
     * -------
     *
     *     PersistenceService.retrieve(Book, { id: '1234' }).then(response => {
     *         const book = response.object;
     *         // Do stuff with your book...
     *     });
     */
    retrieve = (model, params={}, raw=false) => {
        const keys = [...model.__skeys__, 'retrieve'];
        return this.action(keys, params, raw, model, false);
    };

    /**
     * Given a model type and an optional set of parameters, perform a create
     * against the backing API and return a promise of results in the
     * form of a FetchResponse (see FetchResponse for more information).
     *
     * Example
     * -------
     *
     *     const data = { title: 'An Adventure', author: 'John Smith' };
     *     PersistenceService.create(Book, data).then(response => {
     *         const book = response.object;
     *         // Do stuff with your new book...
     *     });
     */
    create = (model, params={}, raw=false) => {
        const keys = [...model.__skeys__, 'create'];
        return this.action(keys, params, raw, model, false);
    };

    /**
     * Given a model type and an optional set of parameters, perform an update
     * against the backing API and return a promise of results in the
     * form of a FetchResponse (see FetchResponse for more information).
     *
     * Example
     * -------
     *
     *     const data = { id: '1234', title: 'An Adventure II', author: 'John Smith' };
     *     PersistenceService.update(Book, data).then(response => {
     *         const book = response.object;
     *         // Do stuff with your updated book...
     *     });
     */
    update = (model, params={}, raw=false) => {
        const keys = [...model.__skeys__, 'update'];
        return this.action(keys, params, raw, model, false);
    };

    /**
     * Given a model type and an optional set of parameters, perform a destroy
     * against the backing API and return a promise of results in the
     * form of a FetchResponse (see FetchResponse for more information).
     *
     * Example
     * -------
     *
     *     PersistenceService.delete(Book, { id: '1234' }).then(response => {
     *         const book = response.object;
     *         // Do stuff with your updated book...
     *     });
     */
    destroy = (model, params={}, raw=false) => {
        const keys = [...model.__skeys__, 'destroy'];
        return this.action(keys, params, raw, model, false);
    };
};
