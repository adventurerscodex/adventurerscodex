import {
    CharacterCardPublishingService,
    ChatServiceManager,
    DMCardPublishingService
} from 'charactersheet/services/common';
import { CoreManager } from 'charactersheet/utilities/core_manager';
import { Utility } from 'charactersheet/utilities/convenience';
import ko from 'knockout';
import template from './index.html';

export function ChatModalViewModel(params) {
    var self = this;

    self.isOpen = params.isOpen;
    self.modalFinishedClosing = params.onclose;
    self.modalFinishedOpening = params.onopen;

    self.partyMembers = ko.observableArray();
    self.partyMembersToAdd = ko.observableArray();
    self.isSubmitButtonDisabled = ko.observable(false);
    self.isErrorMessageVisible = ko.observable(false);

    self.load = function() {
        self.partyMembersToAdd.subscribe(self.isRoomDuplicate);
        self.isOpen.subscribe(self.dataHasChanged);
    };

    self.dataHasChanged = function() {
        if (self.isOpen()) {
            self.modalFinishedOpening();
            self.partyMembers(self.getAllPartyMembers());
        }
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
        var character = CoreManager.activeCore();
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
                image: Utility.string.createDirectDropboxLink(card.get('imageUrl')[0]),
                jid: card.get('publisherJid')[0]
            };
        });
    };

    self._modalDoneButtonWasClicked = function() {
        self.isOpen(false);
        self.modalFinishedClosing(self.partyMembersToAdd());
    };
}

ko.components.register('chat-modal', {
    template: template,
    viewModel: ChatModalViewModel
});
