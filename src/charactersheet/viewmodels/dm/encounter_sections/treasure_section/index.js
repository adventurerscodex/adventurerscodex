import autoBind from 'auto-bind';
import {
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { AbstractEncounterTabularViewModel } from 'charactersheet/viewmodels/abstract';
import { PartyService, SortService } from 'charactersheet/services/common';
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
    shouldShowExhibitButton = ko.observable(!!PartyService.party);

    modelClass() {
        return Treasure;
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();
        this.subscriptions.push(Notifications.party.changed.add(this.partyDidChange));
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

    getDefaultSort() {
        return this.sorts()['uuid asc'];
    }

    sorts() {
        return {
            ...super.sorts(),
            'uuid asc': { field: 'uuid', direction: 'asc'},
            'uuid desc': { field: 'uuid', direction: 'desc'},
        };
    }

    filteredAndSortedEntities = ko.pureComputed(() =>  (
        SortService.sortAndFilter(this.entities(), this.sort(), null)
    ), this);

    // Actions

    async toggleExhibit(treasure) {
        treasure.isExhibited(!treasure.isExhibited());
        await treasure.save();
        this.markAsExhibited(treasure.uuid());
    }

    // Events

    partyDidChange(party) {
        this.shouldShowExhibitButton(!!party);

        // Update everything that isn't on exhibit. This event can
        // be fired from multiple places.
        const exhibitUuid = get(party, 'exhibit.uuid', null);
        this.markAsExhibited(exhibitUuid);
    };

    markAsExhibited(exhibitUuid) {
        this.entities(
            this.entities().map(treasure => {
                treasure.isExhibited(treasure.uuid() === exhibitUuid);
                return treasure;
            })
        );
    }
}


ko.components.register('treasure-section', {
    viewModel: TreasureSectionViewModel,
    template: template
});
