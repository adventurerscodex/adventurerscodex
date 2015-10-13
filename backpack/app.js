"use strict";

function BackpackViewModel(parent) {
	var self = this;
	
	self.backpack = ko.observableArray([]);
	self.blankItem = ko.observable(new Item());
	
	//UI Methods
	
	self.equipItemButtonWasClicked = function() {
		self._removeItem(self.selecteditem)
		self.equipItem(self.selecteditem());
	};
	
	self.removeItemModalButtonWasClicked = function() {
		self._removeItem(self.selecteditem());
	};
	
	self.removeItemButtonWasClicked = function(item) {
		self._removeItem(item);
	};
	
	self.addItemButtonWasClicked = function() {
		self._addItem(self.blankItem());
		self.blankItem(new Item(self.callback));
	};
	
	self.editItemButtonWasClicked = function(item) {
		self._editItem(item);
	};
	
	//Public Methods
	
	self.addToBackpack = function(item) {
		var newItem = new Item(self.callback);
		newItem.importValues(item.exportValues());
		self._addItem(newItem);
	};
	
	self.equipItem = function(item) {
		self._removeItem(item);
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

	self._addItem = function(item) {
		self.backpack.push(item); 
	};

	self._removeItem = function(item) {
		self.backpack.remove(item);
	};
	
	self._editItem = function(item) {
		self.selecteditem(item);
	};
};
