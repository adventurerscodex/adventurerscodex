'use strict';

/**
 * A View that handles displaying Messages of type CHAT.
 */
function ChatLogChatItem(message) {
    var self = this;

    self.message = message;

    // Chat Item Methods
    self.templateUrl = 'templates/common/chat';
    self.templateName = 'chat_item.tmpl';
    self.timestamp = ko.pureComputed(function() {
        return self.message.dateReceived();
    });

    // UI Methods

    self.image = ko.pureComputed(function() {
        var card = self.getCard();
        if (!card) {
            return 'https://www.gravatar.com/avatar/{}?d=mm';
        }
        return card.get('imageUrl');
    });

    self.name = ko.pureComputed(function() {
        var card = self.getCard();
        if (!card) {
            return self.message.fromUsername();
        }
        return card.get('name') + ' (' + self.message.fromUsername() + ')';
    });

    self.html = ko.pureComputed(function() {
        return self.message.html();
    });

    /* Card Methods */

    self.getCard = function() {
        var character = CharacterManager.activeCharacter();
        var chatService = ChatServiceManager.sharedService();
        var chatRoom = chatService.rooms[self.message.fromBare()];
        if (!chatRoom) { return null; }
        var occupant = chatRoom.roster[self.message.fromUsername()];
        if (!occupant) {
            return null;
        }

        // Get the current card service.
        var jid = occupant.jid;
        var cardService = null;
        if (character.playerType().key == 'character') {
            cardService = CharacterCardPublishingService.sharedService();
        } else {
            cardService = DMCardPublishingService.sharedService();
        }

        return cardService.pCards[jid] ? cardService.pCards[jid]: null;
    };
}
