import {
    CoreManager,
    DataRepository,
    Fixtures,
    Notifications
} from 'charactersheet/utilities';
import { ChatRoom } from 'charactersheet/models/common/chat_room';
import { Message } from 'charactersheet/models/common/message';
import { Presence } from 'charactersheet/models/common/presence';
import { SharedServiceManager } from '../../shared_service_manager';
import { XMPPService } from 'charactersheet/services/common/account/xmpp_connection_service';
import uuid from 'node-uuid';

/**
 * The shared instance manager for the Chat Service.
 */
export var ChatServiceManager = new SharedServiceManager(_ChatService, {});

/**
 * An internal service implementation that holds onto data regarding the
 * creation, joining, and leaving chat rooms.
 */
export function _ChatService(config) {
    var self = this;

    self.configuration = config;

    // A global roster of the currently connected rooms.
    self.rooms = {};

    self._handlerTokens = [];

    self._connectionIsSetup = false;
    self._isListeningForXMPPEvents = false;

    self.currentPartyNode = null;

    self.init = function() {
//         self._setupConnection();
//
//         Notifications.xmpp.initialized.add(self._setupConnection);
//         Notifications.xmpp.connected.add(self._handleConnect);
//         Notifications.xmpp.disconnected.add(self._teardownConnection);
//         Notifications.coreManager.changing.add(self._leaveAll);
//         Notifications.party.joined.add(self._setupRooms);
//         Notifications.party.left.add(self._teardownRooms);
    };

    self.deinit = function() {
        self._teardownConnection();

        Notifications.xmpp.initialized.remove(self._setupConnection);
        Notifications.xmpp.connected.remove(self._handleConnect);
        Notifications.xmpp.disconnected.remove(self._teardownConnection);
        Notifications.coreManager.changing.remove(self._leaveAll);
        Notifications.party.joined.remove(self._setupRooms);
        Notifications.party.left.remove(self._teardownRooms);
    };

    /* Public Methods */

    self.join = async function(jid, nick, isParty) {
        let room;
        if (isParty) {
            room = await self._getOrCreateParty(jid);
            self.currentPartyNode = jid;
        } else {
            room = await self._getOrCreateRoom(jid, true);
        }

        const xmpp = XMPPService.sharedService();
        // TODO: MUC Plugin has issues with connection interuptions....
        // Need to investigate more
        xmpp.connection.muc.join(
            jid, nick, self._handleNewGroupMessage,
            null, self._handleNewRosterMessage,
            null, null, null
        );
        xmpp.connection.flush();

        return room;
    };

    self.leave = function(jid, nick, callback) {
        const xmpp = XMPPService.sharedService();
        xmpp.connection.muc.leave(jid, nick, callback, null);
        delete self.rooms[jid];
    };

    // Room Management

    /**
     * Returns a unique id for a new node.
     * Uses nouns and adjectives array from the `DataRepository`.
     */
    self.getUniqueNodeId = function() {
        var adjective = DataRepository['adjectives'][Math.floor(Math.random() * DataRepository['adjectives'].length)];
        var noun = DataRepository['nouns'][Math.floor(Math.random() * DataRepository['nouns'].length)];
        var code = uuid.v4().substr(0,4);
        return adjective + '-' + noun + '-' + code;
    };

    self.createRoomAndInvite = async function(jid, invitees) {
        const xmpp = XMPPService.sharedService();

        const room = await self.join(jid, Strophe.getNodeFromJid(xmpp.connection.jid));
        self._inviteAll(jid, invitees);

        return room;
    };

    self.getOccupantsInRoom = function(jid) {
        var room = self.rooms[jid] || {};
        var roster = room.roster || {};

        return Object.keys(roster).map(function(occupant, idx, _) {
            return room.roster[occupant].jid;
        });
    };

    self.getNickForBareJidInParty = function(jid) {
        var party = self.rooms[self.currentPartyNode] || {};
        var roster = party.roster || {};

        return Object.keys(roster).filter(function(nick, idx, _) {
            return Strophe.getBareJidFromJid(roster[nick].jid) === jid;
        })[0];
    };

    self.isJidInParty = function(jid) {
        var members = self.getOccupantsInRoom(self.currentPartyNode);
        return members.some(function(member, idx, _) {
            return member === jid;
        });
    };

    self.getAllRooms = function() {
        return Object.keys(self.rooms);
    };

    /* Private Methods */

    // Message Handlers

    self._handleNewGroupMessage = async function(msg) {
        /*eslint no-console:0*/
        try {
            // Messages in Group Chats are ID'd by the group JID.
            var from = Strophe.getBareJidFromJid($(msg).attr('from'));
            var isSubject = $(msg).find('subject').length > 0;

            // We ignore subjects atm.
            if (isSubject) {
                return true;
            }

            let room = null;
            if (from == self.currentPartyNode) {
                room = await self._getOrCreateParty(from);
            } else {
                room = await self._getOrCreateRoom(from, true);
            }

            const chatMessage = Message.fromTree(msg);
            chatMessage.save();

            var delay = $(msg).find('delay').length > 0;
            Notifications.chat.message.dispatch(room, chatMessage, delay);
        } catch(err) {
            console.log(err);
        }
        return true;
    };

    /**
     * Dispatch all presence messages based on what they are.
     */
    self._handlePresence = function(response) {
        /*eslint no-console:0*/
        try {
            var xmpp = XMPPService.sharedService();
            var myNick = Strophe.getNodeFromJid(xmpp.connection.jid);
            var presence = Presence.fromTree(response);
            presence.save();

            // Handle Joining and leaving a room.
            if (presence.hasError()) {
                Notifications.party.joined.dispatch(presence.fromBare(), false);
            } else if (presence.regardsJoiningRoom()) {
                if (presence.fromUsername() == myNick) {
                    // We've joined.
                    Notifications.party.joined.dispatch(presence.fromBare(), true);
                } else {
                    // Someone else has joined.
                    Notifications.chat.member.joined.dispatch(presence);
                }
            } else if (presence.regardsLeavingRoom()) {
                if (presence.fromUsername() == myNick && presence.regardsLeavingParty()) {
                    // We've left.
                    Notifications.party.left.dispatch(presence.fromBare(), true);
                } else {
                    // Someone else has left.
                    Notifications.chat.member.left.dispatch(presence);
                }
            }
        } catch(err) {
            console.log(err);
        }
        return true;
    };

    self._handleInviteMessages = function(response) {
        /*eslint no-console:0*/
        try {
            var invite = $(response).find('invite')[0];
            if (!invite || !self.currentPartyNode) { return true; }

            // Join room if user is in party.
            var xmpp = XMPPService.sharedService();
            var roomJid = $(response).attr('from');
            var nick = Strophe.getNodeFromJid(xmpp.connection.jid);
            self.join(roomJid, nick, false);
        } catch(err) {
            console.log(err);
        }
        return true;

    };

    self._handleNewRosterMessage = function(occupant, room) {
        try {
            self.rooms[room.name] = room;
            Notifications.party.roster.changed.dispatch(room.name, room.nick);
        } catch(err) {
            console.log(err);
        }
        return true;
    };

    // Connection Handlers

    self._handleConnect = function() {};

    self._setupConnection = function() {
        if (self._isListeningForXMPPEvents) {
            return;
        }

        var xmpp = XMPPService.sharedService();

        // One To One Notifications
        var token1 = xmpp.connection.addHandler(
            self._handleNewOneToOneMessage,
            null, null,  'chat', null, null,
            {ignoreNamespaceFragment: true}
        );
        // Presence
        var token2 = xmpp.connection.addHandler(
            self._handlePresence,
            null, 'presence', null, null, null,
            {ignoreNamespaceFragment: true}
        );

        var token3 = xmpp.connection.addHandler(
            self._handleInviteMessages,
            null, 'message', null, null, null,
            {ignoreNamespaceFragment: true}
        );

        self._handlerTokens.push(token1);
        self._handlerTokens.push(token2);
        self._handlerTokens.push(token3);
        self._isListeningForXMPPEvents = true;
    };

    self._teardownConnection = function() {
        var xmpp = XMPPService.sharedService();
        self._handlerTokens.forEach(function(token, idx, _) {
            xmpp.connection.deleteHandler(token);
        });
        self._isListeningForXMPPEvents = false;
    };

    self._setupRooms = async function(node) {
        if (self._roomsAreSetup) { return; }

        var xmpp = XMPPService.sharedService();

        // Rejoin all previous chats.
        await self._rejoinRoomsForCurrentParty();

        // Update the current party node.
        self.currentPartyNode = node;
        self._roomsAreSetup = true;
    };

    self._teardownRooms = function() {
        // Update the current party node.
        self.currentPartyNode = null;
        self._roomsAreSetup = false;
    };

    // Party Management

    self._getOrCreateParty = async function(jid) {
        const coreUuid = CoreManager.activeCore().uuid();
        const partyResponse = await ChatRoom.ps.list({
            type: Fixtures.chatRoom.type.party,
            coreUuid,
            jid
        });
        let party = partyResponse.objects[0];

        // Create the room if it doesn't exist...
        if (!party) {
            const createResponse = await ChatRoom.ps.create({
                jid: jid,
                type: Fixtures.chatRoom.type.party,
                coreUuid: CoreManager.activeCore().uuid()
            });
            party = createResponse.object;
        }

        return party;
    };


    // Room Management

    /**
     * Fetch room with ID or create one if not existant.
     * Refuses to create rooms if there's no current party.
     */
    self._getOrCreateRoom = async function(jid, isGroupChat) {
        if (!self.currentPartyNode) { return; }
        const coreUuid = CoreManager.activeCore().uuid();
        const { objects: rooms } = await ChatRoom.ps.list({
            coreUuid,
            jid,
            partyJid: self.currentPartyNode,
            type: Fixtures.chatRoom.type.chat
        });

        let room = rooms[0];
        // Create the room if it doesn't exist...
        if (!room) {
            const response = await ChatRoom.ps.create({
                jid,
                coreUuid,
                type: Fixtures.chatRoom.type.chat,
                partyJid: self.currentPartyNode

            });
            room = response.object;
        }

        return room;
    };

    self._inviteAll = function(jid, invitees) {
        const xmpp = XMPPService.sharedService();
        for (const invitee of invitees) {
            xmpp.connection.muc.invite(jid, invitee.jid, null);
        }
        xmpp.connection.flush();
    };

    self._rejoinRoomsForCurrentParty = async function() {
        const xmpp = XMPPService.sharedService();
        const { objects: rooms } = await ChatRoom.ps.list({
            coreUuid: CoreManager.activeCore().uuid(),
            type: Fixtures.chatRoom.type.chat,
            partyJid: self.currentPartyNode
        });

        const nick = Strophe.getNodeFromJid(xmpp.connection.jid);
        for (const room of rooms) {
            self.join(room.jid(), nick);
        }
    };

    self._leaveAll = function() {
        var xmpp = XMPPService.sharedService();
        var rooms = Object.keys(self.rooms);
        rooms.forEach(function(room, idx, _) {
            self.leave(room, Strophe.getNodeFromJid(xmpp.connection.jid));
        });
        self.rooms = {};
    };
}
