import { Fixtures, Notifications } from 'charactersheet/utilities';
import { AbstractChildTrackedFormModel } from 'charactersheet/viewmodels/abstract';
import { Feature } from 'charactersheet/models';
import { SELECTDATA } from 'charactersheet/constants';
import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class FeatureFormViewModel  extends AbstractChildTrackedFormModel {
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

    notify() {
        Notifications.feature.changed.dispatch();
    }

    popoverText = () => ('Tracked Features are listed in the Tracker.');
}

ko.components.register('feature-form', {
    viewModel: FeatureFormViewModel,
    template: template
});
