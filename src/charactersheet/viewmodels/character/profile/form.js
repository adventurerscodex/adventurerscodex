import {
    CoreManager,
    Fixtures,
    Notifications
} from 'charactersheet/utilities';
import {
    AbstractFormModel
} from 'charactersheet/viewmodels/abstract';
import {
    CardSubmitActionComponent
} from 'charactersheet/components/card-submit-actions';
import {
    Profile
} from 'charactersheet/models/character';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class ProfileFormViewModel extends AbstractFormModel {
    constructor(params) {
        super(params);
        this.levelHasChanged = ko.observable(false);
        autoBind(this);
    }

    generateBlank() {
        return new Profile();
    }

    async load() {
        await super.load();
        await this.refresh();
    }

    async refresh() {
        await super.refresh();
        const key = CoreManager.activeCore().uuid();
        const response = await Profile.ps.read({
            uuid: key
        });
        this.entity().importValues(response.object.exportValues());
    }

    validation = {
        ...Profile.validationConstraints.rules
    }

    alignmentOptions = Fixtures.profile.alignmentOptions;
    classOptions = Fixtures.profile.classOptions;
    raceOptions = Fixtures.profile.raceOptions;

    setAlignment = (label, value) => {
        this.entity().alignment(value);
    };

    setClass = (label, value) => {
        this.entity().characterClass(value);
    };

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
