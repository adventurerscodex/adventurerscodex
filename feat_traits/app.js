"use strict";

function FeaturesTraitsViewModel() {
	var self = this;

	self.background = ko.observable('', { persist: getKey('traits.background') });
	self.ideals = ko.observable('', { persist: getKey('traits.ideals') });
	self.flaws = ko.observable('', { persist: getKey('traits.flaws') });
	self.bonds = ko.observable('', { persist: getKey('traits.bonds') });

	self.clear = function() {
		self.background('');
		self.ideals('');
		self.flaws('');
		self.bonds('');
	};

	self.importValues = function(values) {
		self.background(values.background);
		self.ideals(values.ideals);
		self.flaws(values.flaws);
		self.bonds(values.bonds);
	};

	self.exportValues = function() {
		return {
			background: self.background(),
			ideals: self.ideals(),
			flaws: self.flaws(),
			bonds: self.bonds(),
		}
	};
};
