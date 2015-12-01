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
	
	//Public Methods

	self.clear = function() {
		self.profile.clear();
	};
};
