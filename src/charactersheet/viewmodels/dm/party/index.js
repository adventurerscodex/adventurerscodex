import 'bin/knockout-custom-loader';
import autoBind from 'auto-bind';
import { observable, components, pureComputed } from 'knockout';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import { Notifications } from 'charactersheet/utilities';
import { PartyService } from 'charactersheet/services';
import template from './index.html';

export class PartyViewModel extends ViewModel {

    constructor() {
        super();
        autoBind(this);
        this.party = observable(PartyService.party);
        this.filterByOnline = observable(false);
    }

    setUpSubscriptions() {
        this.subscriptions.push(Notifications.coreManager.changed.add(this.coreDidChange));
        this.subscriptions.push(Notifications.party.changed.add(this.partyDidChange));
    }

    // UI

    isConnectedToParty = pureComputed(() => (!!this.party()));

    players = pureComputed(() => (
        this.filterByOnline()
        ? this.party().members.filter(player => (
            PartyService.playerIsOnline(player.uuid)
        ))
        : this.party().members
    ));

    toggleFilterByOnline() {
        this.filterByOnline(!this.filterByOnline());
    }

    // Events

    partyDidChange(party) {
        this.party(party);
    }

    coreDidChange() {
        this.party(null);
    }
}

components.register('party', {
    viewModel: PartyViewModel,
    template: template
});
