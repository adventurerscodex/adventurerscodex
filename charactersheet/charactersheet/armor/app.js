"use strict";

function ArmorViewModel() {
    var self = this;

    self.selecteditem = ko.observable();
    self.blankArmor = ko.observable(new Armor());
    self.armors = ko.observableArray([]);

    self.sorts = {
	  'armorName asc': { field: 'armorName', direction: 'asc'},
	  'armorName desc': { field: 'armorName', direction: 'desc'},
	  'armorBonus asc': { field: 'armorBonus', direction: 'asc'},
	  'armorBonus desc': { field: 'armorBonus', direction: 'desc'},
	  'armorType asc': { field: 'armorType', direction: 'asc'},
	  'armorType desc': { field: 'armorType', direction: 'desc'},
	  'armorDexBonus asc': { field: 'armorDexBonus', direction: 'asc'},
	  'armorDexBonus desc': { field: 'armorDexBonus', direction: 'desc'},
	  'armorCheckPenalty asc': { field: 'armorCheckPenalty', direction: 'asc'},
	  'armorCheckPenalty desc': { field: 'armorCheckPenalty', direction: 'desc'},
	  'armorProficiency asc': { field: 'armorProficiency', direction: 'asc'},
	  'armorProficiency desc': { field: 'armorProficiency', direction: 'desc'}
	};

    self.filter = ko.observable('');	
    self.sort = ko.observable(self.sorts['armorName asc']);

	self.init = function() {
	
	};
	
	self.load = function() {
		var key = CharacterManager.activeCharacter().key();
		self.armors(Armor.findAllBy(key));
	};
	
	self.unload = function() {
 		$.each(self.armors(), function(_, e) {
			e.save();
		});
	};
	/* UI Methods */

	/**
	 * Filters and sorts the armors for presentation in a table.
	 */
    self.filteredAndSortedArmors = ko.computed(function() {
    	var armors = self.armors();

    	if (self.filter() !== '') {

    	}

    	return armors.sort(function(a, b) {
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
};