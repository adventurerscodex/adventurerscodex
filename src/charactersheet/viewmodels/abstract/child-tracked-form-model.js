import { AbstractChildFormModel } from './child-form-model';
import { DELAY } from 'charactersheet/constants';
import { Tracked } from 'charactersheet/models';
import {
  TrackedForm
} from 'charactersheet/components/form-tracked-component';
import ko from 'knockout';

/**
 * AbstractChildTrackedFormModel
 *
 * Expands upon the AbstractChildFormModel to manage 'tracked' entities.
 *
 * @property tracked {observable} the Tracked character data model.
 * @param isTracked {observable} flag for if the item is tracked.
 *  Tracked items need to show the 'TrackedForm' to collect tracked data.
 **/

export class AbstractChildTrackedFormModel extends AbstractChildFormModel {
    constructor(params) {
        super(params);
        this.tracked = ko.observable(new Tracked());
        this.isTracked = ko.observable(false);
    }

    async load() {
        await super.load();
        const tracked = this.entity().tracked();
        if (tracked) {
            this.isTracked(true);
            this.tracked().importValues(tracked.exportValues());
        }
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();
        const onTrackFormDisplay = this.isTracked.subscribe(this.forceResize);
        this.subscriptions.push(onTrackFormDisplay);
    }

    async refresh() {
        await super.refresh();
        const tracked = this.entity().tracked();
        if (tracked) {
            this.isTracked(true);
            this.tracked().importValues(tracked.exportValues());
        } else {
            this.isTracked(false);
        }
    }

    async save() {
        if (!this.isTracked()) {
            this.tracked(null);
            this.entity().tracked(null);
        } else {
            this.entity().tracked().importValues(this.tracked().exportValues());
        }
        await super.save();
    }
}
