import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { AbilityScore } from './ability_score';
import { CoreManager } from 'charactersheet/utilities';
import { KOModel } from 'hypnos';
import { Notifications } from 'charactersheet/utilities';
import { ProficiencyService } from 'charactersheet/services/character/proficiency_service';
import ko from 'knockout';


export class SavingThrow extends KOModel {
    static __skeys__ = ['core', 'savingThrows'];

    static mapping = {
        include: ['coreUuid'],
        abilityScore: {
            update: ({ data }) => {
                const abilityScore = new AbilityScore();
                if (data) {
                    abilityScore.importValues(data);
                }
                return abilityScore;
            }
        }
    };

    coreUuid = ko.observable(null);
    name = ko.observable('');
    abilityScore = ko.observable(new AbilityScore());
    modifier = ko.observable(0);
    proficiency = ko.observable(false);

    toSchemaValues = (values) => ({
        ...values,
        abilityScore: values.abilityScore.uuid
    });

    proficiencyBonus = ko.pureComputed(() => {
        const proficiencyBonus = ProficiencyService.sharedService().proficiency();
        if (this.proficiency()) {
            return proficiencyBonus;
        }
        return 0;
    });

    bonus = ko.pureComputed(() => {
        let bonus = this.modifier() ? parseInt(this.modifier()) : 0;
        bonus += this.abilityScore().getModifier();
        bonus += this.proficiencyBonus();
        return bonus;
    });

    proficiencyLabel = ko.pureComputed(() => {
        if (this.proficiency() === true) {
            return 'fa fa-check';
        }
        return '';
    });

    load = async (params) => {
        const response = await this.ps.read(params);
        this.importValues(response.object.exportValues());
        // Saving throws have no notification
    }


    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        // Saving throws have no notification
    }
}

SavingThrow.validationConstraints = {
    fieldParams: {
        modifier: {
            type: 'number',
            pattern: '\\d*',
            required: true,
            min: -10000,
            max: 10000
        }
    }
};
