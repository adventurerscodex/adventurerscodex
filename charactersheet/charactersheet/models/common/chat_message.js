'use strict';


function ChatMessage() {
    var self = this;

    self.ps = PersistenceService.register(ChatMessage, self);
    self.mapping = {
        include: ['characterId', 'chatId', 'to', 'from', 'id', 'message', 'dateSent', 'read', 'isSystemMessage']
    };

    self.characterId = ko.observable();
    self.chatId = ko.observable();
    self.to = ko.observable();
    self.from = ko.observable();
    self.id = ko.observable();
    self.message = ko.observable();
    self.dateSent = ko.observable();
    self.read = ko.observable(false);
    self.isSystemMessage = ko.observable(false);

    self.image = ko.pureComputed(function() {
        var card = self.getCard();
        if (!card) {
            return '';
        }
        return card.get('imageUrl');
    });

    self.clear = function() {
        var values = new ChatMessage().exportValues();
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.importValues = function(values) {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.exportValues = function() {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        return ko.mapping.toJS(self, mapping);
    };

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };

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

    /* String Methods */

    self.toText = function() {
        var dateString = '';
        if (self.dateSent()) {
            dateString = (new Date(self.dateSent())).toDateString();
        }

        return '**{date}**\n\n{text}'.replace(
            '{date}', dateString
        ).replace(
            '{text}', self.message()
        );
    };

    /* XMPP Methods */

    self.tree = function() {
        var message = $msg({
            to: self.to(),
            from: self.from(),
            id: self.id(),
            type: 'chat'
        }).c('body').t(self.message());
        return message.tree();
    };
}
