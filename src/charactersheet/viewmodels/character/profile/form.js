import {
    Fixtures,
    Notifications
} from 'charactersheet/utilities';
import { AbstractFormModel } from 'charactersheet/viewmodels/abstract';
import { Profile } from 'charactersheet/models/character';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class ProfileFormViewModel extends AbstractFormModel {
    constructor(params) {
        super(params);
        this.levelHasChanged = ko.observable(false);
        autoBind(this);
    }

    modelClass () {
        return Profile;
    }

    alignmentOptions = Fixtures.profile.alignmentOptions;
    setAlignment = (label, value) => {
        this.entity().alignment(value);
    };

    classOptions = Fixtures.profile.classOptions;
    setClass = (label, value) => {
        this.entity().characterClass(value);
    };

    raceOptions = Fixtures.profile.raceOptions;
    setRace = (label, value) => {
        this.entity().race(value);
    };

    notify = async () => {
        if (this.levelHasChanged()) {
            Notifications.profile.level.changed.dispatch();
        }
        Notifications.profile.changed.dispatch();
        this.levelHasChanged(false);
    }
    //
    setUpSubscriptions = () => {
        super.setUpSubscriptions();
        // Subscribe to the fields changing so that the correct notifications
        // are fired when saving.
        this.entity().level.subscribe(this.markLevelAsChanged);
    }

    markLevelAsChanged = () => {
        this.levelHasChanged(true);
    }
}

ko.components.register('profile-form', {
    viewModel: ProfileFormViewModel,
    template: template
});
