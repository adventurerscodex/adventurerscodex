"use strict";

function EquipmentViewModel() {
	var self = this;
	
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

	self.equipment = ko.observableArray([]);
	self.blankItem = ko.observable(new Item());
	self.selecteditem = ko.observable(new Item());
	self.sort = ko.observable(self.sorts['itemName asc']);
	self.filter = ko.observable('');
	
	//Responders
	
	self.init = function() {
		//Do something.
	};
	
	self.load = function() {
		self.equipment(Item.findAll());
	};
	
	self.unload = function() {
		$.each(self.equipment(), function(_, e) {
			e.save();
		});
	};
	
	
	/* UI Methods */
	
	/**
	 * Filters and sorts the items for presentation in a table.
	 */
    self.filteredAndSortedEquipment = ko.computed(function() {
    	var equipment = self.equipment();
    	
    	if (self.filter() !== '') {
    		//items = items.filter(function(a) {});
    	}	
    	
    	return equipment.sort(function(a, b) {
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
	self.equipItemButton = function() {
		self.removeItem(self.selecteditem())
		self.equipItem(self.selecteditem());
	};

	self.equipItemRowButton = function(item) {
		self.removeItem(item)
		self.equipItem(item);
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
		self.equipment.push(item); 
		self.blankItem().clear();
	};
	
	self.editItemButton = function(item) {
		self.editItem(item);
	};
	
	//Public Methods
	
	self.addToEquipment = function(item) {
		self.addItem(item);
	};
	
	self.equipItem = function(item) {
		self.removeItem(item);
		self.parent.equippedItemsViewModel().equipItem(item);	
	};

	self.clear = function() {
		self.equipment([]);
	};
		
	//Private Methods	

	self.addItem = function(item) {
		self.equipment.push(item); 
		item.save();
	};

	self.removeItem = function(item) {
		self.equipment.remove(item);
		item.delete();
	};
	
	self.editItem = function(item) {
		self.selecteditem(item);
	};
};
