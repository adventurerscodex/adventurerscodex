'use strict';
import ko from 'knockout'

import { CampaignOverviewViewModel,
    CampaignMapsAndImagesViewModel } from 'charactersheet/viewmodels/dm'
import { ViewModelUtilities } from 'charactersheet/utilities'

export function CampaignTabViewModel() {
    var self = this;

    self.campaignOverviewViewModel = ko.observable(new CampaignOverviewViewModel());
    self.campaignMapsAndImagesViewModel = ko.observable(new CampaignMapsAndImagesViewModel());

    //Public Methods
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
