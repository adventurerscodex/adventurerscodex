"use strict";

var CampaignSignaler = {
	changed: new signals.Signal()
};

function CampaignViewModel() {
	var self = this;
	
	self.campaign = new Campaign();
		
	self.init = function() {};
	
	self.load = function() {
		var key = CharacterManager.activeCharacter().key();
		var cam = Campaign.findBy(key);
		if (cam.length > 0) {
			self.campaign = cam[0];
		}
		self.campaign.characterId(key);
	};
	
	self.unload = function() {
		self.campaign.save();
	};
};
