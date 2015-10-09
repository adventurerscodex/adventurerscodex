"use strict";

function BackpackViewModel(parent) {
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
	};
	
	self.editItem = function(item) {
		self.selecteditem(item);
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
			var newItem = new Item(new Item(self.callback));
			newItem.importValues(item);
			self.backpack.push(newItem);
		}
	};
};
