'use strict';

function EncounterViewModel() {
    var self = this;

    self.modalEncounter = ko.observable();
    self.nameHasFocus = ko.observable(false);
    self.selectedEncounter = ko.observable();
    self.encounters = ko.observableArray();
    self.encounterDetailViewModel = ko.observable();

    /* Encounter Sections */

    self.sections = [
        { property: 'combatSectionViewModel', vm: CombatSectionViewModel, model: CombatSection }
    ];

    /* Modal Section View Models */

    self.combatSectionViewModel = ko.observable();

    /* Public Methods */

    self.init = function() {
    };

    self.load = function() {
        self.selectedEncounter.subscribe(self.setEncounterDetailViewModel);

        self.encounters(self._getTopLevelEncounters());
        self.selectedEncounter(self.encounters()[0]);
    };

    self.unload = function() {
        self.encounters().forEach(function(encounter, idx, _) {
            encounter.save();
        });
    };

    /* UI Methods */

    /**
     * Sets the current encounter detail view model, if the encounter
     * changes then it deinitializes the old value and spins up a new
     * EncounterDetailViewModel with the value of the current encounter.
     */
    self.setEncounterDetailViewModel = function() {
        if (self.encounterDetailViewModel()) {
            self._deinitializeDetailViewModel();
        }

        var newEncounter = self.selectedEncounter();
        if (!newEncounter) { return null; }

        self.encounterDetailViewModel(new EncounterDetailViewModel(newEncounter, self.sections));
        self._initializeDetailViewModel();
    };

    // Modal Methods

    self.openAddModal = function() {
        self.modalEncounter(new Encounter());
        self._setupSectionVMs(self.modalEncounter());
    };

    self.openAddModalWithParent = function(parent) {
        self.modalEncounter(new Encounter());
        self.modalEncounter().parent(parent.encounterId());
        self._setupSectionVMs(self.modalEncounter());
    };

    self.modalFinishedOpening = function() {
        self.nameHasFocus(true);
    };

    self.modalFinishedClosing = function() {
        self.modalEncounter(null);
    };

    /* Manage Encounter Methods */

    self.addEncounter = function() {
        var key = CharacterManager.activeCharacter().key();
        var encounter = self.modalEncounter();
        encounter.characterId(key);
        if (encounter.parent()) {
            encounter.alertParentOfNewChild();
        }
        if (!encounter.name()) {
            encounter.name('Untitled Encounter');
        }

        encounter.save();

        // Reload Encounters
        self.encounters(self._getTopLevelEncounters());
        self.selectedEncounter(encounter);
        self.encounterDetailViewModel().save();
    };

    /**
     * Removes a given encounter from the database. This method is given to the
     * EncounterList Component as the `ondelete` callback. The component will
     * take care of removing the element from the UI.
     */
    self.deleteEncounter = function(encounter) {
        encounter.delete();
        self.encounters(self._getTopLevelEncounters());
        self.selectedEncounter(self.encounters()[0]);
        self.encounterDetailViewModel().delete();
    };

    /* Private Methods */

    self._initializeDetailViewModel = function(vm) {
        self.encounterDetailViewModel().init();
        self.encounterDetailViewModel().load();
    };

    self._deinitializeDetailViewModel = function(vm) {
        self.encounterDetailViewModel().unload();
    };

    self._getTopLevelEncounters = function() {
        var key = CharacterManager.activeCharacter().key();
        var allEncounters = PersistenceService.findBy(Encounter, 'characterId', key);
        return allEncounters.filter(function(enc, idx, _) {
            return !enc.parent();
        });

    };

    /**
     * Using the list of sections, sets the value of the child
     * section view models.
     * Sections are identified using their properties set in the sections list,
     * and are instantiated with 2 parameters being the current encounter, and
     * the view model's data model object (if it exists, or null)  that matched
     * a query by encounter id.
     */
    self._setupSectionVMs = function(encounter) {
        var key = encounter.encounterId();
        self.sections.forEach(function(section, idx, _) {
            var relevantModel = PersistenceService.findFirstBy(section.model, 'encounterId', key);
            var childViewModel = new section.vm(encounter, relevantModel);
            try {
                self[section.property](childViewModel);
            } catch (err) {
                throw "Unable to set child view models for "+section.property
                    +". You probably forgot to add the property to the detail VM.\n"+err
            }
        });
    };

}
