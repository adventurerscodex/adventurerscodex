"use strict";

function BackpackViewModel(parent) {
<<<<<<< HEAD
	var self = this;
	self.parent = parent;
	
	self.backpack = ko.observableArray([]);
	self.blankItem = ko.observable(new Item());
	self.selecteditem = ko.observable(new Item());
	
	//UI Methods
	
	self.equipItemButton = function() {
		self.removeItem(self.selecteditem())
		self.equipItem(self.selecteditem());
	};
	
	self.removeItemModalButton = function() {
		self.removeItem(self.selecteditem());
=======
	var self = this;	
	self.parent = parent;
	
	self.backpack = ko.observableArray([], {
		persist: getKey('backpack.backpack'),
		mapping: function(values){
			return (new Item(self.callback)).importValues(values);;
		}
	});
	self.callback = function() {self.backpack.valueHasMutated()};
		
	self.blankItem = ko.observable(new Item(self.callback));
	self.selecteditem = ko.observable();
	
	self.addItem = function() {
		self.backpack.push(self.blankItem());
		self.blankItem(new Item(self.callback));
	};
	
	self.equipItem = function(item) {
		self.backpack.remove(item);
		self.parent.equipmentViewModel().equippedItems.push(item);	
	};
	
	self.removeItem = function(item) {
		self.backpack.remove(item);
>>>>>>> 6bd930aca7b3474236eb4ffddc2cefbcd9803c98
	};
	
	self.removeItemButton = function(item) {
		self.removeItem(item);
	};
	
	self.addItemButton = function() {
		var item = new Item();
		item.importValues(self.blankItem().exportValues());
		self.backpack.push(item); 
		self.blankItem().clear();
	};
	
	self.editItemButton = function(item) {
		self.editItem(item);
	};
	
	//Public Methods
	
	self.addToBackpack = function(item) {
		self.addItem(item);
	};
	
	self.equipItem = function(item) {
		self.removeItem(item);
		self.parent.equipmentViewModel().equipItem(item);	
	};

	self.clear = function() {
		self.backpack([]);
	};
	
	self.exportValues = function() {
		var backpack = [];
		for (var i in self.backpack()) {
			var item = self.backpack()[i];
			backpack.push(item.exportValues());
		}
		return {
			backpack: backpack
		}
	};

	self.importValues = function(values) {
		var newItems = []
		for (var i in values.backpack) {
			var item = values.backpack[i];
<<<<<<< HEAD
			var newItem = new Item();
=======
			var newItem = new Item(new Item(self.callback));
>>>>>>> 6bd930aca7b3474236eb4ffddc2cefbcd9803c98
			newItem.importValues(item);
			self.addItem(newItem);
		}
	};
<<<<<<< HEAD
	
	//Private Methods	

	self.addItem = function(item) {
		self.backpack.push(item); 
	};

	self.removeItem = function(item) {
		self.backpack.remove(item);
	};
	
	self.editItem = function(item) {
		self.selecteditem(item);
	};
=======
>>>>>>> 6bd930aca7b3474236eb4ffddc2cefbcd9803c98
};
