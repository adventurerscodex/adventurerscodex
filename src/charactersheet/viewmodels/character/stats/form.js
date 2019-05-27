import {
    Health,
    HitDice
} from 'charactersheet/models/character';

import { CoreManager } from 'charactersheet/utilities';
import { FormBaseController } from 'charactersheet/components/form-base-controller';
import { Notifications } from 'charactersheet/utilities';

import { StatsCardViewModel } from './view';
import { StatsHealthViewModel } from './health';

import autoBind from 'auto-bind';
import ko from 'knockout';

import template from './form.html';


export class StatsHealthFormViewModel extends FormBaseController {

    constructor(params) {
        super(params);
        this.flip = params.outerFlip;
        this.show = params.outerShowBack;
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

    refresh = async () => {
        var key = CoreManager.activeCore().uuid();

        const hitDice = await HitDice.ps.read({uuid: key});
        this.hitDice(hitDice.object);

        const health = await Health.ps.read({uuid: key});
        this.health(health.object);
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
}

ko.components.register('stats-health-form', {
    viewModel: StatsHealthFormViewModel,
    template: template
});
