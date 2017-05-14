'use strict';

/**
 * The default configuration object for the Chat service.
 */
var ChatServiceConfiguration = {
    defaultChatOptions: {

    }
};

/**
 * The shared instance manager for the Chat Service.
 */
var ChatServiceManager = new SharedServiceManager(_ChatService, ChatServiceConfiguration);

/**
 * An internal service implementation that holds onto data regarding the
 * creation, joining, and leaving chat rooms.
 */
function _ChatService(config) {
    var self = this;

    self.configuration = config;

    // A global roster of the currently connected rooms.
    self.rooms = {};

    self._handlerTokens = [];

    self._connectionIsSetup = false;
    self._xmppIsConnected = ko.observable(false);

    self.currentPartyNode = null;

    self.init = function() {
        self._setupConnection();

        Notifications.party.joined.add(self._setupRooms);
        Notifications.party.left.add(self._teardownRooms);
    };

    self.deinit = function() {
        self._teardownConnection();

        Notifications.party.joined.remove(self._setupRooms);
        Notifications.party.left.remove(self._teardownRooms);
    };

    self.send = function(room, message) {
        var xmpp = XMPPService.sharedService();
        if (room.isGroupChat()) {
            var id = xmpp.connection.getUniqueId();
            xmpp.connection.muc.groupchat(message.to(), null, message.message(), id);
        } else {
            xmpp.connection.send(message.tree());
        }
        // Actually send the messages.
        xmpp.connection.flush();
    };

    self.join = function(jid, nick, isParty) {
        var xmpp = XMPPService.sharedService();
        xmpp.connection.muc.join(
            jid, nick, self._handleNewGroupMessage,
            null, self._handleNewRosterMessage,
            null, null, null
        );
        xmpp.connection.flush();

        if (isParty) {
            var party = self._getOrCreateParty(jid);
            self.currentPartyNode = jid;
            return party;
        } else {
            var room = self._getOrCreateRoom(jid, true);
            return room;
        }
    };

    self.leave = function(jid, nick, callback) {
        var xmpp = XMPPService.sharedService();
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

    self.createRoomAndInvite = function(jid, invitees) {
        var xmpp = XMPPService.sharedService();
        var room = self._getOrCreateRoom(jid, true);

        self.join(room.chatId(), Strophe.getNodeFromJid(xmpp.connection.jid));
        self._inviteAll(jid, invitees);

        return room;
    };

    /* Private Methods */

    // Message Handlers

    self._handleNewGroupMessage = function(msg) {
        /*eslint no-console:0*/
        try {
            // Messages in Group Chats are ID'd by the group JID.
            var from = Strophe.getBareJidFromJid($(msg).attr('from'));

            var room = self._getOrCreateRoom(from, true);
            var chatMessage = self._parseMessage(msg, room);
            chatMessage.save();

            var delay = $(msg).find('delay').length > 0;

            Notifications.chat.message.dispatch(room, chatMessage, delay);
        } catch(err) {
            console.log(err);
        }
        return true;
    };

    self._handleNewOneToOneMessage = function(msg) {
        /*eslint no-console:0*/
        try {
            // Messages in 1-to-1 Chats are ID'd by the from JID.
            var from = $(msg).attr('from');

            var room = self._getRoomOrCreate(Strophe.getNodeFromJid(from), false);
            var chatMessage = self._parseMessage(msg, room);
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
            var isParticipant = $(response).find('item[role="participant"]').length > 0;
            var isModerator = $(response).find('item[role="moderator"]').length > 0;
            var isNone = $(response).find('item[role="none"]').length > 0;
            var from = Strophe.getBareJidFromJid($(response).attr('from'));
            var jid = $(response).find('item').attr('jid');

            // Handle Joining and leaving a room.
            var isCurrentParty = (from === self.currentPartyNode);
            var joinedRoom = (isCurrentParty && (isParticipant || isModerator));
            var leftRoom = (isNone && isCurrentParty);
            var hasError =  $(response).find('error').length > 0;

            if (hasError) {
                Notifications.party.joined.dispatch(from, false);
            } else if (joinedRoom) {
                var nick = Strophe.getResourceFromJid($(response).attr('from'));
                var myNick = Strophe.getNodeFromJid(xmpp.connection.jid);
                if (nick == myNick) {
                    // We've joined.
                    Notifications.party.joined.dispatch(from, true);
                } else {
                    // Someone else has joined.
                    Notifications.chat.member.joined.dispatch(from, nick);
                }
            } else if (leftRoom) {
                var nick = Strophe.getResourceFromJid($(response).attr('from'));
                var myNick = Strophe.getNodeFromJid(xmpp.connection.jid);
                if (nick == myNick) {
                    // We've left.
                    Notifications.party.left.dispatch(from, true);
                } else {
                    // Someone else has left.
                    Notifications.chat.member.left.dispatch(from, nick, jid);
                }
            }
        } catch(err) {
            console.log(err);
        }
        return true;
    };

    self._handleIQ = function(response) {
        /*eslint no-console:0*/
        try {
            console.log(response);
        } catch(err) {
            console.log(err);
        }
        return true;
    };

    self._handleInviteMessages = function(response) {
        /*eslint no-console:0*/
        try {
            var invite = $(response).find('invite')[0];
            if (!invite || !self.currentPartyNode) { return; }

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
        self.rooms[room.name] = room;
    };

    // Connection Handlers

    self._setupConnection = function() {
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
            self._handleIQ,
            null, 'iq', null, null, null,
            {ignoreNamespaceFragment: true}
        );

        var token4 = xmpp.connection.addHandler(
            self._handleInviteMessages, null, 'message',
            'normal', null, null,
            {ignoreNamespaceFragment: true}
        );

        self._handlerTokens.push(token1);
        self._handlerTokens.push(token2);
        self._handlerTokens.push(token3);
        self._handlerTokens.push(token4);
    };

    self._teardownConnection = function() {
        var xmpp = XMPPService.sharedService();
        self._handlerTokens.forEach(function(token, idx, _) {
            xmpp.connection.deleteHandler(token);
        });
    };

    self._setupRooms = function(node) {
        if (self._roomsAreSetup) { return; }

        var xmpp = XMPPService.sharedService();

        // Rejoin all previous chats.
        self._rejoinRoomsForCurrentParty();

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

    self._getOrCreateParty = function(jid) {
        var key = CharacterManager.activeCharacter().key();
        var party = PersistenceService.findByPredicates(ChatRoom, [
            new KeyValuePredicate('isParty', true),
            new KeyValuePredicate('chatId', jid)
        ])[0];

        // Create the room if it doesn't exist...
        if (!party) {
            party = new ChatRoom();
            party.importValues({
                chatId: jid,
                dateCreated: (new Date()).getTime(),
                name: jid, // DEBUG
                isGroupChat: true,
                isParty: true,
                partyId: null,
                characterId: CharacterManager.activeCharacter().key()
            });
            party.save();
        }

        return party;
    };


    // Room Management

    /**
     * Fetch room with ID or create one if not existant.
     * Refuses to create rooms if there's no current party.
     */
    self._getOrCreateRoom = function(jid, isGroupChat) {
        if (!self.currentPartyNode) { return; }
        var key = CharacterManager.activeCharacter().key();
        var room = PersistenceService.findByPredicates(ChatRoom, [
            // Has the current jid.
            new KeyValuePredicate('chatId', jid),
            new OrPredicate([
                // Either is a party or belongs to the party.
                new KeyValuePredicate('partyId', self.currentPartyNode),
                new KeyValuePredicate('isParty', true),
            ])
        ])[0];

        // Create the room if it doesn't exist...
        if (!room) {
            room = new ChatRoom();
            room.importValues({
                chatId: jid,
                dateCreated: (new Date()).getTime(),
                name: jid, // DEBUG
                isGroupChat: isGroupChat,
                isParty: false,
                partyId: self.currentPartyNode,
                characterId: CharacterManager.activeCharacter().key()
            });
            room.save();
        }

        return room;
    };

    self._inviteAll = function(jid, invitees) {
        var xmpp = XMPPService.sharedService();
        invitees.forEach(function(invitee, idx, _) {
            xmpp.connection.muc.invite(jid, invitee.jid, null);
        });
        xmpp.connection.flush();
    };

    self._rejoinRoomsForCurrentParty = function() {
        var xmpp = XMPPService.sharedService();
        var node = self.currentPartyNode;
        var keys = CharacterManager.activeCharacter().key();
        var nick = Strophe.getNodeFromJid(xmpp.connection.jid);
        var rooms = PersistenceService.findByPredicates(ChatRoom, [
            new KeyValuePredicate('partyId', node),
            new KeyValuePredicate('isGroupChat', true),
        ]);

        rooms.forEach(function(room, idx, _) {
            self.join(room.chatId(), nick);
        });
    };

    // Utility Methods

    self._parseMessage = function(msg, room) {
        var xmpp = XMPPService.sharedService();
        var fullJid = $(msg).attr('from');
        var username =  Strophe.getResourceFromJid(fullJid);
        var chat = new ChatMessage();
        chat.importValues({
            characterId: CharacterManager.activeCharacter().key(),
            to: $(msg).attr('to'),
            from: username,
            id: $(msg).attr('id'),
            chatId: room.chatId(),
            message: $(msg).find('html body').text(),
            dateSent: (new Date()).getTime()
        });
        return chat;
    };

    self._jidFromName = function(name) {
        name = Utility.jid.sanitize(name);
        return '{name}.{party}@{muc}'.replace(
            '{name}', name
        ).replace(
            '{party}', self.currentPartyNode
        ).replace(
            '{muc}', Settings.MUC_SERVICE
        );
    };
}
