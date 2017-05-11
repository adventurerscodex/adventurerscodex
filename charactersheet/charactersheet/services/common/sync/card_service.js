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
    fields: []
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
        var key = CharacterManager.activeCharacter().key();
        Notifications.xmpp.routes.pcard.add(self.handlePCard);
        var player = PersistenceService.findFirstBy(Character, 'key', key);
        if (player.playerType().key === PlayerTypes.characterPlayerType.key) {
            self._setupNotifications();
        }
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
            publisher: xmpp.connection.jid
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
            nodeService.publishItem(content, attrs, 'pcard', null, null);
        }
    };

    /* Private Methods */

    self._setupNotifications = function() {
        Notifications.xmpp.pubsub.subscribed.add(self._updateCurrentNode);
        Notifications.xmpp.pubsub.unsubscribed.add(self._removeCurrentNode);

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

    self._handleResponse = function(response) {
    };

    self._updateCurrentNode = function(node) {
        self.currentPartyNode = node;
        self.dataHasChanged();
    };

    self._removeCurrentNode = function(node) {
        self.currentPartyNode = null;
    };

    self.handlePCard = function(inputPCard) {
        var newPCard = pCard.fromEntries(inputPCard);

        self.pCards[newPCard.get('publisherJid')] = newPCard;
    };
}
