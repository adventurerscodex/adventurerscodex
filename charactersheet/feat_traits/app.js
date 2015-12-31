"use strict";

function FeaturesTraitsViewModel() {
	var self = this;
	
	self.featTraits = new FeaturesTraits();
	
	self.init = function() {
	
	};
	
	self.load = function() {
		var ft = FeaturesTraits.findBy(CharacterManager.activeCharacter().key());
		if (ft.length > 0) {
			self.featTraits = ft[0];
		}
		self.featTraits.characterId(CharacterManager.activeCharacter().key())
	};
	
	self.unload = function() {
		self.featTraits.save();
	};
};
