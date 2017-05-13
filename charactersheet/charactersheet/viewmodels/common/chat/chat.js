'use strict';
/*eslint no-console:0*/
function ChatViewModel() {
    var self = new MasterDetailViewModel();

    self.chats = ko.observableArray();

    self.title = 'Chats';
    self.shouldDisplayModelOnNewItem = true;

    /* View Model Methods */

    self.didLoad = function() {
        self.chats(self._getChats());

        self.cells(self._getChatCells());
        self.selectedCell(self.cells()[0]);

        // Message Notifications
        Notifications.chat.message.add(self._deliverMessageToRoom);
        Notifications.chat.room.add(self._updateChatRooms);
        Notifications.chat.member.joined.add(self._userHasJoined);
        Notifications.chat.member.left.add(self._userHasLeft);
        Notifications.party.joined.add(self._updateChatRooms);
        Notifications.party.left.add(self._updateChatRooms);
    };

    self.didUnload = function() {
        // Chat logs are saved server-side.
        var key = CharacterManager.activeCharacter().key();
        var chats = PersistenceService.findBy(ChatRoom, 'characterId', key);
        chats.forEach(function(chat, idx, _) {
            chat.purge();
        });

        // Message Notifications
        Notifications.chat.message.remove(self._deliverMessageToRoom);
        Notifications.chat.room.remove(self._updateChatRooms);
        Notifications.chat.member.joined.remove(self._userHasJoined);
        Notifications.chat.member.left.remove(self._userHasLeft);
        Notifications.party.left.remove(self._updateChatRooms);
        Notifications.party.joined.remove(self._updateChatRooms);
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

        var chatService = ChatServiceManager.sharedService();
        var jid = name+'@'+Settings.MUC_SERVICE;
        var room = chatService.createRoomAndInvite(jid, invitees);

        self.chats(self._getChats());
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

        var chatService = ChatServiceManager.sharedService();
        chatService.leave(cell.id(), 'test', console.log);

        self.chats(self._getChats());
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
            return cell.id() === room.chatId();
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

    self._getChats = function() {
        var chatService = ChatServiceManager.sharedService();
        var currentPartyNode = chatService.currentPartyNode;
        var chats = PersistenceService.findByPredicates(ChatRoom, [
            new OrPredicate([
                // Get the party chat.
                new KeyValuePredicate('chatId', currentPartyNode),
                // Get all related chats.
                new KeyValuePredicate('partyId', currentPartyNode)
            ])
        ]);
        return chats.sort(function(a,b) {
            return a.isParty() > b.isParty()
        });
    };

    /**
     * Return if the current active room is the same as the provided.
     */
    self._isSelectedRoom = function(room) {
        if (!room || !self.selectedCell()) { return false; }
        return self.selectedCell().id() === room.chatId();
    };

    /**
     * Tell the child view model that it should update its chat messages.
     */
    self._childViewModelShouldUpdate = function() {
        self.detailViewModel().reloadData();
    };

    /**
     * Given a chat message, deliver it to the correct room if the room is
     * active, else badge the icon or create the room if needed and alert
     * the user.
     */
    self._deliverMessageToRoom = function(room, msg, delay) {
        self._updateChatRooms();
        var roomIsSelected = self._isSelectedRoom(room);
        if (roomIsSelected) {
            // The room for this chat is the active room.
            self._childViewModelShouldUpdate();
        } else if (!delay) {
            // The room is in the background. Badge the icon.
            self.updateBadge(room);
        }

        var chatTabIsForground = viewModel.childRootViewModel().activeTab() == 'chat';
        if (!chatTabIsForground && !delay) {
            Notifications.userNotification.infoNotification.dispatch(msg.message(), msg.from());
        }
    };

    self._updateChatRooms = function() {
        // Update the UI.
        self.chats(self._getChats());
        self.cells(self._getChatCells());
    };

    self._userHasJoined = function(jid, nick) {
        Notifications.userNotification.infoNotification.dispatch(nick+' has joined '+jid);
    };

    self._userHasLeft = function(jid, nick) {
        Notifications.userNotification.infoNotification.dispatch(nick+' has left '+jid);
    };

    return self;
}
