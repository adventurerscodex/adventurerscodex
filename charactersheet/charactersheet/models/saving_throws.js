"use strict";

function SavingThrows() {
    var self = this;
    self.ps = PersistenceService.register(SavingThrows, self);

    self.name = ko.observable('');
    self.modifier = ko.observable(0);
    self.proficiency = ko.observable(false);
    
	self.modifierLabel = ko.computed(function() {
		var str = self.modifier() >= 0 ? '+' + self.modifier() : String(self.modifier());
		return str;
	});
	
	self.proficiencyLabel = ko.computed(function() {
		if (self.proficiency() === true) {
			return 'glyphicon glyphicon-ok';
		} 
		return '';
	});

	self.save = function() {
		self.ps.save();
	};

    self.clear = function() {
        self.name('');
        self.modifier(0);
        self.proficiency(false);
    };

    self.importValues = function(values) {
        self.name(values.name);
        self.modifier(values.modifier);
        self.proficiency(values.proficiency);
    };

    self.exportValues = function() {
        return {
			name: self.name(),
			modifier: self.modifier(),
			proficiency: self.proficiency(),
		}
    };
};

SavingThrows.findAll = function() {
	return PersistenceService.findAll(SavingThrows);
};
