"use strict";

var StatsSignaler = {
	changed: new signals.Signal()
};

function StatsViewModel() {
	var self = this;
	
	self.health = new Health();
	self.otherStats = new OtherStats();
	self.blankHitDice = new HitDice();
	self.hitDiceList = ko.observableArray([]);
	
	self.enableAdd = ko.computed(function(){
		return self.hitDiceList().length < 21;
	});

	self.init = function() {
	
	};
	
	self.load = function() {
		var health = Health.find();
		if (health) {
			self.health = health;
		}
		var otherStats = OtherStats.find();
		if (otherStats) {
			self.otherStats = otherStats;
		}
		var hitDiceList = HitDice.findAll();
		if (hitDiceList) {
			self.hitDiceList(hitDiceList);
		}
		
		self.otherStats.proficiency.subscribe(self.otherStats.save);
	};
	
	self.unload = function() {
		self.health.save();
		self.otherStats.save();
		$.each(self.hitDiceList(), function(_, e) {
			e.save();
		});
	};

	self.clear = function() {
		self.health.clear();
		self.otherStats.clear();
	};
		
	self.addHitDice = function() {
		self.hitDiceList.push(self.blankHitDice());
		self.blankHitDice(new HitDice());
	};
	
	self.removeHitDice = function() {
		self.hitDiceList.remove(self.hitDiceList.pop());
	};
};

