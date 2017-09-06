'use strict';

import ko from 'knockout'

import { ArmorViewModel } from 'charactersheet/viewmodels/character/armor'
import { ViewModelUtilities } from 'charactersheet/utilities'
import { WeaponsViewModel } from 'charactersheet/viewmodels/character/weapons'

import template from './index.html'

/**
 * This view model contains the player's equipment information.
 */
export function EquipmentTabViewModel() {
    var self = this;

    self.weaponsViewModel = ko.observable(new WeaponsViewModel());
    self.armorViewModel = ko.observable(new ArmorViewModel());

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

ko.components.register('equipment-tab', {
  viewModel: EquipmentTabViewModel,
  template: template
})
