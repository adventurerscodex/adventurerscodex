'use strict';

function EncounterViewModel() {
    var self = this;

    self.modalEncounter = ko.observable();
    self.nameHasFocus = ko.observable(false);
    self.selectedEncounter = ko.observable();
    self.encounters = ko.observableArray();
    self._encounterDetailViewModel = ko.observable();

    self.init = function() {
    };

    self.load = function() {
        self.encounters(self._getTopLevelEncounters());
        self.selectedEncounter(self.encounters()[0]);
    };

    self.unload = function() {
        self.encounters().forEach(function(encounter, idx, _) {
            encounter.save();
        });
    };

    // UI Methods

    /**
     * Returns the current internal encounter detail view model, if the encounter
     * changes then it deinitializes the old value and spins up a new
     * EncounterDetailViewModel with the value of the current encounter.
     */
    self.encounterDetailViewModel = ko.pureComputed(function() {
        if (self._encounterDetailViewModel()) {
            self._deinitializeDetailViewModel();
        }

        var newEncounter = self.selectedEncounter();
        if (!newEncounter) { return null; }

        self._encounterDetailViewModel(new EncounterDetailViewModel(newEncounter));
        self._initializeDetailViewModel();

        return self._encounterDetailViewModel;
    });

    // Modal Methods

    self.openAddModal = function() {
        self.modalEncounter(new Encounter());
    };

    self.openAddModalWithParent = function(parent) {
        self.modalEncounter(new Encounter());
        self.modalEncounter().parent(parent.encounterId());
    };

    self.modalFinishedOpening = function() {
        self.nameHasFocus(true);
    };

    self.modalFinishedClosing = function() {
        self.modalEncounter(null);
    };

    // Manage Encounter Methods

    self.addEncounter = function() {
        var key = CharacterManager.activeCharacter().key();
        var encounter = self.modalEncounter();
        encounter.characterId(key);
        if (encounter.parent()) {
            encounter.alertParentOfNewChild();
        }

        encounter.save();

        // Reload Encounters
        self.encounters(self._getTopLevelEncounters());
        self.selectedEncounter(encounter);
    };

    /**
     * Removes a given encounter from the database. This method is given to the
     * EncounterList Component as the `ondelete` callback. The component will
     * take care of removing the element from the UI.
     */
    self.deleteEncounter = function(encounter) {
        encounter.delete();
        self.encounters(self._getTopLevelEncounters());
    };

    // Private Methods

    self._initializeDetailViewModel = function(vm) {
        self._encounterDetailViewModel().init();
        self._encounterDetailViewModel().load();
    };

    self._deinitializeDetailViewModel = function(vm) {
        self._encounterDetailViewModel().unload();
    };

    self._getTopLevelEncounters = function() {
        var key = CharacterManager.activeCharacter().key();
        var allEncounters = PersistenceService.findBy(Encounter, 'characterId', key);
        return allEncounters.filter(function(enc, idx, _) {
            return !enc.parent();
        });

    };
}
