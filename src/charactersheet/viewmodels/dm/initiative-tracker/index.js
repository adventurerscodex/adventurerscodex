import autoBind from 'auto-bind';
import {
    observable,
    observableArray,
    components,
    pureComputed,
    mapping,
    unwrap,
} from 'knockout';
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
        this.exclusions = observableArray([]);
        this.includeBonuses = observable(true);
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
    });

    modifierFor(item) {
        const bonus = parseInt(item.dexterityBonus()) || 0;
        const modifier = parseInt(item.initiativeModifier()) || 0;
        return bonus + modifier;
    }

    totalInitiativeFor(item) {
        const roll = parseInt(item.initiative()) || 0;
        if (this.includeBonuses()) {
            return roll + this.modifierFor(item);
        } else {
            return roll;
        }
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
                    return b.name > a.name ? 1 : -1;
                } else {
                    return bDex - aDex;
                }
            }
            return bInitiative - aInitiative;
        });
        this.updateInitiativeIfNeeded();
    }

    startOver() {
        this.order(this.party().members.map(member => this.prepare(member)));
        this.exclusions([]);
        this.updateInitiativeIfNeeded(true);
    }

    include(entry) {
        if (!this.existsInOrder(entry)) {
            this.addToOrderAndSort(entry);
            // Remove from the exclusions if they're there.
            this.exclusions(this.exclusions().filter(
                ({ uuid }) => unwrap(uuid) !== unwrap(entry.uuid)
            ))
        }

        this.updateInitiativeIfNeeded(true);
    }

    exclude(entry) {
        this.order(this.order().filter(item => item.uuid() !== entry.uuid()));
        this.exclusions.push(entry);
        this.updateInitiativeIfNeeded(true);
    }

    toggleIncludeBonuses() {
        this.includeBonuses(!this.includeBonuses());
    }

    // Data Methods

    existsInOrder(entry) {
        return this.order().some(({ uuid }) =>
            unwrap(uuid) === unwrap(entry.uuid)
        );
    }

    existsInExclusions(entry) {
        return this.exclusions().some(({ uuid }) =>
            unwrap(uuid) === unwrap(entry.uuid)
        );
    }

    prepare(entry) {
        return mapping.fromJS(this.withRequiredFields(entry));
    }

    addToOrderAndSort(entryToAdd) {
        const koEntryToAdd = mapping.fromJS(this.withRequiredFields(entryToAdd));
        this.order.push(koEntryToAdd);
        this.resort();
    }

    updateInitiativeIfNeeded(force=false) {
        if (force || this.state() === this.State.started) {
            PartyService.updateInitiative(mapping.toJS({
                order: this.order(),
                exclusions: this.exclusions(),
                rounds: this.rounds(),
                state: this.state(),
                currentTurn: this.currentTurn(),
                nextTurn: this.nextTurn(),
            }));
        }
    }

    withRequiredFields(item) {
        if (item.initiative === undefined) {
            const rng = RandomNumberGeneratorService.sharedService();
            item.initiative = rng.rollDie(20);
        }
        if (item.dexterityBonus === undefined) {
            item.dexterityBonus = 0;
        }
        if (item.initiativeModifier === undefined) {
            item.initiativeModifier = 0;
        }
        return item;
    }

    // Events

    partyDidChange = (party) => {
        this.party(party);

        // Add & Update Party Member Info

        this.party().members.forEach(member => {
            if (this.existsInOrder(member)) {
                this.order().forEach(entry => {
                    if (unwrap(entry.uuid) === member.uuid) {
                        mapping.fromJS(member, {}, entry);
                    }
                });
            } else if (this.existsInExclusions(member)) {
                this.exclusions().forEach(entry => {
                    if (unwrap(entry.uuid) === member.uuid) {
                        mapping.fromJS(member, {}, entry);
                    }
                });
            } else {
                if (this.state() === this.State.called) {
                    this.addToOrderAndSort(this.prepare(member));
                } else {
                    // Add all new players to the exclusions
                    // so as to not mess with combat already in progress.
                    this.exclusions.push(this.prepare(member))
                }
            }
        });

        // Note: Players who leave the party in the middle of initiative
        // cannot be removed as they are effectively 'demoted to a monster'
        // and there is no way to tell them apart from another monster.
        // They will be promoted again if they rejoin, but the DM will need
        // to actually remove them from the order.

        this.updateInitiativeIfNeeded();
    }

    partyDidConnect(_) {
        PartyService.observeInitiative(this.initiativeDidChange)
    }

    initiativeDidChange() {
        const doc = PartyService.getInitiative();
        if (doc) {
            this.rounds(doc.rounds || this.rounds());
            this.state(doc.state || this.state());
            this.exclusions(doc.exclusions || []);

            const order = doc.order || [];
            if (order.length === 0) {
                this.order(this.party().members.map(member => mapping.fromJS(member)));
            } else {
                this.order(order.map(entry => mapping.fromJS(entry)));
            }

            this.currentTurn(
                !!doc.currentTurn
                ? this.prepare(doc.currentTurn)
                : this.currentTurn()
            );
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
