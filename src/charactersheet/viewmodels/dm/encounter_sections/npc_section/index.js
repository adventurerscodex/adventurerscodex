import autoBind from 'auto-bind';
import {
    CoreManager,
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { AbstractEncounterTabularViewModel } from 'charactersheet/viewmodels/abstract';
import { PartyService, SortService } from 'charactersheet/services/common';
import { NPC } from 'charactersheet/models/dm';
import ko from 'knockout';
import { get } from 'lodash';
import template from './index.html';
import './form';
import './view';


class NPCSectionViewModel extends AbstractEncounterTabularViewModel {

    constructor(params) {
        super(params);
        autoBind(this);

        this.column = params.column;

        this.addFormId = '#add-npc';
        this.collapseAllId = '#npc-pane';
    }

    fullScreen = ko.observable(false);
    shouldShowExhibitButton = ko.observable(!!PartyService.party);

    modelClass() {
        return NPC;
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();
        this.subscriptions.push(Notifications.party.changed.add(this.partyDidChange));
    }

    // UI

    name = ko.pureComputed(() => {
        const index = Fixtures.encounter.sections.npcs.index;
        return this.encounter().sections()[index].name();
    });

    tagline = ko.pureComputed(() => {
        const index = Fixtures.encounter.sections.npcs.index;
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

    async toggleExhibit(npc) {
        npc.isExhibited(!npc.isExhibited());
        try {
            await npc.save();
        } catch(error) {
            const message = !!error ? error.message : '';
            Notifications.userNotification.dangerNotification.dispatch(
                `Unable to update exhibit. ${message}`,
                'Error'
            );
            npc.isExhibited(!npc.isExhibited());
            return;
        }
        this.markAsExhibited(npc.uuid());
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
            this.entities().map(npc => {
                npc.isExhibited(npc.uuid() === exhibitUuid);
                return npc;
            })
        );
    }
}


ko.components.register('npc-section', {
    viewModel: NPCSectionViewModel,
    template: template
});
