"use strict";

function SpellStatsViewModel() {
  var self = this;

  self.spell_stats = ko.observable(new SpellStats());

  self.clear = function() {
    self.spell_stats().clear();
  };

  self.importValues = function(values) {
    self.spell_stats().importValues(values.spell_stats);
  };

  self.exportValues = function() {
    return {
      spell_stats: self.spell_stats().exportValues()
    };
  };
};
