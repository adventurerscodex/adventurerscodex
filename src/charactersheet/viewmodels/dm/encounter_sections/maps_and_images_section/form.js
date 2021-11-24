import autoBind from 'auto-bind';
import { CoreManager } from 'charactersheet/utilities';
import { AbstractChildEncounterFormModel } from 'charactersheet/viewmodels/abstract';
import { EncounterImage } from 'charactersheet/models/common';
import ko from 'knockout';
import template from './form.html';
import { SELECTDATA } from 'charactersheet/constants';


class MapsAndImagesFormViewModel extends AbstractChildEncounterFormModel {

    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelClass() {
        return EncounterImage;
    }
}


ko.components.register('maps-and-images-form', {
    viewModel: MapsAndImagesFormViewModel,
    template: template
});
