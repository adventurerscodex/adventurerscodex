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

    self.combatSectionViewModel = ko.observable();
    // TODO: Add more sections...

    //Public Methods

    self.init = function() {
    };

    self.load = function() {
        var key = CharacterManager.activeCharacter().key();

        // Combat section.
        var combat = PersistenceService.findFirstBy(CombatSection, 'encounterId', key);
        self.combatSectionViewModel(new CombatSectionViewModel(combat));
        // TODO: Add more sections...

        ViewModelUtilities.initSubViewModels(self);
        ViewModelUtilities.loadSubViewModels(self);
    };

    self.unload = function() {
        ViewModelUtilities.unloadSubViewModels(self);
    };

}
