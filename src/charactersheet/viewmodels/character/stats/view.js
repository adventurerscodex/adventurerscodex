import 'bin/knockout-circular-progress';
import {
    DeathSave,
    Health
} from 'charactersheet/models/character';

import { defer, find } from 'lodash';
import { CoreManager } from 'charactersheet/utilities';
import { DELAY } from 'charactersheet/constants';
import { Notifications } from 'charactersheet/utilities';
import { StatsDeathSaveViewModel } from './deathsave';
import { StatsHealthViewModel } from './health';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './view.html';


// Manage the interactions between health and death saves
export class StatsCardViewModel {

    constructor(params) {
        this.tabId = params.tabId;
        this.containerId = params.containerId;
        this.show = params.show;
        this.flip = params.flip;
        this.forceOuterCardResize = params.forceCardResize;

        this.health = ko.observable(new Health());
        this.massiveDamageTaken = ko.observable(false);
        this.noMaxHpLeft = ko.observable(false);
        this.deathSavesVisible = ko.observable(false);
        this.subscriptions = [];
        autoBind(this);
    }

    load = async () => {
        const key = CoreManager.activeCore().uuid();
        await this.health().load({uuid: key});
        this.deathSavesVisible(this.health().isDying());
        this.setUpSubscriptions();
    }

    setUpSubscriptions = () => {
        this.subscriptions.push(Notifications.health.changed.add(this.healthChanged));
        this.subscriptions.push(this.deathSavesVisible.subscribe(this.subscribeToShowForm));
    }

    disposeOfSubscriptions() {
        const disposeOfDisposable = (disposable) => {
            if (disposable.dispose) {
                disposable.dispose();
            } else if (disposable.detach) {
                disposable.detach();
            }

        };
        this.subscriptions.map((disposable) => defer(disposeOfDisposable, disposable));
        this.subscriptions = [];
    }

    dispose() {
        setTimeout(this.disposeOfSubscriptions, DELAY.DISPOSE);
    }

    healthChanged = (health) => {
        this.health().importValues(health.exportValues());
        this.deathSavesVisible(this.health().isDying());
    }

    subscribeToShowForm = () => {
        this.forceOuterCardResize();
    }

    toggleDeathSavesVisible = () => {
        this.deathSavesVisible(!this.deathSavesVisible());
    }
}

ko.components.register('stats-card-view', {
    viewModel: StatsCardViewModel,
    template: template
});
