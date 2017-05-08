'use strict';
/*eslint no-console:0*/

function PartyManagerViewModel() {
    var self = this;

    self.loggedIn = ko.observable(false);
    self.inAParty = ko.observable(false);
    self.parties = ko.observableArray([]);

    self.createOrJoin = ko.observable('create');

    self.roomId = ko.observable();

    self.load = function() {
        Notifications.xmpp.connected.add(self.dataHasChanged);
        self.parties(self._getParties());
    };

    self.unload = function() {
        Notifications.authentication.loggedIn.remove(self.dataHasChanged);

        if (self.roomId()) {
            self.leaveParty(self.roomId(), false);
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
        self.joinParty(self.roomId());
    };

    self.joinPartyWasClickedWithParty = function(party) {
        self.joinParty(party.partyId());
    };

    self.leavePartyWasClicked = function() {
        self.leaveParty(self.roomId(), true);
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
     * If any errors occur in this process an alert is fired to the user.
     */
    self.createParty = function() {
        var nodeManager = NodeServiceManager.sharedService();
        var node = nodeManager.getUniqueNodeId();
        nodeManager.create(node, function() {
            // Save the party now that it's officially created.
            var party = new Party();
            party.importValues({
                partyId: node,
                characterId: CharacterManager.activeCharacter().key()
            });
            party.save();

           // Once a node has been created, subscribe to it.
            nodeManager.subscribe(node,
                self._handleSuccessfulSubscription,
                self._handleFailedSubscription
            );
        });
    };

    /**
     * Join an existing node and fire a notification to let the user know
     * they've successfully joined the party.
     * If any errors occur, also fire off a notification to let the user know.
     */
    self.joinParty = function(node) {
        var nodeManager = NodeServiceManager.sharedService();
        nodeManager.subscribe(node,
            self._handleSuccessfulSubscription,
            self._handleFailedSubscription
        );
    };

    /**
     * Unsubscrive to an existing node subscription and fire a notification to
     * let the user know they've successfully left the party.
     * If any errors occur, also fire off a notification to let the user know.
     */
    self.leaveParty = function(node, notify) {
        var nodeManager = NodeServiceManager.sharedService();
        if (notify) {
            nodeManager.unsubscribe(node,
                self._handleSuccessfulUnsubscription,
                self._handleFailedUnsubscription
            );
        } else {
            nodeManager.unsubscribe(node,
                self._handleSuccessfulUnsubscription,
                self._doNothing
            );
        }
    };

    /**
     * Deletes a given party from the user's previously joined parties list.
     */
    self.deleteParty = function(node) {
        var party = PersistenceService.findFirstBy(Party, 'partyId', node);
        if (party) {
            party.delete();
        }

        // Reload parties.
        self.parties(self._getParties());
    };

    self.dataHasChanged = function() {
        var token = PersistenceService.findAll(AuthenticationToken)[0];
        self.loggedIn(token && token.isValid());

        var xmpp = XMPPService.sharedService();
        xmpp.connection.pubsub.getSubscriptions(self._subscribeToExistingParty, 3000);
    };

    /* Private Methods */

    self._subscribeToExistingParty = function(response) {
        var fullJid = XMPPService.sharedService().connection.jid;
        var subscriptions = $(response).find('subscriptions').children().toArray();
        subscriptions.forEach(function(subscriptionNode, idx, _) {
            if ($(subscriptionNode).attr('subscription') === 'subscribed' &&
            $(subscriptionNode).attr('jid') === fullJid) {
                self.roomId($(subscriptionNode).attr('node'));
                self.inAParty(true);
                Notifications.userNotification.successNotification.dispatch(
                    'You have re-joined ' + self.roomId()
                );
            }
        });
    };

    self._getParties = function() {
        var key = CharacterManager.activeCharacter().key();
        return PersistenceService.findBy(Party, 'characterId', key);
    };

    self._handleSuccessfulSubscription = function(success) {
        self.roomId($(success).find('subscription').attr('node'));
        self.inAParty(true);

        // Reload parties.
        self.parties(self._getParties());

        Notifications.userNotification.successNotification.dispatch(
            'You have successfully joined ' + self.roomId()
        );
    };

    self._handleFailedSubscription = function(error) {
        Notifications.userNotification.warningNotification.dispatch(
            'An error has occurred while attempting to join the party'
        );
        console.log(error);
    };

    self._handleSuccessfulUnsubscription = function(success) {
        self.roomId(null);
        self.inAParty(false);

        Notifications.userNotification.successNotification.dispatch(
            'You have successfully left your party.'
        );
    };

    self._handleFailedUnsubscription = function(error) {
        Notifications.userNotification.warningNotification.dispatch(
            'An error has occurred while attempting to leave the party'
        );
        console.log(error);
    };

    self._doNothing = function() {};
}
