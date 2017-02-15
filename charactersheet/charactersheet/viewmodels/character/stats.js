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
    self.editItem = ko.observable();
    self.modalOpen = ko.observable(false);
    self.level = ko.observable('');
    self.experience = ko.observable('');
    self._dummy = ko.observable();
    self._otherStatsDummy = ko.observable();

    self.initiativePopover = ko.observable();
    self.proficiencyPopover = ko.observable();

    self.load = function() {
        Notifications.global.save.add(self.save);

        var key = CharacterManager.activeCharacter().key();
        var health = PersistenceService.findBy(Health, 'characterId', key);
        if (health.length > 0) {
            self.health(health[0]);
        } else {
            self.health(new Health());
        }
        self.health().characterId(key);

        var otherStats = PersistenceService.findBy(OtherStats, 'characterId', key);
        if (otherStats.length > 0) {
            self.otherStats(otherStats[0]);
        } else {
            self.otherStats(new OtherStats());
        }
        self.otherStats().characterId(key);

        var hitDiceList = PersistenceService.findBy(HitDice, 'characterId', key);
        if (hitDiceList.length > 0) {
            self.hitDiceList(hitDiceList);
        }
        self.hitDiceList().forEach(function(e, i, _) {
            e.characterId(key);
        });

        self.calculateHitDice();

        var hitDiceType = PersistenceService.findBy(HitDiceType, 'characterId', key);
        if(hitDiceType.length > 0){
            self.hitDiceType(hitDiceType[0]);
        }
        else {
            self.hitDiceType(new HitDiceType());
        }
        self.hitDiceType().characterId(key);

        var deathSaveList = PersistenceService.findBy(DeathSave, 'characterId', key);
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

        var profile = PersistenceService.findBy(Profile, 'characterId', key)[0];
        if (profile) {
            self.level(profile.level());
            self.experience(profile.exp());
        }

        self.deathSaveSuccessList().forEach(function(e, i, _) {
            e.characterId(key);
        });
        self.deathSaveFailureList().forEach(function(e, i, _) {
            e.characterId(key);
        });

        //Subscriptions
        self.health().maxHitpoints.subscribe(self.dataHasChanged);
        self.health().damage.subscribe(self.dataHasChanged);
        self.otherStats().proficiency.subscribe(self.dataHasChanged);
        self.otherStats().inspiration.subscribe(self.dataHasChanged);
        self.otherStats().initiative.subscribe(self._otherStatsDummy.valueHasMutated);
        self.otherStats().ac.subscribe(self.dataHasChanged);
        self.level.subscribe(self.dataHasChanged);
        self.experience.subscribe(self.dataHasChanged);

        Notifications.profile.changed.add(self._dummy.valueHasMutated);
        Notifications.profile.changed.add(self.calculateHitDice);
        Notifications.events.longRest.add(self.resetOnLongRest);
        Notifications.abilityScores.changed.add(self._otherStatsDummy.valueHasMutated);
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

        Notifications.profile.changed.remove(self.calculatedProficiencyLabel);
        Notifications.profile.changed.remove(self.calculateHitDice);
        Notifications.events.longRest.remove(self.resetOnLongRest);
        Notifications.abilityScores.changed.remove(self.calculateInitiativeLabel);
        Notifications.global.save.remove(self.save);
        self.dataHasChanged();
    };

    self.save = function() {
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

    self.editHealth = function() {
        self.editItem(new Health());
        self.editItem().importValues(self.health().exportValues());
        self.modalOpen(true);
    };

    self.calculateHitDice = function() {
        var profile = PersistenceService.findBy(Profile, 'characterId',
            CharacterManager.activeCharacter().key())[0];

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
    self.resetHitDice = function() {
        var profile = PersistenceService.findBy(Profile, 'characterId',
            CharacterManager.activeCharacter().key())[0];
        var level = profile.level();
        var restoredHitDice = Math.floor(level / 2);

        ko.utils.arrayForEach(this.hitDiceList(), function(hitDice) {
            if (hitDice.hitDiceUsed() === true) {
                if (restoredHitDice !== 0) {
                    hitDice.hitDiceUsed(false);
                    restoredHitDice -= 1;
                }
            }
        });
    };

    // Calculate proficiency label and popover
    self.calculatedProficiencyLabel = ko.pureComputed(function() {
        self._dummy();
        var proficiencyService = ProficiencyService.sharedService();
        var level = proficiencyService.proficiencyBonusByLevel();
        var proficiency = proficiencyService.proficiencyModifier();
        self.updateProficiencyPopoverMessage(level, proficiency);

        return ProficiencyService.sharedService().proficiency();
    });

    self.updateProficiencyPopoverMessage = function(level, proficiency) {
        self.proficiencyPopover('<span style="white-space:nowrap;"><strong>Proficiency</strong> = '
            + '(<strong>Level</strong> / 4) + 1 + <strong>Modifier</strong></span></br>Proficiency = '
            + level + ' + 1 + ' + proficiency);
    };

    // Calculate initiative label and popover
    self.calculateInitiativeLabel = ko.pureComputed(function() {
        self._otherStatsDummy();
        var key = CharacterManager.activeCharacter().key();
        var abilityScores = PersistenceService.findFirstBy(AbilityScores, 'characterId', key);
        var dexterityModifier = getModifier(abilityScores.dex()) ? getModifier(abilityScores.dex()) : 0;
        var initiativeModifier = self.otherStats().initiative() ? parseInt(self.otherStats().initiative()) : 0;
        self.updateInitiativePopoverMessage(dexterityModifier, initiativeModifier);

        return dexterityModifier + initiativeModifier;
    });

    self.updateInitiativePopoverMessage = function(dexterityModifier, initiativeModifier) {
        self.initiativePopover('<span style="white-space:nowrap;"><strong>Initiative</strong> = ' +
        'Dexterity Modifier + Modifier</span></br>'
            + 'Initiative = ' + dexterityModifier + ' + ' +  initiativeModifier );
    };

    // Modal methods
    self.modifierHasFocus = ko.observable(false);

    self.modalFinishedAnimating = function() {
        self.modifierHasFocus(true);
    };

    self.modalFinishedClosing = function() {
        if (self.modalOpen()) {
            self.health().importValues(self.editItem().exportValues());
        }
        self.modalOpen(false);
        self.health().save();
    };

    /* Utility Methods */

    self.dataHasChanged = function() {
        self.otherStats().save();
        self.health().save();
        Notifications.stats.changed.dispatch();

        //Save level and exp in profile model
        var profile = PersistenceService.findBy(Profile, 'characterId',
            CharacterManager.activeCharacter().key())[0];
        profile.level(self.level());
        profile.exp(self.experience());
        profile.save();
        Notifications.profile.changed.dispatch();
    };
}
