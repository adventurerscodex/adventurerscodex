import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import {
    CharacterManager,
    Fixtures
} from 'charactersheet/utilities';
import { AbilityScores } from 'charactersheet/models/character/ability_scores';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { ProficiencyService } from 'charactersheet/services/character/proficiency_service';
import { SharedServiceManager } from 'charactersheet/services/common/shared_service_manager';

import ko from 'knockout';


export function Weapon() {
    var self = this;

    self.FINESSE = 'finesse';
    self.RANGED = 'ranged';

    self.ps = PersistenceService.register(Weapon, self);
    self.mapping = {
        include: ['weaponHit', 'characterId', 'weaponName', 'weaponType', 'weaponDmg',
        'weaponHandedness', 'weaponProficiency', 'weaponPrice', 'weaponCurrencyDenomination',
        'weaponToHitModifier', 'weaponWeight', 'weaponRange', 'weaponDamageType',
        'weaponProperty', 'weaponDescription', 'weaponQuantity']
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
    // weaponHit is misnamed, should be magical modifier
    self.weaponHit = ko.observable(0);
    self.weaponToHitModifier = ko.observable(0);
    self.weaponWeight = ko.observable(1);
    self.weaponRange = ko.observable('');
    self.weaponDamageType = ko.observable('');
    self.weaponProperty = ko.observable('');
    self.weaponDescription = ko.observable('');
    self.weaponQuantity = ko.observable(1);

    self.weaponProficiencyOptions = ko.observableArray(Fixtures.weapon.weaponProficiencyOptions);
    self.weaponHandednessOptions = ko.observableArray(Fixtures.weapon.weaponHandednessOptions);
    self.weaponTypeOptions = ko.observableArray(Fixtures.weapon.weaponTypeOptions);
    self.weaponPropertyOptions = ko.observableArray(Fixtures.weapon.weaponPropertyOptions);
    self.weaponDamageTypeOptions = ko.observableArray(Fixtures.weapon.weaponDamageTypeOptions);
    self.weaponCurrencyDenominationOptions = Fixtures.general.currencyDenominationList;

    self.updateValues = function() {
        self._dummy.notifySubscribers();
    };

    self.totalWeight = ko.computed(function() {
        var qty = parseInt(self.weaponQuantity()) || 1;
        var perWeight = parseInt(self.weaponWeight()) || 0;

        return qty * perWeight;
    });

    self.proficiencyScore = function() {
        return ProficiencyService.sharedService().proficiency();
    };

    self.strAbilityScoreModifier = function() {
        var score = null;
        try {
            score = PersistenceService.findBy(AbilityScores, 'characterId',
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
            score = PersistenceService.findBy(AbilityScores, 'characterId',
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
        if (self.weaponType().toLowerCase() === self.RANGED) {
            return self.dexAbilityScoreModifier();
        } else {
            if (self.weaponProperty().toLowerCase().indexOf(self.FINESSE) >= 0) {
                var dexBonus = self.dexAbilityScoreModifier();
                var strBonus = self.strAbilityScoreModifier();

                if (dexBonus) {
                    return dexBonus > strBonus ? dexBonus : strBonus;
                } else {
                    return strBonus ? strBonus:0;
                }
            } else {
                return self.strAbilityScoreModifier();
            }
        }
    });

    self.totalBonus = ko.pureComputed(function() {
        self._dummy();
        var bonus = 0;
        var abilityScoreBonus = self.abilityScoreBonus();
        var proficiencyBonus = self.proficiencyScore();
        // This is magical modifier
        var weaponHit = parseInt(self.weaponHit());
        var toHitModifer = parseInt(self.weaponToHitModifier());

        if (abilityScoreBonus) {
            bonus += abilityScoreBonus;
        }
        if (proficiencyBonus) {
            bonus += proficiencyBonus;
        }
        if (weaponHit) {
            bonus += weaponHit;
        }
        if (toHitModifer) {
            bonus += toHitModifer;
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
        if (self.weaponType().toLowerCase() === 'ranged') {
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

    self.toHitModifierLabel = ko.pureComputed(function() {
        self._dummy();

        var toHitModifier = self.weaponToHitModifier();
        if (toHitModifier) {
            return toHitModifier >= 0 ? ('+ ' + toHitModifier) : '- ' +
            Math.abs(toHitModifier);
        } else {
            return 0;
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
        return self.weaponWeight() !== '' && self.weaponWeight() >= 0 ? self.weaponWeight() + ' lbs.' : '0 lbs.';
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
Weapon.__name = 'Weapon';

PersistenceService.addToRegistry(Weapon);
