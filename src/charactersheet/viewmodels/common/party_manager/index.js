/*eslint no-console:0*/
import {
    AuthenticationToken,
} from 'charactersheet/models/common';
import {
    PersistenceService,
} from 'charactersheet/services/common';
import {
    CoreManager,
    Fixtures,
    Notifications
} from 'charactersheet/utilities';
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
        return self.roomId() + '@' + MUC_SERVICE;
    };

    self.load = async function() {
//         self.parties(await self._getParties());
//         self.checkIfInAParty();

//         self.dataHasChanged();
//         if (self.loggedIn()) {
//             self.rejoinLastParty();
//         }
    };

    /* UI Methods */

    self.roomLink = ko.pureComputed(function() {
        if (self.roomId()) {
            return encodeURI(HOST_URL + '?party_node=' + self.roomId());
        }
        return '';
    });

    self.createPartyWasClicked = async function() {
        await self.createParty();
    };

    self.joinPartyWasClicked = function() {
        if (self.roomId().length > 6) {
            self.joinParty(self.roomId().toLowerCase());
        }
    };

    self.joinPartyWasClickedWithParty = function(party) {
        self.joinParty(Strophe.getNodeFromJid(party.jid()));
    };

    self.leavePartyWasClicked = function() {
        self.leaveParty(self.roomJid(), true);
    };

    self.deletePartyWasClicked = async function(party) {
        await self.deleteParty(party);
    };

    self.dateCreatedLabel = function(party) {
        var date = new Date(party.createdAt());
        return date.toLocaleDateString();
    };

    /* Public Methods */

    self.checkIfInAParty = function() {
        // TODO
    };

    /**
     * Create a new party node with a random id, and once that's
     * complete subscribe to that node.
     */
    self.createParty = async function() {
        // TODO
    };

    /**
     * Join an existing node or create a new node.
     */
    self.joinParty = async function(node) {
        // TODO
    };

    /**
     * Unsubscrive to an existing node subscription.
     */
    self.leaveParty = function(node, notify) {
        // TODO
    };

    /**
     * Deletes a given party from the user's previously joined parties list.
     */
    self.deleteParty = async function(party) {
        // TODO
    };

    /**
     * If the user has only one party, they will be automatically reconnected upon refresh
     * or when the character or campaign is selected.
    */
    self.rejoinLastParty = () => {
        // TODO
    };

    self.dataHasChanged = function() {
        // TODO
    };

    /* Private Methods */

    self._getParties = async function() {
        const coreUuid = CoreManager.activeCore().uuid();
        const { objects: allParties } = await ChatRoom.ps.list({
            type: Fixtures.chatRoom.type.party,
            coreUuid
        });
        if (allParties.length > 0) {
            self.createOrJoin('join');
        } else {
            self.createOrJoin('create');
        }
        return allParties;
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
            // Notifications.userNotification.warningNotification.dispatch(
            //     'It looks like you\'ve been disconnected. Is your internet ok?',
            //     '',
            //     {
            //         timeOut: 0,
            //         extendedTimeOut: 0
            //     }
            // );
        }
    };

    self._handleSubscription = async (node, success) => {
        if (success) {
            // Ignore if we're already in a party.
            if (self.inAParty()) { return; }

            self.roomId(Strophe.getNodeFromJid(node));
            self.inAParty(true);

            // Reload parties.
            self.parties(await self._getParties());

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
        // Notifications.userNotification.warningNotification.dispatch(
        //     'You will not be able to access party features until this issue is resolved. ' +
        //     '<a href="https://adventurerscodex.com/faq.html#connection">Click here for ' +
        //     'more info.</a>',
        //     'A connection error has occurred.',
        //     {
        //         timeOut: 0,
        //         extendedTimeOut: 0
        //     }
        // );
    };

    self._handleReconnection = function(code) {
        self.inAParty(true);
        // Notifications.userNotification.successNotification.dispatch(
        //     'You\'re back online.',
        //     'Connection reestablished',
        //     {
        //         timeOut: 0,
        //         extendedTimeOut: 0
        //     }
        // );
    };

    self._handleConflict = function() {
        // Notifications.userNotification.dangerNotification.dispatch(
        //     'It looks like you\'re trying to use your account in two places at once.\n\
        //     To use the party features you\'ll have to log out of the other session \
        //     and refresh this page.',
        //     'Conflict',
        //     {
        //         timeOut: 0,
        //         extendedTimeOut: 0
        //     }
        // );
    };
}

ko.components.register('party-manager', {
    viewModel: PartyManagerViewModel,
    template: template
});
