import { CoreManager } from 'charactersheet/utilities/core_manager';
import { Encounter } from 'charactersheet/models/dm';
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { ViewModelUtilities } from 'charactersheet/utilities';
import ko from 'knockout';


export function EncounterCellViewModel(encounter) {
    var self = this;

    self.id = encounter.uuid;
    self.encounter = encounter;
    self.characterId = encounter.characterId;
    self.name = encounter.name;
    self.location = encounter.location;
    self.isOpen = encounter.isOpen;

    self._children = ko.observableArray(encounter.getChildren());

    /* UI Methods */

    self.arrowIconClass = ko.pureComputed(function() {
        return self.isOpen() ? 'fa fa-caret-down' : 'fa fa-caret-right';
    });

    self.children = ko.pureComputed(function() {
        return self._children().map(function(child, idx, _) {
            return new EncounterCellViewModel(child);
        });
    });

    self.toggleIsOpen = function() {
        self.isOpen(!self.isOpen());
        self.save();
    };

    self.shouldShowDelete = ko.pureComputed(function() {
        return true;
    });

    /* Child Management Methods */

    self.addChild = function(child) {
        // Update the data.
        var key = CoreManager.activeCore().uuid();
        var encounter =  PersistenceService.findByPredicates(Encounter, [
            new KeyValuePredicate('uuid', self.uuid()),
            new KeyValuePredicate('characterId', key)
        ])[0];
        encounter.children.push(child.uuid());
        encounter.save();

        // Update the UI.
        self._children.push(child);
    };

    self.removeChild = function(child) {
        self._children(self._children().filter(function(encounter, idx, _) {
            return child.uuid() !== encounter.uuid();
        }));
    };

    /* View Model Methods */

    self.save = function() {
        var key = CoreManager.activeCore().uuid();
        var encounter = PersistenceService.findByPredicates(Encounter, [
            new KeyValuePredicate('uuid', self.uuid()),
            new KeyValuePredicate('characterId', key)
        ])[0];
        encounter.name(self.name());
        encounter.location(self.location());
        encounter.isOpen(self.isOpen());
        encounter.save();
    };

    /* Data Refresh Methods */

    self.reloadData = function() {
        var key = CoreManager.activeCore().uuid();
        var encounter =  PersistenceService.findByPredicates(Encounter, [
            new KeyValuePredicate('uuid', self.uuid()),
            new KeyValuePredicate('characterId', key)
        ])[0];
        if (encounter) {
            self.name(encounter.name());
            self.location(encounter.location());
            self.children().forEach(function(child, idx, _) {
                child.reloadData();
            });
        }
    };
}
