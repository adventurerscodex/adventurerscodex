import autoBind from 'auto-bind';
import { CoreManager } from 'charactersheet/utilities';
import { AbstractChildEncounterFormModel } from 'charactersheet/viewmodels/abstract';
import { PointOfInterest } from 'charactersheet/models/dm';
import ko from 'knockout';
import template from './form.html';
import { SELECTDATA } from 'charactersheet/constants';


class PointOfInterestFormViewModel extends AbstractChildEncounterFormModel {

    constructor(params) {
        super(params);
        autoBind(this);

        this.showElaboration = ko.observable(false);
    }

    modelClass() {
        return PointOfInterest;
    }

    elaborationContext = ko.pureComputed(() => (
        `${this.entity().name()}`
    ));

    useElaboration(elaboration) {
        this.entity().description(elaboration.description());
        this.toggleElaboration();
    }

    toggleElaboration() {
        this.showElaboration(!this.showElaboration());
    }
}


ko.components.register('point-of-interest-form', {
    viewModel: PointOfInterestFormViewModel,
    template: template
});
