'use strict';

function ChatCellViewModel(chat) {
    var self = this;

    self.id = chat.chatId;
    self.characterId = chat.characterId;
    self._name = chat.name;
    self.badge = ko.observable();
    self.isGroupChat = chat.isGroupChat;
    self.isParty = chat.isParty;

    self.name = ko.pureComputed(function() {
        return self.isParty() ? 'My Party' : self.id();
    });

    self.shouldShowDelete = ko.pureComputed(function() {
        return !self.isParty();
    });

    /* View Model Methods */

    self.save = function() {
    };
}
