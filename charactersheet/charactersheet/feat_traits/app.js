"use strict";

function FeaturesTraitsViewModel() {
	var self = this;
	
	self.featTraits = new FeaturesTraits();
	
	self.init = function() {
	
	};
	
	self.load = function() {
		var ft = FeaturesTraits.find();
		if (ft) {
			self.featTraits = ft;
		}
	};
	
	self.unload = function() {
		self.featTraits.save();
	};
};
