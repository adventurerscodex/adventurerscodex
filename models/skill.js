"use strict";

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
