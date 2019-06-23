import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import {
    CoreManager,
    Fixtures,
    Notifications
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

    static FINESSE = 'finesse';
    static MELEE = 'melee';
    static RANGED = 'ranged';
    static REACH = 'reach';

    coreUuid = ko.observable(null);
    uuid = ko.observable(null);
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
    }, this);


    // proficiencyScore() {
    //     return ProficiencyService.sharedService().proficiency();
    // }

    abilityModOptions = ko.pureComputed(() => {
        if (this.type().toLowerCase() === Weapon.RANGED) {
            return ['Dexterity'];
        } else if (this.property().toLowerCase().includes(Weapon.FINESSE)) {
            return ['Strength', 'Dexterity'];
        } else {
            return ['Strength'];
        }
    });

    totalBonus = ko.pureComputed(() => {
        var bonus = 0;
        // var abilityScoreBonus = await this.abilityScoreBonus();
        // var proficiencyBonus = this.proficiencyScore();
        const magicalModifier = parseInt(this.magicalModifier());
        const toHitModifier = parseInt(this.toHitModifier());

        if (magicalModifier) {
            bonus += magicalModifier;
        }
        if (toHitModifier) {
            bonus += toHitModifier;
        }
        return bonus;
    });

    totalWeight = ko.pureComputed(() => {
        var qty = parseInt(this.quantity()) || 1;
        var perWeight = parseInt(this.weight()) || 0;

        return qty * perWeight;
    }, this);

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
        if (this.range()) {
            return this.range() + ' ft.';
        } else if (this.type().toLowerCase() === Weapon.MELEE) {
            if (this.property().toLowerCase().indexOf(Weapon.REACH) !== -1) {
                return '10 ft.';
            }
            return '5 ft.';

        }
        return '';
    });

    magicalModifierLabel = ko.pureComputed(() => {
        var magicalModifier = this.magicalModifier();
        if (magicalModifier) {
            return magicalModifier >= 0 ? ('+ ' + magicalModifier) : '- ' +
            Math.abs(magicalModifier);
        } else {
            return '';
        }
    }, this);

    toHitModifierLabel = ko.pureComputed(() => {
        const toHitModifier = this.toHitModifier();
        if (toHitModifier) {
            return toHitModifier >= 0 ? ('+ ' + toHitModifier) : '- ' +
            Math.abs(toHitModifier);
        } else {
            return 0;
        }
    }, this);

    applyMagicalModifierLabel = ko.pureComputed(() => {
        if (this.magicalModifierLabel() !== '' ) {
            return true;
        } else {
            return false;
        }
    }, this);

    weaponDescriptionHTML = ko.pureComputed(() => {
        if (!this.description()) {
            return '<div class="h3"><small>Add a description via the edit tab.</small></div>';
        }
        return this.description();
    }, this);

    weaponWeightLabel = ko.pureComputed(() => {
        return this.weight() !== '' && this.weight() >= 0 ? this.weight() + ' lbs.' : '0 lbs.';
    }, this);



    load = async (params) => {
        const response = await this.ps.model.ps.read(params);
        this.importValues(response.object.exportValues());
    }

    create = async () => {
        const response = await this.ps.create();
        this.importValues(response.object.exportValues());
        Notifications.weapon.added.dispatch(this);
    }

    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        Notifications.weapon.changed.dispatch(this);
    }

    delete = async () => {
        await this.ps.delete();
        Notifications.weapon.deleted.dispatch(this);
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
            type: 'number',
            min: 0,
            max: 100000000
        },
        currencyDenomination: {
            maxlength: 128
        },
        magicalModifier: {
            type: 'number',
            min: -10000,
            max: 10000
        },
        toHitModifier: {
            type: 'number',
            min: -10000,
            max: 10000
        },
        weight: {
            type: 'number',
            step: '0.01',
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
            type: 'number',
            min: 0,
            max: 100000
        }
    }
};
