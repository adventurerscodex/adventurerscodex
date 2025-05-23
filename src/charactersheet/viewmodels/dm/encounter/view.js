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
        this.filtered = ko.observable(false);
        this.sortAttribute = ko.observable();
        this.sortAsc = ko.observable(true);
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

    filteredAndSortedEntities = ko.pureComputed(() => this.entities());

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

    sortBy(columnName) {
        super.sortBy(columnName);

        // We can't use the Sort Service to sort because of the encounter nesting.
        // Though we still use it for managing UI state.
        // The sort is done here.

        const { field, direction } = this.sort();

        const sorter = (left, right) => (
            left[field]() == right[field]()
            ? 0
            : (
                left[field]() > right[field]()
                ? 1
                : -1

            )
        );

        const applySort = entities => {
            if (direction === 'asc') {
                entities.sort(sorter);
            } else {
                entities.reverse(sorter);
            }

            entities().forEach(entity => applySort(entity.children));
        };

        // Apply the sort at the top.
        applySort(this.entities);

    }
}


ko.components.register('encounters-view', {
    viewModel: EncounterViewModel,
    template: template
});
