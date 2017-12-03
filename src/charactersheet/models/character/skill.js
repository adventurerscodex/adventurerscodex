import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { AbilityScores } from './ability_scores';
import { CharacterManager } from 'charactersheet/utilities';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { ProficiencyService } from 'charactersheet/services';
import ko from 'knockout';


export function Skill() {
    var self = this;
    self.ps = PersistenceService.register(Skill, self);
    self.mapping = {
        include: ['characterId', 'name', 'modifier', 'abilityScore', 'proficiency']
    };

    self._dummy = ko.observable(null);
    self.characterId = ko.observable(null);
    self.name = ko.observable('');
    self.modifier = ko.observable(null);
    self.abilityScore = ko.observable('');
    self.proficiency = ko.observable('');

    self.updateValues = function() {
        self._dummy.notifySubscribers();
    };

    //UI Methods

    self.proficiencyScore = function() {
        self._dummy();
        var key = CharacterManager.activeCharacter().key();
        var profBonus = ProficiencyService.sharedService().proficiency();

        if (self.proficiency() === 'half') {
            return Math.floor(profBonus / 2);
        } else if (self.proficiency() === 'expertise') {
            return profBonus * 2;
        } else if (self.proficiency() === 'proficient') {
            return profBonus;
        }

        // Will get to here if proficiency is null or empty
        return 0;
    };

    self.abilityScoreModifier = function() {
        self._dummy();
        var score = null;
        try {
            score = PersistenceService.findBy(AbilityScores, 'characterId',
                CharacterManager.activeCharacter().key())[0].modifierFor(self.abilityScore());
        } catch(err) { /*Ignore*/ }

        return score ? parseInt(score) : 0;
    };

    self.bonus = ko.pureComputed(function() {
        self._dummy();
        var bonus = self.modifier() ? parseInt(self.modifier()) : 0;
        if (self.proficiency()) {
            bonus += self.proficiencyScore() + self.abilityScoreModifier();
        } else if (self.abilityScoreModifier()) {
            bonus += self.abilityScoreModifier();
        }

        return bonus;
    });

    self.bonusLabel = ko.pureComputed(function() {
        self._dummy();
        var str = '+ 0';
        if (self.bonus()) {
            str = self.bonus() >= 0 ? '+ ' + self.bonus() : '- ' +
            Math.abs(self.bonus());
        }

        str += ' <i><small>('
                + self.abilityScore() + ')</small></i>';
        return str;
    });

    self.nameLabel = ko.pureComputed(function(){
        self._dummy();
        var str = self.name();

        str += ' <i><small class="skills-ability-type">(' + self.abilityScore() + ')</small></i>';

        return str;
    });

    self.passiveBonus = ko.pureComputed(function() {
        self._dummy();
        var bonus = 10 + self.bonus();

        return bonus;
    });

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };

    self.clear = function() {
        var values = new Skill().exportValues();
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.importValues = function(values) {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.exportValues = function() {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        return ko.mapping.toJS(self, mapping);
    };
}
Skill.__name = "Skill";

PersistenceService.addToRegistry(Skill);
