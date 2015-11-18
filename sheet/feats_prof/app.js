"use strict";

function FeatsProfViewModel() {
  var self = this;

  self.feats = ko.observable('');
  self.proficiencies = ko.observable('');
  self.specialAbilities = ko.observable('');

  self.clear = function() {
    self.feats('');
    self.proficiencies('');
    self.specialAbilities('');
  };

  self.importValues = function(values) {
    self.feats(values.feats);
    self.proficiencies(values.proficiencies);
    self.specialAbilities(values.specialAbilities);
  };

  self.exportValues = function() {
    return {
      feats: self.feats(),
      proficiencies: self.proficiencies(),
      specialAbilities: self.specialAbilities()
    }
  };
};
