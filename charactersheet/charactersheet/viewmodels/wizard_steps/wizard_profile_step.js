'use strict';

function WizardProfileStepViewModel() {
    var self = this;

    self.TEMPLATE_FILE = 'wizard_profile_step.tmpl';
    self.IDENTIFIER = 'WizardProfileStep';

    self.REQUIRED_FIELDS = ['characterName', 'playerName'];

    // View Model Methods

    self.init = function() { };

    self.load = function() {
    };

    self.unload = function() {};

    // View Properties

    self.characterName = ko.observable();
    self.playerName = ko.observable();
    self.race = ko.observable();
    self.typeClass = ko.observable();
    self.alignment = ko.observable();
    self.age = ko.observable();
    self.gender = ko.observable();
    self.diety = ko.observable();
    self.level = ko.observable();
    self.exp = ko.observable();

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
            playerName: self.playerName(),
            characterName: self.characterName(),
            race: self.race(),
            typeClass: self.typeClass(),
            age: self.age(),
            alignment: self.alignment(),
            gender: self.gender(),
            diety: self.diety(),
            level: self.level() || 1,
            exp: self.exp()
        };
    });
}
