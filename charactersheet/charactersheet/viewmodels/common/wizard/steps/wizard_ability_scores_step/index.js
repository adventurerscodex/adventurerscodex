import ko from 'knockout'

import template from './index.html'
import icon from 'images/logo-full-circle-icon.png'

export function WizardAbilityScoresStepViewModel(params) {
    var self = this;

    self.icon = icon;
    self.TEMPLATE_FILE = 'wizard_ability_scores_step.tmpl';
    self.IDENTIFIER = 'WizardAbilityScoresStep';
    self.stepReady = params.stepReady;
    self.stepResult = params.results;

    self.REQUIRED_FIELDS = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

    // View Model Methods

    self.init = function() { };

    self.load = function() {
        self.str.subscribe(self.dataHasChanged);
        self.dex.subscribe(self.dataHasChanged);
        self.con.subscribe(self.dataHasChanged);
        self.int.subscribe(self.dataHasChanged);
        self.wis.subscribe(self.dataHasChanged);
        self.cha.subscribe(self.dataHasChanged);
    };

    self.unload = function() { };

    // View Properties

    self.str = ko.observable().extend({ required: '&#9679; Required' });
    self.dex = ko.observable().extend({ required: '&#9679; Required' });
    self.con = ko.observable().extend({ required: '&#9679; Required' });
    self.int = ko.observable().extend({ required: '&#9679; Required' });
    self.wis = ko.observable().extend({ required: '&#9679; Required' });
    self.cha = ko.observable().extend({ required: '&#9679; Required' });

    // Wizard Step Methods

    self.dataHasChanged = function() {
        self.results();
        self.ready();
    }

    /**
     * Returns true if all required fields are filled.
     */
    self.ready = ko.pureComputed(function() {
        var emptyFields = self.REQUIRED_FIELDS.filter(function(field, idx, _) {
            return self[field]() ? !self[field]().trim() : true;
        });
        self.stepReady(emptyFields.length === 0);
    });

    /**
     * Returns an object containing the current values for
     * the fields in the form.
     */
    self.results = ko.pureComputed(function() {
        self.stepResult( {
            str: self.str(),
            dex: self.dex(),
            con: self.con(),
            int: self.int(),
            wis: self.wis(),
            cha: self.cha()
        });
    });
}

ko.components.register('wizard-ability-score-step', {
    viewModel: WizardAbilityScoresStepViewModel,
    template: template
  })