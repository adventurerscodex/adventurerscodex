import { AbilityScore } from './ability_score';
import { CoreManager } from 'charactersheet/utilities';
import { KOModel } from 'hypnos';
import { ProficiencyService } from 'charactersheet/services/character/proficiency_service';
import ko from 'knockout';


export class Skill extends KOModel {
    static __skeys__ = ['core', 'skills'];

    static mapping = {
        include: ['coreUuid']
    };

    _dummy = ko.observable(null);
    coreUuid = ko.observable(null);
    name = ko.observable('');
    modifier = ko.observable(0);
    abilityScore = ko.observable(null);
    proficiency = ko.observable('not');
    bonusLabel = ko.observable('');
    passiveBonus = ko.observable('');

    toSchemaValues = (values) => {
        // TODO: I have to do this because when delete is called, it only includes the IDs in the
        // TODO: values object.
        if (values.abilityScore) {
            const abilityScoreId = values.abilityScore.uuid;
            values.abilityScore = abilityScoreId;
        }
        return values;
    }

    proficiencyScore() {
        this._dummy();
        var profBonus = ProficiencyService.sharedService().proficiency();

        if (this.proficiency() === 'half') {
            return Math.floor(profBonus / 2);
        } else if (this.proficiency() === 'expertise') {
            return profBonus * 2;
        } else if (this.proficiency() === 'proficient') {
            return profBonus;
        }

        // Will get to here if proficiency is null or empty
        return 0;
    }

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
    }

    bonus = async () => {
        var bonus = this.modifier() ? parseInt(this.modifier()) : 0;
        const abilityScore = await this.abilityScoreModifier();
        if (this.proficiency()) {
            bonus += this.proficiencyScore() + abilityScore;
        } else if (abilityScore) {
            bonus += abilityScore;
        }

        return bonus;
    };

    updateBonuses = async () => {
        var str = '+ 0';
        let bonus = await this.bonus();
        if (bonus) {
            str = bonus >= 0 ? '+ ' + bonus : '- ' +
            Math.abs(bonus);
        }

        str += ' <i><small>('
                + this.abilityScore().abbreviation() + ')</small></i>';
        this.bonusLabel(str);
        this.passiveBonus(10 + bonus);
    };

    nameLabel = ko.pureComputed(() => {
        this._dummy();
        var str = this.name();

        str += ' <i><small class="skills-ability-type">(' + this.abilityScore().abbreviation() + ')</small></i>';

        return str;
    });
}

Skill.validationConstraints = {
    rules: {
        name: {
            required: true,
            maxlength: 256
        },
        modifier: {
            min: -10000,
            max: 10000,
            number: true
        },
        abilityScore: {
            required: true
        }
    }
};
