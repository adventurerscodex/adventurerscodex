'use strict';

/**
 * This view model contains the player's skills information.
 */
function SkillsTabViewModel() {
    var self = this;

    self.featsProfViewModel    = ko.observable(new FeatsProfViewModel());
    self.skillsViewModel       = ko.observable(new SkillsViewModel());
    self.dailyFeatureViewModel = ko.observable(new DailyFeatureViewModel());

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

