"use strict";

function Stats() {
	var self = this;
	
	self.health = new Health();
	self.otherStats = new OtherStats();
	self.blankHitDice = ko.observable(new HitDice());
	self.hitDiceList = ko.observableArray([]);
	self.enableAdd = ko.computed(function(){
		return self.hitDiceList().length < 21;
	});

	self.clear = function() {
		self.health.clear();
		self.otherStats.clear();
	};
	
	self.importValues = function(values) {
		self.health.importValues(values.health);
		self.otherStats.importValues(values.otherStats);
		var newDice = [];
		for (var i in values.hitDiceList) {
			var dice = values.hitDiceList[i];
			var newDice = new HitDice();
			newDice.importValues(dice);
			self.hitDiceList.push(newDice);
		}
	};
	
	self.exportValues = function() {
		var hitDices = [];
		for (var i in self.hitDiceList()) {
			var dice = self.hitDiceList()[i];
			hitDices.push(dice.exportValues());
		}
		return {
			health: self.health.exportValues(),
			otherStats: self.otherStats.exportValues(),
			hitDiceList: hitDices
		}
	};
	
	self.addHitDice = function() {
		self.hitDiceList.push(self.blankHitDice());
		self.blankHitDice(new HitDice());
	};
	
	self.removeHitDice = function() {
		self.hitDiceList.remove(self.hitDiceList.pop());
	};
};

