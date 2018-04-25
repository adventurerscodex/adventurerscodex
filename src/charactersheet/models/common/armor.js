import {
    CoreManager,
    Fixtures
} from 'charactersheet/utilities';
import { AbilityScores } from 'charactersheet/models/character/ability_scores';
import { KOModel } from 'hypnos';
import { SharedServiceManager } from 'charactersheet/services/common/shared_service_manager';

import ko from 'knockout';


export class Armor extends KOModel {
    static __skeys__ = ['core', 'armors'];

    static mapping = {
        include: ['coreUuid']
    };

    _dummy = ko.observable(null);
    coreUuid = ko.observable(null);
    name = ko.observable('');
    type = ko.observable('');
    price = ko.observable('');
    magicalModifier = ko.observable(0);
    currencyDenomination = ko.observable('');
    weight = ko.observable('');
    armorClass = ko.observable('');
    stealth = ko.observable('');
    description = ko.observable('');
    equipped = ko.observable(false);

    armorTypeOptions = ko.observableArray(Fixtures.armor.armorTypeOptions);
    armorStealthOptions = ko.observableArray(Fixtures.armor.armorStealthOptions);
    armorCurrencyDenominationOptions = Fixtures.general.currencyDenominationList;

    acLabel = ko.pureComputed(() => {
        if (this.armorClass()) {
            return 'AC ' + this.armorClass();
        }
        else {
            return '';
        }
    });

    armorDescriptionHTML = ko.pureComputed(() => {
        if (this.description()){
            return this.description().replace(/\n/g, '<br />');
        } else {
            return '<div class="h3"><small>Add a description via the edit tab.</small></div>';
        }
    });

    magicalModifierLabel = ko.pureComputed(() => {
        this._dummy();

        var magicalModifier = this.magicalModifier();
        if (magicalModifier != 0) {
            return magicalModifier >= 0 ? ('+ ' + magicalModifier) : '- ' +
            Math.abs(magicalModifier);
        } else {
            return '';
        }
    });

    armorSummaryLabel = ko.pureComputed(() => {
        if (this.magicalModifier() != 0) {
            if (this.acLabel()) {
                return this.magicalModifierLabel() + ', ' + this.acLabel();
            } else {
                return this.magicalModifierLabel();
            }
        } else {
            return this.acLabel();
        }
    });

    applyMagicalModifierLabel = ko.pureComputed(() => {
        if (this.magicalModifierLabel() !== '' ) {
            return true;
        } else {
            return false;
        }
    });

    armorWeightLabel = ko.pureComputed(() => {
        return this.weight() !== '' && this.weight() >= 0 ? this.weight() + ' lbs.' : '0 lbs.';
    });

    updateValues = () => {
        this._dummy.notifySubscribers();
    };

    dexAbilityScoreModifier = () => {
        this._dummy();
        var score = 2;
        // TODO: FIX THIS WHEN ABILITY SCORES ARE AVAILABLE
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
        var dexAbilityScore = this.dexAbilityScoreModifier();
        if (dexAbilityScore) {
            if (this.type() === 'Light') {
                return dexAbilityScore;
            }
            else if (this.type() === 'Medium') {
                return dexAbilityScore >= 2 ? 2 : dexAbilityScore;
            }
        }
        else{
            return 0;
        }
    });

    armorClassLabel = ko.pureComputed(() => {
        this._dummy();
        var totalBonus = 0;
        var abilityScoreBonus = this.abilityScoreBonus();
        var armorClass = parseInt(this.armorClass());

        if (abilityScoreBonus) {
            totalBonus += abilityScoreBonus;
        }
        if (armorClass) {
            totalBonus += armorClass;
        }

        return totalBonus;
    });
}