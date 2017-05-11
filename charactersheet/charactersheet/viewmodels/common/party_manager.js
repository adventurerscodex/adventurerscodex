'use strict';
/*eslint no-console:0*/

function PartyManagerViewModel() {
    var self = this;

    self.loggedIn = ko.observable(false);
    self.inAParty = ko.observable(false);
    self.parties = ko.observableArray([]);

    self.createOrJoin = ko.observable('create');

    /**
     * The node id of the current party. This should always be a node, not a jid.
     */
    self.roomId = ko.observable();

    self.roomJid = function() {
        return self.roomId()+'@'+Settings.MUC_SERVICE
    };

    self.load = function() {
        Notifications.xmpp.connected.add(self.dataHasChanged);
        self.parties(self._getParties());

        Notifications.party.joined.add(self._handleSubscription);
        Notifications.party.left.add(self._handleUnsubscription);
    };

    self.unload = function() {
        Notifications.xmpp.connected.remove(self.dataHasChanged);
        Notifications.party.joined.remove(self._handleSubscription);
        Notifications.party.left.remove(self._handleUnsubscription);

        if (self.roomId()) {
            self.leaveParty(self.roomJid(), false);
        }
    };

    /* UI Methods */

    self.roomLink = ko.pureComputed(function() {
        if (self.roomId()) {
            return encodeURI(Settings.HOST_URL + '?node_jid=' + self.roomId());
        }
        return '';
    });

    self.createPartyWasClicked = function() {
        self.createParty();
    };

    self.joinPartyWasClicked = function() {
        self.joinParty(self.roomJid());
    };

    self.joinPartyWasClickedWithParty = function(party) {
        self.joinParty(party.chatId());
    };

    self.leavePartyWasClicked = function() {
        self.leaveParty(self.roomJid(), true);
    };

    self.deletePartyWasClicked = function(party) {
        self.deleteParty(party);
    };

    self.dateCreatedLabel = function(party) {
        var date = new Date(party.dateCreated());
        return date.toLocaleDateString();
    };

    /* Public Methods */

    /**
     * Create a new party node with a random id, and once that's
     * complete subscribe to that node.
     */
    self.createParty = function() {
        var chatManager = ChatServiceManager.sharedService();
        var node = chatManager.getUniqueNodeId();
        self.joinParty(node);
    };

    /**
     * Join an existing node or create a new node.
     */
    self.joinParty = function(node) {
        var chatManager = ChatServiceManager.sharedService();
        var xmpp = XMPPService.sharedService();
        chatManager.join(node+'@'+Settings.MUC_SERVICE,
            Strophe.getNodeFromJid(xmpp.connection.jid), true);
    };

    self.joinExistingParty = function(node) {
        var nodeManager = NodeServiceManager.sharedService();
        nodeManager.subscribe(node, self._handleSuccessfulSubscription, self._handleFailedSubscription);
    };

    /**
     * Unsubscrive to an existing node subscription.
     */
    self.leaveParty = function(node, notify) {
        var chatManager = ChatServiceManager.sharedService();
        var xmpp = XMPPService.sharedService();
        chatManager.leave(node, Strophe.getNodeFromJid(xmpp.connection.jid));
    };

    /**
     * Deletes a given party from the user's previously joined parties list.
     */
    self.deleteParty = function(party) {
        party.delete();

        // Reload parties.
        self.parties(self._getParties());
    };

    self.dataHasChanged = function() {
        var token = PersistenceService.findAll(AuthenticationToken)[0];
        self.loggedIn(token && token.isValid());
    };

    /* Private Methods */

    self._getParties = function() {
        var key = CharacterManager.activeCharacter().key();
        return PersistenceService.findByPredicates(ChatRoom, [
            new KeyValuePredicate('characterId', key),
            new KeyValuePredicate('isParty', true)
        ]);
    };

    self._handleSubscription = function(node, success) {
        if (success) {
            // Ignore if we're already in a party.
            if (self.inAParty()) { return; }

            self.roomId(Strophe.getNodeFromJid(node));
            self.inAParty(true);

            // Reload parties.
            self.parties(self._getParties());

            Notifications.userNotification.successNotification.dispatch(
                'You have successfully joined ' + self.roomId()
            );
        } else {
            Notifications.userNotification.warningNotification.dispatch(
                'An error has occurred while attempting to join the party'
            );
            console.log(error);
        }
    };

    self._handleUnsubscription = function(node, success) {
        if (success) {
            self.roomId(null);
            self.inAParty(false);

            Notifications.userNotification.successNotification.dispatch(
                'You have successfully left your party.'
            );
        } else {
            self._handleFailedUnSubscription = function(node) {
                Notifications.userNotification.warningNotification.dispatch(
                    'An error has occurred while attempting to leave the party'
                );
            }
        }
    };
}
