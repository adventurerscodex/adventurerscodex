'use strict';


function PartyViewModel() {
    var self = this;

    self.players = ko.observableArray();
    self.partyStatus = ko.observable();

    self.load = function() {
        Notifications.xmpp.routes.pcard.add(self.handlePCard);
        Notifications.chat.member.left.add(self.removePlayer);
    };

    self.unload = function() {
        Notifications.xmpp.routes.pcard.remove(self.handlePCard);
        Notifications.chat.member.left.remove(self.removePlayer);
    };

    self.handlePCard = function(inputPCard) {
        var publisherJid;
        var isNewPlayer = true;
        inputPCard.forEach(function(field, idx, _) {
            if (field.name === 'publisherJid') {
                publisherJid = field.value;
            }
        });
        self.players().forEach(function(player, idx, _) {
            if (player.publisherJid() === publisherJid) {
                player.map(pCard.fromEntries(inputPCard));
                isNewPlayer = false;
            }
        });
        if (isNewPlayer) {
            self.players.push(new PlayerCard(pCard.fromEntries(inputPCard)));
        }

        Notifications.party.players.changed.dispatch(self.players());
    };

    self.removePlayer = function(room, nick, jid) {
        var remainingPlayers = self.players().filter(function(player) {
            return player.publisherJid() !== jid;
        });
        self.players(remainingPlayers);
    };
}