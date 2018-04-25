import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import {
    CoreManager,
    Fixtures
} from 'charactersheet/utilities';
import { AbilityScores } from 'charactersheet/models/character/ability_scores';
import { KOModel } from 'hypnos';
import { ProficiencyService } from 'charactersheet/services/character/proficiency_service';
import { SharedServiceManager } from 'charactersheet/services/common/shared_service_manager';

import ko from 'knockout';


export class Weapon extends KOModel {
    static __skeys__ = ['core', 'weapon'];

    static mapping = {
        include: ['coreUuid']
    };

    _dummy = ko.observable(null);
    coreUuid = ko.observable(null);
    name = ko.observable('');
    type = ko.observable('');
    damage = ko.observable('');
    damageType = ko.observable('');
    handedness = ko.observable('');
    proficiency = ko.observable('');
    price = ko.observable(0);
    currencyDenomination = ko.observable('');
    magicalModifier = ko.observable(0);
    toHitModifier = ko.observable(0);
    weight = ko.observable(1);
    range = ko.observable('');
    property = ko.observable('');
    description = ko.observable('');
    quantity = ko.observable(1);

    weaponProficiencyOptions = ko.observableArray(Fixtures.weapon.weaponProficiencyOptions);
    weaponHandednessOptions = ko.observableArray(Fixtures.weapon.weaponHandednessOptions);
    weaponTypeOptions = ko.observableArray(Fixtures.weapon.weaponTypeOptions);
    weaponPropertyOptions = ko.observableArray(Fixtures.weapon.weaponPropertyOptions);
    weaponDamageTypeOptions = ko.observableArray(Fixtures.weapon.weaponDamageTypeOptions);
    weaponCurrencyDenominationOptions = Fixtures.general.currencyDenominationList;
    FINESSE = 'finesse';
    RANGED = 'ranged';

    updateValues() {
        this._dummy.notifySubscribers();
    };

    totalWeight = ko.computed(() => {
        var qty = parseInt(this.quantity()) || 1;
        var perWeight = parseInt(this.weight()) || 0;

        return qty * perWeight;
    });

    proficiencyScore() {
        return ProficiencyService.sharedService().proficiency();
    };

    strAbilityScoreModifier() {
        var score = null;
        return 2;
        // TODO: Fix when AS are available
        // try {
        //     score = PersistenceService.findBy(AbilityScores, 'characterId',
        //         CoreManager.activeCore().uuid())[0].modifierFor('Str');
        // } catch(err) { /*Ignore*/ }
        // if (score === null){
        //     return null;
        // }
        // else {
        //     return parseInt(score);
        // }
    };

    dexAbilityScoreModifier() {
        var score = null;
        return 1;
        // try {
        //     score = PersistenceService.findBy(AbilityScores, 'characterId',
        //         CoreManager.activeCore().uuid())[0].modifierFor('Dex');
        // } catch(err) { /*Ignore*/ }
        // if (score === null){
        //     return null;
        // }
        // else {
        //     return parseInt(score);
        // }
    };

    abilityScoreBonus = ko.pureComputed(() => {
        this._dummy();
        if (this.type().toLowerCase() === this.RANGED) {
            return this.dexAbilityScoreModifier();
        } else {
            if (this.property().toLowerCase().indexOf(this.FINESSE) >= 0) {
                var dexBonus = this.dexAbilityScoreModifier();
                var strBonus = this.strAbilityScoreModifier();

                if (dexBonus) {
                    return dexBonus > strBonus ? dexBonus : strBonus;
                } else {
                    return strBonus ? strBonus:0;
                }
            } else {
                return this.strAbilityScoreModifier();
            }
        }
    });

    totalBonus = ko.pureComputed(() => {
        this._dummy();
        var bonus = 0;
        var abilityScoreBonus = this.abilityScoreBonus();
        var proficiencyBonus = this.proficiencyScore();
        var magicalModifier = parseInt(this.magicalModifier());
        var toHitModifer = parseInt(this.toHitModifier());

        if (abilityScoreBonus) {
            bonus += abilityScoreBonus;
        }
        if (proficiencyBonus) {
            bonus += proficiencyBonus;
        }
        if (magicalModifier) {
            bonus += magicalModifier;
        }
        if (toHitModifer) {
            bonus += toHitModifer;
        }
        return bonus;
    });

    hitBonusLabel = ko.pureComputed(() => {
        this._dummy();

        var totalBonus = this.totalBonus();
        if (totalBonus) {
            return totalBonus >= 0 ? ('+ ' + totalBonus) : '- ' +
            Math.abs(totalBonus);
        } else {
            return '+ 0';
        }
    });

    weaponRangeLabel = ko.pureComputed(() => {
        if (this.type().toLowerCase() === 'ranged') {
            if (this.range()) {
                return this.range() + ' ft.';
            } else {
                return '';
            }
        } else if (this.type().toLowerCase() === 'melee') {
            var weaponRange = parseInt(this.range());
            if (!weaponRange) {
                weaponRange = 5;
            }
            if (this.property()) {
                if (this.property().toLowerCase().indexOf('reach') !== -1) {
                    weaponRange += 5;
                }
            }
            return weaponRange + ' ft.';
        }
    });

    magicalModifierLabel = ko.pureComputed(() => {
        this._dummy();

        var magicalModifier = this.magicalModifier();
        if (magicalModifier) {
            return magicalModifier >= 0 ? ('+ ' + magicalModifier) : '- ' +
            Math.abs(magicalModifier);
        } else {
            return '';
        }
    });

    toHitModifierLabel = ko.pureComputed(() => {
        this._dummy();

        var toHitModifier = this.toHitModifier();
        if (toHitModifier) {
            return toHitModifier >= 0 ? ('+ ' + toHitModifier) : '- ' +
            Math.abs(toHitModifier);
        } else {
            return 0;
        }
    });

    applyMagicalModifierLabel = ko.pureComputed(() => {
        if (this.magicalModifierLabel() !== '' ){
            return true;
        } else {
            return false;
        }
    });

    weaponDescriptionHTML = ko.pureComputed(() => {
        if (this.description()){
            return this.description().replace(/\n/g, '<br />');
        } else {
            return '<div class="h3"><small>Add a description via the edit tab.</small></div>';
        }
    });

    weaponWeightLabel = ko.pureComputed(() => {
        return this.weight() !== '' && this.weight() >= 0 ? this.weight() + ' lbs.' : '0 lbs.';
    });
}