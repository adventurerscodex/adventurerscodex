import ko from 'knockout'
import Strophe from 'strophe'

import { Message } from 'charactersheet/models/common'
import { CharacterManager,
    Notifications } from 'charactersheet/utilities'
import { Fixtures } from 'charactersheet/utilities'
import { KeyValuePredicate,
    PersistenceService,
    SharedServiceManager } from 'charactersheet/services/common'

export function ChatRoom() {
    var self = this;

    self.ps = PersistenceService.register(ChatRoom, self);
    self.mapping = {
        include: ['characterId', 'chatId', 'dateCreated', 'name', 'isGroupChat', 'isParty', 'partyId']
    };

    self.characterId = ko.observable();
    self.chatId = ko.observable();
    self.dateCreated = ko.observable();
    self.name = ko.observable();
    self.isGroupChat = ko.observable(false);
    self.isParty = ko.observable(false);
    self.partyId = ko.observable();

    self.chatName = ko.pureComputed(function() {
        return Strophe.getNodeFromJid(self.chatId());
    });

    self.clear = function() {
        var values = new ChatRoom().exportValues();
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

    self.purge = function() {
        self.getAllMessages().forEach(function(msg, idx, _) {
            msg.delete();
        });
    };

    /* Convenience Methods */

    self.getUnreadMessages = function() {
        return PersistenceService.findFiltered(Message, function(msg, _) {
            return Strophe.getBareJidFromJid(msg.from) == self.chatId() && !msg.read;
        });
    };

    self.getAllMessages = function() {
        return PersistenceService.findFiltered(Message, function(msg, _) {
            return  Strophe.getBareJidFromJid(msg.from) == self.chatId();
        }).concat(PersistenceService.findFiltered(Presence, function(msg, _) {
            return Strophe.getBareJidFromJid(msg.from) == self.chatId();
        }));
    };

    self.getRoomMembers = function() {
        var jid = self.chatId();
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
