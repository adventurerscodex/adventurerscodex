'use strict';

function Skill() {
    var self = this;
    self.ps = PersistenceService.register(Skill, self);

    self.characterId = ko.observable(null);
    self.name = ko.observable('');
    self.modifier = ko.observable(null);
    self.abilityScore = ko.observable('');
    self.proficiency = ko.observable(false);
    self.proficiencyType = ko.observable('');

    self.updateValues = function() {
        self.modifier.notifySubscribers();
    };

    //UI Methods

    self.proficiencyScore = function() {
        var key = CharacterManager.activeCharacter().key();
        var profBonus = 0;
        try{
            profBonus = OtherStats.findBy(
            CharacterManager.activeCharacter().key())[0].proficiency();
        } catch(err) { /* Ignore */}
        profBonus = parseInt(profBonus);
        if (self.proficiencyType() === 'half') {
            profBonus = Math.floor(profBonus / 2);
        } else if (self.proficiencyType() === 'expertise'){
            profBonus = profBonus * 2;
        }
        return parseInt(profBonus);
    };

    self.abilityScoreModifier = function() {
        var score = null;
        try {
            score = AbilityScores.findBy(
                CharacterManager.activeCharacter().key())[0].modifierFor(self.abilityScore());
        } catch(err) { /*Ignore*/ }

        return score ? parseInt(score) : 0;
    };

    self.bonus = ko.pureComputed(function() {
        var bonus = self.modifier() ? parseInt(self.modifier()) : 0;
        if (self.proficiency()) {
            bonus += self.proficiencyScore() + self.abilityScoreModifier();
        } else if (self.abilityScoreModifier()){
            bonus += self.abilityScoreModifier();
        }

        return bonus;
    });

    self.bonusLabel = ko.pureComputed(function() {
        var str = '+ 0';
        if (self.bonus()) {
            str = self.bonus() >= 0 ? '+ ' + self.bonus() : '- ' +
            Math.abs(self.bonus());
        }

        str += ' <i><small>('
                + self.abilityScore() + ')</small></i>';
        return str;
    });

    self.isProficient = ko.computed(function() {
        if (self.proficiencyType() === 'not'){
            self.proficiency(false);
        } else if (self.proficiencyType() === 'half'){
            self.proficiency(true);
        } else if (self.proficiencyType() === 'proficient'){
            self.proficiency(true);
        } else if (self.proficiencyType() === 'expertise'){
            self.proficiency(true);
        }
    });

    self.proficiencyLabel = ko.pureComputed(function() {
        if (self.proficiency() === true) {
            return 'fa fa-check';
        }
        return '';
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
        self.proficiency(false);
        self.proficiencyType('');
    };

    self.importValues = function(values) {
        self.characterId(values.characterId);
        self.name(values.name);
        self.abilityScore(values.abilityScore);
        self.modifier(values.modifier);
        self.proficiency(values.proficiency);
        self.proficiencyType(values.proficiencyType);
    };

    self.exportValues = function() {
        return {
            characterId: self.characterId(),
            name: self.name(),
            abilityScore: self.abilityScore(),
            modifier: self.modifier(),
            proficiency: self.proficiency(),
            proficiencyType: self.proficiencyType()
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
