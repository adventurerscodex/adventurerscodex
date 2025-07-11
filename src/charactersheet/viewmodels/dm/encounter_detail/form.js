import autoBind from 'auto-bind';
import { Encounter } from 'charactersheet/models/dm';
import { Notifications } from 'charactersheet/utilities';
import { AbstractEncounterFormViewModel } from 'charactersheet/viewmodels/abstract';
import ko from 'knockout';
import template from './form.html';


class EncounterDetailFormViewModel extends AbstractEncounterFormViewModel {

    constructor(params) {
        super(params);
        autoBind(this);
        this.column = params.column;
    }

    modelClass() {
        return Encounter;
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();
        Notifications.encounter.changed.add(this.encounterDidChange);
    }

    // Events

    encounterDidChange(encounter) {
        if (this.entity().uuid() === encounter.uuid()) {
            this.entity(encounter);
        }
    }
}


ko.components.register('encounter-detail-form', {
    viewModel: EncounterDetailFormViewModel,
    template: template
});
