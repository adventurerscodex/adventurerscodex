"use strict";

function Armor() {
    var self = this;
    self.ps = PersistenceService.register(Armor, self);
	self.mapping = {
	    ignore: ['ps', 'mapping', 'importValues', 'exportValues', 'clear',
	        'save', 'delete', 'proficiencyLabel', 'abilityScoreBonus'],
	    include: ['armorClass']
	};

    self.characterId = ko.observable(null);
    self._dummy = ko.observable(null);
    self.armorName = ko.observable('');
    self.armorType = ko.observable('');
    self.armorProficiency = ko.observable(false);
    self.armorPrice = ko.observable('');
	self.armorCurrencyDenomination = ko.observable('');
    self.armorWeight = ko.observable('');
    self.armorClass = ko.observable('');
    self.armorStealth = ko.observable('');
    self.armorDescription = ko.observable('');
    self.armorTypeOptions = ko.observableArray(Fixtures.armor.armorTypeOptions);
    self.armorStealthOptions = ko.observableArray(Fixtures.armor.armorStealthOptions);

    self.proficiencyLabel = ko.pureComputed(function() {
        if (self.armorProficiency() === true) {
            return 'fa fa-check';
        }
        return '';
    });

    self.clear = function() {
        var values = new Armor().exportValues();
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

    self.updateValues = function() {
        self._dummy.notifySubscribers();
    };

    self.dexAbilityScoreModifier = function() {
        self._dummy();
        var score = null;
        try {
            score = AbilityScores.findBy(
                CharacterManager.activeCharacter().key())[0].modifierFor('Dex');
        } catch(err) {};

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
};

Armor.findAllBy =function(characterId) {
    return PersistenceService.findAll(Armor).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};
