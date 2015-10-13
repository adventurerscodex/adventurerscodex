"use strict";

function FeaturesTraitsViewModel() {
	var self = this;

	self.background = ko.observable('');
	self.ideals = ko.observable('');
	self.flaws = ko.observable('');
	self.bonds = ko.observable('');

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
