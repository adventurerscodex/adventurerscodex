import { Fixtures } from 'charactersheet/utilities';
import { KOModel } from 'hypnos';
import ko from 'knockout';


export class SpellStats extends KOModel {
    static __skeys__ = ['core', 'characters', 'spellStats'];

    static mapping = {
        include: ['coreUuid']
    };

    coreUuid = ko.observable(null);
    castingAbility = ko.observable('');
    spellSaveDc = ko.observable(0);
    spellAttackBonus = ko.observable(0);
    spellsKnown = ko.observable(0);
    cantripsKnown = ko.observable(0);
    invocationsKnown = ko.observable(0);
    maxPrepared = ko.observable(0);
    spellcastingAbilityOptions = ko.observableArray(Fixtures.spellStats.spellcastingAbilityOptions);

    toSchemaValues = (values) => {
        const castingAbility = values.castingAbility;
        values.castingAbility = castingAbility  === '' ? null : castingAbility;
        return values;
    }
}

SpellStats.validationConstraints = {
    rules: {
        spellSaveDc: {
            required: true,
            min: -10000,
            max: 10000,
            number: true
        },
        spellAttackBonus: {
            required: true,
            min: -10000,
            max: 10000,
            number: true
        },
        spellsKnown: {
            required: true,
            min: 0,
            max: 10000,
            number: true
        },
        cantripsKnown: {
            required: true,
            min: 0,
            max: 10000,
            number: true
        },
        invocationsKnown: {
            required: true,
            min: 0,
            max: 10000,
            number: true
        },
        maxPrepared: {
            required: true,
            min: 0,
            max: 10000,
            number: true
        }
    }
};
