"use strict";

function Campaign() {
	var self = this;
	self.ps = PersistenceService.register(Campaign, self);
	
	self.characterId = ko.observable(null)
	self.campaignName =  ko.observable('');
	self.dmName = ko.observable('');

	//UI Methods
	
	self.campaignSummary = ko.computed(function() {
		return self.campaignName() + ' by ' + self.dmName();
	});
	
	//Public Methods
	
	self.clear = function() {
		self.campaignName('');
		self.dmName('');
	};
	
	self.importValues = function(values) {
		self.characterId(values.characterId);
		self.campaignName(values.campaignName);
		self.dmName(values.dmName);
	};
	
	self.exportValues = function() {
		return {
			characterId: self.characterId(),
			campaignName: self.campaignName(), 
			dmName: self.dmName()
		}
	};
	
	self.save = function() {
		self.ps.save();
	};
};

Campaign.findBy = function(characterId) {
	return PersistenceService.findAll(Campaign).filter(function(e, i, _) {
		return e.characterId() === characterId;
	});
};
