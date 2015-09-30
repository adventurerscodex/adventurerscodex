"use strict";

function SkillTree() {
    var self = this;
    self.selecteditem = ko.observable();
    self.blankSkill = ko.observable(new Skill('', 0, false, function(){}));
    self.skills = ko.observableArray([], {
        persist: getKey('skilltree.skills'),
        mapping: function(values){
            return new Skill(values.name, values.bonus, values.proficiency, 
            	function() {
            		self.skills.valueHasMutated();
            	});
        }
    });

    self.addSkill = function() {
        self.skills.push(self.blankSkill());
        self.blankSkill(new Skill('', 0, false, function() {
                self.skills.valueHasMutated();
            }));
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
            var newSkill = new Skill('', 0, false, function(){});
            newSkill.importValues(skill);
            self.skills.push(newSkill);
        }
    };

    self.clear = function() {
        self.skills([]);
    };
};

function Skill(name, bonus, proficiency, callback) {
    var self = this;

    self.name = ko.observable(name);
    self.name.subscribe(callback);

    self.bonus = ko.observable(bonus);
    self.bonus.subscribe(callback);

    self.proficiency = ko.observable(proficiency);
    self.proficiency.subscribe(callback);

	self.bonusLabel = ko.computed(function() {
		if (self.bonus() >= 0) {
			return '+' + self.bonus();
		} 
		return String(self.bonus());
	});
	
	self.proficiencyLabel = ko.computed(function() {
		if (self.proficiency() === true) {
			return 'glyphicon glyphicon-ok';
		} 
		return '';
	});


    self.clear = function() {
        self.name('');
        self.bonus(0);
        self.proficiency(false);
    };

    self.importValues = function(values) {
        self.name(values.name);
        self.bonus(values.bonus);
        self.proficiency(values.proficiency);
    };

    self.exportValues = function() {
        return {
			name: self.name(),
			bonus: self.bonus(),
			proficiency: self.proficiency(),
		}
    };
};
