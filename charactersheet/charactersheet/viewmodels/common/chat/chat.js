'use strict';

function ChatViewModel() {
    var self = new MasterDetailViewModel();

    self.chats = ko.observableArray();

    self.title = 'Chats';
    self.shouldDisplayModelOnNewItem = true;

    self._handlerTokens = [];

    self._connectionIsSetup = false;
    self._xmppIsConnected = ko.observable(false);

    /* View Model Methods */

    self.didLoad = function() {
        var key = CharacterManager.activeCharacter().key();
        var chats = PersistenceService.findBy(ChatRoom, 'characterId', key);
        self.chats(chats);

        self.cells(self._getChatCells());
        self.selectedCell(self.cells()[0]);

        // Incoming Messages/Connections
        Notifications.xmpp.connected.add(self._setupConnection);
        Notifications.xmpp.disconnected.add(self._teardownConnection);
        Notifications.xmpp.pubsub.subscribed.add(self._updateCurrentNode);
        Notifications.xmpp.pubsub.unsubscribed.add(self._removeCurrentNode);

        self._setupConnection();
    };

    self.didUnload = function() {
        self._teardownConnection();

        // Chat logs are saved server-side.
         var key = CharacterManager.activeCharacter().key();
       var chats = PersistenceService.findBy(ChatRoom, 'characterId', key);
        chats.forEach(function(chat, idx, _) {
            chat.purge();
        });

        Notifications.xmpp.connected.remove(self._setupConnection);
        Notifications.xmpp.disconnected.remove(self._teardownConnection);
        Notifications.xmpp.pubsub.subscribed.remove(self._updateCurrentNode);
        Notifications.xmpp.pubsub.unsubscribed.remove(self._removeCurrentNode);
    };

    /* List Management Methods */

    /**
     * Create a new chat and add it to the list. It should be auto selected.
     *
     * Note: New rooms are created with the following JID format:
     * <user's chosen room name>.<PARTY_ID>@<MUC_SERVICE>
     */
    self.addItem = function() {
        var name = uuid.v4().substring(0,6);
        var invitees = self.modalViewModel().partyMembersToAdd();

        var room = self._createRoomAndInvite(name, invitees);
        var key = CharacterManager.activeCharacter().key();

        var chats = PersistenceService.findBy(ChatRoom, 'characterId', key);
        self.chats(chats);
        self.cells(self._getChatCells());

        var cellToSelect = self.cells().filter(function(cell, idx, _) {
            return cell.id() === room.chatId();
        })[0];
        self.selectedCell(cellToSelect);
    };

    /**
     * Clear the detail view model and reload the list of chats.
     */
    self.deleteCell = function(cell) {
        self.detailViewModel().delete();

        var xmpp = XMPPService.sharedService();
        xmpp.connection.muc.leave(cell.id(), 'test', console.log, null);

        var key = CharacterManager.activeCharacter().key();
        var chats = PersistenceService.findBy(ChatRoom, 'characterId', key);
        self.chats(chats);
        self.cells(self._getChatCells());
        self.selectedCell(self.cells()[0]);
    };

    /* Event Methods */

    self.getModalViewModel = function() {
        return new ChatModalViewModel(self);
    };

    self.getDetailViewModel = function(cell) {
        if (cell) {
            return new ChatDetailViewModel(cell, self);
        }
        return null;
    };

    self.modalFinishedOpening = function() {};

    /**
     * Once a modal is closed, if it was closed by clicking done, then create
     * a new room and add the selected users to it.
     */
    self.modalFinishedClosing = function() {
        self.modalIsOpen(false);
    };

    /**
     * Update the value of the badge for a given room.
     */
    self.updateBadge = function(room) {
        var cellToBadge = self.cells().filter(function(cell, idx, _) {
            return cell.chatId() === room.chatId();
        })[0];
        if (cellToBadge) {
            cellToBadge.badge(room.getUnreadMessages().length);
        }
    };

    /* Private Methods */

    self._getChatCells = function() {
        return self.chats().map(function(chat, idx, _) {
            return new ChatCellViewModel(chat);
        });
    };

    /**
     * Return if the current active room is the same as the provided.
     */
    self._isSelectedRoom = function(room) {
        if (!room || !self.selectedCell()) { return false; }
        return self.selectedCell().chatId() === room.chatId();
    };

    /**
     * Fetch room with ID or create one if not existant.
     */
    self._getRoomOrCreate = function(roomId, isGroupChat) {
        var chat = self.chats().filter(function(chats, idx, _) {
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

        // Update the UI.
        self.chats.push(room);
        self.cells(self._getChatCells());

        return room;
    };

    /**
     * Tell the child view model that it should update its chat messages.
     */
    self._childViewModelShouldUpdate = function() {
        self.detailViewModel().reloadData();
    };

    // Room Management

    self._createRoomAndInvite = function(name, invitees) {
        var jid = self._jidFromName(name);
        var room = self._getRoomOrCreate(jid, true);

        self._joinRoom(jid, 'test');
        self._inviteAll(jid, invitees);

        return room;
    };

    // Message Handlers

    self._handleNewGroupMessage = function(msg) {
        /*eslint no-console:0*/
        try {
            // Messages in Group Chats are ID'd by the group JID.
            var from = Strophe.getBareJidFromJid($(msg).attr('from'));

            var room = self._getRoomOrCreate(from, true);
            var chatMessage = self._parseMessage(msg, room);
            chatMessage.save();

            self._deliverMessageToRoom(chatMessage, room);
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

            self._deliverMessageToRoom(chatMessage, room);
        } catch(err) {
            console.log(err);
        }
        return true;
    };

    self._handleNewPresenceOrIqMessage = function(msg) {
        /*eslint no-console:0*/
        console.log(msg);
    };

    /**
     * Given a chat message, deliver it to the correct room if the room is
     * active, else badge the icon or create the room if needed and alert
     * the user.
     */
    self._deliverMessageToRoom = function(chat, room) {
        var roomIsSelected = self._isSelectedRoom(room);
        if (roomIsSelected) {
            // The room for this chat is the active room.
            self._childViewModelShouldUpdate();
        } else {
            // The room is in the background. Badge the icon.
            self.updateBadge(room);
        }
    };

    // Connection Handlers

    self._setupConnection = function() {
        var xmpp = XMPPService.sharedService();

        // MUC Notifications are subscribed to when joining/creating rooms.
        // Rejoin all previous chats.
        if (xmpp.connection.connected) {
            var key = CharacterManager.activeCharacter().key();
            var rooms = PersistenceService.findBy(ChatRoom, 'characterId', key);
            rooms.forEach(function(room, idx, _) {
                if (room.isGroupChat()) {
                    self._joinRoom(room.chatId(), 'test');
                }
            });
        }

        if (self._connectionIsSetup) {
            // Don't resubscribe if you don't need to.
            return;
        }

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
        self._connectionIsSetup = true;
    };

    self._teardownConnection = function() {
        var xmpp = XMPPService.sharedService();
        self._handlerTokens.forEach(function(token, idx, _) {
            xmpp.connection.deleteHandler(token);
        });
        self._connectionIsSetup = false;
    };

    self._updateCurrentNode = function(node) {
        self.currentPartyNode = node;
    };

    self._removeCurrentNode = function(node) {
        self.currentPartyNode = null;
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

    self._joinRoom = function(jid, nick) {
        var xmpp = XMPPService.sharedService();
        xmpp.connection.muc.join(
            jid, nick, self._handleNewGroupMessage,
            self._handleNewPresenceOrIqMessage, console.log,
            null, null, null
        );
        xmpp.connection.flush();
    };

    self._inviteAll = function(jid, invitees) {
        var xmpp = XMPPService.sharedService();
        invitees.forEach(function(invitee, idx, _) {
            xmpp.connection.muc.invite(jid, invitee.jid, null);
        });
        xmpp.connection.flush();
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

    return self;
}
