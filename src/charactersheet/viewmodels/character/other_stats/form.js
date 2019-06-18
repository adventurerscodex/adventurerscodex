import { AbstractFormModel } from 'charactersheet/viewmodels/abstract';
import {  Notifications } from 'charactersheet/utilities';

import { OtherStats } from 'charactersheet/models/character';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class OtherStatsFormViewModel extends AbstractFormModel {
    constructor(params) {
        super(params);
        // Notification Properties
        this.hasInspirationChanged = ko.observable(false);
        autoBind(this);
    }

    modelClass () {
        return OtherStats;
    }

    toggleInspiration = async () => {
        this.entity().inspiration(!this.entity().inspiration());
    }

    notify = async () => {
        if (this.hasInspirationChanged()) {
            Notifications.otherStats.inspiration.changed.dispatch();
        }
        this.resetSubscriptions();
    }

    setUpSubscriptions = () => {
        super.setUpSubscriptions();
        // Subscribe to the fields changing so that the correct notifications
        // are fired when saving.
        this.entity().inspiration.subscribe(this.inspirationHasChanged);
    }

    // Functions to record that fields have changed. These values are reset on save (or reset)
    inspirationHasChanged = () => {
        this.hasInspirationChanged(true);
    }

    resetSubscriptions = () => {
        this.hasInspirationChanged(false);
    }
}

ko.components.register('other-stats-form', {
    viewModel: OtherStatsFormViewModel,
    template: template
});
