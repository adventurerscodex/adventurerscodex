import autoBind from 'auto-bind';
import { get } from 'lodash';
import { CoreManager, Notifications } from 'charactersheet/utilities';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import { PartyService } from 'charactersheet/services';
import { observable, components, pureComputed } from 'knockout';
import template from './index.html';


export class ExhibitViewModel extends ViewModel {

    constructor() {
        super();
        autoBind(this);

        this.party = observable(PartyService.party);
        this.playerType = observable(CoreManager.activeCore().type.name());
        this.fullScreen = observable(false);
    }

    async setUpSubscriptions() {
        super.setUpSubscriptions();

        this.subscriptions.push(Notifications.party.changed.add(this.partyDidChange));
    }

    // UI

    isConnectedToParty = pureComputed(() => (!!this.party()));

    imageUrl = pureComputed(() => (
        get(this.party(), 'exhibit.imageUrl', null)
    ));

    playerText = pureComputed(() => (
        get(this.party(), 'exhibit.playerText', null)
    ));

    hasNothing = pureComputed(() => (
        !this.playerText() && !this.imageUrl()
    ));

    // Actions

    toggleFullScreen() {
        this.fullScreen(!this.fullScreen());
    }

    // Events

    partyDidChange(party) {
        this.party(party);
        this.playerType(CoreManager.activeCore().type.name());
    }
}


components.register('exhibit', {
    viewModel: ExhibitViewModel,
    template: template
});
