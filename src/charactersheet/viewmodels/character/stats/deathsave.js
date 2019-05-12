import 'bin/knockout-circular-progress';
import {
    DeathSave,
    Health,
    HitDice,
    Profile
} from 'charactersheet/models/character';

import { CoreManager } from 'charactersheet/utilities';
import { Notifications } from 'charactersheet/utilities';
import { find } from 'lodash';
import ko from 'knockout';
import template from './deathsave.html';

class ACViewModel {
    constructor(params) {
        // Card Properties
        this.containerId = ko.utils.unwrapObservable(params.containerId);
        this.showBack = params.showBack;
        this.flip = params.flip;

        this.loaded = ko.observable(false);
    }

    async load() {
        this.loaded(false);
        await this.refresh();
        this.setUpSubscriptions();
        this.loaded(true);
    }

    async refresh() {
        throw('refresh must be defined by subclasses of ACViewModel');
    }

    setUpSubscriptions() {
        this.showBack.subscribe(this.subscribeToShowForm);
    }

    subscribeToShowForm = () => {
        if (!this.showBack()) {
            this.refresh();
        }
    }
}


class StatsDeathSaveViewModel extends ACViewModel {
    constructor(params) {
        super(params);
        this.forceCardResize = params.forceCardResize;

        this.stable = params.stable;

        this.deathSaveFailure = ko.observable(new DeathSave());
        this.deathSaveSuccess = ko.observable(new DeathSave());

        this.deathSaveSuccessList = ko.observableArray([]);
        this.deathSaveFailureList = ko.observableArray([]);
    }

    load = async () => {
        this.loaded(false);
        await super.load();
    }

    subscribeToShowForm = () => {
        if (this.showBack()) {
            this.refresh();
        }
    }

    refresh = async () => {
        var key = CoreManager.activeCore().uuid();
        // Fetch death saves
        const deathSaves = await DeathSave.ps.list({coreUuid: key});
        this.deathSaveSuccess(find(deathSaves.objects, (save) => save.type() === 'success'));
        this.deathSaveFailure(find(deathSaves.objects, (save) => save.type() === 'failure'));

        this.calculateDeathSaveSuccessList();
        this.calculateDeathSaveFailureList();
        // TODO: Should this really be here?
        this.forceCardResize();
    };

    calculateDeathSaveFailureList = () => {
        this.deathSaveFailureList(new Array(3));
        for (var i = 0; i < 3; i++) {
            const isUsed = this.deathSaveFailure().used() > i;
            this.deathSaveFailureList()[i] = ko.observable(isUsed);
        }
        // Tell the view to render the list again.
        this.deathSaveFailureList.valueHasMutated();
    };

    calculateDeathSaveSuccessList = () => {
        this.deathSaveSuccessList(new Array(3));
        for (var i = 0; i < 3; i++) {
            const isUsed = this.deathSaveSuccess().used() > i;
            this.deathSaveSuccessList()[i] = ko.observable(isUsed);
        }
        // Tell the view to render the list again.
        this.deathSaveSuccessList.valueHasMutated();
    };

    succeedOnDeathSave = async (undo) => {
        if (this.rip()) {
            return;
        }
        if (undo && this.deathSaveSuccess().used() > 0) {
            this.deathSaveSuccess().used(this.deathSaveSuccess().used() - 1);
        } else if (this.deathSaveSuccess().used() < 3) {
            this.deathSaveSuccess().used(this.deathSaveSuccess().used() + 1);
        }
        const response = await this.deathSaveSuccess().ps.save();
        this.deathSaveSuccess(response.object);
        this.calculateDeathSaveSuccessList();
        if (this.deathSaveSuccess().used() === 3) {
            await this.characterStabilized();
        } else {
            Notifications.stats.deathSaves.notSuccess.changed.dispatch();
        }
    }

    stabilize = async () => {
        this.deathSaveSuccess().used(3);
        const successResponse = await this.deathSaveSuccess().ps.save();
        this.deathSaveSuccess(successResponse.object);
        await this.characterStabilized();
    }

    characterStabilized = async () => {
        Notifications.userNotification.successNotification.dispatch(
          'You have been spared...for now.',
          'You are now stable.', {
              timeOut: 0
          });
        this.deathSaveFailure().used(0);
        const failureResponse = await this.deathSaveFailure().ps.save();
        this.deathSaveFailure(failureResponse.object);
        Notifications.stats.deathSaves.success.changed.dispatch();
    }

