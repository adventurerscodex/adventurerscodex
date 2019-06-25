import { DataRepository, Fixtures, Notifications } from 'charactersheet/utilities';
import { AbstractChildFormModel } from 'charactersheet/viewmodels/abstract';
import { Feature } from 'charactersheet/models';
import { SELECTDATA } from 'charactersheet/constants';
import { TrackedForm } from 'charactersheet/components/form-tracked-component';
import autoBind from 'auto-bind';
import { find } from 'lodash';
import ko from 'knockout';
import template from './form.html';

export class FeatureFormViewModel  extends AbstractChildFormModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelClass() {
        return Feature;
    }

    prePopSource = 'features';
    prePopLimit = SELECTDATA.LONG;

    classOptions = Fixtures.profile.classOptions;
    populateClass = (label, value) => {
        this.entity().characterClass(value);
    };

    popoverText = () => ('Tracked Features are listed in the Tracker.');

    setUpSubscriptions() {
        super.setUpSubscriptions();
        const onTrackFormDisplay = this.entity().isTracked.subscribe(this.forceResize);
        this.subscriptions.push(onTrackFormDisplay);
    }
}

ko.components.register('feature-form', {
    viewModel: FeatureFormViewModel,
    template: template
});
