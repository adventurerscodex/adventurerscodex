"use strict";

function Skill() {
    var self = this;

    self.name = ko.observable('');
    self.bonus = ko.observable(0);
    self.proficiency = ko.observable(false);

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
