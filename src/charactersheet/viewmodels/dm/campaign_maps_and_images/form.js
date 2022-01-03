import autoBind from 'auto-bind';
import { CoreManager } from 'charactersheet/utilities';
import { AbstractChildFormModel } from 'charactersheet/viewmodels/abstract';
import { Image } from 'charactersheet/models/dm';
import ko from 'knockout';
import template from './form.html';
import { SELECTDATA } from 'charactersheet/constants';


class MapsAndImagesFormViewModel extends AbstractChildFormModel {

    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelClass() {
        return Image;
    }
}


ko.components.register('campaign-maps-and-images-form', {
    viewModel: MapsAndImagesFormViewModel,
    template: template
});
