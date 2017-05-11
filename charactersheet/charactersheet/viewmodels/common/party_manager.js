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

        var xmpp = XMPPService.sharedService();
        xmpp.connection.addHandler(self._handlePresence, null, 'presence');
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
        self.joinParty(party.chatId());
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
        var chatManager = ChatServiceManager.sharedService();
        var node = chatManager.getUniqueNodeId();

        var party = new ChatRoom();
        party.importValues({
            chatId: node,
            dateCreated: (new Date()).getTime(),
            name: 'Party Chat',
            isGroupChat: true,
            isParty: true,
            characterId: CharacterManager.activeCharacter().key()
        });
        party.save();

        self.joinParty(node);
    };

    /**
     * Join an existing node and fire a notification to let the user know
     * they've successfully joined the party.
     * If successful, the party will be saved for easy access later.
     * If any errors occur, also fire off a notification to let the user know.
     */
    self.joinParty = function(node) {
        var chatManager = ChatServiceManager.sharedService();
        chatManager.join(node+'@'+Settings.MUC_SERVICE, 'test');
    };

    self.joinExistingParty = function(node) {
        var nodeManager = NodeServiceManager.sharedService();
        nodeManager.subscribe(node, self._handleSuccessfulSubscription, self._handleFailedSubscription);
    };

    /**
     * Unsubscrive to an existing node subscription and fire a notification to
     * let the user know they've successfully left the party.
     * If any errors occur, also fire off a notification to let the user know.
     */
    self.leaveParty = function(node, notify) {
        var chatManager = ChatServiceManager.sharedService();
        chatManager.leave(node+'@'+Settings.MUC_SERVICE, 'test', self._handleUnsubscription);
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

        var xmpp = XMPPService.sharedService();
        xmpp.connection.pubsub.getSubscriptions(self._subscribeToExistingParty, 3000);
    };

    /* Private Methods */

    self._getParties = function() {
        var key = CharacterManager.activeCharacter().key();
        return PersistenceService.findByPredicates(ChatRoom, [
            new KeyValuePredicate('characterId', key),
            new KeyValuePredicate('isParty', true)
        ]);
    };

    /**
     * Dispatch all presence messages based on what they are.
     */
    self._handlePresence = function(response) {
        // TODO: Dispatch presence based on value.
        console.log(response);

        var isParticipant = $(response).find('item[role="participant"]').length > 0;
        var isModerator = $(response).find('item[role="moderator"]').length > 0;
        var isNone = $(response).find('item[role="none"]').length > 0;

        if (isParticipant || isModerator) {
            self._handleSuccessfulSubscription(response);
        } else if (isNone) {
            self._handleSuccessfulUnsubscription(response);
        }

        return true;
    };

    self._handleSuccessfulSubscription = function(success) {
        // Ignore if we're already in a party.
        if (self.inAParty()) { return; }

        self.roomId(Strophe.getNodeFromJid($(success).attr('from')));
        self.inAParty(true);

        // Reload parties.
        self.parties(self._getParties());

        Notifications.party.joined.dispatch(self.roomId());
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

    self._handleSuccessfulUnsubscription = function(response) {
        self.roomId(null);
        self.inAParty(false);

        Notifications.party.left.dispatch();
        Notifications.userNotification.successNotification.dispatch(
            'You have successfully left your party.'
        );
    };

    self._handleFailedUnSubscription = function(response) {
        Notifications.userNotification.warningNotification.dispatch(
            'An error has occurred while attempting to leave the party'
        );
    };
}
