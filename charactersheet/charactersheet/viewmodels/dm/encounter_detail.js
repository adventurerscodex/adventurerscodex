'use strict';

/**
 * A View Model for the detailed display of an encounter.
 * This is a child of the Encounter View Model and, when instantiated,
 * is given the encounter it will display. When the user selects another
 * encounter to focus on, the current encounter is cleaned up.
 */
function EncounterDetailViewModel(encounter) {
    var self = this;

    self.name = encounter.name;
    self.locale = encounter.locale;
    // TODO: Add Fields Here.

    /* Encounter Sections */

    self.sections = [
        { property: 'combatSectionViewModel', vm: CombatSectionViewModel, model: CombatSection }
    ];

    self.combatSectionViewModel = ko.observable();
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
        ViewModelUtilities.unloadSubViewModels(self);
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
        var key = CharacterManager.activeCharacter().key();
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