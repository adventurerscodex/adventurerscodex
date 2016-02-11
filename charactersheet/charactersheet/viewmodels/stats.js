"use strict";

function StatsViewModel() {
	var self = this;

	self.health = ko.observable(new Health());
	self.otherStats = ko.observable(new OtherStats());
	self.blankHitDice = ko.observable(new HitDice());
	self.hitDiceList = ko.observableArray([]);
	self.hitDiceType = ko.observable('');
	self.hitDiceOptions = ko.observableArray(
        ['D4', 'D6', 'D8', 'D10', 'D12', 'D20']);
	self.deathSaveSuccessList = ko.observableArray([]);
	self.deathSaveFailureList = ko.observableArray([]);

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

// 		var hitDiceType = HitDiceType.findAllBy(CharacterManager.activeCharacter().key());
// 		if(hitDiceType.length > 0){
// 			self.hitDiceType = hitDiceType[0];
// 		}
// 		self.hitDiceType.characterId(CharacterManager.activeCharacter().key());

		var deathSaveSuccessList = DeathSave.findAllBy(CharacterManager.activeCharacter().key());
		if (deathSaveSuccessList.length > 0) {
			for(var i=0; i<3;i++)
				self.deathSaveSuccessList.push(deathSaveSuccessList[i]);
		}
		else{
			for(var i=0; i<3;i++)
				self.deathSaveSuccessList.push(new DeathSave());
		}
		self.deathSaveSuccessList().forEach(function(e, i, _) {
			e.characterId(CharacterManager.activeCharacter().key())
		});

		var deathSaveFailureList = DeathSave.findAllBy(CharacterManager.activeCharacter().key());
		if (deathSaveFailureList.length > 0) {
			for(var i=3; i<6;i++)
				self.deathSaveFailureList.push(deathSaveFailureList[i]);
		}
		else{
			for(var i=0; i<3;i++)
				self.deathSaveFailureList.push(new DeathSave());
		}
		self.deathSaveFailureList().forEach(function(e, i, _) {
			e.characterId(CharacterManager.activeCharacter().key())
		});

		//Subscriptions
		self.health().maxHitpoints.subscribe(self.dataHasChanged);
		self.health().damage.subscribe(self.dataHasChanged);
		self.otherStats().proficiency.subscribe(self.dataHasChanged);
		self.otherStats().ac.subscribe(self.dataHasChanged);
		Notifications.profile.changed.add(self.calculateHitDice);
	};

	self.unload = function() {
		self.health().save();
		self.otherStats().save();
		self.hitDiceList().forEach(function(e, i, _) {
			e.save();
		});
		self.deathSaveSuccessList().forEach(function(e, i, _) {
			e.save();
		});
		self.deathSaveFailureList().forEach(function(e, i, _) {
			e.save();
		});
	};

	self.clear = function() {
		self.health().clear();
		self.otherStats().clear();
		self.deathSaveSuccessList().forEach(function(e, i, _) {
			e.clear();
		});
		self.deathSaveFailureList().forEach(function(e, i, _) {
			e.clear();
		});
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
	    self.health().save();
		Notifications.stats.changed.dispatch();
	};
};
