import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';

import { FormController } from './form-controller-component';
import { Tracked } from 'charactersheet/models';

import campingTentWhite from 'images/camping-tent.svg';
import ko from 'knockout';
import meditationWhite from 'images/meditation.svg';

export class TrackedFormController extends FormController {
    constructor(params) {
        super(params);
        this.meditationWhite = meditationWhite;
        this.campingTentWhite = campingTentWhite;

        this.tracked = ko.observable(new Tracked());
        this.isTracked = ko.observable(false);

        if (this.existingData && this.existingData.tracked()) {
            this.isTracked(true);
            this.tracked(this.entity().tracked());
        }
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();
        const onTrackFormDisplay = this.isTracked.subscribe(this.forceResizeForTrackedForm);
        this.subscriptions.push(onTrackFormDisplay);
    }

    forceResizeForTrackedForm = async () => {
        setTimeout(this.forceCardResize, 50);
    }

    refresh() {
        super.refresh();
        this.isTracked(false);
        this.tracked(new Tracked());
        if (this.existingData && this.existingData.tracked()) {
            this.isTracked(true);
            this.tracked(this.existingData.tracked());
        }
    }

    async save () {
        if (!this.isTracked()) {
            this.tracked(null);
        }
        this.entity().tracked(this.tracked());
        await super.save();
    }
}
