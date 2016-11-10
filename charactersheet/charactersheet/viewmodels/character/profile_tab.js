'use strict';

/**
 * This view model contains the player's profile information.
 */
function ProfileTabViewModel() {
    var self = this;

    self.profileViewModel        = ko.observable(new ProfileViewModel());
    self.appearanceViewModel     = ko.observable(new AppearanceViewModel());
    self.featuresTraitsViewModel = ko.observable(new FeaturesTraitsViewModel());

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
