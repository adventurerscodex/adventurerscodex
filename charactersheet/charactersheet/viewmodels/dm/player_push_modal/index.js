import ko from 'knockout'

import {
    ChatServiceManager,
    DMCardPublishingService,
    CharacterCardPublishingService,
    XMPPService
} from 'charactersheet/services/common'
import { CharacterManager, Notifications } from 'charactersheet/utilities'
import { Message } from 'charactersheet/models/common'

import template from './index.html'


export function PlayerPushModalViewModel(params) {
    var self = this;

    self.isOpen = params.isOpen;
    self.payload = params.payload;
    self.type = params.type;
    self.onclose = params.onclose

    self.partyMembers = ko.observableArray();
    self.selectedPartyMembers = ko.observableArray();

    self.load = function() {
        Notifications.party.joined.add(self.dataHasChanged);
        Notifications.party.left.add(self.dataHasChanged);

        self.isOpen.subscribe(self.dataHasChanged);
        self.payload.subscribe(self.dataHasChanged);
        self.type.subscribe(self.dataHasChanged);

        self.dataHasChanged();
    };

    /* UI Methods */

    self.doneButtonLabel = ko.pureComputed(function() {
        if (self.selectedPartyMembers().length > 0) {
            return 'Send';
        } else {
            return 'Cancel';
        }
    });

    self.toggleAll = function() {
        if (self.selectedPartyMembers().length > 0) {
            self.selectedPartyMembers([]);
        } else {
            self.selectedPartyMembers(self.partyMembers());
        }
    };

    self.selectAllButtonLabel = ko.pureComputed(function() {
        if (self.selectedPartyMembers().length > 0) {
            return 'Deselect All';
        } else {
            return 'Select All';
        }
    });

    self.doneButtonWasClicked = function() {
        var chat = ChatServiceManager.sharedService();
        var currentParty = chat.currentPartyNode;
        var xmpp = XMPPService.sharedService();

        self.partyMembers().forEach(function(player, idx, _) {
            var bare = Strophe.getBareJidFromJid(player.jid);
            var nick = chat.getNickForBareJidInParty(bare);

            var message = new Message();
            message.importValues({
                to: currentParty + '/' + nick,
                type: 'chat',
                from: xmpp.connection.jid,
                id: xmpp.connection.getUniqueId(),
                html: ko.unwrap(self.payload).toHTML(),
                body: ''
            });

            message.item({
                xmlns: Strophe.NS.JSON + '#' + self.type(),
                json: ko.unwrap(self.payload).toJSON()
            });

            xmpp.connection.send(message.tree());
        });
    };

    /* Private Methods */

    self.dataHasChanged = function() {
        self.partyMembers(self.getAllPartyMembers());
    };

    self.getAllPartyMembers = function() {
        var character = CharacterManager.activeCharacter();
        var chatService = ChatServiceManager.sharedService();

        // Get the current card service.
        var cardService = null;
        if (character.playerType().key == 'character') {
            cardService = CharacterCardPublishingService.sharedService();
        } else {
            cardService = DMCardPublishingService.sharedService();
        }

        return cardService.getPCardsExceptMine().map(function(card, idx, _) {
            return {
                name: card.get('name')[0],
                image: card.get('imageUrl')[0],
                jid: card.get('publisherJid')[0]
            };
        });
    };
}

ko.components.register('player-push-modal', {
    viewModel: PlayerPushModalViewModel,
    template: template
  })
