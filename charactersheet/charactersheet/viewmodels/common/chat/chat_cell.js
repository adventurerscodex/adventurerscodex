'use strict';

function ChatCellViewModel(chat) {
    var self = this;

    self.id = chat.chatId;
    self.characterId = chat.characterId;
    self._name = chat.name;
    self.badge = ko.observable();
    self.isGroupChat = chat.isGroupChat;
    self._getRoomMembers = chat.getRoomMembers;
    self.isParty = chat.isParty;
    self.members = ko.observableArray([]);

    self.name = ko.pureComputed(function() {
        return self.members().map(function(member, idx, _) {
            return self._getMemberTemplate(member);
        }).join('');

    });

    self.shouldShowDelete = ko.pureComputed(function() {
        return !self.isParty();
    });

    self.reload = function() {
        self.members(self._getRoomMembers());
    };

    /* View Model Methods */

    self.save = function() {};

    /* Template Rendering Methods */

    self._getMemberTemplate = function(card) {
        if (typeof card == 'string') {
            return card;
        } else {
            return ChatCellViewModelMemberTemplate.replace(
                '{card.imageUrl}', card.get('imageUrl')[0]
            );
        }
    };
}


var ChatCellViewModelMemberTemplate = '\
    <img src="{card.imageUrl}" width="40px" height="40px" class="img img-circle" />&nbsp;\
'
