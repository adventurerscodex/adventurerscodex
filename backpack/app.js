function Backpack() {
	var self = this;
	
	self.backpack = ko.observableArray([]);
	self.blankItem = ko.observable(new Item());
	self.selecteditem = ko.observable();
	
	self.addItem = function() {
		self.backpack.push(self.blankItem());
		self.blankItem(new Item());
	};
	this.removeItem = function(item) {
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
			var newItem = new Item();
			newItem.importValues(item);
			self.backpack.push(newItem);
		}
	};
};
//TODO: Add units and make numbers.
function Item(name, desc, qty, weight, callback) {
	var self = this;
	self.itemName = ko.observable(name);
	self.itemName.subscribe(callback);

	self.itemDesc = ko.observable(desc);
	self.itemDesc.subscribe(callback);

	self.itemQty = ko.observable(qty);
	self.itemQty.subscribe(callback);

	self.itemWeight = ko.observable(weight);
	self.itemWeight.subscribe(callback);

	this.clear = function() {
		self.itemName('');
		self.itemDesc('');
		self.itemQty('');
		self.itemWeight('');
	};
	
	this.importValues = function(values) {
		self.itemName(values.itemName);
		self.itemDesc(values.itemDesc);
		self.itemQty(values.itemQty);
		self.itemWeight(values.itemWeight);
	};
	
	this.exportValues = function() {
		return {
			itemName: self.itemName(),
			itemDesc: self.itemDesc(),
			itemQty: self.itemQty(),
			itemWeight: self.itemWeight()
		}
	};
};