    failOnDeathSave = async (undo) => {
        if (undo && this.deathSaveFailure().used() > 0) {
            this.deathSaveFailure().used(this.deathSaveFailure().used() - 1);
        } else if (this.deathSaveSuccess().used() < 3) {
            this.deathSaveFailure().used(this.deathSaveFailure().used() + 1);
        }
        const response = await this.deathSaveFailure().ps.save();
        this.deathSaveFailure(response.object);
        this.calculateDeathSaveFailureList();

        if (this.deathSaveFailure().used() === 3) {
            await this.die();
        } else {
            Notifications.stats.deathSaves.notFail.changed.dispatch();
        }
    }

    die = async () => {
        Notifications.userNotification.dangerNotification.dispatch(
            'Failing all 3 death saves will do that...',
            'You have died.', {
                timeOut: 0
            });
        this.deathSaveSuccess().used(0);
        const successResponse = await this.deathSaveSuccess().ps.save();
        this.deathSaveSuccess(successResponse.object);
        Notifications.stats.deathSaves.fail.changed.dispatch();
    }

    rip = ko.pureComputed(() => {
        return this.deathSaveFailure().used() >= 3; // I know, 'should' max at 3
    });

    //     load = async () => {

    //
    //         // Fetch death saves
    //         const deathSaves = await DeathSave.ps.list({coreUuid: key});
    //         // this.setDeathSaves(deathSaves.objects);
    //
    //         this.createDeathSaveLists();
    //
    //         // Fetch Health
    //         const health = await Health.ps.read({uuid: key});
    //         this.health(health.object);
    //
    //         //Subscriptions
    //         // this.health().maxHitPoints.subscribe(this.maxHpDataHasChanged);
    //         // this.health().damage.subscribe(this.damageDataHasChanged);
    //         // this.health().tempHitPoints.subscribe(this.tempHpDataHasChanged);
    //         this.health.subscribe(this.resetDeathSaves);
    //
    //         Notifications.events.longRest.add(this.resetOnLongRest);
    //
    //         Notifications.profile.level.changed.add(this.updateProfile);
    //         // this._alertPlayerHasDied();
    //         // this._alertPlayerIsStable();
    //         // this.healthDataHasChange();
    //     };



    //     deathSavesVisible = ko.computed(() => {
    //         return this.health != undefined ? this.health().hitPoints() <= 0 : false;
    //     });
    //
    //     rip = ko.computed(() => {
    //         return this.deathSaveFailureList != undefined ? this.deathSaveFailureList().every(function(save, idx, _) {
    //             return save.deathSaveFailure();
    //         }) : false;
    //     });



    //     // recoverDeathSaveSuccess = () => {
    //     //     let used = this.deathSaveSuccess().used();
    //     //     if (used - 1 >= 0) {
    //     //         this.deathSaveSuccess().used(used - 1);
    //     //     } else {
    //     //         this.deathSaveSuccess().used(0);
    //     //     }
    //     //
    //     //     // Save DeathSave Success
    //     //     this.saveDeathSaveSuccess();
    //     //
    //     //     // Calculate HitDiceList
    //     //     this.createDeathSaveSuccessList();
    //     //
    //     //     // Notify
    //     //     this._alertPlayerIsStable();
    //     // };
    //
    //     // useDeathSaveSuccess = async () => {
    //     //     let used = this.deathSaveSuccess().used();
    //     //     if (used + 1 <= 3) {
    //     //         this.deathSaveSuccess().used(used + 1);
    //     //     } else {
    //     //         this.deathSaveSuccess().used(3);
    //     //     }
    //     //
    //     //     // Save HitDice
    //     //     await this.saveDeathSaveSuccess();
    //     //
    //     //     // Calculate HitDiceList
    //     //     this.createDeathSaveSuccessList();
    //     //
    //     //     // Notify
    //     //     this._alertPlayerIsStable();
    //     // };
    //
    //     // saveDeathSaveSuccess = async () => {
    //     //     var response = await this.deathSaveSuccess().ps.save();
    //     //     this.deathSaveSuccess(response.object);
    //     // };
    //
    //     // recoverDeathSaveFailure = async () => {
    //     //     let used = this.deathSaveFailure().used();
    //     //     if (used - 1 >= 0) {
    //     //         this.deathSaveFailure().used(used - 1);
    //     //     } else {
    //     //         this.deathSaveFailure().used(0);
    //     //     }
    //     //
    //     //     // Save DeathSave Success
    //     //     await this.saveDeathSaveFailure();
    //     //
    //     //     // Calculate HitDiceList
    //     //     this.createDeathSaveFailureList();
    //     //
    //     //     // Notify
    //     //     this._alertPlayerHasDied();
    //     // };
    //
    //     // useDeathSaveFailure = async () => {
    //     //     let used = this.deathSaveFailure().used();
    //     //     if (used + 1 <= 3) {
    //     //         this.deathSaveFailure().used(used + 1);
    //     //     } else {
    //     //         this.deathSaveFailure().used(3);
    //     //     }
    //     //
    //     //     // Save HitDice
    //     //     await this.saveDeathSaveFailure();
    //     //
    //     //     // Calculate HitDiceList
    //     //     this.createDeathSaveFailureList();
    //     //
    //     //     // Notify
    //     //     this._alertPlayerHasDied();
    //     // };
    //     //
    //     // saveDeathSaveFailure = async () => {
    //     //     var response = await this.deathSaveFailure().ps.save();
    //     //     this.deathSaveFailure(response.object);
    //     // };

