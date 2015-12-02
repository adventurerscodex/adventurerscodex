"use strict";

function Slot() {
	var self = this;
	self.ps = PersistenceService.register(Slot, self);

	self.slotColors = [
		'progress-bar-forest',
		'progress-bar-sky',
		'progress-bar-orange',
		'progress-bar-red',
		'progress-bar-purple',
		'progress-bar-teal',
		'progress-bar-indigo',
		'progress-bar-brown',
		'progress-bar-yellow',
		'progress-bar-magenta',
		'progress-bar-green',
		'progress-bar-blue',
		'progress-bar-red',
		'progress-bar-purple',
		'progress-bar-teal',
		'progress-bar-blue',
		'progress-bar-indigo'
	];

	self.characterId = ko.observable(null);
	self.level = ko.observable(1);
	self.maxSpellSlots = ko.observable(1);
	self.usedSpellSlots = ko.observable(0);
	
	self.color = ko.computed(function() {
		return self.slotColors[self.level()-1];
	});

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
    	self.characterId(values.characterId);   	
		self.level(values.level);
		self.maxSpellSlots(values.maxSpellSlots);
		self.usedSpellSlots(values.usedSpellSlots);
	};

	self.exportValues = function() {
		return {
        	characterId: self.characterId(),
			level: self.level(),
			maxSpellSlots: self.maxSpellSlots(),
			usedSpellSlots: self.usedSpellSlots(),
		}
	};
	
	self.save = function() {
		self.ps.save();
	};
	
	self.delete = function() {
		self.ps.delete();
	};
};

Slot.findAll = function() {
	return PersistenceService.findAll(Slot);
};
