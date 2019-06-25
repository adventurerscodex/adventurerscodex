import { CoreManager, Notifications } from 'charactersheet/utilities';
import { AbilityScore } from './ability_score';
import { KOModel } from 'hypnos';
import { ProficiencyService } from 'charactersheet/services/character/proficiency_service';
import { isEmpty } from 'lodash';

import ko from 'knockout';


export class Skill extends KOModel {
    static __skeys__ = ['core', 'skills'];

    static mapping = {
        include: ['coreUuid'],
        abilityScore: {
            update: ({ data }) => {
                const abilityScore = new AbilityScore();
                if (!isEmpty(data)) {
                    abilityScore.importValues(ko.utils.unwrapObservable(data));
                    return abilityScore;
                }
            }
        }
    }

    coreUuid = ko.observable(null);
    name = ko.observable('');
    modifier = ko.observable(0);
    abilityScore = ko.observable(null);
    proficiency = ko.observable('not');
    abilityScore = ko.observable(new AbilityScore());

    toSchemaValues = (values) => {
        let schemaValues = {...values};
        if (values.abilityScore) {
            schemaValues.abilityScore = values.abilityScore.uuid;
        }
        if (values.modifier === '') {
            schemaValues.modifier = 0;
        }
        if (values.proficiency === '') {
            schemaValues.proficiency = 'not';
        }
        return schemaValues;
    }

    proficiencyBonus = ko.pureComputed(() => {
        var profBonus = ProficiencyService.sharedService().proficiency();
        if (this.proficiency() === 'half') {
            return Math.floor(profBonus / 2);
        } else if (this.proficiency() === 'expertise') {
            return profBonus * 2;
        } else if (this.proficiency() === 'proficient') {
            return profBonus;
        }
        return 0;
    })

    bonus = ko.pureComputed(()=> {
        let bonus = this.modifier() ? parseInt(this.modifier()) : 0;
        bonus += this.abilityScore().getModifier();
        bonus += this.proficiencyBonus();
        return bonus;
    })

    passiveBonus = ko.pureComputed(() => {
        return 10 + ko.utils.unwrapObservable(this.bonus);
    })

    updateAbilityScoreValues = async (abilityScore) => {
        if (this.abilityScore().uuid() === abilityScore.uuid()) {
            this.abilityScore().importValues(abilityScore.exportValues());
        }
    };

    load = async (params) => {
        const response = await this.ps.model.ps.read(params);
        this.importValues(response.object.exportValues());
    }

    create = async () => {
        const response = await this.ps.create();
        this.importValues(response.object.exportValues());
        Notifications.skill.added.dispatch(this);
    }

    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        Notifications.skill.changed.dispatch(this);
    }

    delete = async () => {
        await this.ps.delete();
        Notifications.skill.deleted.dispatch(this);
    }

}

Skill.validationConstraints = {
    rules: {
        name: {
            required: true,
            maxlength: 256
        },
        modifier: {
            type: 'number',
            pattern: '\\d*',
            min: -10000,
            max: 10000
        },
        abilityScore: {
            required: true
        }
    }
};
