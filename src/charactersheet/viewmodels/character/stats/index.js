import 'bin/knockout-circular-progress';
import {
    DeathSave,
    Health,
    HitDice,
    HitDiceType,
    Profile
} from 'charactersheet/models/character';

import { CharacterManager } from 'charactersheet/utilities';
import { CoreManager } from 'charactersheet/utilities';
import { Notifications } from 'charactersheet/utilities';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { StatsCardViewModel } from './view';
import { StatsHealthFormViewModel } from './form';
import icon from 'images/nested-hearts.svg';
import ko from 'knockout';
import template from './index.html';

class ACCardModel {
    constructor(params) {
        this.tabId = params.tabId;
        this.cardTabId = params.tabId;
        this.containerId = params.containerId;
        this.showBack = params.showBack;
        this.resize = params.resize;
        this.flip = params.flip;
    }
}

// class StatsViewModel extends ACViewModel {
//     constructor(params) {
//         super(params);
//         this.profile = ko.observable();
//
//         this.hitDice = ko.observable(new HitDice());
//
//         this.deathSaveSuccess = ko.observable();
//         this.deathSaveFailure = ko.observable();
//
//         this.health = ko.observable(new Health());
//
//         this.healInput = ko.observable(null);
//         this.tempInput = ko.observable(null);
//         this.dmgInput = ko.observable(null);
//
//
//         this.hitDiceList = ko.observableArray([]);
//
//         this.deathSaveSuccessList = ko.observableArray([]);
//         // this.deathSaveSuccessVisible = ko.observable(true);
//         this.deathSaveFailureList = ko.observableArray([]);
//         // this.deathSaveFailureVisible = ko.observable(true);
//
//
//
//     }
//     // Wait for page load
//
//     // Determine if death saves should be visible
//     deathSavesVisible = ko.computed(() => {
//         return this.health != undefined ? this.health().hitPoints() <= 0 : false;
//     });
//
//     rip = ko.computed(() => {
//         return this.deathSaveFailureList != undefined ? this.deathSaveFailureList().every(function(save, idx, _) {
//             return save.deathSaveFailure();
//         }) : false;
//     });
//
//     hpText = ko.pureComputed(() => {
//         let tempHp = '';
//         if (this.health().tempHitPointsRemaining()) {
//             tempHp = `<span style="color: #71D4E8">+${this.health().tempHitPointsRemaining()}</span>`;
//         }
//         return `${this.health().regularHitPointsRemaining()} ${tempHp}<br />of&nbsp;${this.health().maxHitPoints()}&nbsp;HP`;
//     });
//
//     hpChart = ko.pureComputed(()=>({
//         data: {
//             text: {value: this.hpText()},
//             value: this.health().regularHitPointsRemaining(),
//             maxValue: this.health().maxHitPoints()
//         },
//         config: {
//             strokeWidth: 12,
//             from: { color: this.getHealthColor() },
//             to: { color: this.getHealthColor() },
//             text: {
//                 className: 'lead hpChart'
//             }
//         }
//     }));
//
//     tempHpChart =  ko.pureComputed(()=>({
//         data: {
//             text: null,
//             value: this.health().tempHitPointsRemaining(),
//             maxValue: this.health().maxHitPoints()
//         },
//         config: {
//             trailColor: '#FFF',
//             strokeWidth: 6,
//             from: { color: this.tempHpColor },
//             to: { color: this.tempHpColor }
//         }
//     }));
//
//     getHealthColor = () => {
//         if (this.health().isDangerous()) {
//             return '#e74c3c';
//         } else if (this.health().isWarning()) {
//             return '#f39c12';
//         }
//         return '#18bc9c';
//     };
//
//     tempHpColor = '#71D4E8';
//
//     handleHeal = async () => {
//         if (this.healInput()) {
//             this.damageHandler(0-parseInt(this.healInput()));
//         }
//         this.healInput(null);
//     };
//
//     handleTemp = async () => {
//         if (this.tempInput()) {
//             this.health().tempHitPoints(this.tempInput());
//             this.saveHealth();
//             Notifications.health.tempHitPoints.changed.dispatch();
//         }
//         this.tempInput(null);
//     };
//
//     handleDmg = async () => {
//         if (this.dmgInput()) {
//             this.damageHandler(this.dmgInput());
//         }
//         this.dmgInput(null);
//     };
//
//     damageHandler = ko.computed({
//         read: function() {
//             return this.health ? this.health().damage() : 0;
//         },
//         write: async function(value) {
//             const currentValue = parseInt(value);
//             const currentDamage = parseInt(this.health().damage());
//             const currentTempHP = parseInt(this.health().tempHitPoints());
//             const maxHitPoints = parseInt(this.health().maxHitPoints());
//             let newDamage;
//             if (value < 0) {
//                 newDamage = currentDamage + currentValue;
//                 if (newDamage < 0) {
//                     newDamage = 0;
//                 }
//             } else if (currentTempHP) {
//                 // Find the damage delta, then apply to temp hit Points first.
//                 let remainingTempHP = currentTempHP - currentValue;
//                 if (remainingTempHP >= 0 ) {
//                     // New damage value did not eliminate temporary hit Points
//                     // reduce temporary hit Points, and do not apply to damage.
//                     this.health().tempHitPoints(remainingTempHP);
//                     newDamage = currentDamage;
//                 } else { // remainingTempHP is negative.
//                     this.health().tempHitPoints(0);
//                     newDamage = currentDamage - remainingTempHP;
//                 }
//             } else if (this.health().hitPoints() == 0) {
//                 // Hit Points were already at 0, so death saves are necessary
//                 newDamage = maxHitPoints;
//                 console.log('death saves, man');
//                 // self.deathSaveSuccessList().forEach(function(save, idx, _) {
//                 //     save.deathSaveSuccess(false);
//                 // });
//                 // self.deathSavesVisible();
//             } else {
//                 newDamage = currentDamage + currentValue;
//             }
//             if (newDamage > maxHitPoints) {
//                 newDamage = maxHitPoints;
//             }
//             this.health().damage(newDamage);
//             this.saveHealth();
//             Notifications.health.damage.changed.dispatch();
//         },
//         owner: this
//     });
//
//
//     load = async () => {
//         var key = CoreManager.activeCore().uuid();
//         // Fetch Profile
//         const profile = await Profile.ps.read({uuid: key});
//         this.profile(profile.object);
//
//         // Fetch Hit Dice
//         const hitDice = await HitDice.ps.read({uuid: key});
//         this.hitDice(hitDice.object);
//
//         // Create the hit dice display
//         this.calculateHitDice();
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
//
//     updateProfile = async () => {
//         const key = CoreManager.activeCore().uuid();
//         const profile = await Profile.ps.read({uuid: key});
//         this.profile(profile.object);
//
//         this.calculateHitDice();
//     };
//
//     recoverHitDice = async () => {
//         let used = this.hitDice().used();
//         if (used - 1 >= 0) {
//             this.hitDice().used(used - 1);
//         } else {
//             this.hitDice().used(0);
//         }
//
//         // Save HitDice
//         await this.saveHitDice();
//
//         // Calculate HitDiceList
//         this.calculateHitDice();
//
//         // Notify
//         Notifications.hitDice.changed.dispatch();
//     };
//
//     useHitDice = async () => {
//         let used = this.hitDice().used();
//         const level = this.profile().level();
//         if (used + 1 <= level) {
//             this.hitDice().used(used + 1);
//         } else {
//             this.hitDice().used(level);
//         }
//
//         // Save HitDice
//         await this.saveHitDice();
//
//         // Calculate HitDiceList
//         this.calculateHitDice();
//
//         // Notify
//         Notifications.hitDice.changed.dispatch();
//     };
//
//     saveHitDice = async () => {
//         var response = await this.hitDice().ps.save();
//         this.hitDice(response.object);
//     };
//
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
//
//     /**
//      * Fired when a long rest notification is recieved.
//      * Resets health and hit dice.
//      */
//     resetOnLongRest = async () => {
//         this.resetHitDice();
//         this.health().damage(0);
//         this.health().tempHitPoints(0);
//         await this.damageDataHasChanged();
//     };
//
//     resetDamage = async () => {
//         this.health().damage(0);
//         await this.damageDataHasChanged();
//     };
//
//     /**
//      * Reset the hit dice to an unused state up to the floor of half of the
//      * character's level.
//      *
//      * This will be used primarily for long rest resets.
//      */
//     resetHitDice = async () => {
//         var level = this.profile().level();
//         var restoredHitDice = Math.floor(level / 2) < 1 ? 1 : Math.floor(level / 2);
//
//         var remainingHitDice = this.hitDice().used() - restoredHitDice;
//         if (remainingHitDice < 0) {
//             this.hitDice().used(0);
//         } else {
//             this.hitDice().used(remainingHitDice);
//         }
//
//         await this.saveHitDice();
//
//         this.calculateHitDice();
//     };
//
//
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
//
//     // Modal methods
//
//     validation = {
//         submitHandler: (form, event) => {
//             event.preventDefault();
//             this.modalFinishedClosing();
//         },
//         updateHandler: ($element) => {
//             this.addFormIsValid($element.valid());
//         },
//         rules: {
//             maxHitPoints: {
//                 min: 0,
//                 max: 1000000,
//                 required: true,
//                 number: true
//             },
//             tempHitPoints: {
//                 min: 0,
//                 max: 1000000,
//                 required: true,
//                 number: true
//             },
//             damage: {
//                 min: 0,
//                 max: 1000000,
//                 required: true,
//                 number: true
//             },
//             type: {
//                 required: true,
//                 maxlength: 32
//             }
//         }
//     };
//
//     modifierHasFocus = ko.observable(false);
//
//
//     editHealth = function() {
//         this.editHealthItem(new Health());
//         this.editHealthItem().importValues(this.health().exportValues());
//         this.modalOpen(true);
//     };
//
//     modalFinishedClosing = async () => {
//         if (this.modalOpen() && this.addFormIsValid()) {
//             this.health().importValues(this.editHealthItem().exportValues());
//             await this.healthDataHasChange();
//             await this.saveHitDice();
//             Notifications.hitDiceType.changed.dispatch();
//         }
//         this.modalOpen(false);
//     };
//
//     // Pre-populate methods
//     setHitDiceType = function(label, value) {
//         this.hitDice().type(value);
//     };
//
//     // healthDataHasChange = async () => {
//     //     await this.saveHealth();
//     //     Notifications.health.changed.dispatch();
//     // };
//
//     // maxHpDataHasChanged = async () => {
//     //     await this.saveHealth();
//     //     Notifications.health.maxHitPoints.changed.dispatch();
//     // };
//     //
//     // damageDataHasChanged = async () => {
//     //     await this.saveHealth();
//     //     Notifications.health.damage.changed.dispatch();
//     // };
//     //
//     // tempHpDataHasChanged = async () => {
//     //     await this.saveHealth();
//     //     Notifications.health.tempHitPoints.changed.dispatch();
//     // };
//     //
//     saveHealth = async () => {
//         var response = await this.health().ps.save();
//         // this.health(response.object);
//     };
//
//     // _alertPlayerHasDied = function() {
//     //     if (this.deathSavesVisible() && this.deathSaveFailure().used() == 3) {
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
//     // };
//
//     // _alertPlayerIsStable = function() {
//     //     if (this.deathSavesVisible() && this.deathSaveSuccess().used() == 3) {
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
//
//     toggleMode = () => {
//         return this.deathSavesVisible();
//     };
//
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
//
//         //Subscriptions
//         // this.health().maxHitPoints.subscribe(this.maxHpDataHasChanged);
//         // this.health().damage.subscribe(this.damageDataHasChanged);
//         // this.health().tempHitPoints.subscribe(this.tempHpDataHasChanged);
//         // this.hitDiceList().forEach(function(hitDice, i, _) {
//         //     hitDice.hitDiceUsed.subscribe(this.hitDiceDataHasChanged);
//         // });
//         // this.hitDiceType.subscribe(this.hitDiceTypeDataHasChanged);
//         // this.deathSaveFailureList().forEach(function(save, idx, _) {
//         //     save.deathSaveFailure.subscribe(this._alertPlayerHasDied);
//         //     save.deathSaveFailure.subscribe(this.deathSaveFailureDataHasChanged);
//         // });
//         // this.deathSaveSuccessList().forEach(function(save, idx, _) {
//         //     save.deathSaveSuccess.subscribe(this._alertPlayerIsStable);
//         //     save.deathSaveSuccess.subscribe(this.deathSaveSuccessDataHasChanged);
//         // });
//         // this.deathSavesVisible.subscribe(this.toggleMode);
//         //
//         // Notifications.events.longRest.add(this.resetOnLongRest);
//         // Notifications.profile.level.changed.add(this.calculateHitDice);
//         // this._alertPlayerHasDied();
//         // this._alertPlayerIsStable();
//         // this.healthDataHasChange();
//         // this.setNewHeight();
//     //};
//
//
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
//
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
//
//     calculateHitDice = () => {
//         const level = this.profile().level();
//
//         this.hitDiceList(new Array(level));
//         for (var i = 0; i < level; i++) {
//             const isVisible = (level - this.hitDice().used()) > i;
//             this.hitDiceList()[i] = ko.observable(isVisible);
//         }
//
//         // Tell the view to render the list again.
//         this.hitDiceList.valueHasMutated();
//     };
//     //
//     //
//     // this.save = function() {
//     //     this.health().save();
//     //     this.hitDiceList().forEach(function(e, i, _) {
//     //         e.save();
//     //     });
//     //     this.hitDiceType().save();
//     //     this.deathSaveSuccessList().forEach(function(e, i, _) {
//     //         e.save();
//     //     });
//     //     this.deathSaveFailureList().forEach(function(e, i, _) {
//     //         e.save();
//     //     });
//     // };
//     //
//     // this.clear = function() {
//     //     this.health().clear();
//     //     this.deathSaveSuccessList().forEach(function(e, i, _) {
//     //         e.clear();
//     //     });
//     //     this.deathSaveFailureList().forEach(function(e, i, _) {
//     //         e.clear();
//     //     });
//     //     this.hitDiceList([]);
//     // };
//     //
//     // this.calculateHitDice = function() {
//     //     var profile = PersistenceService.findBy(Profile, 'characterId',
//     //         CharacterManager.activeCharacter().key())[0];
//     //
//     //     var difference = parseInt(profile.level()) - this.hitDiceList().length;
//     //     var pushOrPop = difference > 0 ? 'push' : 'pop';
//     //     for (var i = 0; i < Math.abs(difference); i++) {
//     //         var h;
//     //         if (pushOrPop === 'push') {
//     //             h = new HitDice();
//     //             h.characterId(CharacterManager.activeCharacter().key());
//     //             h.save();
//     //             this.hitDiceList.push(h);
//     //         } else {
//     //             h = this.hitDiceList.pop();
//     //             h.delete();
//     //         }
//     //     }
//     // };
//     //
//     // /**
//     //  * Fired when a long rest notification is recieved.
//     //  * Resets health and hit dice.
//     //  */
//     // this.resetOnLongRest = function() {
//     //     this.resetHitDice();
//     //     this.health().damage(0);
//     //     this.health().tempHitPoints(0);
//     //     this.health().save();
//     //     this.damageDataHasChanged();
//     // };
//     //
//     // this.resetDamage = function() {
//     //     this.health().damage(0);
//     //     this.health().save();
//     //     this.damageDataHasChanged();
//     // };
//     //
//     // /**
//     //  * Reset the hit dice to an unused state up to the floor of half of the
//     //  * character's level.
//     //  *
//     //  * This will be used primarily for long rest resets.
//     //  */
//     // this.resetHitDice = function() {
//     //     var profile = PersistenceService.findBy(Profile, 'characterId',
//     //         CharacterManager.activeCharacter().key())[0];
//     //     var level = profile.level();
//     //     var restoredHitDice = Math.floor(level / 2) < 1 ? 1 : Math.floor(level / 2);
//     //
//     //     ko.utils.arrayForEach(this.hitDiceList(), function(hitDice) {
//     //         if (hitDice.hitDiceUsed() === true) {
//     //             if (restoredHitDice !== 0) {
//     //                 hitDice.hitDiceUsed(false);
//     //                 restoredHitDice -= 1;
//     //             }
//     //         }
//     //     });
//     //     this.hitDiceList().forEach(function(e, i, _) {
//     //         e.save();
//     //     });
//     //     this.hitDiceDataHasChanged();
//     // };
//     //
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
//     //
//     // // Determine if death saves should be visible
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
//     // /* Utility Methods */
//     //
//     //
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
//     // this.healthDataHasChange = function() {
//     //     this.health().save();
//     //     Notifications.health.changed.dispatch();
//     // };
//     //
//     // this.maxHpDataHasChanged = function() {
//     //     this.health().save();
//     //     Notifications.health.maxHitPoints.changed.dispatch();
//     //     Notifications.health.changed.dispatch();
//     // };
//     //
//     // this.damageDataHasChanged = function() {
//     //     this.health().save();
//     //     Notifications.health.damage.changed.dispatch();
//     //     Notifications.health.changed.dispatch();
//     // };
//     //
//     // this.tempHpDataHasChanged = function() {
//     //     this.health().save();
//     //     Notifications.health.tempHitPoints.changed.dispatch();
//     //     Notifications.health.changed.dispatch();
//     // };
//     //
//     // this.hitDiceDataHasChanged = function() {
//     //     this.hitDiceList().forEach(function(e, i, _) {
//     //         e.save();
//     //     });
//     //     Notifications.hitDice.changed.dispatch();
//     // };
//     //
//     // this.hitDiceTypeDataHasChanged = function() {
//     //     this.hitDiceType().save();
//     //     Notifications.hitDiceType.changed.dispatch();
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
//
//
// }

ko.components.register('stats', {
    viewModel: ACCardModel,
    template: template
});
