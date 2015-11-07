"use strict";

function SpellStats() {
  var self = this;

  self.spellcastingAbility = ko.observable('');
  self.spellSaveDc = ko.observable('');
  self.spellAttackBonus = ko.observable('');

  self.spellcastingAbilityOptions = ko.observableArray([
    'INT', 'WIS', 'CHA']);

  //Public Methods

  self.clear = function() {
    self.spellcastingAbility('');
    self.spellSaveDc(0);
    self.spellAttackBonus(0);
  };

  self.importValues = function(values) {
    self.spellcastingAbility(values.spellcastingAbility);
    self.spellSaveDc(values.spellSaveDc);
    self.spellAttackBonus(values.spellAttackBonus);
  };

  self.exportValues = function() {
    return {
      spellcastingAbility: self.spellcastingAbility(),
      spellSaveDc: self.spellSaveDc(),
      spellAttackBonus: self.spellAttackBonus(),
    }
  };
};