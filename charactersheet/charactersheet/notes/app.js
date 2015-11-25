"use strict";

function NotesViewModel() {
	var self = this;

	self.note = new Note();
	
	self.init = function() {
	
	};
	
	self.load = function() {
		var note = Note.find();
		if (note) {
			self.note = note;
		}
	};
	
	self.unload = function() {
		self.note.save();
	};	


};
