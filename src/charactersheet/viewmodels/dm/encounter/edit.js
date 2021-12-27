import autoBind from 'auto-bind';
import { Encounter } from 'charactersheet/models/dm';
import { Notifications } from 'charactersheet/utilities';
import { AbstractEncounterListViewModel } from 'charactersheet/viewmodels/abstract';
import ko from 'knockout';
import template from './edit.html';


class EncountersEditViewModel extends AbstractEncounterListViewModel {

    constructor(params) {
        super(params);
        autoBind(this);

        this.column = params.column;
        this.visible = params.visible;
        this.flip = params.flip;
        this.active = ko.observable();
    }

    modelClass() {
        return Encounter;
    }

    reset() {
        this.flip();
    }

    // Overrides - to flip on add

    addToList(item) {
        super.addToList(item);

        // Don't flip if the normal list view is visible.
        if (ko.unwrap(this.visible)) {
            this.flip();
        }
    }
}


ko.components.register('encounters-edit', {
    viewModel: EncountersEditViewModel,
    template: template
});
