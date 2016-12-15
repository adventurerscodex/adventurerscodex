'use strict';

function Weapon() {
    var self = this;

    self.FINESSE = 'finesse';
    self.RANGED = 'ranged';

    self.ps = PersistenceService.register(Weapon, self);
    self.mapping = {
        include: ['weaponHit', 'characterId', 'weaponName', 'weaponType', 'weaponDmg',
        'weaponHandedness', 'weaponProficiency', 'weaponPrice', 'weaponCurrencyDenomination',
        'weaponWeight', 'weaponRange', 'weaponDamageType', 'weaponProperty',
        'weaponDescription', 'weaponQuantity']
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
    self.weaponPropertyOptions = ko.observableArray(
        Fixtures.weapon.weaponPropertyOptions);
    self.weaponDamageTypeOptions = ko.observableArray(
        Fixtures.weapon.weaponDamageTypeOptions);

    self.updateValues = function() {
        self._dummy.notifySubscribers();
    };

    self.totalWeight = ko.computed(function() {
        var qty = parseInt(self.weaponQuantity()) || 1;
        var perWeight = parseInt(self.weaponWeight()) || 0;

        return qty * perWeight;
    });

    self.proficiencyScore = function() {
        var key = CharacterManager.activeCharacter().key();
        var profBonus = 0;
        try{
            profBonus = OtherStats.findBy(
                CharacterManager.activeCharacter().key())[0].proficiencyLabel();
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
        if (self.weaponType().toLowerCase() === self.RANGED){
            return self.dexAbilityScoreModifier();
        } else{
            if (self.weaponProperty().toLowerCase().indexOf(self.FINESSE) >= 0){
                var dexBonus = self.dexAbilityScoreModifier();
                var strBonus = self.strAbilityScoreModifier();

                if(dexBonus){
                    return dexBonus > strBonus ? dexBonus : strBonus;
                } else{
                    return strBonus ? strBonus:0;
                }
            } else{
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
        if (totalBonus) {
            return totalBonus >= 0 ? ('+ ' + totalBonus) : '- ' +
            Math.abs(totalBonus);
        } else {
            return '+ 0';
        }
    });

    self.weaponRangeLabel = ko.pureComputed(function() {
        if (self.weaponType().toLowerCase() === 'ranged'){
            if(self.weaponRange()) {
                return self.weaponRange() + ' ft.';
            } else {
                return '';
            }
        } else if (self.weaponType().toLowerCase() === 'melee') {
            var weaponRange = parseInt(self.weaponRange());
            if (!weaponRange) {
                weaponRange = 5;
            }
            if (self.weaponProperty()) {
                if(self.weaponProperty().toLowerCase().indexOf('reach') !== -1) {
                    weaponRange += 5;
                }
            }
            return weaponRange + ' ft.';

        } else {
            throw 'Weapon type not range or melee.';
        }
    });

    self.magicalModifierLabel = ko.pureComputed(function() {
        self._dummy();

        var magicalModifier = self.weaponHit();
        if (magicalModifier) {
            return magicalModifier >= 0 ? ('+ ' + magicalModifier) : '- ' +
            Math.abs(magicalModifier);
        } else {
            return '';
        }
    });

    self.applyMagicalModifierLabel = ko.pureComputed(function() {
        if (self.magicalModifierLabel() !== '' ){
            return true;
        } else {
            return false;
        }
    });

    self.weaponDescriptionHTML = ko.pureComputed(function() {
        if (self.weaponDescription()){
            return self.weaponDescription().replace(/\n/g, '<br />');
        } else {
            return '<div class="h3"><small>Add a description via the edit tab.</small></div>';
        }
    });

    self.weaponWeightLabel = ko.pureComputed(function() {
        return self.weaponWeight() + ' lbs.';
    });

    self.clear = function() {
        var values = new Weapon().exportValues();
        ko.mapping.fromJS(values, self.mapping, self);
    };

    self.importValues = function(values) {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.exportValues = function() {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        return ko.mapping.toJS(self, mapping);
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
