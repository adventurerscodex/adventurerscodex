"use strict";

function FeaturesTraitsViewModel() {
	var self = this;

	self.background = ko.observable('');
	self.ideals = ko.observable('');
	self.flaws = ko.observable('');
	self.bonds = ko.observable('');

	self.init = function() {
	
	};
	
	self.load = function() {
	
	};
	
	self.unload = function() {
	
	};

	self.clear = function() {
		self.background('');
		self.ideals('');
		self.flaws('');
		self.bonds('');
	};
};
