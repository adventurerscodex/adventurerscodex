'use strict';
/*eslint no-console:0*/
function ChatViewModel() {
    var self = new MasterDetailViewModel();

    self.chats = ko.observableArray();

    self.title = 'Chats';
    self.shouldDisplayModelOnNewItem = true;

    /* View Model Methods */

    self.didLoad = function() {
        self.reloadCells();
        self.selectedCell(self.cells()[0]);

        // Message Notifications
        Notifications.chat.message.add(self._deliverMessageToRoom);
        Notifications.chat.room.add(self.reloadCells);
        Notifications.chat.member.joined.add(self._userHasJoined);
        Notifications.chat.member.left.add(self._userHasLeft);
        Notifications.party.joined.add(self._didJoinParty);
        Notifications.party.left.add(self.reloadCells);
        Notifications.party.players.changed.add(self.reloadCells);
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
        Notifications.chat.room.remove(self.reloadCells);
        Notifications.chat.member.joined.remove(self._userHasJoined);
        Notifications.chat.member.left.remove(self._userHasLeft);
        Notifications.party.joined.remove(self._didJoinParty);
        Notifications.party.left.remove(self.reloadCells);
        Notifications.party.players.changed.remove(self.reloadCells);
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

        self.reloadCells();

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

        self.reloadCells();
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

    // Cell Methods

    /**
     * Fetch all of the cells for the given character/campaign and
     * convert them into cells.
     */
    self.reloadCells = function() {
        self.chats(self._getChats());
        self.cells(self._getChatCells());
    };

    /**
     * Tell each of the existing cells to reload their data.
     * This does NOT reload the list of cells from disk.
     */
    self.refreshCells = function() {
        return self.cells().forEach(function(cell, idx, _) {
            cell.reload();
        });
    };

    /* Private Methods */

    self._getChatCells = function() {
        return self.chats().map(function(chat, idx, _) {
            var cell = new ChatCellViewModel(chat);
            cell.reload();
            return cell;
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
            var aVal = a.isParty() ? 1 : -1;
            var bVal = b.isParty() ? 1 : -1;

            return bVal - aVal;
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
        self.reloadCells();
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

    self._userHasJoined = function(jid, nick) {
        var room = PersistenceService.findFirstBy(ChatRoom, 'chatId', jid);
        var chat = new ChatMessage();
        chat.importValues({
            characterId: CharacterManager.activeCharacter().key(),
            chatId: room.chatId(),
            isSystemMessage: true,
            message: nick + ' has entered the room.',
            dateSent: (new Date()).getTime()
        });
        chat.save();
        self._deliverMessageToRoom(chat, room, false);
    };

    self._userHasLeft = function(roomId, nick, jid) {
        var room = PersistenceService.findFirstBy(ChatRoom, 'chatId', roomId);
        var chat = new ChatMessage();
        chat.importValues({
            characterId: CharacterManager.activeCharacter().key(),
            chatId: room.chatId(),
            isSystemMessage: true,
            message: nick + ' has left the room.',
            dateSent: (new Date()).getTime()
        });
        chat.save();
        self._deliverMessageToRoom(chat, room, false);
    };

    self._didJoinParty = function() {
        self.reloadCells();
        self.selectedCell(self.cells()[0]);
    };

    return self;
}
