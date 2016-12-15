'use strict';

function StatsViewModel() {
    var self = this;

    self.health = ko.observable(new Health());
    self.otherStats = ko.observable(new OtherStats());
    self.blankHitDice = ko.observable(new HitDice());
    self.hitDiceList = ko.observableArray([]);
    self.hitDiceType = ko.observable(new HitDiceType());
    self.deathSaveSuccessList = ko.observableArray([]);
    self.deathSaveFailureList = ko.observableArray([]);
    self.level = ko.observable('');
    self.experience = ko.observable('');

    var msg = 'Dexterity Bonus';
    self.initiativeTooltip = ko.observable(msg);

    self.init = function() {
        Notifications.global.save.add(function() {
            self.health().save();
            self.otherStats().save();
            self.hitDiceList().forEach(function(e, i, _) {
                e.save();
            });
            self.hitDiceType().save();
            self.deathSaveSuccessList().forEach(function(e, i, _) {
                e.save();
            });
            self.deathSaveFailureList().forEach(function(e, i, _) {
                e.save();
            });
        });
    };

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
            e.characterId(CharacterManager.activeCharacter().key());
        });

        self.calculateHitDice();

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
            for(var j=3; j<6;j++){
                self.deathSaveFailureList.push(deathSaveList[j]);
            }
        } else{
            for(var k=0; k<3;k++){
                self.deathSaveSuccessList.push(new DeathSave());
                self.deathSaveFailureList.push(new DeathSave());
            }
        }

        var profile = Profile.findBy(CharacterManager.activeCharacter().key())[0];
        if (profile) {
            self.level(profile.level());
            self.experience(profile.exp());
        }

        self.deathSaveSuccessList().forEach(function(e, i, _) {
            e.characterId(CharacterManager.activeCharacter().key());
        });
        self.deathSaveFailureList().forEach(function(e, i, _) {
            e.characterId(CharacterManager.activeCharacter().key());
        });

        //Subscriptions
        self.health().maxHitpoints.subscribe(self.dataHasChanged);
        self.health().damage.subscribe(self.dataHasChanged);
        self.otherStats().proficiency.subscribe(self.dataHasChanged);
        self.otherStats().ac.subscribe(self.dataHasChanged);
        self.level.subscribe(self.dataHasChanged);
        self.experience.subscribe(self.dataHasChanged);

        Notifications.profile.changed.add(self.calculateProficiencyLabel);
        Notifications.profile.changed.add(self.calculateHitDice);
        Notifications.skills.changed.add(self.calculatePassiveWisdom);
        Notifications.events.longRest.add(self.resetOnLongRest);
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

        Notifications.profile.changed.remove(self.calculateProficiencyLabel);
        Notifications.profile.changed.remove(self.calculateHitDice);
        Notifications.skills.changed.remove(self.calculatePassiveWisdom);
        Notifications.events.longRest.remove(self.resetOnLongRest);
        self.dataHasChanged();
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
            var h;
            if (pushOrPop === 'push') {
                h = new HitDice();
                h.characterId(CharacterManager.activeCharacter().key());
                h.save();
                self.hitDiceList.push(h);
            } else {
                h = self.hitDiceList.pop();
                h.delete();
            }
        }
    };

    /**
     * Fired when a long rest notification is recieved.
     * Resets health and hit dice.
     */
    self.resetOnLongRest = function() {
        self.resetHitDice();
        self.health().damage(0);
    };

    self.resetDamage = function() {
        self.health().damage(0);
    };

    /**
     * Reset the hit dice to an unused state up to the floor of half of the
     * character's level.
     *
     * This will be used primarily for long rest resets.
     */
    self.resetHitDice = function(){
        var profile = Profile.findBy(CharacterManager.activeCharacter().key())[0];
        var level = profile.level();
        var restoredHitDice = Math.floor(level / 2);

        ko.utils.arrayForEach(this.hitDiceList(), function(hitDice) {
            if (hitDice.hitDiceUsed() === true){
                if (restoredHitDice !== 0){
                    hitDice.hitDiceUsed(false);
                    restoredHitDice -= 1;
                }
            }
        });
    };

  /**
   * Tells the other stats model to recalculate it's passive wisdom value.
   */
    self.calculatePassiveWisdom = function() {
        self.otherStats().updateValues();
    };

    /**
    * Tells otherStats to run proficiencyLabel method
    */
    self.calculateProficiencyLabel = function() {
        self.otherStats().updateValues();
    };

    // Modal methods
    self.modifierHasFocus = ko.observable(false);

    self.modalFinishedAnimating = function() {
        self.modifierHasFocus(true);
    };

    /* Utility Methods */

    self.dataHasChanged = function() {
        self.otherStats().save();
        self.health().save();
        Notifications.stats.changed.dispatch();

        //Save level and exp in profile model
        var profile = Profile.findBy(CharacterManager.activeCharacter().key())[0];
        profile.level(self.level());
        profile.exp(self.experience());
        profile.save();
        Notifications.profile.changed.dispatch();
    };
}
