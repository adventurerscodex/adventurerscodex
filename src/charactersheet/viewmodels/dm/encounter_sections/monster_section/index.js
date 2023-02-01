import autoBind from 'auto-bind';
import {
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { AbstractEncounterTabularViewModel } from 'charactersheet/viewmodels/abstract';
import {
    PartyService,
    SortService,
    RandomNumberGeneratorService,
} from 'charactersheet/services/common';
import { Monster } from 'charactersheet/models/dm';
import ko from 'knockout';
import { get } from 'lodash';
import template from './index.html';
import './form';
import './view';


class MonsterSectionViewModel extends AbstractEncounterTabularViewModel {

    constructor(params) {
        super(params);
        autoBind(this);

        this.column = params.column;

        this.addFormId = '#add-monster';
        this.collapseAllId = '#monster-pane';
    }

    fullScreen = ko.observable(false);
    shouldShowExhibitButton = ko.observable(!!PartyService.party);
    initiativeState = ko.observable('called');

    modelClass() {
        return Monster;
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();
        this.subscriptions.push(Notifications.party.changed.add(this.partyDidChange));
    }

    // UI

    name = ko.pureComputed(() => {
        const index = Fixtures.encounter.sections.monsters.index;
        return this.encounter().sections()[index].name();
    });

    tagline = ko.pureComputed(() => {
        const index = Fixtures.encounter.sections.monsters.index;
        return this.encounter().sections()[index].tagline();
    });

    sorts() {
        return {
            ...super.sorts(),
            'name asc': { field: 'name', direction: 'asc'},
            'name desc': { field: 'name', direction: 'desc'},
            'armorClass asc': { field: 'armorClass', direction: 'asc'},
            'armorClass desc': { field: 'armorClass', direction: 'desc'},
            'hitPoints asc': { field: 'hitPoints', direction: 'asc'},
            'hitPoints desc': { field: 'hitPoints', direction: 'desc'},
            'isExhibited asc': { field: 'isExhibited', direction: 'asc'},
            'isExhibited desc': { field: 'isExhibited', direction: 'desc'},
        };
    }

    filteredAndSortedEntities = ko.pureComputed(() =>  (
        SortService.sortAndFilter(this.entities(), this.sort(), null)
    ), this);

    canAddToInitiative = ko.pureComputed(() => (
        this.entities().length > 0
    ));

    // Actions

    async toggleExhibit(monster) {
        monster.isExhibited(!monster.isExhibited());
        try {
            await monster.save();
        } catch(error) {
            const message = !!error ? error.message : '';
            Notifications.userNotification.dangerNotification.dispatch(
                `Unable to update exhibit. ${message}`,
                'Error'
            );
            monster.isExhibited(!monster.isExhibited());
            return;
        }
        if (monster.isExhibited()) {
            this.markAsExhibited(monster.uuid());
            PartyService.updatePresence({ exhibit: monster.uuid() });
        } else {
            this.markAsExhibited(null);
            PartyService.updatePresence({ exhibit: null });
        }
    }

    addToInitiative() {
        // Add the Monsters to the current Initiative Order.
        const initiative = PartyService.getInitiative()
        if (!initiative) {
            return;
        }

        const rng = RandomNumberGeneratorService.sharedService();
        const monsters = this.entities().map(monster => ({
            ...monster.exportValues(),
            initiative: rng.rollDie(20),
            initiativeModifier: 0,
            dexterityBonus: monster.modifier(
                monster.findAbilityScoreByName('Dexterity')
            ),
        }));

        const order = [...initiative.order, ...monsters];
        PartyService.updateInitiative({ order });

        // Let the root know to change tabs.
        Notifications.dm.tabShouldChange.dispatch('initiative');
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
            this.entities().map(monster => {
                monster.isExhibited(monster.uuid() === exhibitUuid);
                return monster;
            })
        );
    }
}


ko.components.register('monster-section', {
    viewModel: MonsterSectionViewModel,
    template: template
});
