/*eslint no-console:0*/
import {
    AuthenticationToken,
    ChatRoom
} from 'charactersheet/models/common';
import {
    CharacterManager,
    Notifications
} from 'charactersheet/utilities';
import {
    ChatServiceManager,
    KeyValuePredicate,
    PersistenceService,
    XMPPService
} from 'charactersheet/services/common';
import { Settings } from 'charactersheet/settings';
import ko from 'knockout';
import template from './index.html';

export function PartyManagerViewModel() {
    var self = this;

    self.loggedIn = ko.observable(false);
    self.inAParty = ko.observable(false);
    self.parties = ko.observableArray([]);

    self.createOrJoin = ko.observable('create');

    /**
     * The node id of the current party. This should always be a node, not a jid.
     */
    self.roomId = ko.observable('');

    self.roomJid = function() {
        return self.roomId() + '@' + Settings.MUC_SERVICE;
    };

    self.load = function() {
        Notifications.xmpp.connected.add(self.dataHasChanged);
        Notifications.xmpp.reconnected.add(self._handleReconnection);
        Notifications.xmpp.disconnected.add(self._handleDisconnection);
        Notifications.xmpp.error.add(self._handleConnectionError);
        Notifications.xmpp.conflict.add(self._handleConflict);
        self.parties(self._getParties());
        self.checkIfInAParty();

        Notifications.party.joined.add(self._handleSubscription);
        Notifications.party.left.add(self._handleUnsubscription);

        self.dataHasChanged();
    };

    /* UI Methods */

    self.roomLink = ko.pureComputed(function() {
        if (self.roomId()) {
            return encodeURI(Settings.HOST_URL + '?party_node=' + self.roomId());
        }
        return '';
    });

    self.createPartyWasClicked = function() {
        self.createParty();
    };

    self.joinPartyWasClicked = function() {
        if (self.roomId().length > 6) {
            self.joinParty(self.roomId().toLowerCase());
        }
    };

    self.joinPartyWasClickedWithParty = function(party) {
        self.joinParty(Strophe.getNodeFromJid(party.chatId()));
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

    self.checkIfInAParty = function() {
        var chatManager = ChatServiceManager.sharedService();
        var node = chatManager.currentPartyNode;
        if (node) {
            self.roomId(Strophe.getNodeFromJid(node));
            self.inAParty(true);
        }
    };

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
        var xmpp = XMPPService.sharedService();
        var chatManager = ChatServiceManager.sharedService();
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
        var xmpp = XMPPService.sharedService();
        var chatManager = ChatServiceManager.sharedService();
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
        var xmpp = XMPPService.sharedService();
        self.loggedIn(token && token.isValid() && xmpp.connection.authenticated);
    };

    /* Private Methods */

    self._getParties = function() {
        var key = CharacterManager.activeCharacter().key();
        var foundParties = PersistenceService.findByPredicates(ChatRoom, [
            new KeyValuePredicate('characterId', key),
            new KeyValuePredicate('isParty', true)
        ]);
        if (foundParties.length > 0) {
            self.createOrJoin('join');
        } else {
            self.createOrJoin('create');
        }
        return foundParties;
    };

    self._leaveOnSwitch = function() {
        if (self.inAParty()) {
            self._handleUnsubscription('', true);
        }
    };

    self._handleDisconnection = function(shouldNotify) {
        self.dataHasChanged();
        self.loggedIn(false);
        self.roomId(null);
        self.inAParty(false);

        if (shouldNotify) {
            Notifications.userNotification.warningNotification.dispatch(
                'It looks like you\'ve been disconnected. Is your internet ok?',
                '',
                {
                    timeOut: 0,
                    extendedTimeOut: 0
                }
            );
        }
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
            Notifications.userNotification.warningNotification.dispatch(
                'An error has occurred while attempting to leave the party'
            );
        }
    };

    self._handleConnectionError = function(code) {
        self.loggedIn(false);
        Notifications.userNotification.warningNotification.dispatch(
            'You will not be able to access party features until this issue is resolved. ' +
            '<a href="https://adventurerscodex.com/faq.html#connection">Click here for ' +
            'more info.</a>',
            'A connection error has occurred.',
            {
                timeOut: 0,
                extendedTimeOut: 0
            }
        );
    };

    self._handleReconnection = function(code) {
        Notifications.userNotification.successNotification.dispatch(
            'You\'re back online.',
            'Connection reestablished',
            {
                timeOut: 0,
                extendedTimeOut: 0
            }
        );
    };

    self._handleConflict = function() {
        Notifications.userNotification.dangerNotification.dispatch(
            'It looks like you\'re trying to use your account in two places at once.\n\
            To use the party features you\'ll have to log out of the other session \
            and refresh this page.',
            'Conflict',
            {
                timeOut: 0,
                extendedTimeOut: 0
            }
        );
    };
}

ko.components.register('party-manager', {
    viewModel: PartyManagerViewModel,
    template: template
});
