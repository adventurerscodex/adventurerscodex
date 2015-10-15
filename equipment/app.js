"use strict";

/**
 * The current items that a user has equipped.
 */
function EquipmentViewModel(parent) {
	var self = this;
	self.parent = parent;
	
    self.sorts = {
	  'itemName asc': { field: 'itemName', direction: 'asc'},
	  'itemName desc': { field: 'itemName', direction: 'desc'},
	  'itemIsEquippable asc': { field: 'itemIsEquippable', direction: 'asc'},
	  'itemIsEquippable desc': { field: 'itemIsEquippable', direction: 'desc'},
	  'itemQty asc': { field: 'itemQty', direction: 'asc', numeric: true},
	  'itemQty desc': { field: 'itemQty', direction: 'desc', numeric: true},
	  'itemWeight asc': { field: 'itemWeight', direction: 'asc', numeric: true},
	  'itemWeight desc': { field: 'itemWeight', direction: 'desc', numeric: true},
	  'itemCost asc': { field: 'itemCost', direction: 'asc', numeric: true},
	  'itemCost desc': { field: 'itemCost', direction: 'desc', numeric: true},
	  'itemBodyLocation asc': { field: 'itemBodyLocation', direction: 'asc'},
	  'itemBodyLocation desc': { field: 'itemBodyLocation', direction: 'desc'}
	};

	self.equippedItems = ko.observableArray([]);
	self.blankItem = ko.observable(new Item());
	self.selecteditem = ko.observable();
	self.sort = ko.observable(self.sorts['itemName asc']);
	self.filter = ko.observable('');
	
	/* UI Methods */
	
	/**
	 * Filters and sorts the items for presentation in a table.
	 */
    self.filteredAndSortedEquippedItems = ko.computed(function() {
    	var equippedItems = self.equippedItems();
    	
    	if (self.filter() !== '') {
    		//items = items.filter(function(a) {});
    	}	
    	
    	return equippedItems.sort(function(a, b) {
    		var asc = self.sort().direction === 'asc' ? true : false;
    		var res = null;
    		
    		var aprop = a[self.sort().field]();
    		var bprop = b[self.sort().field]();
    		
    		if (self.sort().numeric) {
				aprop = parseInt(a[self.sort().field]());
				bprop = parseInt(b[self.sort().field]());
    		}
    		
    		if (asc) {
	    		res = aprop > bprop ? 1 : -1;
    		} else {
	    		res = aprop < bprop ? 1 : -1;
    		}
    		return res;
    	});
    });
    
    /**
     * Determines whether a column should have an up/down/no arrow for sorting.
     */
    self.sortArrow = function(columnName) {
    	var sort = self.sort();
    	var arrow = '';
    	if (columnName === sort.field) {
			if (sort.direction === 'asc') {
				arrow = 'glyphicon glyphicon-arrow-up';
			} else {
				arrow = 'glyphicon glyphicon-arrow-down';
			}
    	}
    	return arrow;
    };

	/**
	 * Given a column name, determine the current sort type & order.
	 */
	self.sortBy = function(columnName) {
		var sort = null
		if (self.sort().field === columnName && self.sort().direction === 'asc') {
			sort = self.sorts[columnName+' desc'];
		} else {
			sort = self.sorts[columnName+' asc'];
		}	
		self.sort(sort);
	};

	//Manipulating items	
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
