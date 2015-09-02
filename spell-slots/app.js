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
		for (slot in this.slots()) {
			slots.push(slot.exportValues());
		}
		return {
			slots: slots
		}
	};
	
	this.importValues = function(values) {
		var newSlots = []
		for (slot in values.slots) {
			var newSlot = new Slot();
			newSlot.importValues(slot);
			this.slots.push(newSlot);
		}
	};
	
	this.clear = function() {
		this.slots([]);
	};
};

function Slot(level, maxSpellSlots, usedSpellSlots, callback) {
	this.level = ko.observable(level);
	this.level.subscribe(callback);
	
	this.maxSpellSlots = ko.observable(maxSpellSlots);
	this.maxSpellSlots.subscribe(callback);
	
	this.usedSpellSlots = ko.observable(usedSpellSlots);
	this.usedSpellSlots.subscribe(callback);
	
	this.spellSlots = ko.computed(function() {
		return (parseInt(this.maxSpellSlots()) - parseInt(this.usedSpellSlots()));
	}, this);
	
	this.totalSpellSlots = ko.computed(function() {
		return (parseInt(this.maxSpellSlots()));
	}, this);
	
	this.regularSpellSlotsRemaining = ko.computed(function() {
		return (parseInt(this.maxSpellSlots()) - (parseInt(this.usedSpellSlots())));
	}, this);
	
	//Convenience Methods
	
	this.levelHeader = ko.computed(function() {
		return 'Level: ' + this.level();
	}, this);
	
	//Progress bar methods.
	
	this.regularProgressWidth = ko.computed(function() {
		return (parseInt(this.regularSpellSlotsRemaining()) / parseInt(this.totalSpellSlots()) * 100) + '%';
	}, this);
		
	this.clear = function() {
		this.level(0)
		this.maxSpellSlots(0);
		this.usedSpellSlots(0);
	};
	
	this.importValues = function(values) {
		this.level(values.level);
		this.maxSpellSlots(values.maxSpellSlots);
		this.usedSpellSlots(values.usedSpellSlots);
	};
	
	this.exportValues = function() {
		return {
			level: this.level(),
			maxSpellSlots: this.maxSpellSlots(),
			usedSpellSlots: this.usedSpellSlots()
		}
	};
};
