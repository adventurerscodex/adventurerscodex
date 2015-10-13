"use strict";

/**
 * The current items that a user has equipped.
 */
function EquipmentViewModel(parent) {
	var self = this;
	self.parent = parent;
	
	self.equippedItems = ko.observableArray([]);
	self.blankItem = ko.observable(new Item());
	self.selecteditem = ko.observable();
	
	//UI Methods
	
	self.moveToBackpackButtonWasClicked = function() {
		self.moveToBackpack(self.selectedItem());
	};
	
	//Public Methods

	self.equipItem = function(item) {
		self.equippedItems.push(item);
	};
	
	self.moveToBackpack = function(item) {
		self.removeItem(item);
		self.parent.backpackViewModel().addToBackpack(item);
	};
	
	self.clear = function() {
		self.equippedItems([]);
	};
	
	self.exportValues = function() {
		var equippedItems = [];
		for (var i in self.equippedItems()) {
			var item = self.equippedItems()[i];
			equippedItems.push(item.exportValues());
		}
		return {
			equippedItems: equippedItems
		}
	};

	self.importValues = function(values) {
		var newItems = []
		for (var i in values.equippedItems) {
			var item = values.equippedItems[i];
			var newItem = new Item()
			newItem.importValues(item);
			self.addItem(newItem);
		}
	};

	//Private Methods
	
	self.addItem = function(item) {
		self.equippedItems.push(item)
	};
	
	self.removeItem = function(item) {
		self.equippedItems.remove(item);
	};
	
	self.editItem = function(item) {
		self.selecteditem(item);
	};

};
