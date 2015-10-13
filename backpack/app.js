"use strict";

function BackpackViewModel(parent) {
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
			var newItem = new Item();
			newItem.importValues(item);
			self.addItem(newItem);
		}
	};
	
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
};