    //     // Reset death and success saves when char drops to 0 hp
    //     // resetDeathSaves = async () => {
    //     //     // We don't want to change 0 -> 0 since it causes unneeded requests.
    //     //     const shouldUpdate = (
    //     //         // We have loaded.
    //     //         this.health() !== undefined
    //     //         // HP is greater than 0.
    //     //         && this.health().hitPoints() > 0
    //     //         // Fails are not zero
    //     //         && this.deathSaveFailure().used() !== 0
    //     //         // Successes are not zero
    //     //         && this.deathSaveSuccess().used() !== 0
    //     //     );
    //     //
    //     //     if (shouldUpdate) {
    //     //         this.deathSaveFailure().used(0);
    //     //         this.deathSaveSuccess().used(0);
    //     //         await this.saveDeathSaveFailure();
    //     //         await this.saveDeathSaveSuccess();
    //     //         this.createDeathSaveLists();
    //     //     }
    //     // };

    //     // this.load = function() {
    //     //     Notifications.global.save.add(this.save);
    //
    //         //
    //         // if (deathSaveList.length === 6) {
    //         //     for (var i=0; i<3; i++) {
    //         //         this.deathSaveSuccessList.push(deathSaveList[i]);
    //         //     }
    //         //     for (var j=3; j<6; j++) {
    //         //         this.deathSaveFailureList.push(deathSaveList[j]);
    //         //     }
    //         // } else {
    //         //     // FIXME: Purge all saves and remake...
    //         //     deathSaveList.forEach(save => {
    //         //         save.delete();
    //         //     });
    //         //
    //         //     for (var k=0; k<3; k++) {
    //         //         this.deathSaveSuccessList.push(new DeathSave());
    //         //         this.deathSaveFailureList.push(new DeathSave());
    //         //     }
    //         // }
    //         //
    //         // this.deathSaveSuccessList().forEach(function(e, i, _) {
    //         //     e.characterId(key);
    //         // });
    //         // this.deathSaveFailureList().forEach(function(e, i, _) {
    //         //     e.characterId(key);
    //         // });

    //     // setDeathSaves = (deathSaves) => {
    //     //     const deathSaveFailure = deathSaves.filter((save, i, _) => {
    //     //         return save.type() === 'failure';
    //     //     })[0];
    //     //
    //     //     const deathSaveSuccess = deathSaves.filter((save, i, _) => {
    //     //         return save.type() === 'success';
    //     //     })[0];
    //     //
    //     //     this.deathSaveFailure(deathSaveFailure);
    //     //     this.deathSaveSuccess(deathSaveSuccess);
    //     // };
    //     createDeathSaveLists = () => {
    //         this.createDeathSaveFailureList();
    //         this.createDeathSaveSuccessList();
    //     };
    //
    //     createDeathSaveFailureList = () => {
    //         this.deathSaveFailureList(new Array(3));
    //         for (var i = 0; i < 3; i++) {
    //             const isVisible = this.deathSaveFailure() === undefined ? false : (3 - this.deathSaveFailure().used()) > i;
    //             this.deathSaveFailureList()[i] = ko.observable(isVisible);
    //         }
    //
    //         this.deathSaveFailureList(this.deathSaveFailureList().reverse());
    //
    //         // Tell the view to render the list again.
    //         this.deathSaveFailureList.valueHasMutated();
    //     };
    //
    //     createDeathSaveSuccessList = () => {
    //         this.deathSaveSuccessList(new Array(3));
    //         for (var i = 0; i < 3; i++) {
    //             const isVisible = this.deathSaveSuccess() === undefined ? false : (3 - this.deathSaveSuccess().used()) > i;
    //             this.deathSaveSuccessList()[i] = ko.observable(isVisible);
    //         }
    //
    //         this.deathSaveSuccessList(this.deathSaveSuccessList().reverse());
    //         // Tell the view to render the list again.
    //         this.deathSaveSuccessList.valueHasMutated();
    //     };

