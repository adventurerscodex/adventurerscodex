import ko from 'knockout';
import PersistenceServiceToken from 'charactersheet/services/common/ppersistence_service/persistence_service_token';

/**
 * This class is the base definition of all ES6 style model objects.
 *
 * Models extending this class will gain the following benefits:
 * - Automatic Persistence Service Token registration.
 * - Automatic mapping via
 *
 */
export class Model {

    constructor() {
        // Automatically register the given object to the persistence service.
        this.ps = new PersistenceServiceToken(this.constructor, this);
    }

    /**
     * Check to see if the subclasses provide a mapping, if they do
     * not, then raise an exception.
     */
    get _mapping() {
        const mapping = this.constructor.mapping;
        if (!mapping) {
            throw new Error(`Model: "${this.constructor.name}" does not provide a mapping.`);
        }
        return mapping;
    }

    /**
     * A default implementation of object deserialization using Knockout autoignore
     * mapping. For custom mapping, subclasses can override this method.
     */
    importValues = (values) => {
        const mapping = ko.mapping.autoignore(this, this._mapping);
        ko.mapping.fromJS(values, mapping, this);
    }

    /**
     * A default implementation of object serialization using Knockout autoignore
     * mapping. For custom mapping, subclasses can override this method.
     */
    exportValues = () => {
        const mapping = ko.mapping.autoignore(this, this._mapping);
        return ko.mapping.toJS(this, mapping);
    };
}


export class Core extends Model {

    static __skeys__ = ['core'];

    static mapping = {
        include: [],
    };

    summary = ko.pureComputed(() => {
        return `${this.playerName()}: a ${this.type.description()}.`;
    });
}

export class Item extends Model {

    static __skeys__ = ['core', 'items'];

    static mapping = {
        include: [],
    };
}
