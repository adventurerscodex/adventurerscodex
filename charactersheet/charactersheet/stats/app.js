"use strict";

var StatsSignaler = {
	changed: new signals.Signal()
};

function StatsViewModel() {
	var self = this;
	
	self.health = ko.observable(new Health());
	self.otherStats = ko.observable(new OtherStats());
	self.blankHitDice = ko.observable(new HitDice());
	self.hitDiceList = ko.observableArray([]);
	
	self.enableAdd = ko.computed(function(){
		return self.hitDiceList().length < 21;
	});

	self.init = function() {};
	
	self.load = function() {
		var health = Health.findBy(CharacterManager.activeCharacter().key());
		if (health.length > 0) {
			self.health(health[0]);
		} else {
		    self.health(new Health());
		}
		self.health().characterId(CharacterManager.activeCharacter().key());
		
		var otherStats = OtherStats.findBy(CharacterManager.activeCharacter().key());
		if (otherStats.length > 0) {
			self.otherStats(otherStats[0]);
		} else {
		    self.otherStats(new OtherStats());
		}
		self.otherStats().characterId(CharacterManager.activeCharacter().key());

		var hitDiceList = HitDice.findAllBy(CharacterManager.activeCharacter().key());
		if (hitDiceList.length > 0) {
			self.hitDiceList(hitDiceList);
		}
		self.hitDiceList().forEach(function(e, i, _) {
			e.characterId(CharacterManager.activeCharacter().key())
		});
		
		//Subscriptions
		self.otherStats().proficiency.subscribe(self.dataHasChanged);
		ProfileSignaler.changed.add(self.calculateHitDice);
	};
	
	self.unload = function() {
		self.health().save();
		self.otherStats().save();
		self.hitDiceList().forEach(function(e, i, _) {
			e.save();
		});
	};

	self.clear = function() {
		self.health().clear();
		self.otherStats().clear();
	};
		
	self.calculateHitDice = function() {
		var profile = Profile.findBy(CharacterManager.activeCharacter().key())[0];
		var difference = parseInt(profile.level()) - self.hitDiceList().length;
		var pushOrPop = difference > 0 ? 'push' : 'pop';
		for (var i = 0; i < Math.abs(difference); i++) {
			if (pushOrPop === 'push') {
				var h = new HitDice();
				h.characterId(CharacterManager.activeCharacter().key());
				h.save();
				self.hitDiceList.push(h);
			} else {
				var h = self.hitDiceList.pop();
				h.delete();
			}
		}
	};
	
	self.dataHasChanged = function() {
	    self.otherStats().save();
		StatsSignaler.changed.dispatch();
	};
};

