'use strict';

function EncounterCellViewModel(encounter) {
    var self = this;

    self.id = encounter.encounterId;
    self.characterId = encounter.characterId;
    self.encounterId = encounter.encounterId;
    self.name = encounter.name;
    self.encounterLocation = encounter.encounterLocation;

    self._children = ko.observableArray(encounter.getChildren());
    self.isOpen = encounter.isOpen;

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
    };

    /* Child Management Methods */

    self.addChild = function(child) {
        // Update the data.
        var encounter = PersistenceService.findFirstBy(Encounter, 'encounterId', self.encounterId());
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
        var encounter = PersistenceService.findFirstBy(Encounter, 'encounterId', self.encounterId());
        encounter.name(self.name());
        encounter.encounterLocation(self.encounterLocation());
    };

    self.delete = function() {
        var encounter = PersistenceService.findFirstBy(Encounter, 'encounterId', self.encounterId());
        encounter.delete();
        self.children().forEach(function(child, idx, _) {
            child.delete();
        });
    };

    /* Data Refresh Methods */

    self.reloadData = function() {
        var encounter = PersistenceService.findFirstBy(Encounter, 'encounterId', self.encounterId());
        self.name(encounter.name());
        self.encounterLocation(encounter.encounterLocation());
        self.children().forEach(function(child, idx, _) {
            child.reloadData();
        });
    };
}
