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


    weaponDamageIcon = ko.pureComputed(() => {
        switch(this.damageType().toLowerCase()) {
        case 'fire': {
            return 'damage-icon damage-fire';
        }
        case 'cold': {
            return 'damage-icon damage-cold';
        }
        case 'lightning': {
            return 'damage-icon damage-lightning';
        }
        case 'thunder': {
            return 'damage-icon damage-thunder';
        }
        case 'poison': {
            return 'damage-icon damage-poison';
        }
        case 'acid': {
            return 'damage-icon damage-acid';
        }
        case 'psychic': {
            return 'damage-icon damage-psychic';
        }
        case 'necrotic': {
            return 'damage-icon damage-necrotic';
        }
        case 'radiant': {
            return 'damage-icon damage-radiant';
        }
        case 'force': {
            return 'damage-icon damage-force';
        }
        case 'bludgeoning': {
            return 'damage-icon damage-bludgeoning';
        }
        case 'piercing': {
            return 'damage-icon damage-piercing';
        }
        case 'slashing': {
            return 'damage-icon damage-slashing';
        }
        default:
            return '';
        }
    });


    FINESSE = 'finesse';
    RANGED = 'ranged';

    totalWeight = ko.pureComputed(() => {
        var qty = parseInt(this.quantity()) || 1;
        var perWeight = parseInt(this.weight()) || 0;

        return qty * perWeight;
    }, this);

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
            const response = await AbilityScore.ps.list({coreUuid, name: Fixtures.abilityScores.constants.dexterity.name});
            score = response.objects[0];
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
    }, this);

    toSchemaValues = (values) => {
        if (values.price === '') {
            values.price = 0;
        }

        if (values.quantity === '') {
            values.quantity = 0;
        }

        if (values.weight === '') {
            values.weight = 0;
        }

        if (values.magicalModifier === '') {
            values.magicalModifier = 0;
        }

        if (values.toHitModifier === '') {
            values.toHitModifier = 0;
        }

        return values;
    }
}

Weapon.validationConstraints = {
    rules: {
        name: {
            required: true,
            maxlength: 256
        },
        type: {
            required: true,
            maxlength: 128
        },
        damage: {
            required: true,
            maxlength: 128
        },
        damageType: {
            maxlength: 128
        },
        handedness: {
            maxlength: 128
        },
        proficiency: {
            maxlength: 128
        },
        price: {
            number: true,
            min: 0,
            max: 100000000
        },
        currencyDenomination: {
            maxlength: 128
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
            maxlength: 128
        },
        property: {
            maxlength: 128
        },
        quantity: {
            number: true,
            min: 0,
            max: 100000
        }
    }
};
