'use strict';

function CampaignTabViewModel() {
    var self = this;

    self.campaignOverviewViewModel = ko.observable(new CampaignOverviewViewModel());

    //Public Methods

    /**
     * Call Init on each sub-module.
     */
    self.init = function() {
        ViewModelUtilities.initSubViewModels(self);
    };

    /**
     * Signal all modules to load their data.
     */
    self.load = function() {
        ViewModelUtilities.loadSubViewModels(self);
    };

    self.unload = function() {
        ViewModelUtilities.unloadSubViewModels(self);
    };
}
