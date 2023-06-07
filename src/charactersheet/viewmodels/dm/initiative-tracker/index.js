import autoBind from 'auto-bind';
import { observable, observableArray, components, pureComputed, mapping } from 'knockout';
import { AbstractTabularViewModel } from 'charactersheet/viewmodels/abstract';
import { CoreManager, Notifications } from 'charactersheet/utilities';
import {
    PartyService,
    HotkeysService,
    RandomNumberGeneratorService,
} from 'charactersheet/services';
import { PlayerTypes } from 'charactersheet/models/common';
import template from './index.html';
import './form';

export class InitiativeTrackerViewModel extends AbstractTabularViewModel {

    State = {
        called: 'called',
        started: 'started',
    }

    constructor(params) {
        super(params);
        autoBind(this);
        this.addFormId = '#add-initiative';
        this.collapseAllId = '#initiative-pane';

        this.party = observable(PartyService.party);
        this.filterByOnline = observable(false);

        const key = CoreManager.activeCore().type.name();
        this.playerType = observable(key);

        this.defaultImageUrl = 'https://www.gravatar.com/avatar/x?d=mm'

        // Sharable State

        this.state = observable(this.State.called);
        this.order = observableArray([]);
        this.currentTurn = observable(null);
        this.rounds = observable(1);
    }

    refresh() {
        // Override this to prevent model-backed behavior from triggering.
        // Party data is loaded asynchronously.
    }

    setUpSubscriptions() {
        this.subscriptions.push(Notifications.coreManager.changed.add(this.coreDidChange));
        this.subscriptions.push(Notifications.party.changed.add(this.partyDidChange));
        this.subscriptions.push(Notifications.party.connected.add(this.partyDidConnect));

        HotkeysService.registerHotkey('j', this.goBackward);
        HotkeysService.registerHotkey('k', this.goForward);

        // Trigger the signal if we're already too late.
        if (this.isConnectedToParty()) {
            partyDidConnect();
        }
    }

    // UI

    isConnectedToParty = pureComputed(() => (!!this.party()));

    canReRoll = pureComputed(() => (this.state() === this.State.called));

    /**
     * By default return all players & additional participants, but if the
     * filterByOnline is set, then filter the former to only show online players.
     * all additions will still be shown.
     */
    participants = pureComputed(() => (
        this.filterByOnline()
        ? this.order().filter(participant => (
            !this.isPlayer(participant)
            || PartyService.playerIsOnline(participant.uuid())
        ))
        : this.order()
    ));

    remainingPlayers = pureComputed(() => (
        this.party().members.filter(member => (
            !this.order().some(participant => participant.uuid() === member.uuid)
        ))
    ));

    toggleFilterByOnline() {
        this.filterByOnline(!this.filterByOnline());
    }

    isDM = pureComputed(() => (
        PlayerTypes.dm.key === this.playerType()
    ));

    isCharacter = pureComputed(() => (
        PlayerTypes.character.key === this.playerType()
    ));

    currentIndex = pureComputed(() => {
        const current = this.currentTurn();
        if (!current) {
            return null;
        }
        return this.order().map(i => i.uuid()).indexOf(current.uuid());
    });

    nextIndex = pureComputed(() => {
        if (this.currentIndex() + 1 >= this.order().length) {
            return 0
        };
        return this.currentIndex() + 1;
    });

    nextTurn = pureComputed(() => this.order()[this.nextIndex()]);

    previousIndex = pureComputed(() => {
        if (this.currentIndex() - 1 < 0) {
            return this.order().length - 1;
        };
        return this.currentIndex() - 1;
    });

    previousTurn = pureComputed(() => this.order()[this.previousIndex()]);

    totalTime = pureComputed(() => {
        const time = this.rounds() * 6;
        const minutes = time / 60 | 0;
        const seconds = time - (minutes * 60);
        const formattedSeconds = ('0000'+seconds).slice(-2)
        return `${minutes}:${formattedSeconds}`

        if (seconds < 60) {}
    });

    modifierFor(item) {
        const bonus = parseInt(item.dexterityBonus()) || 0;
        const modifier = parseInt(item.initiativeModifier()) || 0;
        return bonus + modifier;
    }

    totalInitiativeFor(item) {
        const roll = parseInt(item.initiative()) || 0;
        return roll + this.modifierFor(item);
    }

    isPlayer(participant) {
        return this.party().members.some(p => participant.uuid() === p.uuid);
    }

    playerIsOnline = player => PartyService.playerIsOnline(player.uuid());

    // UI Methods

