import 'bin/knockout-circular-progress';
import {
    DeathSave,
    Health
} from 'charactersheet/models/character';

import { CoreManager } from 'charactersheet/utilities';
import { Notifications } from 'charactersheet/utilities';
import { StatsDeathSaveViewModel } from './deathsave';
import { StatsHealthViewModel } from './health';

import autoBind from 'auto-bind';
import { find } from 'lodash';
import ko from 'knockout';
import template from './view.html';


// Manage the interactions between health and death saves
export class StatsCardViewModel {
    constructor(params) {
        // super(params);
        this.tabId = params.tabId;
        this.containerId = params.containerId;
        this.show = params.show;
        this.flip = params.flip;
        this.forceOuterCardResize = params.forceCardResize;

        this.health = ko.observable(new Health());
        // this.deathSaveSuccess = ko.observable(new DeathSave());
        // this.deathSaveFailure = ko.observable(new DeathSave());
        this.massiveDamageTaken = ko.observable(false);
        this.deathSavesVisible = ko.observable(false);
        autoBind(this);
    }

    load = async () => {
        const key = CoreManager.activeCore().uuid();
        await this.health().load({uuid: key});
        this.deathSavesVisible(this.health().dying());
        this.setUpSubscriptions();
    }

    setUpSubscriptions = () => {
        Notifications.health.changed.add(this.healthChanged);
        this.deathSavesVisible.subscribe(this.subscribeToShowForm);
    }

    healthChanged = (health) => {
        this.health().importValues(health.exportValues());
        this.deathSavesVisible(this.health().dying());
    }

    // setNotification = () => {
    //
    //
    //   if (this.massiveDamageTaken()) {
      //       // oh no ...
      //         this.deathSaveFailure().used(3);
      //         const saveFailures = await this.deathSaveFailure().save();
      //         this.deathSaveFailure(saveFailures.object);
      //
      //         Notifications.userNotification.dangerNotification.dispatch(
      //             'Massive damage is not to be trifled with...',
      //             'You have died.', {
      //                 timeOut: 0
      //             });
      //         Notifications.stats.deathSaves.fail.changed.dispatch();
      //         this.massiveDamageTaken(false);
      //     }
    // }

    subscribeToShowForm = () => {
        this.forceOuterCardResize();
    }

    // healthinessDidUpdate = async () => {
    //
    //     const oldHealth = this.health();
    //     const oldSuccess = this.deathSaveSuccess();
    //     const oldFailure = this.deathSaveFailure();
    //
    //     await this.refresh();
    //
    //     // TODO: This is very convoluted, and could be solved by
    //     // migrating the DeathSave object to
    //     // have no type
    //     // have a fails integer property
    //     // have a successes integer property
    //     // and have a status flag, dying, which could be triggered
    //     // when a character first drops to 0, and then gets unset
    //     // when a character stabilizes.
    //
    //     if (!oldHealth.isKnockedOut() && this.health().isKnockedOut()) {
    //         // Dropped to unconscious. Reset the saving throws.
    //         this.deathSaveSuccess().used(0);
    //         this.deathSaveFailure().used(0);
    //         const saveSuccesses = await this.deathSaveSuccess().save();
    //         const saveFailures = await this.deathSaveFailure().save();
    //         this.deathSaveSuccess(saveSuccesses.object);
    //         this.deathSaveFailure(saveFailures.object);
    //         Notifications.stats.deathSaves.notSuccess.changed.dispatch();
    //
    //     } else if (oldHealth.isKnockedOut() && !this.health().isKnockedOut()) {
    //         // Healed a bit. Reset saves for next time.
    //         this.deathSaveSuccess().used(0);
    //         this.deathSaveFailure().used(0);
    //         const saveSuccesses = await this.deathSaveSuccess().save();
    //         const saveFailures = await this.deathSaveFailure().save();
    //         this.deathSaveSuccess(saveSuccesses.object);
    //         this.deathSaveFailure(saveFailures.object);
    //         Notifications.stats.deathSaves.success.changed.dispatch();
    //     } else if (oldHealth.isKnockedOut() && this.health().isKnockedOut()) {
    //       // Damaged while stable.
    //         this.deathSaveSuccess().used(0);
    //         this.deathSaveFailure().used(0);
    //         const saveSuccesses = await this.deathSaveSuccess().save();
    //         const saveFailures = await this.deathSaveFailure().save();
    //         this.deathSaveSuccess(saveSuccesses.object);
    //         this.deathSaveFailure(saveFailures.object);
    //         Notifications.stats.deathSaves.notSuccess.changed.dispatch();
    //     }
    //
    //     if (this.massiveDamageTaken()) {
    //       // oh no ...
    //         this.deathSaveFailure().used(3);
    //         const saveFailures = await this.deathSaveFailure().save();
    //         this.deathSaveFailure(saveFailures.object);
    //
    //         Notifications.userNotification.dangerNotification.dispatch(
    //             'Massive damage is not to be trifled with...',
    //             'You have died.', {
    //                 timeOut: 0
    //             });
    //         Notifications.stats.deathSaves.fail.changed.dispatch();
    //         this.massiveDamageTaken(false);
    //     }
    //
    //     if (this.health().isKnockedOut() && this.deathSaveSuccess().used() < 3) {
    //       // dying and not stable
    //         this.deathSavesVisible(true);
    //     } else {
    //         this.deathSavesVisible(false);
    //     }
    // }

    // deathSavesDidUpdate = async () => {
    //     await this.refresh();
    //     if (this.health().isKnockedOut() && this.deathSaveSuccess().used() < 3) {
    //         // dying and not stable
    //         this.deathSavesVisible(true);
    //     } else {
    //         this.deathSavesVisible(false);
    //     }
    // }

    toggleDeathSavesVisible = () => {
        this.deathSavesVisible(!this.deathSavesVisible());
    }
}

ko.components.register('stats-card-view', {
    viewModel: StatsCardViewModel,
    template: template
});
