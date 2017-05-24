'use strict';


function PartyViewModel() {
    var self = this;

    self.players = ko.observableArray();

    self.load = function() {
        Notifications.xmpp.routes.pcard.add(self.handlePCard);
        Notifications.chat.member.left.add(self.removePlayer);
        Notifications.party.left.add(self.clearPCards);
    };

    self.unload = function() {
        Notifications.xmpp.routes.pcard.remove(self.handlePCard);
        Notifications.chat.member.left.remove(self.removePlayer);
        Notifications.party.left.remove(self.clearPCards);
    };

    self.handlePCard = function(inputPCard) {
        var chat = ChatServiceManager.sharedService();
        if (chat.currentPartyNode == null) { return; }
        var isNewPlayer = true;
        var newPCard = pCard.fromEntries(inputPCard);
        var publisherJid = newPCard.get('publisherJid')[0];
        var pCardInParty = false;
        var players = chat.getOccupantsInRoom(chat.currentPartyNode);
        players.forEach(function(player, idx, _) {
            if (player === publisherJid) {
                pCardInParty = true;
            }
        });
        if (!pCardInParty) { return; }
        self.players().forEach(function(player, idx, _) {
            if (player.publisherJid() === publisherJid) {
                player.map();
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
    };
}
