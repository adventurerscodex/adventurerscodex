import PersistenceService from './persistence_service';


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
class PersistenceServiceToken {

    constructor(model, instance) {
        this.model = model;
        this.instance = instance;
    }

    /**
     * Refresh the data for the given object from the remote store.
     */
    refresh = () => {
        const keys = [...model.__skeys__, 'retrieve'];
        // TODO: Add params from self.
        const params = {};
        return this.action(keys, params, raw, model, false);
    };

    /**
     * Persist the object's data to the remote store. This only works for
     * existing objects.
     *
     * If a list of fields is provided, then only update those fields.
     */
    save = (fields=[]) => {
        const keys = [...model.__skeys__, 'update'];
        // TODO: Add params from self.
        const params = {};
        return this.action(keys, params, raw, model, false);
    };

    /**
     * Tell the remote store to destroy the current object.
     *
     * WARNING: This does not remove the object from memory, only from
     * the remote store.
     */
    delete = () => {
        // TODO: Add params from self.
        const keys = [...model.__skeys__, 'destroy'];
        // TODO: Add params from self.
        const params = {};
        return this.action(keys, params, raw, model, false);
    };
}


export default PersistenceServiceToken;
