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
    modifier = ko.observable(null);
    proficiency = ko.observable(false);
    modifierLabel = ko.observable('');

    toSchemaValues = (values) => {
        const abilityScoreId = values.abilityScore.uuid;
        values.abilityScore = abilityScoreId;
        return values;
    }

    // TODO: FIX WHEN SERVICE IS REFACTORED
    proficiencyScore = () => {
        // return ProficiencyService.sharedService().proficiency();
        return 2;
    };

    abilityScoreModifier = async () => {
        var score = null;
        try {
            var key = CoreManager.activeCore().uuid();
            const response = await AbilityScore.ps.list({coreUuid: key});
            score = response.objects.filter((score, i, _) => {
                return score.name() === this.abilityScore().name();
            })[0];
        } catch(err) { /*Ignore*/ }

        if (score === null) {
            return null;
        } else {
            return score.getModifier();
        }
    };

    bonus = async () => {
        var bonus = this.modifier() ? parseInt(this.modifier()) : null;
        const abilityScoreModifier = await this.abilityScoreModifier();
        const proficiency = this.proficiency();
        if (proficiency) {
            bonus += this.proficiencyScore() + abilityScoreModifier;
        } else if (abilityScoreModifier) {
            bonus += abilityScoreModifier;
        } else {
            bonus = bonus != null ? bonus : null;
        }
        return bonus;
    };

    updateModifierLabel = async () => {
        const bonus = await this.bonus();
        if (bonus === null) {
            return '+ 0';
        }
        var str = bonus >= 0 ? '+ ' + bonus : '- ' + Math.abs(bonus);
        this.modifierLabel(str);
    };

    proficiencyLabel = ko.pureComputed(() => {
        if (this.proficiency() === true) {
            return 'fa fa-check';
        }
        return '';
    });
}