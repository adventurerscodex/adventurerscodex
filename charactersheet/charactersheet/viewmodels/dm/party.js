'use strict';


function PartyViewModel() {
    var self = this;

    self.players = ko.observableArray();

    self.load = function() {
        Notifications.xmpp.routes.pcard.add(self.handlePCard);
    };

    self.unload = function() {

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
    };
}