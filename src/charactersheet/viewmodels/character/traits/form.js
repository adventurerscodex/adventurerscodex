import { AbstractChildTrackedFormModel } from 'charactersheet/viewmodels/abstract';
import { Fixtures } from 'charactersheet/utilities';
import { Notifications } from 'charactersheet/utilities';
import { SELECTDATA } from 'charactersheet/constants';
import { Trait } from 'charactersheet/models';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class TraitFormViewModel extends AbstractChildTrackedFormModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelClass() {
        return Trait;
    }
    prePopSource = 'traits';
    prePopLimit = SELECTDATA.LONG;

    raceOptions = Fixtures.profile.raceOptions;
    populateRace = (label, value) => {
        this.entity().race(value);
    };

    popoverText = () => ('Tracked Traits are listed in the Tracker.');
}

ko.components.register('trait-form', {
    viewModel: TraitFormViewModel,
    template: template
});
