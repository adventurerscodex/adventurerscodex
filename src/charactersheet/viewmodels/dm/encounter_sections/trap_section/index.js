import autoBind from 'auto-bind';
import {
    CoreManager,
    DataRepository,
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { AbstractEncounterTabularViewModel } from 'charactersheet/viewmodels/abstract';
import { SortService } from 'charactersheet/services/common';
import { Trap } from 'charactersheet/models/dm';
import ko from 'knockout';
import template from './index.html';
import './form';
import './view';

class TrapSectionViewModel extends AbstractEncounterTabularViewModel {

    constructor(params) {
        super(params);
        autoBind(this);

        this.addFormId = '#add-trap';
        this.collapseAllId = '#traps-pane';
    }

    fullScreen = ko.observable(false);

    modelClass() {
        return Trap;
    }

    // UI

    name = ko.pureComputed(() => {
        const index = Fixtures.encounter.sections.traps.index;
        return this.encounter().sections()[index].name();
    });

    tagline = ko.pureComputed(() => {
        const index = Fixtures.encounter.sections.traps.index;
        return this.encounter().sections()[index].tagline();
    });

    sorts() {
        return {
            ...super.sorts(),
            'isActive asc': { field: 'isActive', direction: 'asc'},
            'isActive desc': { field: 'isActive', direction: 'desc'},
            'name asc': { field: 'name', direction: 'asc'},
            'name desc': { field: 'name', direction: 'desc'},
            'effect asc': { field: 'effect', direction: 'asc'},
            'effect desc': { field: 'effect', direction: 'desc'},
            'trigger asc': { field: 'trigger', direction: 'asc', numeric: true},
            'trigger desc': { field: 'trigger', direction: 'desc', numeric: true}
        };
    }

    filteredAndSortedEntities = ko.pureComputed(() =>  (
        SortService.sortAndFilter(this.entities(), this.sort(), null)
    ), this);

    // Actions

    async toggleArmed(trap, event) {
        event.stopPropagation();
        trap.isActive(!trap.isActive());
        await trap.save();
    }
}


ko.components.register('traps-section', {
    viewModel: TrapSectionViewModel,
    template: template
});
