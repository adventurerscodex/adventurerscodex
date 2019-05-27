import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { AbilityScore } from './ability_score';
import { CoreManager } from 'charactersheet/utilities';
import { KOModel } from 'hypnos';
import { ProficiencyService } from 'charactersheet/services/character/proficiency_service';
import ko from 'knockout';


export class SavingThrow extends KOModel {
    static __skeys__ = ['core', 'savingThrows'];

    static mapping = {
        include: ['coreUuid']
    };

    coreUuid = ko.observable(null);
    name = ko.observable('');
    abilityScore = ko.observable();
    abilityScoreObject = ko.observable(new AbilityScore());
    modifier = ko.observable(0);
    proficiency = ko.observable(false);

    toSchemaValues = (values) => {
        const abilityScoreId = values.abilityScore.uuid;
        values.abilityScore = abilityScoreId;
        return values;
    }

    proficiencyScore = () => {
        return ProficiencyService.sharedService().proficiency();
    };

    async updateAbilityScore() {
        try {
            var key = CoreManager.activeCore().uuid();
            const response = await AbilityScore.ps.read({coreUuid: key,
                uuid: this.abilityScore().uuid()});
            this.abilityScoreObject(response.object);
        } catch(err) {/*Ignore*/ }
    }

    modifierLabel = ko.pureComputed(() => {
        let bonus = this.modifier() ? parseInt(this.modifier()) : 0;
        const abilityScoreModifier = this.abilityScoreObject().getModifier();
        const proficiency = this.proficiency();
        if (proficiency) {
            bonus += this.proficiencyScore() + abilityScoreModifier;
        } else if (abilityScoreModifier) {
            bonus += abilityScoreModifier;
        } else {
            bonus = bonus != null ? bonus : null;
        }
        if (bonus === null) {
            return '+ 0';
        }
        return bonus >= 0 ? '+ ' + bonus : '- ' + Math.abs(bonus);
    })

    proficiencyLabel = ko.pureComputed(() => {
        if (this.proficiency() === true) {
            return 'fa fa-check';
        }
        return '';
    });
}

SavingThrow.validationConstraints = {
    rules: {
        modifier: {
            required: true,
            min: -10000,
            max: 10000
        }
    }
};
