'use strict';

function SavingThrows() {
    var self = this;
    self.ps = PersistenceService.register(SavingThrows, self);

    self.characterId = ko.observable(null);
    self.name = ko.observable('');
    self.modifier = ko.observable(null);
    self.proficiency = ko.observable(false);

    //UI Methods

    self.proficiencyScore = function() {
        var key = CharacterManager.activeCharacter().key();
        var profBonus = 0;
        try {
            profBonus = OtherStats.findBy(
                CharacterManager.activeCharacter().key())[0].proficiencyLabel();
        } catch(err) { /*Ignore*/ }
        return profBonus;
    };

    self.abilityScoreModifier = function() {
        var score = null;
        try {
            var key = CharacterManager.activeCharacter().key();
            score = AbilityScores.findBy(key)[0].modifierFor(self._abilityScore());
        } catch(err) { /*Ignore*/ }
        if (score === null){
            return null;
        }
        else {
            return parseInt(score);
        }
    };

    self.bonus = ko.pureComputed(function() {
        var bonus = self.modifier() ? parseInt(self.modifier()) : null;
        if (self.proficiency()) {
            bonus += self.proficiencyScore() + self.abilityScoreModifier();
        }
        else if (self.abilityScoreModifier()) {
            bonus += self.abilityScoreModifier();
        }
        else {
            bonus = bonus != null ? bonus : null;
        }
        return bonus;
    });

    self.modifierLabel = ko.pureComputed(function() {
        if (self.bonus() === null){
            return '+ 0';
        }
        var str = self.bonus() >= 0 ? '+ ' + self.bonus() : '- ' + Math.abs(self.bonus());
        return str;
    });

    self.proficiencyLabel = ko.pureComputed(function() {
        if (self.proficiency() === true) {
            return 'fa fa-check';
        }
        return '';
    });

    //Utility Methods

    self._abilityScore = function() {
        return self.name().toLowerCase().substring(0,3);
    };

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };

    self.clear = function() {
        self.name('');
        self.modifier(null);
        self.proficiency(false);
    };

    self.updateValues = function() {
        self.modifier.notifySubscribers();
        self.proficiency.notifySubscribers();
    };

    self.importValues = function(values) {
        self.characterId(values.characterId);
        self.name(values.name);
        self.modifier(values.modifier);
        self.proficiency(values.proficiency);
    };

    self.exportValues = function() {
        return {
            characterId: self.characterId(),
            name: self.name(),
            modifier: self.modifier(),
            proficiency: self.proficiency()
        };
    };
}

SavingThrows.findAllBy = function(characterId) {
    return PersistenceService.findAll(SavingThrows).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};
