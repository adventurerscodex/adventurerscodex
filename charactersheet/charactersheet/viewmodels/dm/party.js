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
        var publisherJid;
        var isNewPlayer = true;
        inputPCard.forEach(function(field, idx, _) {
            if (field.name === 'publisherJid') {
                publisherJid = field.value;
            }
        });
        var pCardInParty = false;
        var players = Object.keys(chat.rooms[chat.currentPartyNode].roster);
        if (players.length > 0) {
            players.forEach(function(player, idx, _) {
                if (player === publisherJid.split('@')[0]) {
                    pCardInParty = true;
                }
            });
        }
        if (!pCardInParty) { return; }
        self.players().forEach(function(player, idx, _) {
            if (player.publisherJid() === publisherJid) {
                player.map(pCard.fromEntries(inputPCard));
                isNewPlayer = false;
            }
        });
        if (isNewPlayer) {
            self.players.push(new PlayerCard(pCard.fromEntries(inputPCard)));
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
    }
}
