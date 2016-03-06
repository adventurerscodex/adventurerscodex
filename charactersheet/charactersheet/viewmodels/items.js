"use strict";

function ItemsViewModel() {
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

	self.items = ko.observableArray([]);
	self.blankItem = ko.observable(new Item());
	self.selecteditem = ko.observable(new Item());
	self.currencyDenominationList = ko.observableArray([
		'PP', 'GP', 'SP', 'EP', 'CP']);
	self.sort = ko.observable(self.sorts['itemName asc']);
	self.filter = ko.observable('');

	self.totalItemWeight = ko.pureComputed(function() {
		var weightTotal = 0;
		var eqpLen = self.items().length;
		if( eqpLen > 0 ){
			for(var i = 0; i < eqpLen; i++){
				weightTotal += self.items()[i].itemWeight() ? parseInt(self.items()[i].itemWeight()) : 0;
			}
			return ("Weight: " + weightTotal + " (lbs)");
		}
		else{
			return "Weight";
		}
	});

	//Responders

	self.init = function() {
		//Do something.
	};

	self.load = function() {
		var key = CharacterManager.activeCharacter().key();
		self.items(Item.findAllBy(key));
	};

	self.unload = function() {
		$.each(self.items(), function(_, e) {
			e.save();
		});
	};


	/* UI Methods */

	/**
	 * Filters and sorts the items for presentation in a table.
	 */
    self.filteredAndSortedEquipment = ko.computed(function() {
        return SortService.sortAndFilter(self.items(), self.sort(), null);
    });

    /**
     * Determines whether a column should have an up/down/no arrow for sorting.
     */
    self.sortArrow = function(columnName) {
        return SortService.sortArrow(columnName, self.sort());
    };

	/**
	 * Given a column name, determine the current sort type & order.
	 */
	self.sortBy = function(columnName) {
		self.sort(SortService.sortForName(self.sort(),
		    columnName, self.sorts));
	};

	//Manipulating items
	self.removeItemModalButton = function() {
		self.removeItem(self.selecteditem());
	};

	self.removeItemButton = function(item) {
		self.removeItem(item);
	};

	self.addItemButton = function() {
		var item = new Item();
		item.importValues(self.blankItem().exportValues());
		self.addItem(item);
		self.blankItem().clear();
	};

	self.editItemButton = function(item) {
		self.editItem(item);
	};

	//Public Methods

	self.addToItems = function(item) {
		self.addItem(item);
	};

	self.clear = function() {
		self.items([]);
	};

	//Private Methods

	self.addItem = function(item) {
		self.items.push(item);
		item.characterId(CharacterManager.activeCharacter().key());
		item.save();
	};

	self.removeItem = function(item) {
		self.items.remove(item);
		item.delete();
	};

	self.editItem = function(item) {
		self.selecteditem(item);
	};
};
