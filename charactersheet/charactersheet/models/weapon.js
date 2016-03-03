"use strict";

function Weapon() {
    var self = this;
	self.ps = PersistenceService.register(Weapon, self);

	self.characterId = ko.observable(null);
    self.weaponName = ko.observable('');
    self.weaponType = ko.observable('');
    self.weaponDmg = ko.observable('');
    self.weaponHandedness = ko.observable('');
    self.weaponProficiency = ko.observable('');
    self.weaponPrice = ko.observable('');
	self.weaponCurrencyDenomination = ko.observable('');
    self.weaponWeight = ko.observable('');
    self.weaponRange = ko.observable('');
    self.weaponSize = ko.observable('');
    self.weaponDamageType = ko.observable('');
    self.weaponProperty = ko.observable('');
    self.weaponDescription = ko.observable('');
    self.weaponQuantity = ko.observable('')
    self.weaponProficiencyOptions = ko.observableArray(
        ['Simple', 'Martial', 'Improvised', 'Nonlethal', 'Exotic']);
    self.weaponHandednessOptions = ko.observableArray(
        ['Light', 'One-Handed', 'Two-Handed']);
    self.weaponTypeOptions = ko.observableArray(
        ['Melee', 'Ranged']);
    self.weaponSizeOptions = ko.observableArray(
        ['Small', 'Medium', 'Large']);
    self.weaponPropertyOptions = ko.observableArray(
        ['Ammunition', 'Finesse', 'Heavy', 'Light', 'Loading',
         'Range', 'Reach', 'Special', 'Thrown', 'Versatile']);
    self.weaponDamageTypeOptions = ko.observableArray(
         ['Bludgeoning', 'Piercing', 'Slashing']);


    self.clear = function() {
        self.weaponName('');
        self.weaponType('');
        self.weaponDmg('');
        self.weaponHandedness('');
        self.weaponProficiency('');
        self.weaponPrice('');
        self.weaponWeight('');
        self.weaponRange('');
        self.weaponSize('');
        self.weaponDamageType('');
        self.weaponProperty('');
        self.weaponDescription('');
        self.weaponQuantity('');
		self.weaponCurrencyDenomination('');
    };

    self.importValues = function(values) {
    	self.characterId(values.characterId);
        self.weaponName(values.weaponName);
        self.weaponType(values.weaponType);
        self.weaponDmg(values.weaponDmg);
        self.weaponHandedness(values.weaponHandedness);
        self.weaponProficiency(values.weaponProficiency);
        self.weaponPrice(values.weaponPrice);
        self.weaponWeight(values.weaponWeight);
        self.weaponRange(values.weaponRange);
        self.weaponSize(values.weaponSize);
        self.weaponDamageType(values.weaponDamageType);
        self.weaponProperty(values.weaponProperty);
        self.weaponDescription(values.weaponDescription);
        self.weaponQuantity(values.weaponQuantity);
		self.weaponCurrencyDenomination(values.weaponCurrencyDenomination);
    };

    self.exportValues = function() {
        return {
        	characterId: self.characterId(),
			weaponName: self.weaponName(),
			weaponType: self.weaponType(),
			weaponDmg: self.weaponDmg(),
			weaponHandedness: self.weaponHandedness(),
			weaponProficiency: self.weaponProficiency(),
			weaponPrice: self.weaponPrice(),
			weaponWeight: self.weaponWeight(),
			weaponRange: self.weaponRange(),
			weaponSize: self.weaponSize(),
			weaponDamageType: self.weaponDamageType(),
            weaponProperty: self.weaponProperty(),
            weaponDescription: self.weaponDescription(),
            weaponQuantity: self.weaponQuantity(),
			weaponCurrencyDenomination: self.weaponCurrencyDenomination()
        }
    };

    self.save = function() {
    	self.ps.save();
    };

    self.delete = function() {
    	self.ps.delete();
    };
};

Weapon.findAllBy =function(characterId) {
	return PersistenceService.findAll(Weapon).filter(function(e, i, _) {
		return e.characterId() === characterId;
	});
};
