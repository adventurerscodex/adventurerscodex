"use strict";

function SpellSlotsViewModel() {
	var self = this;
	
	self.slotColors = [
		'progress-bar-red',
		'progress-bar-purple',
		'progress-bar-teal',
		'progress-bar-indigo',
		'progress-bar-brown',
		'progress-bar-yellow',
		'progress-bar-forest',
		'progress-bar-sky',
		'progress-bar-orange',
		'progress-bar-magenta',
		'progress-bar-green',
		'progress-bar-blue'
	];
	
	self.slots = ko.observableArray([], { 
		persist: getKey('spellslots.slots'), 
		mapping: function(values){
			return new Slot(values.level, values.maxSpellSlots, values.usedSpellSlots, self.slotColors.pop(), function() {
				self.slots.valueHasMutated();
			});
		}
	});

	self.blankSlot = ko.observable(new Slot(self.slots().length + 1,'', '', '', function() {
			self.slots.valueHasMutated();
		}));
		
	self.selecteditem = ko.observable(null);
	
	self.maxSlotWidth = function() {
		return 100 / self.slots().length;
	};
	
    self.editSlot = function(slot) {
        self.selecteditem(slot);
    };
	
	self.addSlot = function() {
		var slot = new Slot(self.blankSlot().level(), self.blankSlot().maxSpellSlots(),
			0, self.slotColors.pop(), function() {
				self.slots.valueHasMutated();
			});
		self.slots.push(slot);
		self.blankSlot().level(self.slots().length + 1);
		self.blankSlot().maxSpellSlots('');
	};
	
	self.removeSlot = function(slot) {
		self.slotColors.push(slot.color());
		self.slots.remove(slot);
	};
	
	self.resetSlots = function() {
		$.map(self.slots(), function(slot, _) {
			slot.usedSpellSlots(0);
		});
	};
			
	self.exportValues = function() {
		var slots = [];
		for (var i in self.slots()) {
			var slot = self.slots()[i];
			slots.push(slot.exportValues());
		}
		return {
			slots: slots
		}
	};
	
	self.importValues = function(values) {
		var newSlots = []
		for (var i in values.slots) {
			var slot = values.slots[i];
			var newSlot = new Slot('', '', '' ,'' , function(){});
			newSlot.importValues(slot);
			self.slots.push(newSlot);
		}
	};
	
	self.clear = function() {
		self.slots([]);
	};
};

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
