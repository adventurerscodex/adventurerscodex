"use strict";

function AppearanceViewModel() {
	var self = this;

	self.appearance = ko.observable(new CharacterAppearance());
	
	self.init = function() {
		//Do something.
	};
	
	self.load = function() {
		var appear = CharacterAppearance.find();
		if (appear) {
			self.appearance(appear);
		}
	};
	
	self.unload = function() {
		self.appearance().save();
	};
	
	self.clear = function() {
		self.appearance().clear();
	};
};
