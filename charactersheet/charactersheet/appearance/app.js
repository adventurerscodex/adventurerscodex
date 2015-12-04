"use strict";

function AppearanceViewModel() {
	var self = this;

	self.appearance = new CharacterAppearance();
	
	self.init = function() {
		//Do something.
	};
	
	self.load = function() {
		var key = CharacterManager.activeCharacter().key();
		var appear = CharacterAppearance.findBy(key);
		if (appear.length > 0) {
			self.appearance = appear[0];
		}
		self.appearance.characterId(key);
	};
	
	self.unload = function() {
		self.appearance.save();
	};
	
	self.clear = function() {
		self.appearance.clear();
	};
};
