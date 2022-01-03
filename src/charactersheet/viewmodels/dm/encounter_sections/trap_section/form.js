import autoBind from 'auto-bind';
import { CoreManager } from 'charactersheet/utilities';
import { AbstractChildEncounterFormModel } from 'charactersheet/viewmodels/abstract';
import { Trap } from 'charactersheet/models/dm';
import ko from 'knockout';
import template from './form.html';
import { SELECTDATA } from 'charactersheet/constants';


class TrapFormViewModel extends AbstractChildEncounterFormModel {

    constructor(params) {
        super(params);
        autoBind(this);
    }

    formIsValid = ko.observable(false);
    showMoreFields = ko.observable(false);

    prePopSource = 'traps';
    prePopLimit = SELECTDATA.LONG;

    modelClass() {
        return Trap;
    }
}


ko.components.register('trap-form', {
    viewModel: TrapFormViewModel,
    template: template
});
