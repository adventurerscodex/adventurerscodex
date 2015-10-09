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
