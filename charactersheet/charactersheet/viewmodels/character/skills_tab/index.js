'use strict';

import ko from 'knockout'

import { FeatsViewModel } from 'charactersheet/viewmodels/character/feats'
import { FeaturesViewModel } from 'charactersheet/viewmodels/character/features'
import { ProficienciesViewModel } from 'charactersheet/viewmodels/character/proficiencies'
import { SkillsViewModel } from 'charactersheet/viewmodels/character/skills'
import { TrackerViewModel } from 'charactersheet/viewmodels/character/tracker'
import { TraitsViewModel } from 'charactersheet/viewmodels/character/traits'
import { ViewModelUtilities } from 'charactersheet/utilities'

/**
 * This view model contains the player's skills information.
 */
export function SkillsTabViewModel() {
    var self = this;

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

