"use strict";

function ChatMessage() {
	var self = this;
	self.ps = PersistenceService.register(ChatMessage, self);
	
	self.characterId = ko.observable(null);
	self.to = ko.observable('');
	self.from = ko.observable('');
	self.toId = ko.observable('');
	self.fromId = ko.observable('');
	self.text = ko.observable('');
	
	self.message = ko.pureComputed(function () {
		var message = '';
		if (self.from().trim() !== '') {
			message += self.from() + ': ';
		}
		message += self.text();
		return message;
	});
	
	self.importValues = function(values) {
    	self.characterId(values.characterId);   	
		self.to(values.to);
		self.toId(values.toId);
		self.from(values.from);
		self.fromId(values.fromId);
		self.text(values.text);
	};
	
	self.exportValues = function() {
		return {
        	characterId: self.characterId(),
			to: self.to(),
			from: self.from(),
			fromId: self.fromId(),
			toId: self.toId(),
			text: self.text()
		}
	};
	
	self.save = function() {
		self.ps.save();
	};
	
	self.delete = function() {
		self.ps.delete();
	};

};

ChatMessage.findAllBy = function(characterId) {
	return PersistenceService.findAll(ChatMessage).filter(function(e, i, _) {
		return e.characterId() === characterId; 
	});
};
