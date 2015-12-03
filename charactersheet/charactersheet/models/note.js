"use strict";

function Note() {
	var self = this;
	self.ps = PersistenceService.register(Note, self);

	self.characterId = ko.observable(null);
	self.text = ko.observable('');

	self.clear = function() {
		self.text('');
		self.save();
	};
	
	self.importValues = function(values) {
    	self.characterId(values.characterId);   	
		self.text(values.text);
	};
	
	self.exportValues = function() {
		return {
        	characterId: self.characterId(),
			text: self.text()
		}
	};
	
	self.save = function() {
		self.ps.save();
	};
};

Note.findBy = function(characterId) {
	return PersistenceService.findAll(Note).filter(function(e, i, _) {
		return e.characterId() === characterId;
	});
};



