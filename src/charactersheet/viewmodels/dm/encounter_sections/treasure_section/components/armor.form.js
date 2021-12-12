import autoBind from 'auto-bind';
import { CoreManager } from 'charactersheet/utilities';
import { AbstractChildEncounterFormModel } from 'charactersheet/viewmodels/abstract';
import { EncounterArmor } from 'charactersheet/models/dm';
import ko from 'knockout';
import template from './armor.form.html';
import { SELECTDATA } from 'charactersheet/constants';


class EncounterArmorFormViewModel extends AbstractChildEncounterFormModel {

    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelClass() {
        return EncounterArmor;
    }
}


ko.components.register('treasure-armor-form', {
    viewModel: EncounterArmorFormViewModel,
    template: template
});
