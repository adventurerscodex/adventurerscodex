"use strict";

function CharacterAppearance() {
	var self = this;
	self.ps = PersistenceService.register(CharacterAppearance, self);
	
    self.characterId = ko.observable(null);
	self.height = ko.observable('');
	self.weight = ko.observable('');
	self.hairColor = ko.observable('');
	self.eyeColor = ko.observable('');
	self.skinColor = ko.observable('');

	//Public Methods
	
	self.clear = function() {
		self.height('');
		self.weight('');
		self.hairColor('');
		self.eyeColor('');
		self.skinColor('');
	};
	
	self.importValues = function(values) {
		self.characterId(values.characterId);
		self.height(values.height);
		self.weight(values.weight);
		self.hairColor(values.hairColor);
		self.eyeColor(values.eyeColor);
		self.skinColor(values.skinColor);
	};
	
	self.exportValues = function() {
		return {
			characterId: self.characterId(),
			height: self.height(),
			weight: self.weight(),
			hairColor: self.hairColor(),
			eyeColor: self.eyeColor(),
			skinColor: self.skinColor()
		}
	};
			
	self.save = function() {
		self.ps.save();
	};
};

//CRUD

CharacterAppearance.findBy = function(characterId) {
	var r = PersistenceService.findOne(CharacterAppearance);
	if (!r) { r = []; }

	return $.map(r, function(e, _) {
		if (e.characterId === characterId) { return e; }
	});
};

