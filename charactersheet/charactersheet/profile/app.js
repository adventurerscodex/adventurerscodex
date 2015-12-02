"use strict";

var ProfileSignaler = {
	changed: new signals.Signal()
};

function ProfileViewModel() {
	var self = this;

	self.profile = new Profile();

	self.init = function() {
		
	};

	self.load = function() {
		var profile = Profile.findBy(CharacterManager.activeCharacter().key());
		if (profile.length > 0) {
			self.profile = profile[0];
		}
		self.profile.characterId(CharacterManager.activeCharacter().key());
		
		//Subscriptions
		self.profile.level.subscribe(function() {
			self.profile.save();
			ProfileSignaler.changed.dispatch();
		});
	};

	self.unload = function() {
		self.profile.save();
	};	
	
	//Public Methods

	self.clear = function() {
		self.profile.clear();
	};
};
