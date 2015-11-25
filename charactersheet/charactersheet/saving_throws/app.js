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
    	
    };
    
    self.load = function() {
    	if (self.savingThrows().length === 0) {    	
    		self.savingThrows(self._defaultSavingThrows());
    	}
    
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
    self.addSkill = function() {
        self.savingThrows.push(self.blankSavingThrow());
        self.blankSavingThrow(new Skill());
    };

    self.removeSkill = function(skill) { 
    	self.savingThrows.remove(skill) 
    };

    self.editSkill = function(skill) {
        self.selecteditem(skill);
    };
    
    self.exportValues = function() {
        var savingThrows = [];
        for (var i in self.savingThrows()) {
            var skill = self.savingThrows()[i];
            savingThrows.push(skill.exportValues());
        }
        return {
            savingThrows: savingThrows
        }
    };

    self.importValues = function(values) {
        var newSavingThrows = []
        for (var i in values.savingThrows) {
            var skill = values.savingThrows[i];
            var newSkill = new Skill();
            newSkill.importValues(skill);
            self.savingThrows.push(newSkill);
        }
    };

    self.clear = function() {
        self.savingThrows([]);
    };
};
