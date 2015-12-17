"use strict";

function Character() {
	var self = this;
	self.ps = PersistenceService.register(Character, self);
	
	self.key = ko.observable(null);
	self.playerType = ko.observable(PlayerTypes.characterPlayerType);
	self.isDefault = ko.observable(false);
	self.isActive = ko.observable(false);
	
	self.url = ko.pureComputed(function() {
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
	
	self.playerSummary = ko.pureComputed(function() {
		var summ = '';
		try {
			summ = Profile.findBy(self.key())[0].characterSummary();
		} catch(err) {};
		return summ;
	});
	
	self.playerAuthor = ko.pureComputed(function() {
		var summ = '';
		try {
			summ = Profile.findBy(self.key())[0].playerName();
		} catch(err) {};
		return summ;
	});
	
	self.playerTitle = ko.pureComputed(function() {
		var summ = '';
		try {
			summ = Profile.findBy(self.key())[0].characterName();
		} catch(err) {};
		return summ;
	});
	
	self.saveToFile = function() {
    	var string = JSON.stringify(self.exportValues());
    	var filename = self.playerTitle();
    	var blob = new Blob([string], {type: "application/json"});
		saveAs(blob, filename);
    };

};

Character.findAll = function() {
	return PersistenceService.findAll(Character);
};

Character.findBy = function(characterId) {
	return Character.findAll().filter(function(e, i, _) {
		if (e.key() === characterId) return e;
	});
};
