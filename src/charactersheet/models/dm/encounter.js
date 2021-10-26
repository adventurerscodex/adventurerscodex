import { CoreManager } from 'charactersheet/utilities';
import { KOModel } from 'hypnos/lib/models/ko';
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';
import uuid from 'node-uuid';

/**
 * A directory-like container with meta-data information about a container.
 */
export class Encounter extends KOModel {
    static __skeys__ = ['core', 'encounters'];

    static mapping = {
        include: ['coreUuid', 'parent', 'sections']
    };

    // General Encounter Properties.
    coreUuid = ko.observable();
    uuid = ko.observable();
    name = ko.observable();
    location = ko.observable();
    sections = ko.observableArray([]);
    notes = ko.observable();

    //Collapse Properties
    isOpen = ko.observable(false);

    // Related Encounter IDs
    parent = ko.observable(null);
    children = ko.observableArray([]);

    /* Public Methods */

    displayName = ko.pureComputed(function() {
        if (!ko.unwrap(self.name)) {
            return 'Untitled Encounter';
        }
        return this.name();
    });

    removeChild = function(childId) {
        //         this.children(this.children().filter(function(id, idx, _) {
        //             return id !== childId;
        //         }));
    };

    getParent = function() {
        //         var key = CoreManager.activeCore().uuid();
        //         return PersistenceService.findByPredicates(Encounter, [
        //             new KeyValuePredicate('encounterId', self.parent()),
        //             new KeyValuePredicate('characterId', key)
        //         ])[0];
    };


    /**
     * Due to the recursive nature of Encounters, they require a custom import.
     * This import performs the normal duties of mapping, but also calls
     * importValues on the children, mapping all children recursively.
     */
    importValues = (values) => {
        // Do initial mapping.
        ko.mapping.fromJS(values, this._mapping, this);

        // Recursively map the child encounters.
        const children = values.children.map(childValues => {
            const child = new Encounter();
            child.importValues(childValues);
            return child;
        });
        this.children(children);
    };

    toSchemaValues = (values) => {
        let newValues = { ...values };
        if (values.sections) {
            // Strip out everything but the visibility.
            newValues.sections = values.sections.map(({ visible }) => ({ visible }));
        }
        return newValues;
    }
}
