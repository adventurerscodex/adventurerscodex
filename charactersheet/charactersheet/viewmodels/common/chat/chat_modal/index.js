import ko from 'knockout'

export function ChatModalViewModel(parent) {
    var self = this;

    self.templateUrl = 'templates/common/chat';
    self.templateName = 'chat_modal.tmpl';

    self.parent = parent;
    self.partyMembers = ko.observableArray();
    self.partyMembersToAdd = ko.observableArray();
    self.isSubmitButtonDisabled = ko.observable(false);
    self.isErrorMessageVisible = ko.observable(false);

    self.load = function() {
        self.partyMembers(self.getAllPartyMembers());
        self.partyMembersToAdd.subscribe(self.isRoomDuplicate);
    };

    self.unload = function() {

    };

    self.isRoomDuplicate = function() {
        var chatService = ChatServiceManager.sharedService();
        var isDuplicateChat = false;
        Object.keys(chatService.rooms).forEach(function(room, idx, _) {
            // Skip check if it's the main Party chat
            if (room !== chatService.currentPartyNode) {
                var existingRoom = chatService.rooms[room];
                var existingRoomOccupants = Object.keys(existingRoom.roster);
                // First check if the number of occupants in the room is the same as the invitees
                // If they're not equal, it can't be a duplicate room
                if (existingRoomOccupants.length == (self.partyMembersToAdd().length + 1)) {
                    isDuplicateChat = self.partyMembersToAdd().every(function(invitee, idx, _) {
                        return existingRoomOccupants.indexOf(Strophe.getNodeFromJid(invitee.jid)) > -1;
                    });
                }
            }
        });
        if (isDuplicateChat) {
            self.isSubmitButtonDisabled(true);
            self.isErrorMessageVisible(true);
        } else {
            self.isSubmitButtonDisabled(false);
            self.isErrorMessageVisible(false);
        }
    };

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
