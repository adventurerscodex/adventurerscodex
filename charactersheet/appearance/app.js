"use strict";

function AppearanceViewModel() {
	var self = this;

	self.appearance = ko.observable(new CharacterAppearance());
	
	self.clear = function() {
		self.appearance().clear();
	};

	self.importValues = function(values) {
		self.appearance().importValues(values.appearance);
	};
	
	self.exportValues = function() {
		return {
			appearance: self.appearance().exportValues()
		};
	};
};
