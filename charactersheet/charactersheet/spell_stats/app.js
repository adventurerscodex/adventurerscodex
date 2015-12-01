"use strict";

function SpellStatsViewModel() {
	var self = this;

	self.spellStats = new SpellStats();

	self.init = function() {
	
	};

	self.load = function() {
		var stats = SpellStats.find();
		if (stats) {
			self.spellStats = stats;
		}
	};

	self.unload = function() {
		self.spellStats.save();
	};

	self.clear = function() {
		self.spellStats.clear();
	};

};
