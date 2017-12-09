import { CharacterManager } from 'charactersheet/utilities';
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';
import uuid from 'node-uuid';

/**
 * A directory-like container with meta-data information about a container.
 */
export function Encounter() {
    var self = this;
    self.ps = PersistenceService.register(Encounter, self);
    self.mapping = {
        include: ['characterId', 'encounterId', 'name', 'encounterLocation', 'notes',
            'parent', 'children', 'isOpen']
    };

    // General Encounter Properties.
    self.characterId = ko.observable();
    self.encounterId = ko.observable(uuid.v4());
    self.name = ko.observable();
    self.encounterLocation = ko.observable();
    self.notes = ko.observable();

    //Collapse Properties
    self.isOpen = ko.observable(false);

    // Related Encounter IDs
    self.parent = ko.observable();
    self.children = ko.observableArray([]);

    /* Public Methods */

    self.displayName = ko.pureComputed(function() {
        if (!ko.unwrap(self.name)) {
            return 'Untitled Encounter';
        }
        return self.name();
    });

    self.removeChild = function(childId) {
        self.children(self.children().filter(function(id, idx, _) {
            return id !== childId;
        }));
    };

    /**
     * Returns the list of encounter objects corresponding to the child ids.
     */
    self.getChildren = function() {
        var key = CharacterManager.activeCharacter().key();
        return self.children().map(function(id, idx, _) {
            return PersistenceService.findByPredicates(Encounter, [
                new KeyValuePredicate('encounterId', id),
                new KeyValuePredicate('characterId', key)
            ])[0];
        });
    };

    self.getParent = function() {
        var key = CharacterManager.activeCharacter().key();
        return PersistenceService.findByPredicates(Encounter, [
            new KeyValuePredicate('encounterId', self.parent()),
            new KeyValuePredicate('characterId', key)
        ])[0];
    };

    /* View Model Methods */

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };

    self.clear = function() {
        var values = new Encounter().exportValues();
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.importValues = function(values) {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.exportValues = function() {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        return ko.mapping.toJS(self, mapping);
    };
}
Encounter.__name = 'Encounter';

PersistenceService.addToRegistry(Encounter);
