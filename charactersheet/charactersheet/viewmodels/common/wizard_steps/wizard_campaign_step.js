'use strict';

function WizardCampaignStepViewModel() {
    var self = this;

    self.TEMPLATE_FILE = 'wizard_campaign_step.tmpl';
    self.IDENTIFIER = 'WizardCampaignStep';
    self.REQUIRED_FIELDS = ['campaignName', 'playerName'];

    // View Model Methods

    self.init = function() { };

    self.load = function() {
    };

    self.unload = function() {};

    // View Properties

    self.campaignName = ko.observable().extend({ required: '&#9679; Required' });
    self.playerName = ko.observable().extend({ required: '&#9679; Required' });

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
            campaignName: self.campaignName()
        };
    });
}
