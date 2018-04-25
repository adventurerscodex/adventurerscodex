import { AbilityScores } from './ability_scores';
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

    abilityScoreModifier() {
        this._dummy();
        var score = null;
        // TODO: FIX WHEN ABILITY SCORES ARE IN PLACE
        // try {
        //     score = PersistenceService.findBy(AbilityScores, 'characterId',
        //         CoreManager.activeCore().uuid())[0].modifierFor(self.abilityScore());
        // } catch(err) { /*Ignore*/ }

        return score ? parseInt(score) : 0;
    }

    bonus = ko.pureComputed(() => {
        this._dummy();
        var bonus = this.modifier() ? parseInt(this.modifier()) : 0;
        if (this.proficiency()) {
            bonus += this.proficiencyScore() + this.abilityScoreModifier();
        } else if (this.abilityScoreModifier()) {
            bonus += this.abilityScoreModifier();
        }

        return bonus;
    });

    bonusLabel = ko.pureComputed(() => {
        this._dummy();
        var str = '+ 0';
        if (this.bonus()) {
            str = this.bonus() >= 0 ? '+ ' + this.bonus() : '- ' +
            Math.abs(this.bonus());
        }

        // TODO: FIND A FIX FOR THIS HACK
        try {
            str += ' <i><small>('
                + this.abilityScore().name() + ')</small></i>';
        } catch(e) {}
        return str;
    });

    nameLabel = ko.pureComputed(() => {
        this._dummy();
        var str = this.name();

        // TODO: FIND A FIX FOR THIS HACK
        try {
            str += ' <i><small class="skills-ability-type">(' + this.abilityScore().name() + ')</small></i>';
        } catch(e) {}

        return str;
    });

    passiveBonus = ko.pureComputed(() => {
        this._dummy();
        var bonus = 10 + this.bonus();

        return bonus;
    });
}