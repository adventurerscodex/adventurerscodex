'use strict';

function ChatCellViewModel(chat) {
    var self = this;

    self.id = chat.chatId;
    self.characterId = chat.characterId;
    self._name = chat.name;
    self.badge = ko.observable();
    self.isGroupChat = chat.isGroupChat;
    self.isParty = chat.isParty;
    self.members = ko.observableArray([]);

    self.name = ko.pureComputed(function() {
//         if (self.isParty()) {
//             return 'My Party';
//         }

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
        return card;
        return ChatCellViewModelMemberTemplate.replace(
            '{card.imageUrl}', card.get('imageUrl')[0]
        );
    };

    self._getRoomMembers = function() {
        var jid = self.id();
        var character = CharacterManager.activeCharacter();
        var chatService = ChatServiceManager.sharedService();
        var occupants = chatService.getOccupantsInRoom(jid);

        // Get the current card service.
        var cardService = null;
        if (character.playerType().key == 'character') {
            cardService = CharacterCardPublishingService.sharedService();
        } else {
            cardService = DMCardPublishingService.sharedService();
        }

        var occupantCardsOrNames = occupants.map(function(occupant, idx, _) {
            return cardService.pCards[occupant] ? cardService.pCards[occupant] : occupant;
        });

        return occupantCardsOrNames;
    };

}


var ChatCellViewModelMemberTemplate = '\
    <img src="{card.imageUrl}" width="80px" height="80px" class="img img-circle" />\
'
