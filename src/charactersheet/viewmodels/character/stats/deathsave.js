import { DeathSave, Health } from 'charactersheet/models/character';
import { find, times } from 'lodash';

import { CoreManager } from 'charactersheet/utilities';
import { Notifications } from 'charactersheet/utilities';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './deathsave.html';

class StatsDeathSaveViewModel {
    constructor(params) {
        this.loaded = ko.observable(false);
        this.show = params.show;
        this.forceCardResize = params.forceCardResize;
        this.massiveDamageTaken = params.massiveDamageTaken;
        this.deathSaveFailure = ko.observable(new DeathSave());
        this.deathSaveSuccess = ko.observable(new DeathSave());
        this.health = ko.observable(new Health());
        this.healInput = ko.observable(null);
        autoBind(this);
    }

    load = async () => {
        const key = CoreManager.activeCore().uuid();
        const deathSaves = await DeathSave.ps.list({coreUuid: key});
        this.deathSaveSuccess(find(deathSaves.objects, (save) => save.type() === 'success'));
        this.deathSaveFailure(find(deathSaves.objects, (save) => save.type() === 'failure'));
        await this.health().load({uuid: key});
        this.setUpSubscriptions();
        this.forceCardResize();
        this.loaded(true);
    }

    setUpSubscriptions() {
        this.show.subscribe(this.massiveDamageDeath);
        Notifications.health.changed.add(this.updateHealth);
    }

    async massiveDamageDeath() {
        if (this.show() && this.massiveDamageTaken()) {
            this.deathSaveFailure().used(3);
            await this.deathSaveFailure().save();
            Notifications.userNotification.dangerNotification.dispatch(
              'Massive damage is not to be trifled with...',
              'You have died.', {
                  timeOut: 0
              });
            this.massiveDamageTaken(false);
        }
    }
    updateHealth = (health) => {
        this.health().importValues(health.exportValues());
        if (!this.health().dying()) {
            this.resetSaves();
        }
    }

    deathSaveFailureList = ko.pureComputed(()=> {
        return times(3, (i) => {
            return ko.observable(this.deathSaveFailure().used() > i);
        });
    })

    deathSaveSuccessList = ko.pureComputed(() => {
        return times(3, (i) => {
            return ko.observable(this.deathSaveSuccess().used() > i);
        });
    });

    async resetSaves() {
        if (this.deathSaveFailure().used() > 0) {
            this.deathSaveFailure().used(0);
            await this.deathSaveFailure().save();
        }
        if (this.deathSaveSuccess().used() > 0) {
            this.deathSaveSuccess().used(0);
            await this.deathSaveSuccess().save();
        }
    }

    succeedOnDeathSave = async (undo) => {
        if (this.rip()) {
            return;
        }
        if (undo && this.deathSaveSuccess().used() > 0) {
            this.deathSaveSuccess().used(this.deathSaveSuccess().used() - 1);
        } else if (this.deathSaveSuccess().used() < 3) {
            this.deathSaveSuccess().used(this.deathSaveSuccess().used() + 1);
        }
        await this.deathSaveSuccess().save();
        if (this.deathSaveSuccess().used() === 3) {
            await this.stabilize();
        }
    }

    failOnDeathSave = async (undo) => {
        if (undo && this.deathSaveFailure().used() > 0) {
            this.deathSaveFailure().used(this.deathSaveFailure().used() - 1);
        } else if (this.deathSaveSuccess().used() < 3) {
            this.deathSaveFailure().used(this.deathSaveFailure().used() + 1);
        }
        await this.deathSaveFailure().save();
        if (this.deathSaveFailure().used() === 3) {
            await this.die();
        }
    }

    handleHeal = async () => {
        let healValue = -1;
        if (this.healInput()) {
            healValue = 0 - parseInt(this.healInput());
        }
        const currentDamage = parseInt(this.health().damage());
        let newDamage = currentDamage + healValue;
        if (newDamage < 0) {
            newDamage = 0;
        }
        this.health().damage(newDamage);
        await this.stabilize(); // Stabilize will save health
        this.healInput(null);
    };

    stabilize = async () => {
        this.health().dying(false);
        await this.health().save();
        Notifications.userNotification.successNotification.dispatch(
          'You have been spared...for now.',
          'You are now stable.', {
              timeOut: 0
          });
    }

    die = async () => {
        Notifications.userNotification.dangerNotification.dispatch(
            'Failing all 3 death saves will do that...',
            'You have died.', {
                timeOut: 0
            });
    }

    rip = ko.pureComputed(() => {
        return this.deathSaveFailure().used() >= 3; // I know, 'should' max at 3
    });
}

ko.components.register('stats-deathsave-view', {
    viewModel: StatsDeathSaveViewModel,
    template: template
});
