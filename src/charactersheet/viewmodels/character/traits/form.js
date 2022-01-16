import { AbstractChildFormModel } from 'charactersheet/viewmodels/abstract';
import { Fixtures } from 'charactersheet/utilities';
import { Notifications } from 'charactersheet/utilities';
import { SELECTDATA } from 'charactersheet/constants';
import { TrackedForm } from 'charactersheet/components/form-tracked-component';
import { Trait } from 'charactersheet/models';
import { PartyService } from 'charactersheet/services';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class TraitFormViewModel extends AbstractChildFormModel {
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

    setUpSubscriptions() {
        super.setUpSubscriptions();
        const onTrackFormDisplay = this.entity().isTracked.subscribe(this.forceResize);
        this.subscriptions.push(onTrackFormDisplay);
    }


    didSave(success, error) {
        super.didSave(success, error);
        PartyService.updatePresence();
    }

    didDelete(success, error) {
        super.didDelete(success, error);
        PartyService.updatePresence();
    }
}

ko.components.register('trait-form', {
    viewModel: TraitFormViewModel,
    template: template
});
