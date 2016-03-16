"use strict";

function StatsViewModel() {
	var self = this;

	self.health = ko.observable(new Health());
	self.otherStats = ko.observable(new OtherStats());
	self.blankHitDice = ko.observable(new HitDice());
	self.hitDiceList = ko.observableArray([]);
	self.hitDiceType = ko.observable(new HitDiceType());
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
        
        self.calculateHitDice()

		var hitDiceType = HitDiceType.findAllBy(CharacterManager.activeCharacter().key());
		if(hitDiceType.length > 0){
			self.hitDiceType(hitDiceType[0]);
		}
		else {
			self.hitDiceType(new HitDiceType());
		}
		self.hitDiceType().characterId(CharacterManager.activeCharacter().key());

		var deathSaveList = DeathSave.findAllBy(CharacterManager.activeCharacter().key());
		self.deathSaveSuccessList([]);
		self.deathSaveFailureList([]);
		if (deathSaveList.length > 0) {
			for(var i=0; i<3;i++){
				self.deathSaveSuccessList.push(deathSaveList[i]);
			}
			for(var i=3; i<6;i++){
				self.deathSaveFailureList.push(deathSaveList[i]);
			}
		}
		else{
			for(var i=0; i<3;i++){
				self.deathSaveSuccessList.push(new DeathSave());
				self.deathSaveFailureList.push(new DeathSave());
			}
		}

		self.deathSaveSuccessList().forEach(function(e, i, _) {
			e.characterId(CharacterManager.activeCharacter().key())
		});
		self.deathSaveFailureList().forEach(function(e, i, _) {
			e.characterId(CharacterManager.activeCharacter().key())
		});

       	//Subscriptions
		self.health().maxHitpoints.subscribe(self.dataHasChanged);
		self.health().damage.subscribe(self.dataHasChanged);
		self.otherStats().proficiency.subscribe(self.dataHasChanged);
		self.otherStats().ac.subscribe(self.dataHasChanged);
		Notifications.profile.changed.add(self.calculateHitDice);
	    Notifications.skills.changed.add(self.calculatePassiveWisdom);
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
		self.hitDiceType().save();
        self.clear();
		Notifications.profile.changed.remove(self.calculateHitDice);
	    Notifications.skills.changed.remove(self.calculatePassiveWisdom);
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
        self.hitDiceList([]);
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

    /**
     * Tells the other stats model to recalculate it's passive wisdom value.
     */
	self.calculatePassiveWisdom = function() {
        self.otherStats().updateValues();
	};

	self.dataHasChanged = function() {
	    self.otherStats().save();
	    self.health().save();
		Notifications.stats.changed.dispatch();
	};
};
