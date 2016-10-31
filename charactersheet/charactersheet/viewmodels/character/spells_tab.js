'use strict';

/**
 * This view model contains the player's spells information.
 */
function SpellsTabViewModel() {
    var self = this;

    self.actionsToolbarViewModel = ko.observable(new ActionsToolbarViewModel());
    self.spellStatsViewModel    = ko.observable(new SpellStatsViewModel());
    self.spellbookViewModel  = ko.observable(new SpellbookViewModel());
    self.spellSlotsViewModel = ko.observable(new SpellSlotsViewModel());

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
