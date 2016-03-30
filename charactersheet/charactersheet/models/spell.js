"use strict";

function Spell() {
    var self = this;
	self.ps = PersistenceService.register(Spell, self);

	self.characterId = ko.observable(null);
    self.spellName = ko.observable('');
    self.spellPrepared = ko.observable(false);
    self.spellType = ko.observable('');
    self.spellSaveAttr = ko.observable('');
    self.spellDmg = ko.observable('');
    self.spellSchool = ko.observable('');
    self.spellLevel = ko.observable(1);
    self.spellDescription = ko.observable('');
    self.spellCastingTime = ko.observable('');
    self.spellRange = ko.observable('');
    self.spellComponents = ko.observable('');
    self.spellDuration = ko.observable('');
    self.spellTypeOptions = ko.observableArray(Fixtures.spell.spellTypeOptions);
    self.spellSaveAttrOptions = ko.observableArray(Fixtures.spell.spellSaveAttrOptions);
    self.spellSchoolOptions = ko.observableArray(Fixtures.spell.spellSchoolOptions);
    self.spellCastingTimeOptions = ko.observableArray(Fixtures.spell.spellCastingTimeOptions);
    self.spellDurationOptions = ko.observableArray(Fixtures.spell.spellDurationOptions);
    self.spellComponentsOptions = ko.observableArray(Fixtures.spell.spellComponentsOptions);
    self.spellRangeOptions = ko.observableArray(Fixtures.spell.spellRangeOptions);

	self.spellDamageLabel = ko.pureComputed(function() {
		var charKey = CharacterManager.activeCharacter().key();
		var spellBonus = SpellStats.findBy(charKey)[0].spellAttackBonus();
		if( self.spellType() === 'Attack' && spellBonus ){
			return (self.spellDmg() + ' [Spell Bonus: +' + spellBonus + ']');
		}
		else{
			return self.spellDmg();
		}
	});

    self.clear = function() {
        self.spellName('');
        self.spellPrepared = ko.observable(false);
        self.spellType('');
        self.spellSaveAttr('');
        self.spellDmg('');
        self.spellSchool('');
        self.spellLevel('');
        self.spellDescription('');
        self.spellCastingTime('');
        self.spellRange('');
        self.spellComponents('');
        self.spellDuration('');
    };

    self.importValues = function(values) {
    	self.characterId(values.characterId);
        self.spellName(values.spellName);
        self.spellPrepared(values.spellPrepared);
        self.spellType(values.spellType);
        self.spellSaveAttr(values.spellSaveAttr);
        self.spellDmg(values.spellDmg);
        self.spellSchool(values.spellSchool);
        self.spellLevel(values.spellLevel);
        self.spellDescription(values.spellDescription);
        self.spellCastingTime(values.spellCastingTime);
        self.spellRange(values.spellRange);
        self.spellComponents(values.spellComponents);
        self.spellDuration(values.spellDuration);
    };

    self.exportValues = function() {
        return {
        	characterId: self.characterId(),
			spellName: self.spellName(),
            spellPrepared: self.spellPrepared(),
			spellType: self.spellType(),
            spellSaveAttr: self.spellSaveAttr(),
			spellDmg: self.spellDmg(),
			spellSchool: self.spellSchool(),
			spellLevel: self.spellLevel(),
			spellDescription: self.spellDescription(),
			spellCastingTime: self.spellCastingTime(),
			spellRange: self.spellRange(),
			spellComponents: self.spellComponents(),
			spellDuration: self.spellDuration()
        }
    };

    self.save = function() {
    	self.ps.save();
    };

    self.delete = function() {
    	self.ps.delete();
    };
};

Spell.findAllBy =function(characterId) {
	return PersistenceService.findAll(Spell).filter(function(e, i, _) {
		return e.characterId() === characterId;
	});
};
