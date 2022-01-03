import autoBind from 'auto-bind';
import {
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { AbstractEncounterTabularViewModel } from 'charactersheet/viewmodels/abstract';
import { SortService } from 'charactersheet/services/common';
import { Treasure } from 'charactersheet/models/dm';
import ko from 'knockout';
import { get } from 'lodash';
import template from './index.html';
import './form';
import './view';
import './components';


class TreasureSectionViewModel extends AbstractEncounterTabularViewModel {

    constructor(params) {
        super(params);
        autoBind(this);

        this.column = params.column;

        this.addFormId = '#add-treasure';
        this.collapseAllId = '#treasure-pane';
    }

    fullScreen = ko.observable(false);

    modelClass() {
        return Treasure;
    }

    // UI

    name = ko.pureComputed(() => {
        const index = Fixtures.encounter.sections.treasure.index;
        return this.encounter().sections()[index].name();
    });

    tagline = ko.pureComputed(() => {
        const index = Fixtures.encounter.sections.treasure.index;
        return this.encounter().sections()[index].tagline();
    });

    sorts() {
        return {
            ...super.sorts(),
            'name asc': { field: 'name', direction: 'asc'},
            'name desc': { field: 'name', direction: 'desc'},
            'shortDescription asc': { field: 'shortDescription', direction: 'asc'},
            'shortDescription desc': { field: 'shortDescription', direction: 'desc'},
        };
    }

    filteredAndSortedEntities = ko.pureComputed(() =>  (
        SortService.sortAndFilter(this.entities(), this.sort(), null)
    ), this);
}


ko.components.register('treasure-section', {
    viewModel: TreasureSectionViewModel,
    template: template
});
