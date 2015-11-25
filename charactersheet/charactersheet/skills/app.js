"use strict";

function SkillsViewModel() {
    var self = this;
    
    self.sorts = {
	  'name asc': { field: 'name', direction: 'asc'},
	  'name desc': { field: 'name', direction: 'desc'},
	  'modifier asc': { field: 'modifier', direction: 'asc'},
	  'modifier desc': { field: 'modifier', direction: 'desc'},
	  'proficiency asc': { field: 'proficiency', direction: 'asc'},
	  'proficiency desc': { field: 'proficiency', direction: 'desc'}
	};
	
	self._defaultSkills = function() {
		var skills = [
			{ name: 'Acrobatics', abilityScore: 'Dex', proficency: false, modifier: 0 },
			{ name: 'Animal Handling', abilityScore: 'Wis', proficency: false, modifier: 0 },
			{ name: 'Arcana', abilityScore: 'Int', proficency: false, modifier: 0 },
			{ name: 'Athletics', abilityScore: 'Str', proficency: false, modifier: 0 },
			{ name: 'Deception', abilityScore: 'Cha', proficency: false, modifier: 0 },
			{ name: 'History', abilityScore: 'Int', proficency: false, modifier: 0 },
			{ name: 'Insight', abilityScore: 'Wis', proficency: false, modifier: 0 },
			{ name: 'Intimidation', abilityScore: 'Cha', proficency: false, modifier: 0 },
			{ name: 'Investigation', abilityScore: 'Int', proficency: false, modifier: 0 },
			{ name: 'Medicine', abilityScore: 'Wis', proficency: false, modifier: 0 },
			{ name: 'Nature', abilityScore: 'Int', proficency: false, modifier: 0 },
			{ name: 'Perception', abilityScore: 'Wis', proficency: false, modifier: 0 },
			{ name: 'Performance', abilityScore: 'Cha', proficency: false, modifier: 0 },
			{ name: 'Persuasion', abilityScore: 'Cha', proficency: false, modifier: 0 },
			{ name: 'Religion', abilityScore: 'Int', proficency: false, modifier: 0 },
			{ name: 'Sleight of Hand', abilityScore: 'Dex', proficency: false, modifier: 0 },
			{ name: 'Stealth', abilityScore: 'Dex', proficency: false, modifier: 0 },
			{ name: 'Survival', abilityScore: 'Dex', proficency: false, modifier: 0 },
		];
		return $.map(skills, function(e, _) {
			var skill = new Skill(self);
			skill.importValues(e);
			return skill;
		});
	};
		    
    self.selecteditem = ko.observable();
    self.blankSkill = ko.observable(new Skill(self));
    self.skills = ko.observableArray([]);
    self.filter = ko.observable('');
    self.sort = ko.observable(self.sorts['name asc']);
    
    self.init = function() {
    	//Do something.
    };
    
    self.load = function() {
    	var skills = Skill.findAll();
    
    	if (skills.length === 0) {    	
    		self.skills(self._defaultSkills());
    	} else {
    		self.skills(skills);
    	}
    };
    
    self.unload = function() {
    	$.each(self.skills(), function(_, e) {
    		e.save();
    	});
    };
    
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
        self.blankSkill(new Skill(self));
    };

    self.removeSkill = function(skill) { 
    	self.skills.remove(skill) 
    };

    self.editSkill = function(skill) {
        self.selecteditem(skill);
    };
    
    self.clear = function() {
        self.skills([]);
    };
};
