"use strict";

function Spell() {
    var self = this;
	self.ps = PersistenceService.register(Spell, self);

	self.characterId = ko.observable(null);
    self.spellName = ko.observable('');
    self.spellType = ko.observable('');
    self.spellDmg = ko.observable('');
    self.spellSchool = ko.observable('');
    self.spellLevel = ko.observable(1);
    self.spellDescription = ko.observable('');
    self.spellCastingTime = ko.observable('');
    self.spellRange = ko.observable('');
    self.spellComponents = ko.observable('');
    self.spellDuration = ko.observable('');
    self.spellTypeOptions = ko.observableArray(
        ['Attack', 'Savings Throw', 'Automatic']);
    self.spellSchoolOptions = ko.observableArray([
        'Abjuration', 'Cantrip', 'Conjuration',
        'Divination', 'Enchantment', 'Evocation',
        'Illusion', 'Necromancy', 'Transmutation']);
    self.spellCastingTimeOptions = ko.observableArray([
        '1 action', '1 bonus action', '1 minute',
        '10 minutes', '1 hour']);
    self.spellDurationOptions = ko.observableArray([
        'Instantaneous', '1 round', '8 hours',
        '24 hours', '10 days', 'Concentration, 1 min',
        'Concentration, 10 min', 'Concentration, 1 hour',
        'Concentration, 24 hours', 'Special',
        'Until dispelled']);
    self.spellComponentsOptions = ko.observableArray([
        'S', 'V', 'V, S', 'V, S, M']);
    self.spellRangeOptions = ko.observableArray([
        'Self', 'Touch', '5 ft', '10 ft', '30 ft', '60 ft',
        '90 ft', '120 ft', '300 ft', '500 ft', '1 mile']);

    self.clear = function() {
        self.spellName('');
        self.spellType('');
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
        self.spellType(values.spellType);
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
			spellType: self.spellType(),
			spellDmg: self.spellDmg(),
			spellSchool: self.spellSchool(),
			spellLevel: self.spellLevel(),
			spellDescription: self.spellDescription(),
			spellCastingTime: self.spellCastingTime(),
			spellRange: self.spellRange(),
			spellComponents: self.spellComponents(),
			spellDuration: self.spellDuration(),
        }
    };
    
    self.save = function() {
    	self.ps.save();
    };
    
    self.delete = function() {
    	self.ps.delete();
    };
};

Spell.findAll = function() {
	return PersistenceService.findAll(Spell);
};
