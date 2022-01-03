import autoBind from 'auto-bind';
import { CoreManager } from 'charactersheet/utilities';
import { AbstractChildEncounterFormModel } from 'charactersheet/viewmodels/abstract';
import { PlayerText } from 'charactersheet/models/dm';
import ko from 'knockout';
import template from './form.html';
import { SELECTDATA } from 'charactersheet/constants';


class ReadAloudTextFormViewModel extends AbstractChildEncounterFormModel {

    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelClass() {
        return PlayerText;
    }
}


ko.components.register('read-aloud-text-form', {
    viewModel: ReadAloudTextFormViewModel,
    template: template
});
