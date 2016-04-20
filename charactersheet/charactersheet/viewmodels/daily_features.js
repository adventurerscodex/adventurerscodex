"use strict";

function DailyFeatureViewModel() {
	var self = this;

    self.sorts = {
	  'level asc': { field: 'level', direction: 'asc', numeric: true},
	  'level desc': { field: 'level', direction: 'desc', numeric: true},
	  'maxSpellSlots asc': { field: 'maxSpellSlots', direction: 'asc', numeric: true},
	  'maxSpellSlots desc': { field: 'maxSpellSlots', direction: 'desc', numeric: true},
	  'usedSpellSlots asc': { field: 'usedSpellSlots', direction: 'asc', numeric: true},
	  'usedSpellSlots desc': { field: 'usedSpellSlots', direction: 'desc', numeric: true}
	};

	self.dailyFeatures = ko.observableArray([]);
	self.blankDailyFeature = ko.observable(new DailyFeature());
	self.selecteditem = ko.observable(null);
	self.sort = ko.observable(self.sorts['level asc']);
	self.filter = ko.observable('');

	self.init = function() {};

	self.load = function() {
		var dailyFeatures = DailyFeature.findAllBy(CharacterManager.activeCharacter().key());
		self.dailyFeatures(dailyFeatures);
	};

	self.unload = function() {
 		self.dailyFeatures().forEach(function(e, i, _) {
			e.save();
		});
	};

	/* UI Methods */

	/**
	 * Filters and sorts the slots for presentation in a table.
	 */
    self.filteredAndSortedDailyFeatures = ko.computed(function() {
        return SortService.sortAndFilter(self.dailyFeatures(), self.sort(), null);
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

	//Manipulating spell slots
	self.maxBarWidth = function() {
		return 100 / self.dailyFeatures().length;
	};

  self.editDailyFeature = function(dailyFeature) {
      self.selecteditem(dailyFeature);
  };

	self.addDailyFeature = function() {
		var dailyFeature = self.blankDailyFeature();
		slot.characterId(CharacterManager.activeCharacter().key());
		slot.save();
		self.dailyFeatures.push(dailyFeature);

		self.blankDailyFeature(new DailyFeature());
	};

	self.removeDailyFeature = function(dailyFeature) {
		self.dailyFeatures.remove(dailyFeature);
		dailyFeature.delete();
	};

	// self.resetSlots = function() {
	// 	self.slots().forEach(function(slot, i, _) {
	// 		slot.usedSpellSlots(0);
	// 	});
	// };

	self.clear = function() {
		self.dailyFeatures([]);
	};
};
