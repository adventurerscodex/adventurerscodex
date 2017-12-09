import { CharacterManager } from 'charactersheet/utilities/character_manager'
import { Encounter } from 'charactersheet/models/dm';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import { ViewModelUtilities } from 'charactersheet/utilities';
import ko from 'knockout';

export function EncounterCellViewModel(encounter) {
    var self = this;

    self.id = encounter.encounterId;
    self.characterId = encounter.characterId;
    self.encounterId = encounter.encounterId;
    self.name = encounter.name;
    self.encounterLocation = encounter.encounterLocation;
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
        var key = CharacterManager.activeCharacter().key();
        var encounter =  PersistenceService.findByPredicates(Encounter, [
            new KeyValuePredicate('encounterId', self.encounterId()),
            new KeyValuePredicate('characterId', key),
        ])[0];
        encounter.children.push(child.encounterId());
        encounter.save();

        // Update the UI.
        self._children.push(child);
    };

    self.removeChild = function(child) {
        self._children(self._children().filter(function(encounter, idx, _) {
            return child.encounterId() !== encounter.encounterId();
        }));
    };

    /* View Model Methods */

    self.save = function() {
        var key = CharacterManager.activeCharacter().key();
        var encounter =  PersistenceService.findByPredicates(Encounter, [
            new KeyValuePredicate('encounterId', self.encounterId()),
            new KeyValuePredicate('characterId', key),
        ])[0];
        encounter.name(self.name());
        encounter.encounterLocation(self.encounterLocation());
        encounter.isOpen(self.isOpen());
        encounter.save();
    };

    self.delete = function() {
        var key = CharacterManager.activeCharacter().key();
        var encounter =  PersistenceService.findByPredicates(Encounter, [
            new KeyValuePredicate('encounterId', self.encounterId()),
            new KeyValuePredicate('characterId', key),
        ])[0];
        encounter.delete();
        self.children().forEach(function(child, idx, _) {
            child.delete();
        });
    };

    /* Data Refresh Methods */

    self.reloadData = function() {
        var key = CharacterManager.activeCharacter().key();
        var encounter =  PersistenceService.findByPredicates(Encounter, [
            new KeyValuePredicate('encounterId', self.encounterId()),
            new KeyValuePredicate('characterId', key),
        ])[0];
        self.name(encounter.name());
        self.encounterLocation(encounter.encounterLocation());
        self.children().forEach(function(child, idx, _) {
            child.reloadData();
        });
    };
}
