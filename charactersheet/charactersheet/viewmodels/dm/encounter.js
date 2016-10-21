'use strict';

function EncounterViewModel() {
    var self = this;

    self.encounterDetailViewModel = ko.observable();
    self.selectedEncounter = ko.observable();
    self.encounters = ko.observableArray();

    self.init = function() {

    };

    self.load = function() {
        self.encounters(self._getTopLevelEncounters());
    };

    self.unload = function() {

    };

    self.encounterWasSelected = function(encounter) {
        var newEncounter = self.selectedEncounter();
        self._deinitializeDetailViewModel();
        self.encounterDetailViewModel(new EncounterDetailViewModel(newEncounter));
        self._initializeDetailViewModel();
    };

    // TODO: Manage Encounter Methods

    // Private Methods

    self._initializeDetailViewModel = function() {
        self.encounterDetailViewModel().init();
        self.encounterDetailViewModel().load();
    };

    self._deinitializeDetailViewModel = function() {
        self.encounterDetailViewModel().unload();
    };

    self._getTopLevelEncounters = function() {
        var key = CharacterManager.activeCharacter().key();
        var allEncounters = PersistenceService.findBy(Encounter, 'characterId', key);
        return allEncounters.filter(function(enc, idx, _) {
            return !enc.parent();
        });

    };
}
