"use strict";

/**
 * Models an item in the user's backpack or something they
 * have equipped.
 */
function Item() {
	var self = this;
	self.itemName = ko.observable('');	
	self.itemType = ko.observable('');
	self.itemDesc = ko.observable('');
	self.itemQty = ko.observable(0);
	self.itemWeight = ko.observable(0);
	
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
	
	self.exportValues = function() {
		return {
			itemName: self.itemName(),
			itemDesc: self.itemDesc(),
			itemQty: self.itemQty(),
			itemWeight: self.itemWeight()
		}
	};
};
