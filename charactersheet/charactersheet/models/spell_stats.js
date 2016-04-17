"use strict";

function SpellStats() {
	var self = this;
  	self.ps = PersistenceService.register(SpellStats, self);
	self.mapping = {
	    ignore: ['clear', 'ps', 'importValues', 'exportValues', 'save']
    };

	self.characterId = ko.observable(null);
	self.spellcastingAbility = ko.observable('');
	self.spellSaveDc = ko.observable(0);
	self.spellAttackBonus = ko.observable(0);

	self.spellcastingAbilityOptions = ko.observableArray(
		Fixtures.spellStats.spellcastingAbilityOptions);

	//Public Methods

	self.clear = function() {
        var values = new SpellStats().exportValues();
        ko.mapping.fromJS(values, self.mapping, self);
    };

    self.importValues = function(values) {
        ko.mapping.fromJS(values, self.mapping, self);
    };

    self.exportValues = function() {
        return ko.mapping.toJS(self, self.mapping);
    };

	self.save = function() {
		self.ps.save();
	};
};

SpellStats.findBy = function(characterId) {
	return PersistenceService.findAll(SpellStats).filter(function(e, i, _) {
		return e.characterId() === characterId;
	});
};
