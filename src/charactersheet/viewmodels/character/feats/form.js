import { AbstractChildFormModel } from 'charactersheet/viewmodels/abstract';
import { Feat } from 'charactersheet/models';
import { Fixtures } from 'charactersheet/utilities';
import { Notifications } from 'charactersheet/utilities';
import { PartyService } from 'charactersheet/services';
import { SELECTDATA } from 'charactersheet/constants';
import { TrackedForm } from 'charactersheet/components/form-tracked-component';
import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class FeatFormViewModel extends AbstractChildFormModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelClass () {
        return Feat;
    }

    prePopSource = 'feats';
    prePopLimit = SELECTDATA.LONG;

    classOptions = Fixtures.profile.classOptions;

    popoverText = () => ('Tracked Feats are listed in the Tracker.');

    setUpSubscriptions() {
        super.setUpSubscriptions();
        this.subscriptions.push(this.entity().isTracked.subscribe(this.forceResize));
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

ko.components.register('feat-form', {
    viewModel: FeatFormViewModel,
    template: template
});
