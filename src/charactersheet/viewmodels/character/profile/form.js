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
}

ko.components.register('profile-form', {
    viewModel: ProfileFormViewModel,
    template: template
});
