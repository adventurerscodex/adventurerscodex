import autoBind from 'auto-bind';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import { CoreManager, Notifications } from 'charactersheet/utilities';
import { PartyService } from 'charactersheet/services';
import { observable, components, pureComputed } from 'knockout';
import template from './index.html';

export class PartyStatusViewModel extends ViewModel {

    constructor() {
        super();
        autoBind(this);
        this.party = observable(PartyService.party);
        this.partyStatus = observable();
        this.showModal = observable(false);
    }

    setUpSubscriptions() {
        this.subscriptions.push(Notifications.coreManager.changed.add(this.coreDidChange));
        this.subscriptions.push(Notifications.party.changed.add(this.partyDidChange));
        this.subscriptions.push(Notifications.party.connected.add(this.partyDidConnect));

        // Just in case it's already connected.
        if (this.isConnectedToParty()) {
            this.partyDidConnect();
        }
    }

    // UI

    isConnectedToParty = pureComputed(() => (!!this.party()));

    isCurrentTurn = observable(false);

    isNextTurn = observable(false);

    // Events

    partyDidChange(party) {
        this.party(party);
    }

    partyDidConnect(party) {
        PartyService.observeInitiative(this.initiativeDidChange)
    }

    coreDidChange() {
        this._clearPartyStatus();
    }

    initiativeDidChange() {
        const { currentTurn, nextTurn } = PartyService.getInitiative();
        const { uuid } = CoreManager.activeCore();
        this.isCurrentTurn(currentTurn && currentTurn.uuid === uuid());
        this.isNextTurn(nextTurn && nextTurn.uuid === uuid());
    }

    onClose() {
        this.showModal(false);
    }

    // Private

    _clearPartyStatus() {
        this.partyStatus('<i>You\'re not connected to a party.</i>');
    }
}

components.register('party-status', {
    viewModel: PartyStatusViewModel,
    template: template
});
