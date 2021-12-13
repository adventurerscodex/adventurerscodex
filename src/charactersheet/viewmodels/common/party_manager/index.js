import autoBind from 'auto-bind';
import { observable, components, pureComputed } from 'knockout';
import { CoreManager, Notifications } from 'charactersheet/utilities';
import { PartyService } from 'charactersheet/services';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import template from './index.html';


export class PartyManagerViewModel extends ViewModel {

    constructor() {
        super();
        autoBind(this);
        this.party = observable(PartyService.party);
        this.shortCode = observable();
        this.createOrJoin = observable('create');

        this.createFormErrorMessage = observable();
        this.joinFormErrorMessage = observable();
        this.deleteFormErrorMessage = observable();
        this.leaveFormErrorMessage = observable();
    }

    setUpSubscriptions() {
        this.subscriptions.push(Notifications.party.changed.add(this.partyDidChange));
    }

    // Events

    partyDidChange(party) {
        this.party(party);
        this.shortCode(null);
    }

    // UI

    inAParty = pureComputed(() => (!!this.party()));

    clearErrors() {
        this.setError({});
    }

    setError({ create='', join='', del='', leave='' }) {
        this.createFormErrorMessage(create);
        this.joinFormErrorMessage(join);
        this.deleteFormErrorMessage(del);
        this.leaveFormErrorMessage(leave);
    }

    // Actions

    async createParty() {
        const uuid = CoreManager.activeCore().uuid();
        try {
            const party = await PartyService.create(uuid);
            this.party(party);
            this.clearErrors();
        } catch(error) {
            this.setError({ create: 'Error while creating party. Try again.' });
            console.error({error})
        }
    };

    async deleteParty() {
        const uuid = CoreManager.activeCore().uuid();
        try {
            const party = await PartyService.delete(uuid);
            this.party(null);
            this.clearErrors();
        } catch(error) {
            this.setError({ del: 'Error while deleting party. Try again.' });
            console.error({error})
        }
    };

    async joinParty() {
        const uuid = CoreManager.activeCore().uuid();
        try {
            const party = await PartyService.join(uuid, this.shortCode());
            this.party(party);
            this.clearErrors();
        } catch(error) {
            this.setError({ join: 'Error while joining party. Try again.' });
            console.error({error})
        }
    };

    async leaveParty() {
        const uuid = CoreManager.activeCore().uuid();
        try {
            await PartyService.leave(uuid);
            this.party(null);
            this.clearErrors();
        } catch(error) {
            this.setError({ create: 'Error while leaving party. Try again.' });
            console.error({error})
        }
    };
}

components.register('party-manager', {
    viewModel: PartyManagerViewModel,
    template: template
});
