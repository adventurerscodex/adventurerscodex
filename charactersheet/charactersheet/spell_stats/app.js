"use strict";

function SpellStatsViewModel() {
	var self = this;

	self.spell_stats = ko.observable(new SpellStats());

	self.init = function() {
	
	};

	self.load = function() {
	
	};

	self.unload = function() {
	
	};

	self.clear = function() {
		self.spell_stats().clear();
	};

};
