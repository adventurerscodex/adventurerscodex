"use strict";

function SkillTree() {
    var self = this;
    self.selecteditem = ko.observable();
    self.blankSkill = ko.observable(new Skill());
    self.skills = ko.observableArray([]);

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
