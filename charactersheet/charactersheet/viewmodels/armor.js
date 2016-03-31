"use strict";

function ArmorViewModel() {
    var self = this;

    self.selecteditem = ko.observable();
    self.blankArmor = ko.observable(new Armor());
    self.armors = ko.observableArray([]);
    self.currencyDenominationList = ko.observableArray(Fixtures.general.currencyDenominationList);

    self.sorts = {
	  'armorName asc': { field: 'armorName', direction: 'asc'},
	  'armorName desc': { field: 'armorName', direction: 'desc'},
	  'armorType asc': { field: 'armorType', direction: 'asc'},
	  'armorType desc': { field: 'armorType', direction: 'desc'},
	  'armorDexBonus asc': { field: 'armorDexBonus', direction: 'asc'},
	  'armorDexBonus desc': { field: 'armorDexBonus', direction: 'desc'},
	  'armorCheckPenalty asc': { field: 'armorCheckPenalty', direction: 'asc'},
	  'armorCheckPenalty desc': { field: 'armorCheckPenalty', direction: 'desc'},
	  'armorProficiency asc': { field: 'armorProficiency', direction: 'asc', booleanType: true},
	  'armorProficiency desc': { field: 'armorProficiency', direction: 'desc', booleanType: true}
	};

    self.filter = ko.observable('');
    self.sort = ko.observable(self.sorts['armorName asc']);

	self.init = function() {

	};

	self.load = function() {
		var key = CharacterManager.activeCharacter().key();
		self.armors(Armor.findAllBy(key));
		Notifications.abilityScores.changed.add(self.valueHasChanged);
	};

	self.unload = function() {
 		$.each(self.armors(), function(_, e) {
			e.save();
		});
		Notifications.abilityScores.changed.remove(self.valueHasChanged);
	};
	/* UI Methods */

	/**
	 * Filters and sorts the armors for presentation in a table.
	 */
    self.filteredAndSortedArmors = ko.computed(function() {
        return SortService.sortAndFilter(self.armors(), self.sort(), null);
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

	//Manipulating armors
    self.addArmor = function() {
    	var armor = self.blankArmor();
    	armor.characterId(CharacterManager.activeCharacter().key());
    	armor.save();
        self.armors.push(armor);
        self.blankArmor(new Armor());
    };

    self.removeArmor = function(armor) {
    	self.armors.remove(armor)
    	armor.delete();
    };

    self.editArmor = function(armor) {
        self.selecteditem(armor);
    };

    self.clear = function() {
        self.armors([]);
    };

    self.valueHasChanged = function() {
    	self.armors().forEach(function(e, i, _) {
    		e.updateValues();
    	})    	
    };
};
