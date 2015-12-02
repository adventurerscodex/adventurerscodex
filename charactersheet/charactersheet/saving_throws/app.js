"use strict";

function SavingThrowsViewModel() {
    var self = this;
    
    self.sorts = {
	  'name asc': { field: 'name', direction: 'asc'},
	  'name desc': { field: 'name', direction: 'desc'},
	  'modifier asc': { field: 'modifier', direction: 'asc'},
	  'modifier desc': { field: 'modifier', direction: 'desc'},
	  'proficiency asc': { field: 'proficiency', direction: 'asc'},
	  'proficiency desc': { field: 'proficiency', direction: 'desc'}
	};
	
	self._defaultSavingThrows = function() {
		var savingThrows = [
			{ name: 'Strength', proficency: false, modifier: 0 },
			{ name: 'Dexterity', proficency: false, modifier: 0 },
			{ name: 'Constitution', proficency: false, modifier: 0 },
			{ name: 'Intellegence', proficency: false, modifier: 0 },
			{ name: 'Wisdom', proficency: false, modifier: 0 },
			{ name: 'Charisma', proficency: false, modifier: 0 }
		];
		return $.map(savingThrows, function(e, _) {
			var savingThrow = new SavingThrows();
			savingThrow.importValues(e);
			return savingThrow;
		});
	};
		    
    self.selecteditem = ko.observable();
    self.blankSavingThrow = ko.observable(new SavingThrows());
    self.savingThrows = ko.observableArray([]);
    self.filter = ko.observable('');
    self.sort = ko.observable(self.sorts['name asc']);
    
    self.init = function() {
	    AbilityScoresSignaler.changed.add(function() {
	    	$.each(self.savingThrows(), function(_, e) {
	    		e.updateValues();
	    	})
	    });
	    StatsSignaler.changed.add(function() {
	    	$.each(self.savingThrows(), function(_, e) {
	    		e.updateValues();
	    	})
	    });
    };
    
    self.load = function() {
		var st = SavingThrows.findAllBy(CharacterManager.activeCharacter().key());
		if (st.length === 0) {
    		self.savingThrows(self._defaultSavingThrows());
		}
    	else {    	
			self.savingThrows(st);
    	}
    	self.savingThrows().forEach(function(e, i, _) {
    		e.characterId(CharacterManager.activeCharacter().key());
    	});
    };
    
    self.unload = function() {
		$.each(self.savingThrows(), function(_, e) {
			e.save();
		})
    };
    
	/* UI Methods */
	
	/**
	 * Filters and sorts the savingThrows for presentation in a table.
	 */
    self.filteredAndSortedSavingThrows = ko.computed(function() {
    	var savingThrows = self.savingThrows();
    	
    	if (self.filter() !== '') {
    		//savingThrows = savingThrows.filter(function(a) {});
    	}	

    	return savingThrows.sort(function(a, b) {
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

	//Manipulating savingThrows
    self.addsavingThrow = function() {
    	self.blankSavingThrow().save();
        self.savingThrows.push(self.blankSavingThrow());
        self.blankSavingThrow(new SavingThrows());
    };

    self.removeSavingThrow = function(savingThrow) { 
    	self.savingThrows.remove(savingThrow);
    	savingThrow.delete();
    };

    self.editSavingThrow = function(savingThrow) {
        self.selecteditem(savingThrow);
    };
    
    self.clear = function() {
        self.savingThrows([]);
    };
};
