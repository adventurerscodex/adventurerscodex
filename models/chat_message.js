"use strict";

function ChatMessage() {
	var self = this;
	
	self.to = ko.observable('');
	self.from = ko.observable('');
	self.toId = ko.observable('');
	self.fromId = ko.observable('');
	self.text = ko.observable('');
	
	self.importValues = function(values) {
		self.to(values.to);
		self.toId(values.toId);
		self.from(values.from);
		self.fromId(values.fromId);
		self.text(values.text);
	};
	
	self.exportValues = function() {
		return {
			to: self.to(),
			from: self.from(),
			fromId: self.fromId(),
			toId: self.toId(),
			text: self.text()
		}
	};

};
