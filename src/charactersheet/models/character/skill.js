import { AbilityScore } from './ability_score';
import { CoreManager } from 'charactersheet/utilities';
import { KOModel } from 'hypnos';
import ko from 'knockout';


export class Skill extends KOModel {
    static __skeys__ = ['core', 'skills'];

    static mapping = {
        include: ['coreUuid']
    };

    _dummy = ko.observable(null);
    coreUuid = ko.observable(null);
    name = ko.observable('');
    modifier = ko.observable(null);
    abilityScore = ko.observable(null);
    proficiency = ko.observable('');
    bonusLabel = ko.observable('');
    passiveBonus = ko.observable('');

    toSchemaValues = (values) => {
        const abilityScoreId = values.abilityScore.uuid;
        values.abilityScore = abilityScoreId;
        return values;
    }

    proficiencyScore() {
        this._dummy();
        var key = CoreManager.activeCore().uuid();
        // TODO: FIX WHEN SERVICE IS UPDATED
        // var profBonus = ProficiencyService.sharedService().proficiency();
        var profBonus = 5;

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

        // TODO: FIND A FIX FOR THIS HACK
        try {
            str += ' <i><small>('
                + this.abilityScore().name() + ')</small></i>';
        } catch(e) { }
        this.bonusLabel(str);
        this.passiveBonus(10 + bonus);
    };

    nameLabel = ko.pureComputed(() => {
        this._dummy();
        var str = this.name();

        // TODO: FIND A FIX FOR THIS HACK
        try {
            str += ' <i><small class="skills-ability-type">(' + this.abilityScore().name() + ')</small></i>';
        } catch(e) { }

        return str;
    });
}