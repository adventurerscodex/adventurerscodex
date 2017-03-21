'use strict';

function ChatViewModel() {
    var self = new MasterDetailViewModel();

    self.chats = ko.observableArray();

    self.title = 'Chats';

    /* View Model Methods */

    self.didLoad = function() {
        self.chats(Debug_chats.map(function(chat, idx, _) {
            var room = new ChatRoom();
            room.importValues(chat);
            return room;
        }));

        self.cells(self._getChatCells());
        self.selectedCell(self.cells()[0]);
        //Notifications.chats.changed.add(self.dataHasChanged);
    };

    self.didUnload = function() {
        //Notifications.chats.changed.remove(self.dataHasChanged);
    };

    /* List Management Methods */

    /**
     *
     *
     */
    self.addItem = function() {
        throw Error('Not properly configured: addItem');
    };

    /**
     *
     *
     */
    self.deleteCell = function(cell) {
        throw Error('Not properly configured: deleteCell');
    };

    /* Event Methods */

    /**
     *
     *
     */
    self.getModalViewModel = function() {
        throw Error('Not properly configured: getModalViewModel');
    };

    self.getDetailViewModel = function(cell) {
        return new ChatDetailViewModel(cell);
    };

    /**
     *
     *
     */
    self.modalFinishedOpening = function() {};

    /**
     *
     *
     */
    self.modalFinishedClosing = function() {};

    /* Private Methods */

    self._getChatCells = function() {
        return self.chats().map(function(chat, idx, _) {
            return new ChatCellViewModel(chat);
        });
    };

    self._handleNewMessage = function(chatId) {
        //TODO
    };

    return self;
}


//DEBUG
var Debug_chats = [{
    name: 'Your Party',
    chatId: 'hi',
    characterId: 'hi',

},{
    name: 'You and Wind',
    chatId: 'hiwq',
    characterId: 'hi',

},{
    name: 'You and the DM',
    chatId: 'heei',
    characterId: 'hi',
}];

