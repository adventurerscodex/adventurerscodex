import {
    CharacterCardPublishingService,
    DMCardPublishingService
} from 'charactersheet/services/common';
import {
    ChatServiceManager,
    KeyValuePredicate,
    PersistenceService
} from 'charactersheet/services/common';
import {
    CoreManager,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import {
    Note,
    PlayerTypes
} from 'charactersheet/models/common';
import { Settings } from 'charactersheet/settings';
import ko from 'knockout';
import linkifyStr from 'linkifyjs/string';
import template from './index.html';

/**
 * A View that handles displaying Messages of type CHAT.
 */
export function ChatLogChatItem(params) {
    var self = this;

    self.message = params.message;

    // Chat Item Methods
    self.timestamp = ko.pureComputed(function() {
        return self.message.dateReceived();
    });
    self.listItemClass = ko.observable('');

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
        return card.get('name') + ' (' + self.message.fromUsername() + ')';
    });

    self.html = ko.pureComputed(function() {
        return linkifyStr(self.message.html(), Settings.linkifyOptions);
    });

    self.saveToNotes = function() {
        var key = CoreManager.activeCore().uuid();
        var note = PersistenceService.findByPredicates(Note, [
            new KeyValuePredicate('characterId', key),
            new KeyValuePredicate('isSavedChatNotes', true)
        ])[0];
        if (!note) {
            note = new Note();
            note.characterId(key);
            note.text('# Saved from Chat');
            note.isSavedChatNotes(true);
        }
        note.text(note.text() + '\n\n' + self.message.toText());
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

ko.components.register('chat-log-chat-item', {
    viewModel: ChatLogChatItem,
    template: template
});
