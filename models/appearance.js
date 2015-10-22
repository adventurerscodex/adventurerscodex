"use strict";

function CharacterAppearance() {
	var self = this;
	
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
		self.height(values.height);
		self.weight(values.weight);
		self.hairColor(values.hairColor);
		self.eyeColor(values.eyeColor);
		self.skinColor(values.skinColor);
	};
	
	self.exportValues = function() {
		return {
			height: self.height(),
			weight: self.weight(),
			hairColor: self.hairColor(),
			eyeColor: self.eyeColor(),
			skinColor: self.skinColor()
		}
	};


};
