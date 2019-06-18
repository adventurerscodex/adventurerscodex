import { CoreManager, Notifications } from 'charactersheet/utilities';
import { AbilityScore } from './ability_score';
import { KOModel } from 'hypnos';
import { ProficiencyService } from 'charactersheet/services/character/proficiency_service';
import autoBind from 'auto-bind';
import ko from 'knockout';


export class Skill extends KOModel {
    static __skeys__ = ['core', 'skills'];

    static mapping = {
        include: ['coreUuid', 'uuid'],
        abilityScore: {
            create: ({ data }) => {
                const abilityScore = new AbilityScore();
                if (data) {
                    abilityScore.importValues(data);
                }
                return ko.observable(abilityScore);
            },
            update: ({ data }) => {
                const abilityScore = new AbilityScore();
                if (data) {
                    abilityScore.importValues(data);
                }
                return abilityScore;
            }
        }
    }

    name = ko.observable('');
    coreUuid = ko.observable(null);
    name = ko.observable('');
    modifier = ko.observable(0);
    abilityScore = ko.observable(null);
    proficiency = ko.observable('not');
    bonusNumber = ko.observable('');
    abilityScore = ko.observable(new AbilityScore());

    toSchemaValues = (values) => ({
        ...values,
        modifier: values.modifier !== '' ? values.modifier : 0,
        proficiency: values.proficiency !== '' ? values.proficiency : 'not',
        abilityScore: values.abilityScore.uuid
    })
    //     // TODO: I have to do this because when delete is called, it only includes the IDs in the
    //     // TODO: values object.
    //     if (values.abilityScore) {
    //         const abilityScoreId = ko.utils.unwrapObservable(ko.utils.unwrapObservable(values.abilityScore).uuid);
    //         values.abilityScore = abilityScoreId;
    //     }
    //
    //     // assign default values if they are somehow not provided by service code
    //     if (values.modifier === '') {
    //         values.modifier = 0;
    //     }
    //
    //     if (values.proficiency === '') {
    //         values.proficiency = 'not';
    //     }
    //
    //     return values;
    // }

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

    bonus = ko.pureComputed(() => {
        let bonus = this.modifier() ? parseInt(this.modifier()) : 0;
        bonus += this.abilityScore().getModifier();
        bonus += this.proficiencyBonus();
        return bonus;
    });

    passiveBonus = ko.pureComputed(() => {
        return 10 + this.bonus();
    })

    updateAbilityScoreValues = async (abilityScore) => {
        if (this.abilityScore().uuid() === abilityScore.uuid()) {
            this.abilityScore().importValues(abilityScore.exportValues());
        }
    };

    save = async () => {
        const response = await this.ps.save();
        Notifications.skills.changed.dispatch(this);
        return response;
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
            min: -10000,
            max: 10000
        },
        abilityScore: {
            required: true
        }
    }
};
