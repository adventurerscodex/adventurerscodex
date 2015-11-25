"use strict";

function FeatsProfViewModel() {
	var self = this;
	
	self.featsProf = new FeatsProf();
	
	self.init = function() {
	
	};
	
	self.load = function() {
		var fp = FeatsProf.find();
		if (fp) {
			self.featsProf = fp;
		}
	};
	
	self.unload = function() {
		self.featsProf.save();
	};
	
	
};
