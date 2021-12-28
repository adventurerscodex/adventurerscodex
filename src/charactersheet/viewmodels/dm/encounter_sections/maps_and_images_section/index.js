import autoBind from 'auto-bind';
import {
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { AbstractEncounterTabularViewModel } from 'charactersheet/viewmodels/abstract';
import { PartyService, SortService } from 'charactersheet/services/common';
import { EncounterImage } from 'charactersheet/models/common';
import ko from 'knockout';
import { get } from 'lodash';
import template from './index.html';
import './form';
import './view';


class MapsAndImagesSectionViewModel extends AbstractEncounterTabularViewModel {

    constructor(params) {
        super(params);
        autoBind(this);

        this.column = params.column;

        this.addFormId = '#add-moi';
        this.collapseAllId = '#moi-pane';
    }

    fullScreen = ko.observable(false);
    shouldShowExhibitButton = ko.observable(!!PartyService.party);

    modelClass() {
        return EncounterImage;
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();
        this.subscriptions.push(Notifications.party.changed.add(this.partyDidChange));
    }

    // UI

    name = ko.pureComputed(() => {
        const index = Fixtures.encounter.sections.mapsAndImages.index;
        return this.encounter().sections()[index].name();
    });

    tagline = ko.pureComputed(() => {
        const index = Fixtures.encounter.sections.mapsAndImages.index;
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

    async toggleExhibit(moi) {
        moi.isExhibited(!moi.isExhibited());
        try {
            await moi.save();
        } catch(error) {
            const message = !!error ? error.message : '';
            Notifications.userNotification.dangerNotification.dispatch(
                `Unable to update exhibit. ${message}`,
                'Error'
            );
            moi.isExhibited(!moi.isExhibited());
            return;
        }
        this.markAsExhibited(moi.uuid());
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
            this.entities().map(moi => {
                moi.isExhibited(moi.uuid() === exhibitUuid);
                return moi;
            })
        );
    }
}


ko.components.register('maps-and-images-section', {
    viewModel: MapsAndImagesSectionViewModel,
    template: template
});