    //     // // Reset death and success saves when char drops to 0 hp
    //     // this.resetDeathSaves = ko.computed(function() {
    //     //     this._dummy();
    //     //     if (this.health().hitPoints() >= 1){
    //     //         this.deathSaveFailureList().forEach(function(save, idx, _) {
    //     //             save.deathSaveFailure(false);
    //     //         });
    //     //         this.deathSaveSuccessList().forEach(function(save, idx, _) {
    //     //             save.deathSaveSuccess(false);
    //     //         });
    //     //     }
    //     // });

    //     // this.deathSavesVisible = ko.computed(function() {
    //     //     this._dummy();
    //     //     var allSaved = this.deathSaveSuccessList().every(function(save, idx, _) {
    //     //         return save.deathSaveSuccess();
    //     //     });
    //     //     return this.health().hitPoints() === 0 && !allSaved;
    //     // });
    //     //
    //     // this.rip = ko.computed(() => {
    //     //     return this.deathSaveFailureList().every(function(save, idx, _) {
    //     //         return save.deathSaveFailure();
    //     //     });
    //     // });
    //     //
    //     // this.toggleMode = () => {
    //     //     return this.deathSavesVisible();
    //     // };

    //     // this.deathSaveSuccessDataHasChanged = function() {
    //     //     this.deathSaveSuccessList().forEach(function(save, idx, _) {
    //     //         save.save();
    //     //     });
    //     // };
    //     //
    //     // this.deathSaveFailureDataHasChanged = function() {
    //     //     this.deathSaveFailureList().forEach(function(save, idx, _) {
    //     //         save.save();
    //     //     });
    //     // };
    //     //
    //     // this._alertPlayerHasDied = function() {
    //     //     var allFailed = this.deathSaveFailureList().every(function(save, idx, _) {
    //     //         return save.deathSaveFailure();
    //     //     });
    //     //     if (allFailed) {
    //     //         Notifications.userNotification.dangerNotification.dispatch(
    //     //             'Failing all 3 death saves will do that...',
    //     //             'You have died.', {
    //     //                 timeOut: 0
    //     //             });
    //     //         Notifications.stats.deathSaves.fail.changed.dispatch();
    //     //         this.deathSaveSuccessVisible(false);
    //     //     } else {
    //     //         Notifications.stats.deathSaves.notFail.changed.dispatch();
    //     //         this.deathSaveSuccessVisible(true);
    //     //     }
    //     //
    //     // };
    //     //
    //     // this.stabilize = () => {
    //     //     this.deathSaveSuccessList().forEach(function(save, idx, _) {
    //     //         save.deathSaveSuccess(true);
    //     //     });
    //     // };
    //     //
    //     // this._alertPlayerIsStable = function() {
    //     //     var allSaved = this.deathSaveSuccessList().every(function(save, idx, _) {
    //     //         return save.deathSaveSuccess();
    //     //     });
    //     //     if (allSaved) {
    //     //         Notifications.userNotification.successNotification.dispatch(
    //     //             'You have been spared...for now.',
    //     //             'You are now stable.', {
    //     //                 timeOut: 0
    //     //             });
    //     //         Notifications.stats.deathSaves.success.changed.dispatch();
    //     //         this.deathSaveFailureVisible(false);
    //     //     } else {
    //     //         Notifications.stats.deathSaves.notSuccess.changed.dispatch();
    //     //         this.deathSaveFailureVisible(true);
    //     //     }
    //     // };




}

ko.components.register('stats-deathsave-view', {
    viewModel: StatsDeathSaveViewModel,
    template: template
});
