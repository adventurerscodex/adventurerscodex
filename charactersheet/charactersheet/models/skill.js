"use strict";

function Skill() {
    var self = this;
	self.ps = PersistenceService.register(Skill, self);

	self.characterId = ko.observable(null);
    self.name = ko.observable('');
    self.modifier = ko.observable(null);
    self.abilityScore = ko.observable('');
    self.proficiency = ko.observable(false);

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
    	} catch(err){};
		return parseInt(profBonus);
	};

	self.abilityScoreModifier = function() {
    	var score = null;
    	try {
    		score = AbilityScores.findBy(
    			CharacterManager.activeCharacter().key())[0].modifierFor(self.abilityScore());
		} catch(err) {};
    if (score === null){
      return null
    }
    else {
      return parseInt(score);
    }
	};

	self.bonus = ko.pureComputed(function() {
		var bonus = self.modifier() ? parseInt(self.modifier()) : 0;
		if (self.proficiency()) {
			bonus += self.proficiencyScore() + self.abilityScoreModifier();
		} else if (self.abilityScoreModifier()){
			  bonus += self.abilityScoreModifier();
		}
          else {
              bonus = null
     }
		return bonus;
	});

	self.bonusLabel = ko.pureComputed(function() {
    if (self.bonus() === null) {
        var str = ''
    }
    else {
      var str = self.bonus() >= 0 ?
        '+' + self.bonus() :
        String(self.bonus());
    }
		str += ' <i><small>('
				+ self.abilityScore() + ')</small></i>'
		return str;
	});

	self.proficiencyLabel = ko.pureComputed(function() {
		if (self.proficiency() === true) {
			return 'glyphicon glyphicon-ok';
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
			proficiency: self.proficiency(),
		}
    };
};

Skill.findAllBy = function(characterId) {
	return PersistenceService.findAll(Skill).filter(function(e, i, _) {
		return e.characterId() === characterId;
	});
};
