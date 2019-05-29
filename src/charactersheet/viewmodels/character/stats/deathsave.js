import { ACViewModel } from 'charactersheet/components/view-component';
import { CoreManager } from 'charactersheet/utilities';
import { DeathSave } from 'charactersheet/models/character';
import { Notifications } from 'charactersheet/utilities';

import autoBind from 'auto-bind';
import { find } from 'lodash';
import ko from 'knockout';
import template from './deathsave.html';

class StatsDeathSaveViewModel extends ACViewModel {
    constructor(params) {
        super(params);
        this.stable = params.stable;
        this.forceCardResize = params.forceCardResize;
        this.deathSaveFailure = ko.observable(new DeathSave());
        this.deathSaveSuccess = ko.observable(new DeathSave());
        this.deathSaveSuccessList = ko.observableArray([]);
        this.deathSaveFailureList = ko.observableArray([]);
        autoBind(this);
    }

    generateBlank () {
        return new DeathSave();
    }

    load = async () => {
        await this.refresh();
        this.setUpSubscriptions();
        this.loaded(true);
    }

    refresh = async () => {
        var key = CoreManager.activeCore().uuid();
        // Fetch death saves
        const deathSaves = await DeathSave.ps.list({coreUuid: key});
        this.deathSaveSuccess(find(deathSaves.objects, (save) => save.type() === 'success'));
        this.deathSaveFailure(find(deathSaves.objects, (save) => save.type() === 'failure'));

        this.calculateDeathSaveSuccessList();
        this.calculateDeathSaveFailureList();
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
}

ko.components.register('stats-deathsave-view', {
    viewModel: StatsDeathSaveViewModel,
    template: template
});