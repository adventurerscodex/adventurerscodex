import { CoreManager } from 'charactersheet/utilities';
import { EncounterSection } from 'charactersheet/models/dm/encounter_section';
import { Notifications, Fixtures } from 'charactersheet/utilities';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import ko from 'knockout';
import template from './index.html';
import './index.css';
import './form';
import './view';


class EncounterDetailViewModel extends ViewModel {

    constructor(params) {
        super(params);
        this.encounter = params.encounter;
        this.column = params.column;
    }
}


ko.components.register('encounter-detail', {
    viewModel: EncounterDetailViewModel,
    template: template
});
