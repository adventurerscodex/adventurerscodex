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

        Notifications.xmpp.pubsub.subscribed.add(self._setupRooms);
        Notifications.xmpp.pubsub.unsubscribed.add(self._teardownRooms);

        // TODO Set up initial whole party chat.
    };

    self.deinit = function() {
        self._teardownConnection();

        Notifications.xmpp.pubsub.subscribed.remove(self._setupRooms);
        Notifications.xmpp.pubsub.unsubscribed.remove(self._teardownRooms);
    };

    self.send = function(room, message, onsuccess, onerror) {
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

    self.join = function(jid, nick) {
        var xmpp = XMPPService.sharedService();
        xmpp.connection.muc.join(
            jid, nick, self._handleNewGroupMessage,
            self._handleNewPresenceOrIqMessage,
            self._handleNewRosterMessage,
            null, null, null
        );
        xmpp.connection.flush();
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

    self.createRoomAndInvite = function(name, invitees) {
        var jid = self._jidFromName(name);
        var room = self._getRoomOrCreate(jid, true);

        self.join(jid, 'test');
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

            var room = self._getRoomOrCreate(from, true);
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

            var room = self._getRoomOrCreate(from, false);
            var chatMessage = self._parseMessage(msg, room);
            chatMessage.save();

            var delay = $(msg).find('delay').length > 0;

            Notifications.chat.message.dispatch(room, chatMessage, delay);
        } catch(err) {
            console.log(err);
        }
        return true;
    };

    self._handleNewPresenceOrIqMessage = function(msg) {
        /*eslint no-console:0*/
        //TODO Send IQ or Presence Message Notification.
        console.log(msg);
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
        // Presence and IQ messages
        var token2 = xmpp.connection.addHandler(
            self._handleNewPresenceOrIqMessage,
            null, null,  null, null, null,
            {ignoreNamespaceFragment: true}
        );

        self._handlerTokens.push(token1);
        self._handlerTokens.push(token2);
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

        // MUC Notifications are subscribed to when joining/creating rooms.
        // Rejoin all previous chats.
        if (xmpp.connection.connected) {
            var key = CharacterManager.activeCharacter().key();
            var rooms = PersistenceService.findBy(ChatRoom, 'characterId', key);
            rooms.forEach(function(room, idx, _) {
                if (room.isGroupChat()) {
                    self.join(room.chatId(), 'test');
                }
            });
        }

        // Update the current party node.
        self.currentPartyNode = node;
        self._roomsAreSetup = true;
    };

    self._teardownRooms = function() {
        // Update the current party node.
        self.currentPartyNode = null;

        self._roomsAreSetup = false;
    };

    // Room Management

    /**
     * Fetch room with ID or create one if not existant.
     */
    self._getRoomOrCreate = function(roomId, isGroupChat) {
        var key = CharacterManager.activeCharacter().key();
        var chats = PersistenceService.findBy(ChatRoom, 'characterId', key);
        var chat = chats.filter(function(chats, idx, _) {
            return chats.chatId() === roomId;
        })[0];

        // Found it, just exit.
        if (chat) {
            return chat;
        }

        // Create the room since it doesn't exist...
        var room = new ChatRoom();
        room.importValues({
            characterId: CharacterManager.activeCharacter().key(),
            chatId: roomId,
            name: roomId,
            isGroupChat: isGroupChat,
            dateCreated: (new Date()).getTime()
        });
        room.save();

        Notifications.chat.room.dispatch(room);

        return room;
    };

    self._inviteAll = function(jid, invitees) {
        var xmpp = XMPPService.sharedService();
        invitees.forEach(function(invitee, idx, _) {
            xmpp.connection.muc.invite(jid, invitee.jid, null);
        });
        xmpp.connection.flush();
    };

    // Utility Methods

    self._parseMessage = function(msg, room) {
        var xmpp = XMPPService.sharedService();
        var fullJid = $(msg).attr('from');
        var bareJid =  Strophe.getBareJidFromJid(fullJid);
        var chat = new ChatMessage();
        chat.importValues({
            characterId: CharacterManager.activeCharacter().key(),
            to: $(msg).attr('to'),
            from: bareJid,
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
