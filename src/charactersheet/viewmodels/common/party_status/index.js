import autoBind from 'auto-bind';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import { Notifications } from 'charactersheet/utilities';
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
    }

    // UI

    isConnectedToParty = pureComputed(() => (!!this.party()));

    // Events

    partyDidChange(party) {
        this.party(party);
    }

    coreDidChange() {
        this._clearPartyStatus();
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
