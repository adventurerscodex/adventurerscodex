import { Fixtures } from 'charactersheet/utilities';
import { KOModel } from 'hypnos';
import { Notifications } from 'charactersheet/utilities';
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

    load = async (params) => {
        const response = await this.ps.model.ps.read(params);
        this.importValues(response.object.exportValues());
    }

    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        Notifications.spellstats.changed.dispatch(this);
    }
}

SpellStats.validationConstraints = {
    rules: {
        spellSaveDc: {
            required: true,
            min: -10000,
            max: 10000,
            pattern: '\\d*',
            type: 'number'
        },
        spellAttackBonus: {
            required: true,
            min: -10000,
            max: 10000,
            pattern: '\\d*',
            type: 'number'
        },
        spellsKnown: {
            required: true,
            min: 0,
            max: 10000,
            pattern: '\\d*',
            type: 'number'
        },
        cantripsKnown: {
            required: true,
            min: 0,
            max: 10000,
            pattern: '\\d*',
            type: 'number'
        },
        invocationsKnown: {
            required: true,
            min: 0,
            max: 10000,
            pattern: '\\d*',
            type: 'number'
        },
        maxPrepared: {
            required: true,
            min: 0,
            max: 10000,
            pattern: '\\d*',
            type: 'number'
        }
    }
};
