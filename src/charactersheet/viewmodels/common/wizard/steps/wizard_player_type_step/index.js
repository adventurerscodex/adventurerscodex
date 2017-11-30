import { PlayerTypes } from 'charactersheet/models/common';
import icon from 'images/logo-all-icons.png';
import ko from 'knockout';
import template from './index.html';

export function WizardPlayerTypeStepViewModel(params) {
    var self = this;

    self.icon = icon;
    self.TEMPLATE_FILE = 'wizard_player_type_step.tmpl';
    self.IDENTIFIER = 'WizardPlayerTypeStep';
    self.stepReady = params.stepReady;
    self.stepResult = params.results;

    self.REQUIRED_FIELDS = ['playerType'];

    // View Model Methods

    self.init = function() { };

    self.load = function() {
        self.playerType(null);
        self.playerType.subscribe(self.dataHasChanged);
    };

    self.unload = function() {};

    // View Properties

    self.playerType = ko.observable();

    // Wizard Step Methods

    self.dataHasChanged = function() {
        self.results();
        self.ready();
    };

    /**
     * Returns true if all required fields are filled.
     */
    self.ready = function() {
        var emptyFields = self.REQUIRED_FIELDS.filter(function(field, idx, _) {
            return self[field]() ? !self[field]().trim() : true;
        });
        self.stepReady(emptyFields.length === 0);
    };

    /**
     * Returns an object containing the current values for
     * the fields in the form.
     */
    self.results = ko.pureComputed(function() {
        self.stepResult( {
            playerType: PlayerTypes[self.playerType()]
        });
    });
}

ko.components.register('wizard-player-type-step', {
    viewModel: WizardPlayerTypeStepViewModel,
    template: template
});