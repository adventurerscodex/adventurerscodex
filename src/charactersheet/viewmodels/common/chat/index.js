import autoBind from 'auto-bind';
import {
    CoreManager,
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import { PartyService, SortService } from 'charactersheet/services/common';
import { Party } from 'charactersheet/models/common';
import ko from 'knockout';
import { get } from 'lodash';
import template from './index.html';


class ChatViewModel extends ViewModel {

    constructor(params) {
        super(params);
        autoBind(this);

        this.entities = ko.observableArray([]);
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();
        this.subscriptions.push(Notifications.party.changed.add(this.partyDidChange));
        this.subscriptions.push(Notifications.party.connected.add(this.partyDidConnect));
    }

    // UI Methods

    sendToChat() {
        this.sendGlobal('test')
    }

    // Chat Methods

    sendGlobal(message, options={}) {
        PartyService.pushToChatLog(message, null, options);
    }

    sendWhisper(message, to=[]) {
        PartyService.pushToChatLog(message, to, options);
    }

    // Events

    partyDidChange(party) {
        this.entities(PartyService.getChatLog());
    }

    partyDidConnect(party) {
        PartyService.observeChatLog(this.chatLogDidChange)
    }

    chatLogDidChange = (event) => {
        this.entities(PartyService.getChatLog());
    }
}


ko.components.register('chat', {
    viewModel: ChatViewModel,
    template: template
});
