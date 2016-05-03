'use strict';

/**
 * This view model contains the DM's campaign information.
 */
function CampaignTabViewModel() {
    var self = this;

    self.campaignViewModel = ko.observable(new CampaignViewModel());

    self.init = function() {
        ViewModelUtilities.initSubViewModels(self);
    };

    self.load = function() {
        ViewModelUtilities.loadSubViewModels(self);
    };

    self.unload = function() {
        ViewModelUtilities.unloadSubViewModels(self);
    };

    self.clear = function() {
        ViewModelUtilities.clearSubViewModels(self);
    };
}
