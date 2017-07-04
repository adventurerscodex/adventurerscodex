'use strict';

function WizardAbilityScoresStepViewModel() {
    var self = this;

    self.TEMPLATE_FILE = 'wizard_ability_scores_step.tmpl';
    self.IDENTIFIER = 'WizardAbilityScoresStep';

    self.REQUIRED_FIELDS = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

    // View Model Methods

    self.init = function() { };

    self.load = function() { };

    self.unload = function() { };

    // View Properties

    self.str = ko.observable().extend({ required: '&#9679; Required' });
    self.dex = ko.observable().extend({ required: '&#9679; Required' });
    self.con = ko.observable().extend({ required: '&#9679; Required' });
    self.int = ko.observable().extend({ required: '&#9679; Required' });
    self.wis = ko.observable().extend({ required: '&#9679; Required' });
    self.cha = ko.observable().extend({ required: '&#9679; Required' });

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
            str: self.str(),
            dex: self.dex(),
            con: self.con(),
            int: self.int(),
            wis: self.wis(),
            cha: self.cha()
        };
    });
}
