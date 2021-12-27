import autoBind from 'auto-bind';
import { Encounter } from 'charactersheet/models/dm';
import { AbstractEncounterListViewModel } from 'charactersheet/viewmodels/abstract';
import ko from 'knockout';
import template from './view.html';


class EncounterViewModel extends AbstractEncounterListViewModel {

    constructor(params) {
        super(params);
        autoBind(this);

        this.addFormId = '#add-encounter';
        this.collapseAllId = '#encounter-pane';
        this.column = params.column;
        this.flip = params.flip;
        this.active = ko.observable();
    }

    modelClass() {
        return Encounter;
    }
}


ko.components.register('encounters-view', {
    viewModel: EncounterViewModel,
    template: template
});
