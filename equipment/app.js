"use strict";

/**
 * The current items that a user has equipped.
 */
function EquipmentViewModel(parent) {
	var self = this;
	self.parent = parent;
	
	self.equippedItems = ko.observableArray([], {
		persist: getKey('equippedItems.equippedItems'),
		mapping: function(values){
			return (new Item(self.callback)).importValues(values);;
		}
	});
	self.callback = function() {self.equippedItems.valueHasMutated()};
	
	self.blankItem = ko.observable(new Item(self.callback));
	self.selecteditem = ko.observable();
	
	self.addItem = function() {
		self.equippedItems.push(self.blankItem());
		self.blankItem(new Item(self.callback));
	};
	
	self.moveToBackpack = function(item) {
		self.removeItem(item);
		self.parent.backpackViewModel().backpack.push(item);
	};
	
	self.removeItem = function(item) {
		self.equippedItems.remove(item);
	};
	
	self.editItem = function(item) {
		self.selecteditem(item);
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
			var newItem = new Item(self.callback)
			newItem.importValues(item);
			self.equippedItems.push(newItem);
		}
	};
};
