import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import {
    CoreManager,
    Fixtures
} from 'charactersheet/utilities';
import { AbilityScore } from 'charactersheet/models/character/ability_score';
import { KOModel } from 'hypnos';
import { ProficiencyService } from 'charactersheet/services/character/proficiency_service';

import ko from 'knockout';


export class Weapon extends KOModel {
    static __skeys__ = ['core', 'weapons'];

    static mapping = {
        include: ['coreUuid', 'description', 'magicalModifier']
    };

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
    hitBonusLabel = ko.observable();

    weaponProficiencyOptions = ko.observableArray(Fixtures.weapon.weaponProficiencyOptions);
    weaponHandednessOptions = ko.observableArray(Fixtures.weapon.weaponHandednessOptions);
    weaponTypeOptions = ko.observableArray(Fixtures.weapon.weaponTypeOptions);
    weaponPropertyOptions = ko.observableArray(Fixtures.weapon.weaponPropertyOptions);
    weaponDamageTypeOptions = ko.observableArray(Fixtures.weapon.weaponDamageTypeOptions);
    weaponCurrencyDenominationOptions = Fixtures.general.currencyDenominationList;
    FINESSE = 'finesse';
    RANGED = 'ranged';

    totalWeight = ko.computed(() => {
        var qty = parseInt(this.quantity()) || 1;
        var perWeight = parseInt(this.weight()) || 0;

        return qty * perWeight;
    });

    proficiencyScore() {
        return ProficiencyService.sharedService().proficiency();
    }

    strAbilityScoreModifier = async () => {
        var score = null;
        try {
            var coreUuid = CoreManager.activeCore().uuid();
            const response = await AbilityScore.ps.list({coreUuid, name: Fixtures.abilityScores.constants.strength.name});
            score = response.objects[0];
        } catch(err) { /*Ignore*/ }

        if (score === null) {
            return null;
        } else {
            return score.getModifier();
        }
    };

    dexAbilityScoreModifier = async () => {
        var score = null;
        try {
            var key = CoreManager.activeCore().uuid();
            const response = await AbilityScore.ps.list({coreUuid: key});
            score = response.objects.filter((score, i, _) => {
                return score.name() === 'Dexterity';
            })[0];
        } catch(err) { /*Ignore*/ }

        if (score === null) {
            return null;
        } else {
            return score.getModifier();
        }
    };

    abilityScoreBonus = async () => {
        let dexBonus;
        let strBonus;
        if (this.type().toLowerCase() === this.RANGED) {
            return await this.dexAbilityScoreModifier();
        } else {
            if (this.property().toLowerCase().indexOf(this.FINESSE) >= 0) {
                dexBonus = await this.dexAbilityScoreModifier();
                strBonus = await this.strAbilityScoreModifier();

                if (dexBonus) {
                    return dexBonus > strBonus ? dexBonus : strBonus;
                } else {
                    return strBonus ? strBonus:0;
                }
            } else {
                strBonus = await this.strAbilityScoreModifier();
                return strBonus;
            }
        }
    };

    totalBonus = async () => {
        var bonus = 0;
        var abilityScoreBonus = await this.abilityScoreBonus();
        var proficiencyBonus = this.proficiencyScore();
        var magicalModifier = parseInt(this.magicalModifier());
        var toHitModifier = parseInt(this.toHitModifier());

        if (abilityScoreBonus) {
            bonus += abilityScoreBonus;
        }
        if (proficiencyBonus) {
            bonus += proficiencyBonus;
        }
        if (magicalModifier) {
            bonus += magicalModifier;
        }
        if (toHitModifier) {
            bonus += toHitModifier;
        }
        return bonus;
    };

    updateHitBonusLabel = async () => {
        var totalBonus = await this.totalBonus();
        if (totalBonus) {
            this.hitBonusLabel(totalBonus >= 0 ? ('+ ' + totalBonus) : '- ' +
            Math.abs(totalBonus));
        } else {
            this.hitBonusLabel('+ 0');
        }
    };

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
        var magicalModifier = this.magicalModifier();
        if (magicalModifier) {
            return magicalModifier >= 0 ? ('+ ' + magicalModifier) : '- ' +
            Math.abs(magicalModifier);
        } else {
            return '';
        }
    });

    toHitModifierLabel = ko.pureComputed(() => {
        var toHitModifier = this.toHitModifier();
        if (toHitModifier) {
            return toHitModifier >= 0 ? ('+ ' + toHitModifier) : '- ' +
            Math.abs(toHitModifier);
        } else {
            return 0;
        }
    });

    applyMagicalModifierLabel = ko.pureComputed(() => {
        if (this.magicalModifierLabel() !== '' ) {
            return true;
        } else {
            return false;
        }
    });

    weaponDescriptionHTML = ko.pureComputed(() => {
        if (this.description()) {
            return this.description().replace(/\n/g, '<br />');
        } else {
            return '<div class="h3"><small>Add a description via the edit tab.</small></div>';
        }
    });

    weaponWeightLabel = ko.pureComputed(() => {
        return this.weight() !== '' && this.weight() >= 0 ? this.weight() + ' lbs.' : '0 lbs.';
    });
}

Weapon.validationConstraints = {
    rules: {
        name: {
            required: true,
            maxlength: 256
        },
        type: {
            required: true,
            maxlength: 64
        },
        damage: {
            required: true,
            maxlength: 64
        },
        damageType: {
            maxlength: 64
        },
        handedness: {
            maxlength: 64
        },
        proficiency: {
            maxlength: 64
        },
        price: {
            number: true,
            min: 0,
            max: 100000000
        },
        currencyDenomination: {
            maxlength: 64
        },
        magicalModifier: {
            number: true,
            min: -10000,
            max: 10000
        },
        toHitModifier: {
            number: true,
            min: -10000,
            max: 10000
        },
        weight: {
            number: true,
            min: 0,
            max: 100000000
        },
        range: {
            maxlength: 64
        },
        property: {
            maxlength: 64
        },
        quantity: {
            number: true,
            min: 0,
            max: 100000
        }
    }
};
