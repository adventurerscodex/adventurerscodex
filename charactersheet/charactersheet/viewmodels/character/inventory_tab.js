'use strict';

/**
 * This view model contains the player's inventory information.
 */
function InventoryTabViewModel() {
    var self = this;

    self.itemsViewModel = ko.observable(new ItemsViewModel());
    self.treasureViewModel = ko.observable(new TreasureViewModel());
    self.magicitemsViewModel = ko.observable(new MagicItemsViewModel());

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
