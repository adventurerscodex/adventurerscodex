import autoBind from 'auto-bind';
import { debounce } from 'lodash';
import { Encounter } from 'charactersheet/models/dm';
import { AbstractEncounterListViewModel } from 'charactersheet/viewmodels/abstract';
import ko from 'knockout';
import template from './view.html';
import { DELAY } from 'charactersheet/constants';


class EncounterViewModel extends AbstractEncounterListViewModel {

    constructor(params) {
        super(params);
        autoBind(this);

        this.addFormId = '#add-encounter';
        this.importFormId = '#import-donjon-encounter';
        this.collapseAllId = '#encounter-pane';
        this.column = params.column;
        this.flip = params.flip;
        this.active = ko.observable();
        this.forceCardResize = params.forceCardResize;

        this.displayImportForm = ko.observable(false);
    }

    async load() {
        await super.load();

        // It takes a while for KO to draw the encounters list,
        // especially if there's nested items, so we need to
        // force redraw ourselves after that process is likely done.
        setTimeout(this.forceCardResize, DELAY.LONG);
    }

    modelClass() {
        return Encounter;
    }

    removeFromList(item) {
        super.removeFromList(item);

        // Pop off the children components so that there's
        // no legacy, deleted views displayed.
        this.column.popToRoot();
    }

    toggleShowAddForm() {
        super.toggleShowAddForm();
        setTimeout(this.forceCardResize, DELAY.LONG);
    }

    toggleShowImportForm() {
        if (this.displayImportForm()) {
            this.displayImportForm(false);
            $(this.importFormId).collapse('hide');
        } else {
            this.displayImportForm(true);
            $(this.importFormId).collapse('show');
        }
        setTimeout(this.forceCardResize, DELAY.LONG);
    }
}


ko.components.register('encounters-view', {
    viewModel: EncounterViewModel,
    template: template
});
