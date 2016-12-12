'use strict';

/**
 * A View Model for the detailed display of an encounter.
 * This is a child of the Encounter View Model and, when instantiated,
 * is given the encounter it will display. When the user selects another
 * encounter to focus on, the current encounter is cleaned up.
 */
function EncounterDetailViewModel(encounter, allSections) {
    var self = this;

    self.encounterId = encounter.encounterId;
    self.name = encounter.name;
    self.encounterLocation = encounter.encounterLocation;
    self.visibilityVMs = ko.observableArray([]);

    /* Encounter Sections */

    self.sections = allSections;

    self.environmentSectionViewModel = ko.observable();
    self.treasureSectionViewModel = ko.observable();
    self.notesSectionViewModel = ko.observable();
    self.playerTextSectionViewModel = ko.observable();
    self.pointOfInterestSectionViewModel = ko.observable();
    self.npcSectionViewModel = ko.observable();
    self.monsterSectionViewModel = ko.observable();
    // TODO: Add more sections...

    self.openModal = ko.observable(false);
    self.nameHasFocus = ko.observable(false);

    /* Public Methods */

    self.init = function() {
    };

    self.load = function() {
        self._initializeSectionVMs();
        ViewModelUtilities.initSubViewModels(self);
        ViewModelUtilities.loadSubViewModels(self);
    };

    self.unload = function() {
        self.save();
        ViewModelUtilities.unloadSubViewModels(self);
    };

    self.save = function() {
        var encounter = PersistenceService.findFirstBy(Encounter, 'encounterId', self.encounterId());
        if (encounter) {
            encounter.name(self.name());
            encounter.encounterLocation(self.encounterLocation());
            encounter.save();
            ViewModelUtilities.callOnSubViewModels(self, 'save');
        }
    };

    self.delete = function() {
        ViewModelUtilities.callOnSubViewModels(self, 'delete');
    };

    /* UI Methods */

    self.toggleModal = function() {
        self.openModal(!self.openModal());

        // Modal will open.
        if (self.openModal()) {
            self._initializeVisibilityVMs();
        }
    };

    /* Modal Methods */

    self.modalFinishedOpening = function() {
        self.nameHasFocus(true);
    };

    self.modalFinishedClosing = function() {
        self.openModal(false);
        self.save();

        self.visibilityVMs().forEach(function(vm, idx, _) {
            vm.save();
        });
        self._deinitializeVisibilityVMs();
        Notifications.encounters.changed.dispatch();
    };

    /* Private Methods */

    /**
     * Using the list of sections, sets the value of the child
     * section view models.
     * Sections are identified using their properties set in the sections list,
     * and are instantiated with 2 parameters being the current encounter, and
     * the view model's data model object (if it exists, or null)  that matched
     * a query by encounter id.
     */
    self._initializeSectionVMs = function() {
        var encounter = PersistenceService.findFirstBy(Encounter, 'encounterId', self.encounterId());
        self.sections.forEach(function(section, idx, _) {
            var childViewModel = new section.vm(encounter);
            try {
                self[section.property](childViewModel);
            } catch (err) {
                throw 'Unable to set child view models for '+ section.property
                    +'. You probably forgot to add the property to the detail VM.\n' + err;
            }
        });
    };

    // Modal Visibility VMs

    self._initializeVisibilityVMs = function() {
        var encounter = PersistenceService.findFirstBy(Encounter, 'encounterId', self.encounterId());
        self.visibilityVMs(self.sections.map(function(section, idx, _) {
            var visibilityViewModel = new EncounterSectionVisibilityViewModel(encounter, section.model);
            visibilityViewModel.init();
            visibilityViewModel.load();
            return visibilityViewModel;
        }));
    };

    self._deinitializeVisibilityVMs = function() {
        self.visibilityVMs([]);
    };
}
