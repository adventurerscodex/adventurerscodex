'use strict';

function EncounterViewModel() {
    var self = this;

    self.modalEncounter = ko.observable();
    self.nameHasFocus = ko.observable(false);
    self.selectedEncounter = ko.observable();
    self.encounters = ko.observableArray();
    self.encounterDetailViewModel = ko.observable();
    self.visibilityViewModels = ko.observableArray([]);

    /* Encounter Sections */

    self.sections = [
        { property: 'pointOfInterestSectionViewModel', vm: PointOfInterestSectionViewModel, model: PointOfInterestSection },
        { property: 'npcSectionViewModel', vm: NPCSectionViewModel, model: NPCSection },
        { property: 'playerTextSectionViewModel', vm: PlayerTextSectionViewModel, model: PlayerTextSection },
        { property: 'notesSectionViewModel', vm: NotesSectionViewModel, model: NotesSection }
    ];

    /* Public Methods */

    self.init = function() {
    };

    self.load = function() {
        self.selectedEncounter.subscribe(self.setEncounterDetailViewModel);

        self.encounters(self._getTopLevelEncounters());
        self.selectedEncounter(self.encounters()[0]);
        Notifications.encounters.changed.add(self._reloadEncounters);
    };

    self.unload = function() {
        if (self.encounterDetailViewModel()) {
            self.encounterDetailViewModel().unload();
        }
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
        self._initializeVisibilityViewModel();
    };

    self.openAddModalWithParent = function(parent) {
        self.modalEncounter(new Encounter());
        self.modalEncounter().parent(parent.encounterId());
        self._initializeVisibilityViewModel();
    };

    self.modalFinishedOpening = function() {
        self.nameHasFocus(true);
    };

    self.modalFinishedClosing = function() {
        self.modalEncounter(null);
        self._deinitializeVisibilityViewModel()
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
        self.visibilityViewModels().forEach(function(vm, idx, _) {
            vm.save();
        });

        // Reload Encounters
        self._reloadEncounters();
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
        self._reloadEncounters();
        self.selectedEncounter(self.encounters()[0]);
        self.encounterDetailViewModel().delete();
    };

    /* Private Methods */

    self._initializeVisibilityViewModel = function() {
        self.visibilityViewModels(self.sections.map(function(section, idx, _) {
            var visibilityViewModel = new EncounterSectionVisibilityViewModel(self.modalEncounter(), section.model);
            visibilityViewModel.init();
            visibilityViewModel.load();
            return visibilityViewModel;
        }));
    };

    self._deinitializeVisibilityViewModel = function() {
        self.visibilityViewModels([]);
    };

    self._initializeDetailViewModel = function() {
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

    self._reloadEncounters = function() {
        self.encounters(self._getTopLevelEncounters());
    };
}
