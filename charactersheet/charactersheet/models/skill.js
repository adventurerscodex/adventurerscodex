"use strict";

function Skill() {
    var self = this;
	self.ps = PersistenceService.register(Skill, self);
    
    self.name = ko.observable('');
    self.modifier = ko.observable(0);
    self.abilityScore = ko.observable('');
    self.proficiency = ko.observable(false);
    
    self.updateFields = function() {
    	self.modifier.notifySubscribers();
    };

	//UI Methods
	
    self.proficiencyScore = function() {
    	var profBonus = OtherStats.find().proficiency();
		return profBonus ? parseInt(profBonus) : 0;
	};
	
	self.abilityScoreModifier = function() {
    	var score = AbilityScores.find().modifierFor(self.abilityScore());
		return parseInt(score);
	};

	self.bonus = ko.computed(function() {
		var bonus = self.modifier() ? parseInt(self.modifier()) : 0;
		if (self.proficiency()) {
			bonus += self.proficiencyScore() + self.abilityScoreModifier();
		} else { 
			bonus += self.abilityScoreModifier(); 
		}
		return bonus;
	});

	self.bonusLabel = ko.computed(function() {
		var str = self.bonus() >= 0 ? 
			'+' + self.bonus() : 
			String(self.bonus());
		str += ' <i><small>(' 
				+ self.abilityScore() + ')</small></i>'
		return str;
	});
	
	self.proficiencyLabel = ko.computed(function() {
		if (self.proficiency() === true) {
			return 'glyphicon glyphicon-ok';
		} 
		return '';
	});
	
	self.save = function() {
		self.ps.save();
	};

    self.clear = function() {
        self.name('');
        self.abilityScore('');
        self.modifier(0);
        self.proficiency(false);
    };

    self.importValues = function(values) {
        self.name(values.name);
        self.abilityScore(values.abilityScore);
        self.modifier(values.modifier);
        self.proficiency(values.proficiency);
    };

    self.exportValues = function() {
        return {
			name: self.name(),
			abilityScore: self.abilityScore(),
			modifier: self.modifier(),
			proficiency: self.proficiency(),
		}
    };
};

Skill.findAll = function() {
	return PersistenceService.findAll(Skill);
};