    rollForInitiative() {
        const rng = RandomNumberGeneratorService.sharedService();
        this.order().forEach(row => (
            row.initiative(rng.rollDie(20))
        ));
        this.resort();
    }

    canGoForward = pureComputed(() => {
        if (this.state() !== this.State.started) {
            return false;
        }
        return true;
    });

    goForward() {
        if (!this.canGoForward()) {
            return;
        }

        this.currentTurn(this.nextTurn());
        if (this.currentIndex() === 0) {
            this.rounds(this.rounds() + 1);
        }
        this.updateInitiativeIfNeeded();
    }

    canGoBackward = pureComputed(() => {
        if (this.state() !== this.State.started) {
            return false;
        }
        if (this.rounds() > 1) {
            return true;
        }
        return this.currentIndex() > 0;
    });

    goBackward() {
        if (!this.canGoBackward()) {
            return;
        }

        this.currentTurn(this.previousTurn());
        if (this.nextIndex() === 0 && this.rounds() > 1) {
            this.rounds(this.rounds() - 1);
        }
        this.updateInitiativeIfNeeded();
    }

    start() {
        this.state(this.State.started)
        this.resort();
        if (this.currentTurn() === null) {
            this.currentTurn(this.order()[0]);
        }
        this.updateInitiativeIfNeeded();
    }

    reset() {
        this.state(this.State.called)
        this.currentTurn(null);
        this.rounds(1);
        this.updateInitiativeIfNeeded(true);
        this.startOver();
    }

    resort() {
        this.order.sort((a, b) => {
            const aInitiative = this.totalInitiativeFor(a),
                bInitiative = this.totalInitiativeFor(b);

            if (aInitiative === bInitiative) {
                const aDex = a.dexterityBonus() || 0,
                    bDex = b.dexterityBonus() || 0;

                if (aDex === bDex) {
                    return a.name > b.name;
                } else {
                    return aDex < bDex;
                }
            }
            return aInitiative < bInitiative;
        });
        this.updateInitiativeIfNeeded();
    }

    startOver() {
        this.order([]);
        this.addPartyToOrderIfNeeded();
        this.updateInitiativeIfNeeded(true);
    }

    addPartyToOrderIfNeeded() {
        this.party().members.forEach(player =>
            this.addToOrderIfNeededAndSort(player)
        );
    }

    // Data Methods

    addToOrderIfNeededAndSort(entryToAdd) {
        const existingEntry = this.order().filter(({ uuid }) => uuid() === entryToAdd.uuid)[0];
        if (!existingEntry) {
            const koEntryToAdd = mapping.fromJS(this.withRequiredFields(entryToAdd));
            this.order.push(koEntryToAdd);
        } else {
            const index = this.order.indexOf(existingEntry);
            const koEntryToAdd = mapping.fromJS(this.withRequiredFields(entryToAdd));
            this.order()[index] = { ...existingEntry, ...koEntryToAdd };
        }
        this.resort();
    }

    updateInitiativeIfNeeded(force=false) {
        if (force || this.state() === this.State.started) {
            PartyService.updateInitiative(mapping.toJS({
                order: this.order(),
                rounds: this.rounds(),
                state: this.state(),
                currentTurn: this.currentTurn(),
                nextTurn: this.nextTurn(),
            }));
        }
    }

    withRequiredFields(item) {
        const rng = RandomNumberGeneratorService.sharedService();
        return {
            initiative: rng.rollDie(20),
            dexterityBonus: 0,
            initiativeModifier: 0,
            // Overwrite with old values if they already exist.
            ...item,
        };
    }

    // Events

    partyDidChange(party) {
        this.party(party);

        this.initiativeDidChange();

        this.addPartyToOrderIfNeeded();
    }

    partyDidConnect(party) {
        PartyService.observeInitiative(this.initiativeDidChange)
    }

    initiativeDidChange() {
        const doc = PartyService.getInitiative();
        if (doc) {
            const order = doc.order || this.order();
            this.order(order.map(i => mapping.fromJS(this.withRequiredFields(i))));
            this.rounds(doc.rounds || this.rounds());
            this.state(doc.state || this.state());
            const currentTurn = doc.currentTurn || this.currentTurn();
            if (currentTurn) {
                this.currentTurn(mapping.fromJS(this.withRequiredFields(currentTurn)));
            }
        }
    }

    coreDidChange() {
        this.party(null);

        const key = CoreManager.activeCore().type.name();
        this.playerType(PlayerTypes[key]);
    }
}

components.register('initiative-tracker', {
    viewModel: InitiativeTrackerViewModel,
    template: template
});
