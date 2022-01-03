import { CoreManager } from 'charactersheet/utilities';
import { Encounter } from 'charactersheet/models/dm';
import { Notifications, Fixtures } from 'charactersheet/utilities';
import { AbstractEncounterFormViewModel } from 'charactersheet/viewmodels/abstract';
import ko from 'knockout';
import template from './form.html';


class EncounterDetailFormViewModel extends AbstractEncounterFormViewModel {

    constructor(params) {
        super(params);
        this.column = params.column;
    }

    modelClass() {
        return Encounter;
    }
}


ko.components.register('encounter-detail-form', {
    viewModel: EncounterDetailFormViewModel,
    template: template
});
