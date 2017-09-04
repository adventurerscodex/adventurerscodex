'use strict';

import ko from 'knockout'

import { AbilityScoresViewModel,
    SavingThrowsViewModel,
    StatsViewModel } from 'charactersheet/viewmodels/character'
import { ViewModelUtilities } from 'charactersheet/utilities'

/**
 * This view model contains the player's stats information.
 */
export function StatsTabViewModel() {
    var self = this;

    self.statsViewModel         = ko.observable(new StatsViewModel());
    self.abilityScoresViewModel = ko.observable(new AbilityScoresViewModel());
    self.savingThrowsViewModel  = ko.observable(new SavingThrowsViewModel());

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
