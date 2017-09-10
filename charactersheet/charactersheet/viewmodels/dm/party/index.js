import ko from 'knockout'

import { PlayerCard } from 'charactersheet/models'

import template from './index.html'

export function PartyViewModel() {
    var self = this;

    self.players = ko.observableArray();
    self.isConnectedToParty = ko.observable(false);

    self.load = function() {
        Notifications.xmpp.routes.pcard.add(self.handlePCard);
        Notifications.chat.member.left.add(self.removePlayer);
        Notifications.party.left.add(self.clearPCards);
        Notifications.party.joined.add(self.isConnectedToParty);
        self.checkForParty();
    };

    self.unload = function() {
        Notifications.xmpp.routes.pcard.remove(self.handlePCard);
        Notifications.chat.member.left.remove(self.removePlayer);
        Notifications.party.left.remove(self.clearPCards);
        Notifications.party.joined.remove(self.checkForParty);
    };

    self.checkForParty = function() {
        var chat = ChatServiceManager.sharedService();
        self.isConnectedToParty(chat.currentPartyNode == null ? false : true);
    };

    self.handlePCard = function(inputPCard) {
        var chat = ChatServiceManager.sharedService();
        if (chat.currentPartyNode == null) { return; }
        var isNewPlayer = true;
        var newPCard = pCard.fromEntries(inputPCard);
        var publisherJid = newPCard.get('publisherJid')[0];
        var pCardInParty = chat.isJidInParty(publisherJid);
        if (!pCardInParty) { return; }
        self.players().forEach(function(player, idx, _) {
            if (player.publisherJid() === publisherJid) {
                player.map(newPCard);
                isNewPlayer = false;
            }
        });

        var xmpp = XMPPService.sharedService();
        var isMe = publisherJid == xmpp.connection.jid;

        if (isNewPlayer && !isMe) {
            self.players.push(new PlayerCard(newPCard));
        }
    };

    self.removePlayer = function(room, nick, jid) {
        var remainingPlayers = self.players().filter(function(player) {
            return player.publisherJid() !== jid;
        });
        self.players(remainingPlayers);
    };

    self.clearPCards = function() {
        self.players([]);
        self.checkForParty();
    };
}

ko.components.register('party', {
  viewModel: PartyViewModel,
  template: template
})