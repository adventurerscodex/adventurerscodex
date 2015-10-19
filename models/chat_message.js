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
		self.from(values.from);
		self.text(values.text);
	};
	
	self.exportValues = function() {
		return {
			to: self.to(),
			from: self.from(),
			text: self.text()
		}
	};

};
