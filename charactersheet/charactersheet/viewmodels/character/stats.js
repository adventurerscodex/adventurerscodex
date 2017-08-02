'use strict';

function StatsViewModel() {
    var self = this;

    self.health = ko.observable(new Health());
    self.otherStats = ko.observable(new OtherStats());
    self.armorClass = ko.observable();
    self.blankHitDice = ko.observable(new HitDice());
    self.hitDiceList = ko.observableArray([]);
    self.hitDiceType = ko.observable(new HitDiceType());
    self.deathSaveSuccessList = ko.observableArray([]);
    self.deathSaveFailureList = ko.observableArray([]);
    self.editHealthItem = ko.observable();
    self.editHitDiceItem = ko.observable();
    self.modalOpen = ko.observable(false);
    self.level = ko.observable('');
    self.experience = ko.observable('');
    self._dummy = ko.observable();
    self._otherStatsDummy = ko.observable();

    self.initiativePopover = ko.observable();
    self.proficiencyPopover = ko.observable();
    self.armorClassPopover = ko.observable();

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
        self.health().maxHitpoints.subscribe(self.maxHpDataHasChanged);
        self.health().damage.subscribe(self.damageDataHasChanged);
        self.health().tempHitpoints.subscribe(self.tempHpDataHasChanged);
        self.hitDiceList().forEach(function(hitDice, i, _) {
            hitDice.hitDiceUsed.subscribe(self.hitDiceDataHasChanged);
        });
        self.hitDiceType.subscribe(self.hitDiceTypeDataHasChanged);
        self.otherStats().proficiency.subscribe(self.proficiencyHasChanged);
        self.otherStats().inspiration.subscribe(self.inspirationHasChanged);
        self.otherStats().initiative.subscribe(self._otherStatsDummy.valueHasMutated);
        self.otherStats().armorClassModifier.subscribe(self.armorClassModifierDataHasChanged);
        self.level.subscribe(self.levelDataHasChanged);
        self.experience.subscribe(self.experienceDataHasChanged);
        self.deathSaveFailureList().forEach(function(save, idx, _) {
            save.deathSaveFailure.subscribe(self._alertPlayerHasDied);
        });
        self.deathSaveSuccessList().forEach(function(save, idx, _) {
            save.deathSaveSuccess.subscribe(self._alertPlayerIsStable);
        });

        Notifications.profile.changed.add(self._dummy.valueHasMutated);
        Notifications.profile.level.changed.add(self.calculateHitDice);
        Notifications.events.longRest.add(self.resetOnLongRest);
        Notifications.armorClass.changed.add(self.updateArmorClass);
        Notifications.abilityScores.changed.add(self._otherStatsDummy.valueHasMutated);
        self.healthDataHasChange();
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
        Notifications.armorClass.changed.remove(self.updateArmorClass);
        Notifications.abilityScores.changed.remove(self.calculateInitiativeLabel);
        Notifications.global.save.remove(self.save);
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
        self.editHealthItem(new Health());
        self.editHitDiceItem(new HitDiceType());
        self.editHealthItem().importValues(self.health().exportValues());
        self.editHitDiceItem().importValues(self.hitDiceType().exportValues());
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
        self.health().save();
        self.damageDataHasChanged();
    };

    self.resetDamage = function() {
        self.health().damage(0);
        self.health().save();
        self.damageDataHasChanged();
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
        var restoredHitDice = Math.floor(level / 2) < 1 ? 1 : Math.floor(level / 2);

        ko.utils.arrayForEach(this.hitDiceList(), function(hitDice) {
            if (hitDice.hitDiceUsed() === true) {
                if (restoredHitDice !== 0) {
                    hitDice.hitDiceUsed(false);
                    restoredHitDice -= 1;
                }
            }
        });
        self.hitDiceList().forEach(function(e, i, _) {
            e.save();
        });
        self.hitDiceDataHasChanged();
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
            + '(<strong>Level</strong> / 4) + 1 + <strong>Modifier</strong></span><br />Proficiency = '
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
        'Dexterity Modifier + Modifier</span><br />'
            + 'Initiative = ' + dexterityModifier + ' + ' +  initiativeModifier );
    };

    self.updateArmorClassPopoverMessage = function(dexterityModifier, initiativeModifier) {
        var acService = ArmorClassService.sharedService();
        var baseAC = acService.baseArmorClass(),
            dexMod = acService.dexBonus(),
            magicModifiers = acService.equippedArmorMagicalModifier() + acService.equippedShieldMagicalModifier(),
            shield = acService.hasShield() ? acService.getEquippedShieldBonus() : 0;

        var otherStats = PersistenceService.findFirstBy(OtherStats, 'characterId',
            CharacterManager.activeCharacter().key());
        var modifier = 0;
        if (otherStats) {
            modifier = otherStats.armorClassModifier() ? otherStats.armorClassModifier() : 0;
        }

        self.armorClassPopover('<span><strong>Armor Class</strong> = ' +
        'Base AC + Dexterity Modifier + Magical Modifier(s) + Shield + Modifier</span><br />' +
        '<strong>Armor Class</strong> = ' + baseAC + ' + ' + dexMod + ' + ' +  magicModifiers +
        ' + ' + shield + ' + ' + modifier);
    };

    self.updateArmorClass = function() {
        self.updateArmorClassPopoverMessage();
        self.armorClass(ArmorClassService.sharedService().armorClass());
    };

    // Modal methods
    self.modifierHasFocus = ko.observable(false);

    self.modalFinishedAnimating = function() {
        self.modifierHasFocus(true);
    };

    self.modalFinishedClosing = function() {
        if (self.modalOpen()) {
            self.health().importValues(self.editHealthItem().exportValues());
            self.hitDiceType().importValues(self.editHitDiceItem().exportValues());
        }
        self.modalOpen(false);
        self.hitDiceTypeDataHasChanged();
        self.healthDataHasChange();
    };

    /* Utility Methods */

    self.inspirationHasChanged = function() {
        self.otherStats().save();
        Notifications.otherStats.inspiration.changed.dispatch();
    };

    self.healthDataHasChange = function() {
        self.health().save();
        Notifications.health.changed.dispatch();
    };

    self.armorClassModifierDataHasChanged = function() {
        self.otherStats().save();
        Notifications.stats.armorClassModifier.changed.dispatch();
    };

    self.levelDataHasChanged = function() {
        var profile = PersistenceService.findFirstBy(Profile, 'characterId',
            CharacterManager.activeCharacter().key());
        profile.level(self.level());
        profile.save();
        Notifications.profile.level.changed.dispatch();
    };

    self.experienceDataHasChanged = function() {
        var profile = PersistenceService.findFirstBy(Profile, 'characterId',
            CharacterManager.activeCharacter().key());
        profile.exp(self.experience());
        profile.save();
        Notifications.profile.experience.changed.dispatch();
    };

    self.maxHpDataHasChanged = function() {
        self.health().save();
        Notifications.health.maxHitPoints.changed.dispatch();
        Notifications.health.changed.dispatch();
    };

    self.damageDataHasChanged = function() {
        self.health().save();
        Notifications.health.damage.changed.dispatch();
        Notifications.health.changed.dispatch();
    };

    self.tempHpDataHasChanged = function() {
        self.health().save();
        Notifications.health.tempHitPoints.changed.dispatch();
        Notifications.health.changed.dispatch();
    };

    self.hitDiceDataHasChanged = function() {
        self.hitDiceList().forEach(function(e, i, _) {
            e.save();
        });
        Notifications.hitDice.changed.dispatch();
    };

    self.hitDiceTypeDataHasChanged = function() {
        self.hitDiceType().save();
        Notifications.hitDiceType.changed.dispatch();
    };

    self.proficiencyHasChanged = function() {
        self.otherStats().save();
        Notifications.otherStats.proficiency.changed.dispatch();
    };

    self._alertPlayerHasDied = function() {
        var allFailed = self.deathSaveFailureList().every(function(save, idx, _) {
            return save.deathSaveFailure();
        });
        if (allFailed) {
            Notifications.userNotification.dangerNotification.dispatch(
                'Failing all 3 death saves will do that...',
                'You have died.', {
                    timeOut: 0
                });
        }

    };

    self._alertPlayerIsStable = function() {
        var allSaved = self.deathSaveSuccessList().every(function(save, idx, _) {
            return save.deathSaveSuccess();
        });
        if (allSaved) {
            Notifications.userNotification.successNotification.dispatch(
                'You have been spared...for now.',
                'You are now stable.', {
                    timeOut: 0
                });
        }

    };
}
