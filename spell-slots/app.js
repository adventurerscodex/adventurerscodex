"use strict";

function SpellSlots() {
	var self = this;

	this.slots = ko.observableArray([], { 
		persist: 'spellslots.slots', 
		mapping: function(values){
			return new Slot(values.level, values.maxSpellSlots, values.usedSpellSlots, function() {
				self.slots.valueHasMutated();
			});
		}
	});
	
	this.addSlot = function() {
		this.slots.push(new Slot(0, 0, 0, function() {
			self.slots.valueHasMutated();
		}));
	};
	
	this.removeSlot = function(slot) {
		self.slots.remove(slot);
	};
			
	this.exportValues = function() {
		var slots = [];
		for (var i in self.slots()) {
			var slot = self.slots()[i];
			slots.push(slot.exportValues());
		}
		return {
			slots: slots
		}
	};
	
	this.importValues = function(values) {
		var newSlots = []
		for (var i in values.slots) {
			var slot = values.slots[i];
			var newSlot = new Slot(0, 0, 0, function(){});
			newSlot.importValues(slot);
			self.slots.push(newSlot);
		}
	};
	
	this.clear = function() {
		self.slots([]);
	};
};

function Slot(level, maxSpellSlots, usedSpellSlots, callback) {
	var self = this;
	
	this.level = ko.observable(level);
	this.level.subscribe(callback);
	
	this.maxSpellSlots = ko.observable(maxSpellSlots);
	this.maxSpellSlots.subscribe(callback);
	
	this.usedSpellSlots = ko.observable(usedSpellSlots);
	this.usedSpellSlots.subscribe(callback);
	
	this.spellSlots = ko.computed(function() {
		return (parseInt(self.maxSpellSlots()) - parseInt(self.usedSpellSlots()));
	}, this);
		
	//Convenience Methods
	
	this.levelHeader = ko.computed(function() {
		return 'Level: ' + self.level();
	}, this);
	
	//Progress bar methods.
	
	this.regularProgressWidth = ko.computed(function() {
		return (parseInt(self.spellSlots()) / parseInt(self.maxSpellSlots()) * 100) + '%';
	}, this);
		
	this.clear = function() {
		self.level(0);
		self.maxSpellSlots(0);
		self.usedSpellSlots(0);
	};
	
	this.importValues = function(values) {
		self.level(values.level);
		self.maxSpellSlots(values.maxSpellSlots);
		self.usedSpellSlots(values.usedSpellSlots);
	};
	
	this.exportValues = function() {
		return {
			level: self.level(),
			maxSpellSlots: self.maxSpellSlots(),
			usedSpellSlots: self.usedSpellSlots()
		}
	};
};
