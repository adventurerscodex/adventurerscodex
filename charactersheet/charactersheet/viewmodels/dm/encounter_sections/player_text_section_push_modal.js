'use strict';

function PlayerTextSectionPushModalViewModel(parent) {
    var self = this;

    self.parent = parent;
    self.partyMembers = ko.observableArray();
    self.selectedPartyMembers = ko.observableArray();

    self.load = function() {
        self.partyMembers(self.getAllPartyMembers());
    };

    self.unload = function() {

    };

    self.doneButtonLabel = ko.pureComputed(function() {
        if (self.selectedPartyMembers().length > 0) {
            return 'Send';
        } else {
            return 'Cancel';
        }
    });

    self.getAllPartyMembers = function() {
        var character = CharacterManager.activeCharacter();
        var chatService = ChatServiceManager.sharedService();

        // Get the current card service.
        var cardService = null;
        if (character.playerType().key == 'character') {
            cardService = CharacterCardPublishingService.sharedService();
        } else {
            cardService = DMCardPublishingService.sharedService();
        }

        return cardService.getPCardsExceptMine().map(function(card, idx, _) {
            return {
                name: card.get('name')[0],
                image: card.get('imageUrl')[0],
                jid: card.get('publisherJid')[0]
            };
        });
    };
}
