"use strict";

function Weapon() {
    var self = this;
	self.ps = PersistenceService.register(Weapon, self);
    self._dummy = ko.observable(null);
	self.characterId = ko.observable(null);
    self.weaponName = ko.observable('');
    self.weaponType = ko.observable('');
    self.weaponDmg = ko.observable('');
    self.weaponHandedness = ko.observable('');
    self.weaponProficiency = ko.observable('');
    self.weaponPrice = ko.observable('');
	self.weaponCurrencyDenomination = ko.observable('');
    self.weaponHit = ko.observable('');
    self.weaponWeight = ko.observable('');
    self.weaponRange = ko.observable('');
    self.weaponSize = ko.observable('');
    self.weaponDamageType = ko.observable('');
    self.weaponProperty = ko.observable('');
    self.weaponDescription = ko.observable('');
    self.weaponQuantity = ko.observable('');
    self.weaponProficiencyOptions = ko.observableArray(
        Fixtures.weapon.weaponProficiencyOptions);
    self.weaponHandednessOptions = ko.observableArray(
        Fixtures.weapon.weaponHandednessOptions);
    self.weaponTypeOptions = ko.observableArray(
        Fixtures.weapon.weaponTypeOptions);
    self.weaponSizeOptions = ko.observableArray(
        Fixtures.weapon.weaponSizeOptions);
    self.weaponPropertyOptions = ko.observableArray(
        Fixtures.weapon.weaponPropertyOptions);
    self.weaponDamageTypeOptions = ko.observableArray(
        Fixtures.weapon.weaponDamageTypeOptions);


    self.updateValues = function() {
        self._dummy.notifySubscribers();
    };

    self.proficiencyScore = function() {
        var key = CharacterManager.activeCharacter().key();
        var profBonus = 0;
        try{
            profBonus = OtherStats.findBy(
                CharacterManager.activeCharacter().key())[0].proficiency();
        } catch(err){};
        return parseInt(profBonus);
    };

    self.strAbilityScoreModifier = function() {
        var score = null;
        try {
            score = AbilityScores.findBy(
                CharacterManager.activeCharacter().key())[0].modifierFor('Str');
        } catch(err) {};
        if (score === null){
          return null
        }
        else {
          return parseInt(score);
        }
    };

    self.dexAbilityScoreModifier = function() {
        var score = null;
        try {
            score = AbilityScores.findBy(
                CharacterManager.activeCharacter().key())[0].modifierFor('Dex');
        } catch(err) {};
        if (score === null){
          return null
        }
        else {
          return parseInt(score);
        }
    };

    self.abilityScoreBonus = ko.pureComputed(function() {
        self._dummy();
        if(self.weaponType() === 'Ranged'){
            return self.dexAbilityScoreModifier();
        }
        else{
            if(self.weaponProperty() === 'Finesse'){
                var dexBonus = self.dexAbilityScoreModifier();
                var strBonus = self.strAbilityScoreModifier();

                if(dexBonus){
                    return dexBonus > strBonus ? dexBonus : strBonus;
                }
                else{
                    return strBonus ? strBonus:0;
                }
            }
            else{
                return self.strAbilityScoreModifier();
            }
        }
    });

    self.hitBonusLabel = ko.pureComputed(function() {
        self._dummy();
        var totalBonus = 0;
        var abilityScoreBonus = self.abilityScoreBonus();
        var proficiencyBonus = self.proficiencyScore();
        var weaponHit = parseInt(self.weaponHit());

        if(abilityScoreBonus){
            totalBonus += abilityScoreBonus;
        }
        if(proficiencyBonus){
            totalBonus += proficiencyBonus;
        }
        if(weaponHit){
            totalBonus += weaponHit;
        }

        return totalBonus ? ('+' + totalBonus):'+0';
    });

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
        self.weaponHit('');
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
        self.weaponHit(values.weaponHit);
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
			weaponCurrencyDenomination: self.weaponCurrencyDenomination(),
            weaponHit: self.weaponHit()
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
