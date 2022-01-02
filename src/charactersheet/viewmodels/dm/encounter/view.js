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
        this.collapseAllId = '#encounter-pane';
        this.column = params.column;
        this.flip = params.flip;
        this.active = ko.observable();
        this.forceCardResize = params.forceCardResize;
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
}


ko.components.register('encounters-view', {
    viewModel: EncounterViewModel,
    template: template
});
