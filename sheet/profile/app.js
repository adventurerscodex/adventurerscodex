"use strict";

function ProfileViewModel() {
	var self = this;

	self.profile = ko.observable(new Profile());

	//UI Methods
	
	self.characterSummary = ko.computed(function() {
		var desc = ((self.profile().race() && self.profile().race() !== '') && 
						(self.profile().typeClass() && self.profile().typeClass() !== '') && 
						(self.profile().level() && self.profile().level() !== '')) ? 
					'A level ' + self.profile().level() + ' ' + self.profile().race() + ' ' + self.profile().typeClass() + ' by ' 
						+ self.profile().playerName() : false;
		var desc = desc || 'A unique character, handcrafted from the finest bits the '
			+ 'internet can provide.';
		return desc;
	});

	
	//Public Methods

	self.clear = function() {
		self.profile().clear();
	};
	
	self.importValues = function(values) {
		self.profile().importValues(values.profile);
	};
	
	self.exportValues = function() {
		return {
			profile: self.profile().exportValues()
		}
	};
};
