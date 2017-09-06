'use strict';

import ko from 'knockout'

import { ItemsViewModel } from 'charactersheet/viewmodels/character/items'
import { MagicItemsViewModel } from 'charactersheet/viewmodels/character/magic_items'
import { TreasureViewModel } from 'charactersheet/viewmodels/character/treasure'
import { ViewModelUtilities } from 'charactersheet/utilities'

/**
 * This view model contains the player's inventory information.
 */
export function InventoryTabViewModel() {
    var self = this;

    self.itemsViewModel = ko.observable(new ItemsViewModel());
    self.treasureViewModel = ko.observable(new TreasureViewModel());
    self.magicitemsViewModel = ko.observable(new MagicItemsViewModel());

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
