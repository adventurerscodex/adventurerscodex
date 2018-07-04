import {
    CharacterCardPublishingService,
    DMCardPublishingService,
    KeyValuePredicate
} from 'charactersheet/services/common';
import {
    Note,
    PlayerTypes
} from 'charactersheet/models/common';
import { ChatServiceManager } from 'charactersheet/services/common';
import { CoreManager } from 'charactersheet/utilities';
import { Notifications } from 'charactersheet/utilities';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { Utility } from 'charactersheet/utilities/convenience';
import { XMPPService } from 'charactersheet/services/common';
import ko from 'knockout';
import template from './index.html';

/**
 * A View that handles displaying Messages of type CHAT.
 */
export function ChatLogReadAloudItem(params) {
    var self = this;

    self.message = params.message;

    // Chat Item Methods
    self.timestamp = ko.pureComputed(function() {
        return self.message.dateReceived();
    });
    self.listItemClass = ko.observable('info-chat-highlight');

    self.load = function() {
        params.onrender();
    };

    // UI Methods

    self.shouldShowSaveToChatButton = ko.pureComputed(function() {
        var key = CoreManager.activeCore().type.name();
        return key == PlayerTypes.character.key;
    });

    self.image = ko.pureComputed(function() {
        var card = self.getCard();
        if (!card) {
            return 'https://www.gravatar.com/avatar/{}?d=mm';
        }
        return Utility.string.createDirectDropboxLink(card.get('imageUrl')[0]);
    });

    self.name = ko.pureComputed(function() {
        var card = self.getCard();
        if (!card) {
            return self.message.fromUsername();
        }
        return card.get('name') + ' (' + self.message.fromUsername() + ')<br />Private';
    });

    self.html = ko.pureComputed(function() {
        return self.message.item().json.html;
    });

    self.saveToNotes = function() {
        var key = CoreManager.activeCore().uuid();
        var note = PersistenceService.findByPredicates(Note, [
            new KeyValuePredicate('characterId', key),
            new KeyValuePredicate('isSavedChatNotes', true)
        ])[0];
        var date = (new Date()).toDateString();
        if (!note) {
            note = new Note();
            note.characterId(key);
            note.text('# Saved from Chat');
            note.isSavedChatNotes(true);
        }
        note.text(note.text() + '\n\n' + '**' + date + '**' + '\n\n' + self.html());
        note.save();

        Notifications.notes.changed.dispatch();
        Notifications.userNotification.successNotification.dispatch('Saved to Notes.');
    };

    /* Card Methods */

    self.getCard = function() {
        var character = CoreManager.activeCore();
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
        if (character.type.name() == 'character') {
            cardService = CharacterCardPublishingService.sharedService();
        } else {
            cardService = DMCardPublishingService.sharedService();
        }

        return cardService.pCards[jid] ? cardService.pCards[jid]: null;
    };
}

ko.components.register('chat-log-read-aloud-item', {
    viewModel: ChatLogReadAloudItem,
    template: template
});
