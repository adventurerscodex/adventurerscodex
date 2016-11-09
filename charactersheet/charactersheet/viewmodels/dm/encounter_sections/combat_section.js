'use strict';

function CombatSectionViewModel(parentEncounter, combatSection) {
    var self = this;

    /**
     * REQUIRED: Whether or not the given encounter section should be displayed.
     */
    self.visible = ko.observable(true);

    /**
     * REQUIRED: The template name relative to the encounter_sections.
     */
    self.template = 'combat_section.tmpl';

    /**
     * REQUIRED: The display name of the encounter section.
     */
    self.name = 'Combat';

    //Public Methods

    /**
     * Call Init on each sub-module.
     */
    self.init = function() {
    };

    /**
     * Signal all modules to load their data.
     */
    self.load = function() {
    };

    self.unload = function() {
    };

}
