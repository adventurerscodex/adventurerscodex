import ko from 'knockout';

import template from './index.html';

export function WizardCampaignStepViewModel(params) {
    var self = this;

    self.TEMPLATE_FILE = 'wizard_campaign_step.tmpl';
    self.IDENTIFIER = 'WizardCampaignStep';
    self.REQUIRED_FIELDS = ['campaignName', 'playerName'];
    self.stepReady = params.stepReady;
    self.stepResult = params.results;

    // View Model Methods

    self.init = function() { };

    self.load = function() {
        self.campaignName.subscribe(self.dataHasChanged);
        self.playerName.subscribe(self.dataHasChanged);
    };

    self.unload = function() {};

    // View Properties

    self.campaignName = ko.observable().extend({ required: '&#9679; Required' });
    self.playerName = ko.observable().extend({ required: '&#9679; Required' });

    // Wizard Step Methods

    self.dataHasChanged = function() {
        self.results();
        self.ready();
    };

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
            playerName: self.playerName(),
            campaignName: self.campaignName()
        });
    });
}

ko.components.register('wizard-campaign-step', {
    viewModel: WizardCampaignStepViewModel,
    template: template
});