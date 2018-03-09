import uuid from 'uuid';
import PersistenceService from './persistence_service';


/**
 * A FetchResponse is a convenience wrapper around the data received when doing
 * a mapped query to the API.
 *
 * If a model instance is provided, the FetchResponse will map the response data
 * to the model (see Model Serialization for more information). The FetchResponse
 * also remembers the original response data for reference.
 *
 * Accessing the Response Objects
 * ------------------------------
 * Depending on the type of query, responses are mapped to either the `object`
 * or `objects` (note the plural) property on the FetchResponse. In the case of
 * a query that will return multiple objects (i.e. when the `many` flag is set)
 * the resulting objects will be mapped and set to the `objects` property.
 * Otherwise single objects are always mapped to the `object` property.
 *
 * Navigating Paginated Responses
 * ------------------------------
 * A FetchResponse provides an easy way to navigate through paginated results.
 * When retrieving a result set that is paginated (i.e. with
 * `PersistenceService.list()`), FetchResponse provides two convenience methods:
 *
 * - getNextPage: Will fetch the next page in a result set if there is one.
 * - getPreviousPage: Will fetch the previous page in a result set if there is one.
 *
 * Using these two methods you can navigate the results of the query you made
 * originally. Note that you cannot change the parameters or modify the state
 * of the query once it is made. To sort and filter based on different critera,
 * you'll need to make a new query from the PersistenceService.
 *
 */
class FetchResponse {

    constructor(data, keys, params, requestId, model=null, many=false) {
        this.id = uuid.v4().toString();
        this.fetchParams = params;
        this.fetchKeys = keys;
        this.data = data;
        this.requestId = requestId;
        this.many = many;
        this.model = model;

        // Map response to model object(s).
        if (model) {
            if (many) {
                this.objects = data.results.map(result => {
                    const instance = new model();
                    instance.importValues(result);
                    return instance;
                });
            } else {
                const instance = new model();
                instance.importValues(data);
                this.object = instance;
            }
        }
    }

    /**
     * Returns whether or not the given fetch response has a next page.
     */
    hasNextPage = () => (
        this.many && this.data.next
    );

    /**
     * Returns whether or not the given fetch response has a previous page.
     */
    hasPreviousPage = () => (
        this.many && this.data.previous
    );

    /**
     * Fetch the next page of results in a paginated result set.
     *
     * This method returns a promise to the FetchResponse of the next page.
     *
     * WARNING: This method will throw an error when attempting to fetch a next
     * page for a single object result set or if there is no next page.
     * To avoid this, check if the FetchResponse `hasNextPage` before calling.
     */
    getNextPage = () => (new Promise((resolve) => {
        if (!this.many || !this.hasNextPage()) {
            throw new Error(`Given FetchResponse: ${this.id} does not have a next value.`);
        }

        const nextPageFetchParams = { ...this.fetchParams, page: this._getNextPageNumber() };
        return PersistenceService.action(
            this.fetchKeys,
            nextPageFetchParams,
            false,
            this.model,
            this.many
        ).then(resolve);
    }));

    /**
     * Fetch the previous page of results in a paginated result set.
     *
     * This method returns a promise to the FetchResponse of the previous page.
     *
     * WARNING: This method will throw an error when attempting to fetch a previous
     * page for a single object result set or if there is no previous page.
     * To avoid this, check if the FetchResponse `hasPreviousPage` before calling.
     */
    getPreviousPage = () => (new Promise((resolve) => {
        if (!this.many || !this.hasPreviousPage()) {
            throw new Error(`Given FetchResponse: ${this.id} does not have a previous value.`);
        }
        const previousPageFetchParams = { ...this.fetchParams, page: this._getPreviousPageNumber() };
        return PersistenceService.action(
            this.fetchKeys,
            previousPageFetchParams,
            false,
            this.model,
            this.many
        ).then(resolve);
    }));

    /* Private Methods */

    _getCurrentPage = () => (
        this.fetchParams.page ? this.fetchParams.page : 1
    );

    _getNextPageNumber = () => (
        this._getCurrentPage() + 1
    );

    _getPreviousPageNumber = () => (
        this._getCurrentPage() - 1
    );
}


export default FetchResponse;
