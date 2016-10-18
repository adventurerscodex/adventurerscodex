'use strict';

function WizardPlayerTypeStepViewModel() {
    var self = this;

    self.TEMPLATE_FILE = 'wizard_player_type_step.tmpl';
    self.IDENTIFIER = 'WizardPlayerTypeStep';

    self.REQUIRED_FIELDS = ['playerType'];

    // View Model Methods

    self.init = function() { };

    self.load = function() {
        self.playerType(null);
    };

    self.unload = function() {};

    // View Properties

    self.playerType = ko.observable();

    // Wizard Step Methods

    /**
     * Returns true if all required fields are filled.
     */
    self.ready = ko.pureComputed(function() {
        var emptyFields = self.REQUIRED_FIELDS.filter(function(field, idx, _) {
            return self[field]() ? !self[field]().trim() : true;
        });
        return emptyFields.length === 0;
    });

    /**
     * Returns an object containing the current values for
     * the fields in the form.
     */
    self.results = ko.pureComputed(function() {
        return {
            playerType: PlayerTypes[self.playerType()]
        };
    });
}
