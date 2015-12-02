"use strict";

var AbilityScoresSignaler = {
	changed: new signals.Signal()
};

var getModifier = function(value){
  return Math.floor((value - 10) / 2);
};

var getStrModifier = function(modifier){
  var modifier = getModifier(modifier);
  if (modifier >= 0){
    modifier = '+ ' + modifier;
  }
  else{
    modifier = '- ' + Math.abs(modifier);
  }
   return modifier;
};

function AbilityScoresViewModel() {
	var self = this;
	
	self.abilityScores = new AbilityScores();
	
	self.init = function() {};
	
	self.load = function() {
		var scores = AbilityScores.findBy(CharacterManager.activeCharacter().key());
		if (scores.length > 0) {
			self.abilityScores = scores[0];
		}
		self.abilityScores.characterId(CharacterManager.activeCharacter().key());

		//Subscriptions
		self.abilityScores.str.subscribe(self.abilityScores.save);
		self.abilityScores.dex.subscribe(self.abilityScores.save);
		self.abilityScores.con.subscribe(self.abilityScores.save);
		self.abilityScores.int.subscribe(self.abilityScores.save);
		self.abilityScores.wis.subscribe(self.abilityScores.save);
		self.abilityScores.cha.subscribe(self.abilityScores.save);	
	};
	
	self.unload = function() {
		self.abilityScores.save();
	};
};
