'use strict';

/**
 * A View Model for the detailed display of an encounter.
 * This is a child of the Encounter View Model and, when instantiated,
 * is given the encounter it will display. When the user selects another
 * encounter to focus on, the current encounter is cleaned up.
 */
function EncounterDetailViewModel(encounter) {
    var self = this;

    self.encounterId = encounter.encounterId;
    self.name = encounter.name;
    self.encounterLocation = encounter.encounterLocation;
    self.sections = allSections;
    // TODO: Add Fields Here.


    /* Encounter Sections */

    self.sections = [
        { property: 'notesSectionViewModel', vm: NotesSection },
        { property: 'pointOfInterestSectionViewModel', vm: PointOfInterestSection }
    ];

    self.notesSectionViewModel = ko.observable();
    // TODO: Add more sections...

    self.openModal = ko.observable(false);
    self.nameHasFocus = ko.observable(false);

    //Public Methods

    self.init = function() {
    };

    self.load = function() {
        self._setupSectionVMs();
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
    };

    /* Modal Methods */

    self.modalFinishedOpening = function() {
        self.nameHasFocus(true);
    };

    self.modalFinishedClosing = function() {
        self.openModal(false);
        self.save();
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
    self._setupSectionVMs = function() {
        self.sections.forEach(function(section, idx, _) {
            var childViewModel = new section.vm(encounter);
            try {
                self[section.property](childViewModel);
            } catch (err) {
                throw "Unable to set child view models for "+ section.property
                    +". You probably forgot to add the property to the detail VM.\n"+err
            }
        });
    };
}
