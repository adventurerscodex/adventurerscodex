'use strict';

/**
 * This view model contains the player's equipment information.
 */
function EquipmentTabViewModel() {
    var self = this;

    self.weaponsViewModel = ko.observable(new WeaponsViewModel());
    self.armorViewModel = ko.observable(new ArmorViewModel());

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

