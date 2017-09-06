'use strict';

import ko from 'knockout'

import { AppearanceViewModel } from 'charactersheet/viewmodels/character/appearance'
import { FeaturesTraitsViewModel } from 'charactersheet/viewmodels/character/feat_traits'
import { ProfileViewModel } from 'charactersheet/viewmodels/character/profile'
import { ViewModelUtilities } from 'charactersheet/utilities'

/**
 * This view model contains the player's profile information.
 */
export function ProfileTabViewModel() {
    var self = this;

    self.profileViewModel        = ko.observable(new ProfileViewModel());
    self.appearanceViewModel     = ko.observable(new AppearanceViewModel());
    self.featuresTraitsViewModel = ko.observable(new FeaturesTraitsViewModel());

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
