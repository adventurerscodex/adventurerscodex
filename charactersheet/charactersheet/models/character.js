"use strict";

function Character() {
	var self = this;
	self.ps = PersistenceService.register(Character, self);
	
	self.key = ko.observable(null);
	self.playerType = ko.observable(PlayerTypes.characterPlayerType);
	self.isDefault = ko.observable(false);
	self.isActive = ko.observable(false);
	
	self.url = ko.computed(function() {
		return '/charactersheet/?key=' + self.key() 
			+ '&playerType=' + self.playerType().key;
	});
	
	self.importValues = function(values) {
		self.key(values.key);
		self.isDefault(values.isDefault);
		self.isActive(values.isActive);
		self.playerType(values.playerType);
	};
	
	self.exportValues = function() {
		return {
			key: self.key(),
			isDefault: self.isDefault(),
			isActive: self.isActive(),
			playerType: self.playerType()
		};
	};
	
	self.save = function() {
		self.ps.save();
	}; 
	
	self.delete = function() {
		self.ps.delete();
	};
	
	self.playerSummary = ko.computed(function() {
		var summ = '';
		try {
			summ = Profile.find().characterSummary();
		} catch(err) {};
	});
	
	self.playerAuthor = ko.computed(function() {
		var summ = '';
		try {
			summ = Profile.find().characterSummary();
		} catch(err) {};
	});
	
	self.playerTitle = ko.computed(function() {
		var summ = '';
		try {
			summ = Profile.find().characterSummary();
		} catch(err) {};
	});
};

Character.findAll = function() {
	return PersistenceService.findAll(Character);
};

Character.findBy = function(characterId) {
	return $.map(Character.findAll(), function(e, _) {
		if (e.key === characterId) return e;
	});
};
