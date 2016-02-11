"use strict";

function SpellbookViewModel() {
    var self = this;

    self.sorts = {
	  'spellName asc': { field: 'spellName', direction: 'asc'},
	  'spellName desc': { field: 'spellName', direction: 'desc'},
      'spellPrepared asc': { field: 'spellPrepared', direction: 'asc'},
      'spellPrepared desc': { field: 'spellPrepared', direction: 'desc'},
	  'spellType asc': { field: 'spellType', direction: 'asc'},
	  'spellType desc': { field: 'spellType', direction: 'desc'},
	  'spellDmg asc': { field: 'spellDmg', direction: 'asc'},
	  'spellDmg desc': { field: 'spellDmg', direction: 'desc'},
	  'spellLevel asc': { field: 'spellLevel', direction: 'asc', numeric: true},
	  'spellLevel desc': { field: 'spellLevel', direction: 'desc', numeric: true},
	  'spellCastingTime asc': { field: 'spellCastingTime', direction: 'asc'},
	  'spellCastingTime desc': { field: 'spellCastingTime', direction: 'desc'},
	  'spellRange asc': { field: 'spellRange', direction: 'asc'},
	  'spellRange desc': { field: 'spellRange', direction: 'desc'}
	};

    self.selecteditem = ko.observable();
    self.blankSpell = ko.observable(new Spell());
    self.spellbook = ko.observableArray([]);

    self.filter = ko.observable('');
    self.sort = ko.observable(self.sorts['spellName asc']);

    self.numberOfPrepared = ko.computed(function(){
        var prepared = ko.utils.arrayFilter(self.spellbook(), function(spell) {
            return spell.spellPrepared() === true;
        });

        return prepared.length;
    });

	self.init = function() {

	};

	self.load = function() {
		var key = CharacterManager.activeCharacter().key();
		self.spellbook(Spell.findAllBy(key));
	};

	self.unload = function() {
 		$.each(self.spellbook(), function(_, e) {
			e.save();
		});
	};

	/* UI Methods */

	/**
	 * Filters and sorts the spells for presentation in a table.
	 */
    self.filteredAndSortedSpells = ko.computed(function() {
    	var spells = self.spellbook();

    	if (self.filter() !== '') {

    	}

    	return spells.sort(function(a, b) {
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

	//Manipulating spells
    self.addSpell = function() {
    	var spell = self.blankSpell();
    	spell.characterId(CharacterManager.activeCharacter().key());
    	spell.save();
        self.spellbook.push(spell);
        self.blankSpell(new Spell());
    };

    self.removeSpell = function(spell) {
    	self.spellbook.remove(spell)
    	spell.delete();
    };

    self.editSpell = function(spell) {
        self.selecteditem(spell);
    };

    self.clear = function() {
        self.spellbook([]);
    };
};

