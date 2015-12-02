"use strict";

function NotesViewModel() {
	var self = this;

	self.note = new Note();
	
	self.init = function() {};
	
	self.load = function() {
		var note = Note.findBy(CharacterManager.activeCharacter().key());
		if (note.length > 0) {
			self.note = note[0];
		}
		self.note.characterId(CharacterManager.activeCharacter().key());
	};
	
	self.unload = function() {
		self.note.save();
	};	
};
