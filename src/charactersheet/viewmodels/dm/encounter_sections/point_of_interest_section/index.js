import autoBind from 'auto-bind';
import {
    Fixtures,
    Notifications,
} from 'charactersheet/utilities';
import { AbstractEncounterTabularViewModel } from 'charactersheet/viewmodels/abstract';
import { PartyService, SortService } from 'charactersheet/services/common';
import { PointOfInterest } from 'charactersheet/models/dm';
import ko from 'knockout';
import { get } from 'lodash';
import template from './index.html';
import './form';
import './view';


class PointOfInterestSectionViewModel extends AbstractEncounterTabularViewModel {

    constructor(params) {
        super(params);
        autoBind(this);

        this.column = params.column;

        this.addFormId = '#add-poi';
        this.collapseAllId = '#poi-pane';
    }

    fullScreen = ko.observable(false);
    viewMode = ko.observable('all');
    shouldShowExhibitButton = ko.observable(!!PartyService.party);

    modelClass() {
        return PointOfInterest;
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();
        this.subscriptions.push(Notifications.party.changed.add(this.partyDidChange));
    }

    // UI

    name = ko.pureComputed(() => {
        const index = Fixtures.encounter.sections.pointsOfInterest.index;
        return this.encounter().sections()[index].name();
    });

    tagline = ko.pureComputed(() => {
        const index = Fixtures.encounter.sections.pointsOfInterest.index;
        return this.encounter().sections()[index].tagline();
    });

    sorts() {
        return {
            ...super.sorts(),
            'name asc': { field: 'name', direction: 'asc'},
            'name desc': { field: 'name', direction: 'desc'},
            'description asc': { field: 'description', direction: 'asc'},
            'description desc': { field: 'description', direction: 'desc'},
            'isExhibited asc': { field: 'isExhibited', direction: 'asc'},
            'isExhibited desc': { field: 'isExhibited', direction: 'desc'},
        };
    }

    filteredAndSortedEntities = ko.pureComputed(() =>  (
        SortService.sortAndFilter(this.entities(), this.sort(), null)
    ), this);

    // Actions

    async toggleExhibit(poi) {
        poi.isExhibited(!poi.isExhibited());
        try {
            await poi.save();
        } catch(error) {
            const message = !!error ? error.message : '';
            Notifications.userNotification.dangerNotification.dispatch(
                `Unable to update exhibit. ${message}`,
                'Error'
            );
            poi.isExhibited(!poi.isExhibited());
            return;
        }

        if (poi.isExhibited()) {
            this.markAsExhibited(poi.uuid());
            PartyService.updatePresence({ exhibit: poi.uuid() });
        } else {
            this.markAsExhibited(null);
            PartyService.updatePresence({ exhibit: null });
        }
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
            this.entities().map(poi => {
                poi.isExhibited(poi.uuid() === exhibitUuid);
                return poi;
            })
        );
    }
}


ko.components.register('point-of-interest-section', {
    viewModel: PointOfInterestSectionViewModel,
    template: template
});
