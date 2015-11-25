"use strict";

function ProfileViewModel() {
	var self = this;

	self.profile = new Profile();

	self.init = function() {
		
	};

	self.load = function() {
		var profile = Profile.find();
		if (profile) {
			self.profile = profile;
		}
	};

	self.unload = function() {
		self.profile.save();
	};

	//UI Methods
	
	self.characterSummary = ko.computed(function() {
		var desc = ((self.profile.race() && self.profile.race() !== '') && 
						(self.profile.typeClass() && self.profile.typeClass() !== '') && 
						(self.profile.level() && self.profile.level() !== '')) ? 
					'A level ' + self.profile.level() + ' ' + self.profile.race() + ' ' + self.profile.typeClass() + ' by ' 
						+ self.profile.playerName() : false;
		var desc = desc || 'A unique character, handcrafted from the finest bits the '
			+ 'internet can provide.';
		return desc;
	});
	
	//Public Methods

	self.clear = function() {
		self.profile.clear();
	};
};
