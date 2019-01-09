import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { KOModel } from 'hypnos';
import ko from 'knockout';


export class AbilityScore extends KOModel {
    static __skeys__ = ['core', 'abilityScores'];
    static __dependents__ = ['Skill', 'SavingThrow'];

    static mapping = {
        include: ['coreUuid']
    };

    coreUuid = ko.observable(null);
    name = ko.observable('');
    value = ko.observable(1);
    shortName = ko.observable('');

    getModifier() {
        if (this.value()) {
            return Math.floor((this.value() - 10) / 2);
        } else {
            return 0;
        }
    }

    modifierLabel() {
        try {
            if (this.value() === null || this.value() === '') {
                return '';
            }
            let modifier = this.getModifier();
            if (modifier >= 0) {
                modifier = '+ ' + modifier;
            } else {
                modifier = '- ' + Math.abs(modifier);
            }
            return modifier;
        } catch (e) {
            // Ignore
        }
    }
}

AbilityScore.validationConstraints = {
    rules: {
        Strength: {
            required: true,
            min: -10000,
            max: 1000000
        },
        Dexterity: {
            required: true,
            min: -10000,
            max: 1000000
        },
        Constitution: {
            required: true,
            min: -10000,
            max: 1000000
        },
        Intelligence: {
            required: true,
            min: -10000,
            max: 1000000
        },
        Wisdom: {
            required: true,
            min: -10000,
            max: 1000000
        },
        Charisma: {
            required: true,
            min: -10000,
            max: 1000000
        }
    }
};
