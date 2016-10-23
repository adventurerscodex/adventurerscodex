'use strict';

/**
 * A View Model for the detailed display of an encounter.
 * This is a child of the Encounter View Model and, when instantiated,
 * is given the encounter it will display. When the user selects another
 * encounter to focus on, the current encounter is cleaned up.
 */
function EncounterDetailViewModel(encounter) {
    var self = this;

    self.encounter = ko.observable(encounter);

    // TODO: Add Fields Here.


    //Public Methods

    self.init = function() {

    };

    self.load = function() {

    };

    self.unload = function() {

    };
}
