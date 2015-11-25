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

	self.init = function() {
	
	};
	
	self.load = function() {
	};
	
	self.unload = function() {
	
	};
};
