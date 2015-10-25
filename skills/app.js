"use strict";

function SkillTree() {
    var self = this;
    
    self.sorts = {
	  'name asc': { field: 'name', direction: 'asc'},
	  'name desc': { field: 'name', direction: 'desc'},
	  'modifier asc': { field: 'modifier', direction: 'asc'},
	  'modifier desc': { field: 'modifier', direction: 'desc'},
	  'proficiency asc': { field: 'proficiency', direction: 'asc'},
	  'proficiency desc': { field: 'proficiency', direction: 'desc'}
	};
	    
    self.selecteditem = ko.observable();
    self.blankSkill = ko.observable(new Skill());
    self.skills = ko.observableArray([]);
    self.filter = ko.observable('');
    self.sort = ko.observable(self.sorts['name asc']);
    
	/* UI Methods */
	
	/**
	 * Filters and sorts the skills for presentation in a table.
	 */
    self.filteredAndSortedSkills = ko.computed(function() {
    	var skills = self.skills();
    	
    	if (self.filter() !== '') {
    		//skills = skills.filter(function(a) {});
    	}	

    	return skills.sort(function(a, b) {
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

	//Manipulating skills
    self.addSkill = function() {
        self.skills.push(self.blankSkill());
        self.blankSkill(new Skill());
    };

    self.removeSkill = function(skill) { 
    	self.skills.remove(skill) 
    };

    self.editSkill = function(skill) {
        self.selecteditem(skill);
    };
    
    self.exportValues = function() {
        var skills = [];
        for (var i in self.skills()) {
            var skill = self.skills()[i];
            skills.push(skill.exportValues());
        }
        return {
            skills: skills
        }
    };

    self.importValues = function(values) {
        var newSkills = []
        for (var i in values.skills) {
            var skill = values.skills[i];
            var newSkill = new Skill();
            newSkill.importValues(skill);
            self.skills.push(newSkill);
        }
    };

    self.clear = function() {
        self.skills([]);
    };
};
