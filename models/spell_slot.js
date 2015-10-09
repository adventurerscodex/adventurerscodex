"use strict";

function Slot(level, maxSpellSlots, usedSpellSlots, color, callback) {
	var self = this;
	
	self.level = ko.observable(level);
	self.level.subscribe(callback);
	
	self.maxSpellSlots = ko.observable(maxSpellSlots);
	self.maxSpellSlots.subscribe(callback);
	
	self.usedSpellSlots = ko.observable(usedSpellSlots);
	self.usedSpellSlots.subscribe(callback);
	
	self.color = ko.observable(color);
	
	self.spellSlots = ko.computed(function() {
		return (parseInt(self.maxSpellSlots()) - parseInt(self.usedSpellSlots()));
	}, self);
	
	self.incrUsed = function() {
		if (self.usedSpellSlots() < self.maxSpellSlots()) {
			self.usedSpellSlots(parseInt(self.usedSpellSlots()) + 1);
		}
	};

	self.decrUsed = function() {
		if (self.usedSpellSlots() > 0) {
			self.usedSpellSlots(parseInt(self.usedSpellSlots()) - 1);
		}
	};
	
	self.progressLabel = ko.computed(function() {
		return (parseInt(self.maxSpellSlots()) - parseInt(self.usedSpellSlots())) + '/' + parseInt(self.maxSpellSlots());
	});
	
	self.progressWidth = ko.computed(function() {
		return (parseInt(self.maxSpellSlots()) - parseInt(self.usedSpellSlots())) / parseInt(self.maxSpellSlots());
	});
		
	self.clear = function() {
		self.level(0);
		self.maxSpellSlots(0);
		self.usedSpellSlots(0);
	};
	
	self.importValues = function(values) {
		self.level(values.level);
		self.maxSpellSlots(values.maxSpellSlots);
		self.usedSpellSlots(values.usedSpellSlots);
	};
	
	self.exportValues = function() {
		return {
			level: self.level(),
			maxSpellSlots: self.maxSpellSlots(),
			usedSpellSlots: self.usedSpellSlots()
		}
	};
};
