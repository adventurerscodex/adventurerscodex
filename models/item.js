"use strict";

/**
 * Models an item in the user's backpack or something they
 * have equipped.
 */
function Item(callback) {
	var self = this;
	self.callback = callback;
	
	self.itemName = ko.observable('');
	self.itemName.subscribe(self.callback);
	
	self.itemType = ko.observable('');
	self.itemType.subscribe(self.callback);

	self.itemDesc = ko.observable('');
	self.itemDesc.subscribe(self.callback);

	self.itemBodyLocation = ko.observable('');
	self.itemBodyLocation.subscribe(self.callback);

	self.itemQty = ko.observable(0);
	self.itemQty.subscribe(self.callback);

	self.itemWeight = ko.observable(0);
	self.itemWeight.subscribe(self.callback);

	self.clear = function() {
		self.itemName('');
		self.itemDesc('');
		self.itemQty(0);
		self.itemWeight(0);
	};
	
	self.importValues = function(values) {
		self.itemName(values.itemName);
		self.itemDesc(values.itemDesc);
		self.itemQty(values.itemQty);
		self.itemWeight(values.itemWeight);
	};
	
	self.exportValues = function() {
		return {
			itemName: self.itemName(),
			itemDesc: self.itemDesc(),
			itemQty: self.itemQty(),
			itemWeight: self.itemWeight()
		}
	};
};

/**
 * Models the different types of items.
 */
function ItemTypes() {
	var self = this;
	
	self._types = [
		{ type: 'sword', classifications: ['combat', 'weapon', 'equippable'] },
		{ type: 'shield', classifications: ['combat', 'weapon', 'equippable'] },
		{ type: 'quarter staff', classifications: ['combat', 'weapon', 'equippable'] },
		
		{ type: 'plate armor', classifications: ['combat', 'armor', 'equippable'] }
	];
	
	/**
	 * Get all of the item types.
	 */
	self.allTypes = function() {
		return self._types;
	};
	
	/**
	 * Get all of the item types with a given classification.
	 * (i.e. get all 'equippable' types)
	 */
	self.allWithClassification = function(type) {
		return self._types.filter(function(t) {
			return (t.classifications.indexOf(type) > -1);
		});
	};
};
