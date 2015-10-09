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
