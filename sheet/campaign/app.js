"use strict";

function CampaignViewModel() {
	var self = this;
	
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
		self.campaignName(values.campaignName);
		self.dmName(values.dmName);
	};
	
	self.exportValues = function() {
		return {
			campaignName: self.campaignName(), 
			dmName: self.dmName()
		}
	};
};
