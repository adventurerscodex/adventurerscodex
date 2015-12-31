"use strict";

function FeaturesTraits() {
	var self = this;
	self.ps = PersistenceService.register(FeaturesTraits, self);

	self.characterId = ko.observable(null);
	self.background = ko.observable('');
	self.ideals = ko.observable('');
	self.flaws = ko.observable('');
	self.bonds = ko.observable('');

	self.save = function() {
		self.ps.save();
	};

	self.clear = function() {
		self.background('');
		self.ideals('');
		self.flaws('');
		self.bonds('');
	};
	
	self.importValues = function(values) {
    	self.characterId(values.characterId);   	
		self.background(values.background);
		self.ideals(values.ideals);
		self.flaws(values.flaws);
		self.bonds(values.bonds);
	};

	self.exportValues = function() {
		return {
        	characterId: self.characterId(),
			background: self.background(),
			ideals: self.ideals(),
			flaws: self.flaws(),
			bonds: self.bonds(),
		}
	};
};

FeaturesTraits.findBy = function(characterId) {
	return PersistenceService.findAll(FeaturesTraits).filter(function(e, i, _) {
		return e.characterId() === characterId;
	});
};
