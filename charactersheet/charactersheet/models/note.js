"use strict";

function Note() {
	var self = this;
	self.ps = PersistenceService.register(Note, self);

	self.text = ko.observable('');

	self.clear = function() {
		self.text('');
	};
	
	self.importValues = function(values) {
		self.text(values.text);
	};
	
	self.exportValues = function() {
		return {
			text: self.text()
		}
	};
	
	self.save = function() {
		self.ps.save();
	};
};

Note.find = function() {
	return PersistenceService.findOne(Note);
};



