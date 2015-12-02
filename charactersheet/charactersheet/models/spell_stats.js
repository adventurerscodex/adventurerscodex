"use strict";

function SpellStats() {
	var self = this;
  	self.ps = PersistenceService.register(SpellStats, self);

	self.characterId = ko.observable(null);
	self.spellcastingAbility = ko.observable('');
	self.spellSaveDc = ko.observable(0);
	self.spellAttackBonus = ko.observable(0);

	self.spellcastingAbilityOptions = ko.observableArray([
		'INT', 'WIS', 'CHA']);

	//Public Methods

	self.clear = function() {
		self.spellcastingAbility('');
		self.spellSaveDc(0);
		self.spellAttackBonus(0);
	};

	self.importValues = function(values) {
    	self.characterId(values.characterId);   	
		self.spellcastingAbility(values.spellcastingAbility);
		self.spellSaveDc(values.spellSaveDc);	
		self.spellAttackBonus(values.spellAttackBonus);
	};

	self.exportValues = function() {
		return {
        	characterId: self.characterId(),
			spellcastingAbility: self.spellcastingAbility(),
			spellSaveDc: self.spellSaveDc(),
			spellAttackBonus: self.spellAttackBonus(),	
		}
	};
	
	self.save = function() {
		self.ps.save();
	};
};

SpellStats.find = function() {
	return PersistenceService.findOne(SpellStats);
};
