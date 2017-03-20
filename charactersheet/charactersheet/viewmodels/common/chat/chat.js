'use strict';

function ChatViewModel() {
    var self = new MasterDetailViewModel();

    self.chats = [{
        name: ko.observable('Your Party'),
        chatId: ko.observable('hi'),
        characterId: ko.observable('hi'),

    },{
        name: ko.observable('You and Wind'),
        chatId: ko.observable('hiwq'),
        characterId: ko.observable('hi'),

    },{
        name: ko.observable('You and the DM'),
        chatId: ko.observable('heei'),
        characterId: ko.observable('hi'),

    }];

    self.title = 'Chats';

    /* View Model Methods */

    self.didLoad = function() {
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

    /**
     *
     *
     */
    self.cellWasSelected = function(cell) {
        //throw Error('Not properly configured: cellWasSelected');
    };

    /* Private Methods */

    self._getChatCells = function() {
        return self.chats.map(function(chat, idx, _) {
            return new ChatCellViewModel(chat);
        });
    };

    return self;
}
