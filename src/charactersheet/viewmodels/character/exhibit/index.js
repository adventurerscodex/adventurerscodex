import autoBind from 'auto-bind';
import { get } from 'lodash';
import { Notifications } from 'charactersheet/utilities';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import { PartyService } from 'charactersheet/services';
import { observable, components, pureComputed } from 'knockout';
import template from './index.html';


export class ExhibitViewModel extends ViewModel {

    constructor() {
        super();
        autoBind(this);

        this.party = observable(PartyService.party);
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

    description = pureComputed(() => (
        get(this.party(), 'exhibit.description', null)
    ));

    hasNothing = pureComputed(() => (
        !this.description() && !this.imageUrl()
    ));

    // Actions

    toggleFullScreen() {
        this.fullScreen(!this.fullScreen());
    }

    // Events

    partyDidChange(party) {
        this.party(party);
    }
}


components.register('exhibit', {
    viewModel: ExhibitViewModel,
    template: template
});
