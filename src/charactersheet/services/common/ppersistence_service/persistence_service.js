/*eslint no-console:0*/
import coreapi from 'coreapi';
import schema from 'schema';

import APIResponse from './response';

/**
 * The Persistence Service is a light-weight ORM and API Client for
 * Javascript Web Clients.
 *
 * It uses a CoreAPI client and a given API schema to allow clients easy access
 * to both raw response data and mapped custom Model objects.
 *
 * Persistence Service returns all normal responses in the form of a APIResponse
 * which allows for easy navigation through paginated responses as well as automatic
 * mapping to custom Models (see `Model` and `APIResponse` for more information).
 *
 * Once a Model is mapped from a response, it is also registered with the
 * Persistence Service and has access to shortcut methods via it's `ps` property.
 *
 * Example
 * -------
 *
 *     PersistenceService.retrieve(Book, { id: '1234' }).then(response => {
 *         const book = response.object;
 *         // Update the local properties of the book object.
 *         book.title('My new favorite book');
 *
 *         // Persist your changes back to the API.
 *         book.ps.save();
 *
 *         // ...You can even refresh your local object from the API.
 *         book.ps.refresh();
 *
 *         // ...Or delete it easily.
 *         book.ps.delete();
 *     });
 */
// TODO: make this default....
export class Persistence {
    static configuration = {};

    static _service = null;

    static get service() {
        if (!Persistence._service) {
            Persistence._service = new _PersistenceService(
                Persistence.configuration.credentials,
                Persistence.configuration.schema
            );
        }
        return Persistence._service;
    }

    static flush() {
        this._service = null;
    }
}

class _PersistenceService {

    constructor(credentials, schema) {
        this.schema = schema;

        // Initialize the CoreAPI Client
        const auth = new coreapi.auth.TokenAuthentication(credentials);
        this.client = new coreapi.Client({ auth: auth });
    }

    // TODO: Implement Caching

    /**
     * TODO: Document
     */
    hash = (keys, params) => {
        // TODO: Implement hashing for caching purposes.
        return '';
    };

    /**
     * TODO: Document
     */
    action = (keys, params, raw, ...rest) => (new Promise((resolve) => {
        this.client.action(this.schema, keys, params).then(response => {
            if (raw) {
                resolve(response);
            } else {
                const hash = this.hash(keys, params);
                resolve(new APIResponse(response, keys, params, hash, ...rest));
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
     * returns a APIResponse.
     *
     * Unmapped Responses
     * ------------------
     * To perform the query without mapping the results to a APIResponse set
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
     * APIResponse (see APIResponse for more information).
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
     * form of a APIResponse (see APIResponse for more information).
     *
     * Example
     * -------
     *
     *     PersistenceService.read(Book, { id: '1234' }).then(response => {
     *         const book = response.object;
     *         // Do stuff with your book...
     *     });
     */
    read = (model, params={}, raw=false) => {
        const keys = [...model.__skeys__, 'read'];
        return this.action(keys, params, raw, model, false);
    };

    /**
     * Given a model type and an optional set of parameters, perform a create
     * against the backing API and return a promise of results in the
     * form of a APIResponse (see APIResponse for more information).
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
     * form of a APIResponse (see APIResponse for more information).
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
     * form of a APIResponse (see APIResponse for more information).
     *
     * Example
     * -------
     *
     *     PersistenceService.delete(Book, { id: '1234' });
     */
    delete = (model, params={}, raw=false) => {
        const keys = [...model.__skeys__, 'delete'];
        return this.action(keys, params, raw, model, false);
    };
};
