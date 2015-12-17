"use strict";

function SavingThrows() {
    var self = this;
    self.ps = PersistenceService.register(SavingThrows, self);

	self.characterId = ko.observable(null);
    self.name = ko.observable('');
    self.modifier = ko.observable(0);
    self.proficiency = ko.observable(false);
    
    //UI Methods
    
    self.proficiencyScore = function() {
    	var key = CharacterManager.activeCharacter().key();
    	var profBonus = 0;
    	try {
    		profBonus = parseInt(OtherStats.findBy(key)[0].proficiency());
		} catch(err) {};
		return profBonus;
	};
	
	self.abilityScoreModifier = function() {
    	var score = 0;
    	try {
	    	var key = CharacterManager.activeCharacter().key();
    		score = AbilityScores.findBy(key)[0].modifierFor(self._abilityScore());
		} catch(err) {};
		return parseInt(score);
	};

	self.bonus = ko.pureComputed(function() {
		var bonus = self.modifier() ? parseInt(self.modifier()) : 0;
		if (self.proficiency()) {
			bonus += self.proficiencyScore() + self.abilityScoreModifier();
		} else { 
			bonus += self.abilityScoreModifier(); 
		}
		return bonus;
	});

	self.modifierLabel = ko.pureComputed(function() {
		var str = self.bonus() >= 0 ? '+' + self.bonus() : String(self.bonus());
		return str;
	});
	
	self.proficiencyLabel = ko.pureComputed(function() {
		if (self.proficiency() === true) {
			return 'glyphicon glyphicon-ok';
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

    self.clear = function() {
        self.name('');
        self.modifier(0);
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
			proficiency: self.proficiency(),
		}
    };
};

SavingThrows.findAllBy = function(characterId) {
	return PersistenceService.findAll(SavingThrows).filter(function(e, i, _) {
		return e.characterId() === characterId;
	});
};
