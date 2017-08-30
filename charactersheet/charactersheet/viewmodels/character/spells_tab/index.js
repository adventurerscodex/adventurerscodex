'use strict';

import ko from 'knockout'

import { ActionsToolbarViewModel } from 'charactersheet/viewmodels/character/actions_toolbar'
import { SpellbookViewModel } from 'charactersheet/viewmodels/character/spells'
import { SpellSlotsViewModel } from 'charactersheet/viewmodels/character/spell_slots'
import { SpellStatsViewModel } from 'charactersheet/viewmodels/character/spell_stats'
import { ViewModelUtilities } from 'charactersheet/utilities'

/**
 * This view model contains the player's spells information.
 */
export function SpellsTabViewModel() {
    var self = this;

    self.actionsToolbarViewModel = ko.observable(new ActionsToolbarViewModel());
    self.spellStatsViewModel    = ko.observable(new SpellStatsViewModel());
    self.spellbookViewModel  = ko.observable(new SpellbookViewModel());
    self.spellSlotsViewModel = ko.observable(new SpellSlotsViewModel());

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
