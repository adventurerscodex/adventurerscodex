import {
    Health,
    HitDice
} from 'charactersheet/models/character';

import { AbstractFormModel } from 'charactersheet/viewmodels/abstract';
import { CoreManager } from 'charactersheet/utilities';
import { Notifications } from 'charactersheet/utilities';

import { StatsCardViewModel } from './view';
import { StatsHealthViewModel } from './health';

import autoBind from 'auto-bind';
import ko from 'knockout';

import template from './form.html';


export class StatsHealthFormViewModel extends AbstractFormModel {

    constructor(params) {
        super(params);
        this.defaultHeight = params.defaultHeight;
        this.loaded = ko.observable(false);
        this.hitDice = ko.observable(new HitDice());
        this.health = ko.observable(new Health());
        this.hitDiceList = ko.observableArray([]);
        autoBind(this);
    }

    generateBlank () {
        return new Health();
    }

    async load() {
        await this.refresh();
        this.setUpSubscriptions();
        this.loaded(true);
    }

    setUpSubscriptions () {
        super.setUpSubscriptions();
    }

    refresh = async () => {
        var key = CoreManager.activeCore().uuid();

        const hitDice = await HitDice.ps.read({uuid: key});
        this.hitDice().importValues(hitDice.object.exportValues());

        const health = await Health.ps.read({uuid: key});
        this.health().importValues(health.object.exportValues());
    };

    save = async () => {
        await this.health().ps.save();
        await this.hitDice().ps.save();
    };

    notify = () => {
        Notifications.hitDiceType.changed.dispatch();
        Notifications.health.changed.dispatch();
        Notifications.health.damage.changed.dispatch();
        Notifications.health.maxHitPoints.changed.dispatch();
    }

    setHitDiceType = (hitDiceType) => {
        this.hitDice().type(hitDiceType);
    }

    validation = {
        Health: Health.validationConstraints.rules,
        HitDice: HitDice.validationConstraints.rules
    }
}

ko.components.register('stats-health-form', {
    viewModel: StatsHealthFormViewModel,
    template: template
});
