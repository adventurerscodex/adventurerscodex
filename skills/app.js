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
