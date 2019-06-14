import {
  AbstractChildFormModel
} from './child-form-model';
import {
  Tracked
} from 'charactersheet/models';
import { TrackedForm } from 'charactersheet/components';

import campingTentWhite from 'images/camping-tent.svg';
import ko from 'knockout';
import meditationWhite from 'images/meditation.svg';

export class AbstractChildTrackedFormModel extends AbstractChildFormModel {
    constructor(params) {
        super(params);
        this.meditationWhite = meditationWhite;
        this.campingTentWhite = campingTentWhite;

        this.tracked = ko.observable(new Tracked());
        this.isTracked = ko.observable(false);

        if (this.existingData && this.existingData.tracked()) {
            this.isTracked(true);
            this.tracked().importValues(this.entity().tracked());
        }
    }

    setUpSubscriptions () {
        super.setUpSubscriptions();
        const onTrackFormDisplay = this.isTracked.subscribe(()=>{this.forceResizeForTrackedForm();});
        this.subscriptions.push(onTrackFormDisplay);
    }

    forceResizeForTrackedForm = async () => {
        setTimeout(this.forceCardResize, 50);
    }

    async refresh() {
        await super.refresh();
        this.isTracked(false);
        if (this.existingData && this.existingData.tracked()) {
            this.isTracked(true);
            this.tracked().importValues(this.existingData.tracked());
        }
    }

    async save () {
        if (!this.isTracked()) {
            this.tracked(null);
            this.entity().tracked(null);
        } else {
            this.entity().tracked(this.tracked().exportValues());
        }
        await super.save();
    }
}
