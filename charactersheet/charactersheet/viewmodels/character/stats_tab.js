'use strict';

/**
 * This view model contains the player's stats information.
 */
function StatsTabViewModel() {
    var self = this;

    self.statsViewModel         = ko.observable(new StatsViewModel());
    self.abilityScoresViewModel = ko.observable(new AbilityScoresViewModel());
    self.savingThrowsViewModel  = ko.observable(new SavingThrowsViewModel());


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
