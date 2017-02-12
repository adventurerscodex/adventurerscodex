'use strict';

/**
 * This view model contains the player's skills information.
 */
function SkillsTabViewModel() {
    var self = this;

    self.featsProfViewModel    = ko.observable(new FeatsProfViewModel());
    self.skillsViewModel       = ko.observable(new SkillsViewModel());
    self.trackerViewModel = ko.observable(new TrackerViewModel());
    self.proficienciesViewModel = ko.observable(new ProficienciesViewModel());
    self.featsViewModel = ko.observable(new FeatsViewModel());
    self.traitsViewModel = ko.observable(new TraitsViewModel());
    self.featuresViewModel = ko.observable(new FeaturesViewModel());

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

