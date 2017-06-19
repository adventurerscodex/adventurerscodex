'use strict';


function ChatLogHTMLItem() {
    var self = this;

    self.image = ko.pureComputed(function() {
        var card = self.getCard();
        if (!card) {
            return '';
        }
        return card.get('imageUrl');
    });


    // TODO Finish ViewModel

    /* Card Methods */

    self.getCard = function() {
        if (self.isSystemMessage()) {
            return null;
        }
        var character = CharacterManager.activeCharacter();
        var chatService = ChatServiceManager.sharedService();
        var chatRoom = chatService.rooms[self.chatId()];
        if (!chatRoom) { return null; }
        var occupant = chatRoom.roster[self.from()];
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
