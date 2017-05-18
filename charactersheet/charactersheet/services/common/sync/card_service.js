'use strict';

var CharacterCardPublishingServiceConfiguration = {
    enableCompression: true,
    compression: {
        name: 'lz-string',
        method: LZString.compressToUTF16
    },
    fields: CharacterCardFields
};


var DMCardPublishingServiceConfiguration = {
    enableCompression: true,
    compression: {
        name: 'lz-string',
        method: LZString.compressToUTF16
    },
    fields: DMCardFields
};


var CharacterCardPublishingService = new SharedServiceManager(_pCardService, CharacterCardPublishingServiceConfiguration);
var DMCardPublishingService = new SharedServiceManager(_pCardService, DMCardPublishingServiceConfiguration);

/**
 * A service responsible for publishing the current pCard.
 */
function _pCardService(configuration) {
    var self = this;

    self.configuration = configuration;
    self.currentPartyNode = null;
    self.pCards = {};

    self.init = function() {
        Notifications.xmpp.routes.pcard.add(self.handlePCard);
        Notifications.chat.member.left.add(self.removePlayer);
        Notifications.party.left.add(self.clearPCards);

        self._setupNotifications();
    };

    self.dataHasChanged = function() {
        var card = self._buildCard();
        self.publishCard(card);
    };

    self.publishCard = function(card) {
        var xmpp = XMPPService.sharedService();
        var nodeService = NodeServiceManager.sharedService();

        // Serialize the card to XML.
        var compressed = self.configuration.enableCompression;
        var attrs = {
            id: xmpp.connection.getUniqueId(),
            publisher: xmpp.connection.jid,
            node: Strophe.NS.JSON + '#' + 'pcard'
        };
        var content = '';

        if (compressed) {
            attrs.compressed = true;
            attrs.compression = self.configuration.compression.name;
            content = self.configuration.compression.method(card.toJSON());
        } else {
            attrs.compressed = false;
            content = card.toJSON();
        }

        var cardTree = $build('json', attrs).t(content).tree();

        // Publish the card to the current node.
        if (self.currentPartyNode) {
            nodeService.publishItem(content, attrs, 'pcard', console.log, console.log);
        }
    };

    self.getPCardsExceptMine = function() {
        return Object.keys(self.pCards).filter(function(jid, idx, _) {
            var xmpp = XMPPService.sharedService();
            return jid !== xmpp.connection.jid;
        }).map(function(jid, idx, _) {
            return self.pCards[jid];
        });
    };

    /* Private Methods */

    self._setupNotifications = function() {
        Notifications.party.joined.add(self._updateCurrentNode);

        self.configuration.fields.forEach(function(field, idx, _) {
            field.refreshOn.add(self.dataHasChanged);
        });
    };

    self._buildCard = function() {
        var card = new pCard();

        self.configuration.fields.forEach(function(field, idx, _) {
            card.set(uuid.v4(), field.name, null, field.valueAccessor());
        });

        return card;
    };

    /* Event Handlers */

    self._updateCurrentNode = function(roomName, success) {
        if (success) {
            self.currentPartyNode = roomName;
            self.dataHasChanged();
        }
    };

    self.handlePCard = function(inputPCard) {
        var chat = ChatServiceManager.sharedService();
        if (chat.currentPartyNode == null) {
            return;
        }
        var pCardInParty = false;
        var newPCard = pCard.fromEntries(inputPCard);
        var publisherJid = newPCard.get('publisherJid')[0].split('@')[0];
        var players = Object.keys(chat.rooms[chat.currentPartyNode].roster);
        if (players.length > 0) {
            players.forEach(function(player, idx, _) {
                if (player === publisherJid) {
                    pCardInParty = true;
                }
            });
        }

        if (pCardInParty) {
            self.pCards[newPCard.get('publisherJid')] = newPCard;
        }

        self._dispatchPlayerChangedNotification();
    };

    self.removePlayer = function(room, nick, jid) {
        var doesUserExist = self.pCards[jid];
        if (doesUserExist) {
            delete self.pCards[jid];
        }

        self._dispatchPlayerChangedNotification();
    };

    self.clearPCards = function() {
        self.pCards = {};
    }

    /* Private Methods */

    self._dispatchPlayerChangedNotification = function() {
        var players = Object.keys(self.pCards).map(function(jid, idx, _) {
            return self.pCards[jid];
        });
        Notifications.party.players.changed.dispatch(players);
    };
}
