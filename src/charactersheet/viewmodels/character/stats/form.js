import {
    Health,
    HitDice
} from 'charactersheet/models/character';

import { AbstractFormModel } from 'charactersheet/viewmodels/abstract';
import { CoreManager } from 'charactersheet/utilities';
import { Notifications } from 'charactersheet/utilities';
import { PartyService } from 'charactersheet/services';

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
        autoBind(this);
    }

    modelClass () {
        return Health;
    }

    generateBlank() {
        return new Health();
    }

    async refresh () {
        await super.refresh();
        await this.hitDice().load({uuid: CoreManager.activeCore().uuid()});
    }

    async save () {
        if (this.entity().damage() < this.entity().maxHitPoints() ) {
            this.entity().isDying(false);
        }
        await super.save();
        await this.hitDice().save();
    }

    setHitDiceType = (hitDiceType) => {
        this.hitDice().type(hitDiceType);
    }


    didSave(success, error) {
        super.didSave(success, error);
        PartyService.updatePresence();
    }

    validation = {
        Health: Health.validationConstraints.fieldParams,
        HitDice: HitDice.validationConstraints.fieldParams
    }
}

ko.components.register('stats-health-form', {
    viewModel: StatsHealthFormViewModel,
    template: template
});
