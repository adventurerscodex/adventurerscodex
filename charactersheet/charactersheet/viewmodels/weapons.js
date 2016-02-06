"use strict";

function WeaponsViewModel() {
    var self = this;

    self.selecteditem = ko.observable();
    self.blankWeapon = ko.observable(new Weapon());
    self.weapons = ko.observableArray([]);

    self.sorts = {
	  'weaponName asc': { field: 'weaponName', direction: 'asc'},
	  'weaponName desc': { field: 'weaponName', direction: 'desc'},
	  'weaponDmg asc': { field: 'weaponDmg', direction: 'asc'},
	  'weaponDmg desc': { field: 'weaponDmg', direction: 'desc'},
	  'weaponType asc': { field: 'weaponType', direction: 'asc'},
	  'weaponType desc': { field: 'weaponType', direction: 'desc'},
	  'weaponRange asc': { field: 'weaponRange', direction: 'asc'},
	  'weaponRange desc': { field: 'weaponRange', direction: 'desc'},
	  'weaponDamageType asc': { field: 'weaponDamageType', direction: 'asc'},
	  'weaponDamageType desc': { field: 'weaponDamageType', direction: 'desc'},
	  'weaponProperty asc': { field: 'weaponProperty', direction: 'asc'},
	  'weaponProperty desc': { field: 'weaponProperty', direction: 'desc'}
	};

    self.filter = ko.observable('');	
    self.sort = ko.observable(self.sorts['weaponName asc']);

	self.init = function() {
	
	};
	
	self.load = function() {
		var key = CharacterManager.activeCharacter().key();
		self.weapons(Weapon.findAllBy(key));
	};
	
	self.unload = function() {
 		$.each(self.weapons(), function(_, e) {
			e.save();
		});
	};
	/* UI Methods */

	/**
	 * Filters and sorts the weaponss for presentation in a table.
	 */
    self.filteredAndSortedWeapons = ko.computed(function() {
    	var weapons = self.weapons();

    	if (self.filter() !== '') {

    	}

    	return weapons.sort(function(a, b) {
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

	//Manipulating weapons
    self.addWeapon = function() {
    	var weapon = self.blankWeapon();
    	weapon.characterId(CharacterManager.activeCharacter().key());
    	weapon.save();
        self.weapons.push(weapon);
        self.blankWeapon(new Weapon());
    };

    self.removeWeapon = function(weapon) { 
    	self.weapons.remove(weapon) 
    	weapon.delete();	
    };

    self.editWeapon = function(weapon) {
        self.selecteditem(weapon);
    };

    self.clear = function() {
        self.weapons([]);
    };
};