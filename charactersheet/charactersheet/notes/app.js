"use strict";

function NotesViewModel() {
	var self = this;

	self.note = new Note();
	
	self.init = function() {};
	
	self.load = function() {
		var key = CharacterManager.activeCharacter().key();
		var note = Note.findBy(key);
		if (note.length > 0) {
			self.note = note[0];
		}
		self.note.characterId(key);
		
		self.note.text.subscribe(self.note.save);
	};
	
	self.unload = function() {
		self.note.save();
	};	
};
