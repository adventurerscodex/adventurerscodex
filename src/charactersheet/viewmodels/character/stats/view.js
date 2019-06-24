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
        this.tabId = params.tabId;
        this.containerId = params.containerId;
        this.show = params.show;
        this.flip = params.flip;
        this.forceOuterCardResize = params.forceCardResize;

        this.health = ko.observable(new Health());
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
