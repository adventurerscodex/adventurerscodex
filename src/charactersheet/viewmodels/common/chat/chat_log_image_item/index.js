import {
    CharacterCardPublishingService,
    DMCardPublishingService
} from 'charactersheet/services/common';
import {
    CoreManager,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { Note,
    PlayerTypes
} from 'charactersheet/models/common';
import { ChatServiceManager } from 'charactersheet/services/common/account/messaging';
import ko from 'knockout';
import template from './index.html';

/**
 * A View that handles displaying Messages of type CHAT.
 */
export function ChatLogImageItem(params) {
    var self = this;

    self.message = params.message;
    self.fullScreen = ko.observable(false);

    // Chat Item Methods

    self.timestamp = ko.pureComputed(function() {
        return self.message.dateReceived();
    });
    self.listItemClass = ko.observable('image-chat-highlight');

    self.toggleFullScreen = function() {
        self.fullScreen(!self.fullScreen());
    };

    self.load = function() {
        params.onrender(self.message);
    };

    // UI Methods

    self.shouldShowSaveToNotesButton = ko.pureComputed(function() {
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

    self.messageImage = ko.pureComputed(function() {
        return Utility.string.createDirectDropboxLink(self.message.item().json.url);
    });

    self.html = ko.pureComputed(function() {
        return '<h3>{name}</h3>'.replace(
            '{name}', self.message.item().json.name
        );
    });

    self.imageHtml = function() {
        return '<img src="{url}" width="100%" />'.replace('{url}', self.messageImage());
    };

    self.saveToNotes = async function() {
        const date = (new Date()).toDateString();

        let note = Note.getSavedFromChatNote(CoreManager.activeCore().uuid());
        note.appendTextToNote(self.html() + '\n\n' + date + '\n\n' + self.imageHtml());
        await note.save();

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

ko.components.register('chat-log-image-item', {
    viewModel: ChatLogImageItem,
    template: template
});
