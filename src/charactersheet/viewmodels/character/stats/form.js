import {
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
import { StatsHealthViewModel } from './health';


import ko from 'knockout';

import template from './form.html';



class ACFormViewModel {
    constructor(params) {
        // Card Properties
        this.containerId = ko.utils.unwrapObservable(params.containerId);
        this.showBack = params.showBack;
        this.flip = params.flip;
        this.resize = params.resize;

        this.loaded = ko.observable(false);
        this.formElementHasFocus = ko.observable(false);
    }

    async load() {
        this.loaded(false);
        await this.refresh();
        this.setUpSubscriptions();
        this.loaded(true);
    }

    async reset() {
        await this.refresh();
        this.flip();
    }

    async refresh() {
        throw('refresh must be defined by subclasses of ACFormViewModel');
    }

    async save() {
        throw('Save must be defined by subclasses of ACFormViewModel');
    }

    async notify() {
        throw('Notify must be defined by subclasses of ACFormViewModel');
    }

    async submit() {
        await this.save();
        this.notify();
        this.setUpSubscriptions();
        this.flip();
    }

    setUpSubscriptions() {
        this.showBack.subscribe(this.subscribeToShowForm);
    }

    subscribeToShowForm = () => {
        if (this.showBack()) {
            this.refresh();
            this.formElementHasFocus(true);
        } else {
            this.formElementHasFocus(false);
        }
    }
}

export class StatsHealthFormViewModel extends ACFormViewModel {

    constructor(params) {
        super(params);
        this.flip = params.outerFlip;
        this.showBack = params.outerShowBack;
        this.defaultHeight = params.defaultHeight;
        this.hitDice = ko.observable(new HitDice());
        this.health = ko.observable(new Health());
        this.hitDiceList = ko.observableArray([]);

    }

    refresh = async () => {
        var key = CoreManager.activeCore().uuid();

        const hitDice = await HitDice.ps.read({uuid: key});
        this.hitDice(hitDice.object);

        const health = await Health.ps.read({uuid: key});
        this.health(health.object);
    };

    save = async () => {
        var key = CoreManager.activeCore().uuid();

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
