'use strict';

function Skill() {
    var self = this;
    self.ps = PersistenceService.register(Skill, self);

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
        var profBonus = 0;
        try{
            profBonus = OtherStats.findBy(
                CharacterManager.activeCharacter().key())[0].proficiencyLabel();
        } catch(err) { /* Ignore */}
        profBonus = parseInt(profBonus);

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
            score = AbilityScores.findBy(
                CharacterManager.activeCharacter().key())[0].modifierFor(self.abilityScore());
        } catch(err) { /*Ignore*/ }

        return score ? parseInt(score) : 0;
    };

    self.bonus = ko.pureComputed(function() {
        self._dummy();
        var bonus = self.modifier() ? parseInt(self.modifier()) : 0;
        if (self.proficiency()) {
            bonus += self.proficiencyScore() + self.abilityScoreModifier();
        } else if (self.abilityScoreModifier()){
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

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };

    self.clear = function() {
        self.name('');
        self.abilityScore('');
        self.modifier(null);
        self.proficiency('');
    };

    self.importValues = function(values) {
        self.characterId(values.characterId);
        self.name(values.name);
        self.abilityScore(values.abilityScore);
        self.modifier(values.modifier);
        self.proficiency(values.proficiency);
    };

    self.exportValues = function() {
        return {
            characterId: self.characterId(),
            name: self.name(),
            abilityScore: self.abilityScore(),
            modifier: self.modifier(),
            proficiency: self.proficiency()
        };
    };
}

Skill.findAllBy = function(characterId) {
    return PersistenceService.findAll(Skill).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};

/**
 * Given a character id and a case insensitive skill name,
 * return the relevant Skill(s).
 */
Skill.findAllByKeyAndName = function(characterId, skillName) {
    return PersistenceService.findAll(Skill).filter(function(e, i, _) {
        return (e.characterId() === characterId
            && e.name().toLowerCase() == skillName.toLowerCase());
    });
};
