import 'bin/knockout-custom-loader';
import autoBind from 'auto-bind';
import { observable, components, pureComputed } from 'knockout';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import { CoreManager, Notifications } from 'charactersheet/utilities';
import { PartyService } from 'charactersheet/services';
import { PlayerTypes } from 'charactersheet/models/common';
import template from './index.html';

export class PartyViewModel extends ViewModel {

    constructor() {
        super();
        autoBind(this);
        this.party = observable(PartyService.party);

        const key = CoreManager.activeCore().type.name();
        this.playerType = observable(key);
    }

    setUpSubscriptions() {
        this.subscriptions.push(Notifications.coreManager.changed.add(this.coreDidChange));
        this.subscriptions.push(Notifications.party.changed.add(this.partyDidChange));
    }

    // UI

    isConnectedToParty = pureComputed(() => (!!this.party()));

    players = pureComputed(() => (
        this.isConnectedToParty() ? this.party().members : []
    ));

    isDM = pureComputed(() => (
        PlayerTypes.dm.key === this.playerType()
    ));

    isCharacter = pureComputed(() => (
        PlayerTypes.character.key === this.playerType()
    ));

    // Events

    partyDidChange(party) {
        this.party(party);
    }

    coreDidChange() {
        this.party(null);

        const key = CoreManager.activeCore().type.name();
        this.playerType(PlayerTypes[key]);
    }
}

components.register('party', {
    viewModel: PartyViewModel,
    template: template
});
