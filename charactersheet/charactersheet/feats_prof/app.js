"use strict";

function FeatsProfViewModel() {
	var self = this;
	
	self.featsProf = new FeatsProf();
	
	self.init = function() {};
	
	self.load = function() {
		var fp = FeatsProf.findBy(CharacterManager.activeCharacter().key());
		if (fp.length > 0) {
			self.featsProf = fp[0];
		}
		self.featsProf.characterId(CharacterManager.activeCharacter().key());
	};
	
	self.unload = function() {
		self.featsProf.save();
	};
};
