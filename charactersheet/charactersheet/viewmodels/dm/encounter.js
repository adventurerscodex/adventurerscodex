'use strict';

function EncounterViewModel() {
    var self = this;

    self.selectedEncounter = ko.observable();
    self.encounters = ko.observableArray();
    self._encounterDetailViewModel = ko.observable();

    self.init = function() {

    };

    self.load = function() {
        self.encounters(self._getTopLevelEncounters());
    };

    self.unload = function() {

    };

    // UI Methods

    self.encounterDetailViewModel = ko.pureComputed(function() {
        var newEncounter = self.selectedEncounter();
        self._deinitializeDetailViewModel();
        self._encounterDetailViewModel(new EncounterDetailViewModel(newEncounter));
        self._initializeDetailViewModel();
        return self._encounterDetailViewModel();
    });

    self.addTopLevelEncounter = function() {
        var key = CharacterManager.activeCharacter().key();
        var encounter = new Encounter();
        encounter.characterId(key);
        encounter.name('A new encounter');
        encounter.save();

        // Reload Encounters
        self.encounters(self._getTopLevelEncounters());
    };

    // TODO: Manage Encounter Methods

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
