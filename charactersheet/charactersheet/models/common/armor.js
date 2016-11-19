'use strict';

function Armor() {
    var self = this;
    self.ps = PersistenceService.register(Armor, self);
    self.mapping = {
        include: ['characterId', 'armorName', 'armorType',
                  'armorPrice', 'armorMagicalModifier', 'armorCurrencyDenomination',
                  'armorWeight', 'armorClass', 'armorEquipped', 'armorStealth',
                  'armorDescription']
    };

    self._dummy = ko.observable(null);
    self.characterId = ko.observable(null);
    self.armorName = ko.observable('');
    self.armorType = ko.observable('');
    self.armorPrice = ko.observable('');
    self.armorMagicalModifier = ko.observable(0);
    self.armorCurrencyDenomination = ko.observable('');
    self.armorWeight = ko.observable('');
    self.armorClass = ko.observable('');
    self.armorEquipped = ko.observable('');
    self.armorStealth = ko.observable('');
    self.armorDescription = ko.observable('');

    self.armorTypeOptions = ko.observableArray(Fixtures.armor.armorTypeOptions);
    self.armorStealthOptions = ko.observableArray(Fixtures.armor.armorStealthOptions);

    self.armorEquippedLabel = ko.pureComputed(function() {
        return self.armorEquipped() ? 'fa fa-check' : '';
    });

    self.acLabel = ko.pureComputed(function() {
        return 'AC ' + self.armorClass();
    });

    self.armorDescriptionHTML = ko.pureComputed(function() {
        if (self.armorDescription()){
            return self.armorDescription().replace(/\n/g, '<br />');
        } else {
            return '<div class="h3"><small>Add a description via the edit tab.</small></div>';
        }
    });

    self.magicalModifierLabel = ko.pureComputed(function() {
        self._dummy();

        var magicalModifier = self.armorMagicalModifier();
        if (magicalModifier != 0) {
            return magicalModifier >= 0 ? ('+ ' + magicalModifier) : '- ' +
            Math.abs(magicalModifier);
        } else {
            return '';
        }
    });

    self.armorSummaryLabel = ko.pureComputed(function() {
        if (self.armorMagicalModifier() != 0){
            return self.magicalModifierLabel() + ', ' + self.acLabel();
        } else {
            return self.acLabel();
        }
    });

    self.applyMagicalModifierLabel = ko.pureComputed(function() {
        if (self.magicalModifierLabel() !== '' ){
            return true;
        } else {
            return false;
        }
    });

    self.armorWeightLabel = ko.pureComputed(function() {
        return self.armorWeight() + ' lbs.'
    });

    self.clear = function() {
        var values = new Armor().exportValues();
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
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

    self.updateValues = function() {
        self._dummy.notifySubscribers();
    };

    self.dexAbilityScoreModifier = function() {
        self._dummy();
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
        var dexAbilityScore = self.dexAbilityScoreModifier();
        if(dexAbilityScore){
            if(self.armorType() === 'Light'){
                return dexAbilityScore;
            }
            else if(self.armorType() === 'Medium'){
                return dexAbilityScore >= 2 ? 2 : dexAbilityScore;
            }
        }
        else{
            return 0;
        }
    });

    self.armorClassLabel = ko.pureComputed(function() {
        self._dummy();
        var totalBonus = 0;
        var abilityScoreBonus = self.abilityScoreBonus();
        var armorClass = parseInt(self.armorClass());

        if(abilityScoreBonus){
            totalBonus += abilityScoreBonus;
        }
        if(armorClass){
            totalBonus += armorClass;
        }

        return totalBonus;
    });
}

Armor.findAllBy =function(characterId) {
    return PersistenceService.findAll(Armor).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};
