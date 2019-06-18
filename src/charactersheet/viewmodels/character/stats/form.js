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
        this.hitDice = ko.observable(new HitDice());
        this.hitDiceList = ko.observableArray([]);
        autoBind(this);
    }

    modelClass () {
        return Health;
    }

    generateBlank() {
        const thisClazz = this.modelClass();
        const newEntity = new thisClazz();
        return newEntity;
    }

    async refresh () {
        await super.refresh();
        const coreKey = CoreManager.activeCore().uuid();
        const hitDice = await HitDice.ps.read({uuid: coreKey});
        this.hitDice().importValues(hitDice.object.exportValues());
    }

    async save () {
        await super.save();
        await this.hitDice().save();
    }

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
