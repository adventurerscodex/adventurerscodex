'use strict';


function PartyViewModel() {
    var self = this;

    self.players = ko.observableArray();

    self.load = function() {
        Notifications.xmpp.routes.pcard.add(self.handlePCard);
    };

    self.unload = function() {

    };

    self.handlePCard = function(pCard) {
        self.players().push(new PlayerCard(pCard));
    };
}