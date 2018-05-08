import {
    DeathSave,
    Health,
    HitDice,
    HitDiceType,
    Profile
} from 'charactersheet/models/character';
import { ArmorClassService } from 'charactersheet/services';
import { CoreManager } from 'charactersheet/utilities';
import { Notifications } from 'charactersheet/utilities';
import ko from 'knockout';
import template from './index.html';

export function StatsViewModel() {
    var self = this;

    self.health = ko.observable();
    self.profile = ko.observable();
    self.hitDice = ko.observable(new HitDice());
    self.hitDiceList = ko.observableArray();
    self.deathSaveSuccess = ko.observable();
    self.deathSaveFailure = ko.observable();
    self.deathSaveSuccessList = ko.observableArray([]);
    self.deathSaveSuccessVisible = ko.observable(true);
    self.deathSaveFailureList = ko.observableArray([]);
    self.deathSaveFailureVisible = ko.observable(true);
    self.editHealthItem = ko.observable();
    self.modalOpen = ko.observable(false);

    self.load = async () => {
        var key = CoreManager.activeCore().uuid();
        // Fetch Profile
        const profile = await Profile.ps.read({uuid: key});
        self.profile(profile.object);

        // Fetch Hit Dice
        const hitDice = await HitDice.ps.read({uuid: key});
        self.hitDice(hitDice.object);

        // Create the hit dice display
        self.calculateHitDice();

        // Fetch death saves
        const deathSaves = await DeathSave.ps.list({coreUuid: key});
        self.setDeathSaves(deathSaves.objects);

        self.createDeathSaveLists();

        // Fetch Health
        const health = await Health.ps.read({uuid: key});
        self.health(health.object);

        //Subscriptions
        self.health().maxHitPoints.subscribe(self.maxHpDataHasChanged);
        self.health().damage.subscribe(self.damageDataHasChanged);
        self.health().tempHitPoints.subscribe(self.tempHpDataHasChanged);
        self.health.subscribe(self.resetDeathSaves);

        // TODO: FIX WHEN ACTIONS HAS BEEN REFACTORED
        Notifications.events.longRest.add(self.resetOnLongRest);
        Notifications.profile.level.changed.add(self.updateProfile);
        self._alertPlayerHasDied();
        self._alertPlayerIsStable();
        self.healthDataHasChange();
    };

    self.setDeathSaves = (deathSaves) => {
        const deathSaveFailure = deathSaves.filter((save, i, _) => {
            return save.type() === 'failure';
        })[0];

        const deathSaveSuccess = deathSaves.filter((save, i, _) => {
            return save.type() === 'success';
        })[0];

        self.deathSaveFailure(deathSaveFailure);
        self.deathSaveSuccess(deathSaveSuccess);
    };

    self.createDeathSaveLists = () => {
        self.createDeathSaveFailureList();
        self.createDeathSaveSuccessList();
    };

    self.createDeathSaveFailureList = () => {
        self.deathSaveFailureList(new Array(3));
        for (var i = 0; i < 3; i++) {
            const isVisible = (3 - self.deathSaveFailure().used()) > i;
            self.deathSaveFailureList()[i] = ko.observable(isVisible);
        }

        self.deathSaveFailureList(self.deathSaveFailureList().reverse());
        // Tell the view to render the list again.
        self.deathSaveFailureList.valueHasMutated();
    };

    self.createDeathSaveSuccessList = () => {
        self.deathSaveSuccessList(new Array(3));
        for (var i = 0; i < 3; i++) {
            const isVisible = (3 - self.deathSaveSuccess().used()) > i;
            self.deathSaveSuccessList()[i] = ko.observable(isVisible);
        }

        self.deathSaveSuccessList(self.deathSaveSuccessList().reverse());
        // Tell the view to render the list again.
        self.deathSaveSuccessList.valueHasMutated();
    };

    self.damageHandler = ko.computed({
        read: function() {
            return self.health() ? self.health().damage() : 0;
        },
        write: function(value) {
            if (self.health().tempHitPoints()) {
                // Find the damage delta, then apply to temp hit points first.
                var damageChange = value - self.health().damage();
                if (damageChange > 0) {
                    var remainingTempHP = self.health().tempHitPoints() - damageChange;
                    if (remainingTempHP >= 0 ) {
                        // New damage value did not eliminate temporary hit points
                        // reduce temporary hit points, and do not apply to damage.
                        self.health().tempHitPoints(remainingTempHP);
                        self.tempHpDataHasChanged();
                        return;
                    } else {
                        // remainingTempHP is negative.
                        self.health().tempHitPoints(0);
                        value = self.health().damage() + remainingTempHP;
                        self.health().damage(value);
                        self.damageDataHasChanged();
                        return;
                    }
                }
            }
            self.health().damage(value);
            self.damageDataHasChanged();
        },
        owner: self
    });

    // TODO: FIX WHEN ACTIONS HAS BEEN REFACTORED
    self.calculateHitDice = () => {
        const level = self.profile().level();

        self.hitDiceList(new Array(level));
        for (var i = 0; i < level; i++) {
            const isVisible = (level - self.hitDice().used()) > i;
            self.hitDiceList()[i] = ko.observable(isVisible);
        }

        // Tell the view to render the list again.
        self.hitDiceList.valueHasMutated();
    };

    self.updateProfile = async () => {
        const key = CoreManager.activeCore().uuid();
        const profile = await Profile.ps.read({uuid: key});
        self.profile(profile.object);

        self.calculateHitDice();
    };

    self.recoverHitDice = () => {
        let used = self.hitDice().used();
        if (used - 1 >= 0) {
            self.hitDice().used(used - 1);
        } else {
            self.hitDice().used(0);
        }

        // Save HitDice
        self.saveHitDice();

        // Calculate HitDiceList
        self.calculateHitDice();

        // Notify
        Notifications.hitDice.changed.dispatch();
    };

    self.useHitDice = () => {
        let used = self.hitDice().used();
        const level = self.profile().level();
        if (used + 1 <= level) {
            self.hitDice().used(used + 1);
        } else {
            self.hitDice().used(level);
        }

        // Save HitDice
        self.saveHitDice();

        // Calculate HitDiceList
        self.calculateHitDice();

        // Notify
        Notifications.hitDice.changed.dispatch();
    };

    self.saveHitDice = async () => {
        var response = await self.hitDice().ps.save();
        self.hitDice(response.object);
    };

    self.recoverDeathSaveSuccess = () => {
        let used = self.deathSaveSuccess().used();
        if (used - 1 >= 0) {
            self.deathSaveSuccess().used(used - 1);
        } else {
            self.deathSaveSuccess().used(0);
        }

        // Save DeathSave Success
        self.saveDeathSaveSuccess();

        // Calculate HitDiceList
        self.createDeathSaveSuccessList();

        // Notify
        self._alertPlayerIsStable();
    };

    self.useDeathSaveSuccess = () => {
        let used = self.deathSaveSuccess().used();
        if (used + 1 <= 3) {
            self.deathSaveSuccess().used(used + 1);
        } else {
            self.deathSaveSuccess().used(3);
        }

        // Save HitDice
        self.saveDeathSaveSuccess();

        // Calculate HitDiceList
        self.createDeathSaveSuccessList();

        // Notify
        self._alertPlayerIsStable();
    };

    self.saveDeathSaveSuccess = async () => {
        var response = await self.deathSaveSuccess().ps.save();
        self.deathSaveSuccess(response.object);
    };

    self.recoverDeathSaveFailure = () => {
        let used = self.deathSaveFailure().used();
        if (used - 1 >= 0) {
            self.deathSaveFailure().used(used - 1);
        } else {
            self.deathSaveFailure().used(0);
        }

        // Save DeathSave Success
        self.saveDeathSaveFailure();

        // Calculate HitDiceList
        self.createDeathSaveFailureList();

        // Notify
        self._alertPlayerHasDied();
    };

    self.useDeathSaveFailure = () => {
        let used = self.deathSaveFailure().used();
        if (used + 1 <= 3) {
            self.deathSaveFailure().used(used + 1);
        } else {
            self.deathSaveFailure().used(3);
        }

        // Save HitDice
        self.saveDeathSaveFailure();

        // Calculate HitDiceList
        self.createDeathSaveFailureList();

        // Notify
        self._alertPlayerHasDied();
    };

    self.saveDeathSaveFailure = async () => {
        var response = await self.deathSaveFailure().ps.save();
        self.deathSaveFailure(response.object);
    };

    /**
     * Fired when a long rest notification is recieved.
     * Resets health and hit dice.
     */
    // TODO: FIX WHEN ACTIONS HAS BEEN REFACTORED
    self.resetOnLongRest = function() {
        self.resetHitDice();
        self.health().damage(0);
        self.health().tempHitPoints(0);
        self.damageDataHasChanged();
    };

    self.resetDamage = function() {
        self.health().damage(0);
        self.damageDataHasChanged();
    };

    /**
     * Reset the hit dice to an unused state up to the floor of half of the
     * character's level.
     *
     * This will be used primarily for long rest resets.
     */
    // TODO: FIX WHEN ACTIONS HAS BEEN REFACTORED
    self.resetHitDice = async () => {
        var key = CoreManager.activeCore().uuid();
        const response = await Profile.ps.read({uuid: key});
        const profile = response.object;
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
    };

    // Determine if death saves should be visible
    self.deathSavesVisible = ko.computed(function() {
        return self.health() != undefined ? self.health().hitpoints() == 0 : false;
    });

    // Reset death and success saves when char drops to 0 hp
    self.resetDeathSaves = () => {
        if (self.health() != undefined && self.health().hitpoints() >= 1) {
            self.deathSaveFailure().used(0);
            self.deathSaveSuccess().used(0);
            self.saveDeathSaveFailure();
            self.saveDeathSaveSuccess();
            self.createDeathSaveLists();
        }
    };

    // Modal methods
    self.modifierHasFocus = ko.observable(false);

    self.modalFinishedAnimating = function() {
        self.modifierHasFocus(true);
    };

    self.editHealth = function() {
        self.editHealthItem(new Health());
        self.editHealthItem().importValues(self.health().exportValues());
        self.modalOpen(true);
    };

    self.modalFinishedClosing = function() {
        if (self.modalOpen()) {
            self.health().importValues(self.editHealthItem().exportValues());
            self.healthDataHasChange();
            self.saveHitDice();
            Notifications.hitDiceType.changed.dispatch();
        }
        self.modalOpen(false);
    };

    // Prepopulate methods
    self.setHitDiceType = function(label, value) {
        self.hitDice().type(value);
    };

    self.healthDataHasChange = function() {
        self.saveHealth();
        Notifications.health.changed.dispatch();
    };

    self.maxHpDataHasChanged = function() {
        self.saveHealth();
        Notifications.health.maxHitPoints.changed.dispatch();
    };

    self.damageDataHasChanged = function() {
        self.saveHealth();
        Notifications.health.damage.changed.dispatch();
    };

    self.tempHpDataHasChanged = function() {
        self.saveHealth();
        Notifications.health.tempHitPoints.changed.dispatch();
    };

    self.saveHealth = async () => {
        var response = await self.health().ps.save();
        self.health(response.object);
    };

    self._alertPlayerHasDied = function() {
        if (self.deathSavesVisible() && self.deathSaveFailure().used() == 3) {
            Notifications.userNotification.dangerNotification.dispatch(
                'Failing all 3 death saves will do that...',
                'You have died.', {
                    timeOut: 0
                });
            Notifications.stats.deathSaves.fail.changed.dispatch();
            self.deathSaveSuccessVisible(false);
        } else {
            Notifications.stats.deathSaves.notFail.changed.dispatch();
            self.deathSaveSuccessVisible(true);
        }

    };

    self._alertPlayerIsStable = function() {
        if (self.deathSavesVisible() && self.deathSaveSuccess().used() == 3) {
            Notifications.userNotification.successNotification.dispatch(
                'You have been spared...for now.',
                'You are now stable.', {
                    timeOut: 0
                });
            Notifications.stats.deathSaves.success.changed.dispatch();
            self.deathSaveFailureVisible(false);
        } else {
            Notifications.stats.deathSaves.notSuccess.changed.dispatch();
            self.deathSaveFailureVisible(true);
        }

    };
}

ko.components.register('stats', {
    viewModel: StatsViewModel,
    template: template
});
