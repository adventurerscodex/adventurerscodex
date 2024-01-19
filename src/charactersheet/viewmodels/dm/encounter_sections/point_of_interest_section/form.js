import autoBind from 'auto-bind';
import { CoreManager } from 'charactersheet/utilities';
import { AbstractChildEncounterFormModel } from 'charactersheet/viewmodels/abstract';
import { PointOfInterest } from 'charactersheet/models/dm';
import { randomPointOfInterest } from 'charactersheet/services/dm';
import ko from 'knockout';
import template from './form.html';
import { SELECTDATA } from 'charactersheet/constants';


class PointOfInterestFormViewModel extends AbstractChildEncounterFormModel {

    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelClass() {
        return PointOfInterest;
    }

    generateRandomName() {
        this.entity().name(randomPointOfInterest());
    }
}


ko.components.register('point-of-interest-form', {
    viewModel: PointOfInterestFormViewModel,
    template: template
});
