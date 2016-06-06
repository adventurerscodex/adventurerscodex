'use strict';

function Weapon() {
    var self = this;
    self.ps = PersistenceService.register(Weapon, self);
    self.mapping = {
        ignore: ['ps', 'mapping', 'clear', 'proficiencyScore', 'strAbilityScoreModifier',
            'dexAbilityScoreModifier', 'exportValues', 'importValues', 'save', 'abilityScoreBonus',
            'hitBonusLabel', 'totalBonus', 'delete', '_dummy', 'updateValues',
            'mapping']
    };

    self._dummy = ko.observable(null);
    self.characterId = ko.observable(null);
    self.weaponName = ko.observable('');
    self.weaponType = ko.observable('');
    self.weaponDmg = ko.observable('');
    self.weaponHandedness = ko.observable('');
    self.weaponProficiency = ko.observable('');
    self.weaponPrice = ko.observable(0);
    self.weaponCurrencyDenomination = ko.observable('');
    self.weaponHit = ko.observable(0);
    self.weaponWeight = ko.observable(1);
    self.weaponRange = ko.observable('');
    self.weaponSize = ko.observable('');
    self.weaponDamageType = ko.observable('');
    self.weaponProperty = ko.observable('');
    self.weaponDescription = ko.observable('');
    self.weaponQuantity = ko.observable(1);
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
        } catch(err) { /*Ignore*/ }
        return parseInt(profBonus);
    };

    self.strAbilityScoreModifier = function() {
        var score = null;
        try {
            score = AbilityScores.findBy(
                CharacterManager.activeCharacter().key())[0].modifierFor('Str');
        } catch(err) { /*Ignore*/ }
        if (score === null){
            return null;
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
        } catch(err) { /*Ignore*/ }
        if (score === null){
            return null;
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

    self.totalBonus = ko.pureComputed(function() {
        self._dummy();
        var bonus = 0;
        var abilityScoreBonus = self.abilityScoreBonus();
        var proficiencyBonus = self.proficiencyScore();
        var weaponHit = parseInt(self.weaponHit());

        if(abilityScoreBonus){
            bonus += abilityScoreBonus;
        }
        if(proficiencyBonus){
            bonus += proficiencyBonus;
        }
        if(weaponHit){
            bonus += weaponHit;
        }

        return bonus;
    });

    self.hitBonusLabel = ko.pureComputed(function() {
        self._dummy();

        var totalBonus = self.totalBonus();

        return totalBonus ? ('+' + totalBonus):'+0';
    });


    self.clear = function() {
        var values = new Weapon().exportValues();
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

    self.delete = function() {
        self.ps.delete();
    };
}

Weapon.findAllBy =function(characterId) {
    return PersistenceService.findAll(Weapon).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};
