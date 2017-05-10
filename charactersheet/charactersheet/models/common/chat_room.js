'use strict';


function ChatRoom() {
    var self = this;

    self.ps = PersistenceService.register(ChatRoom, self);
    self.mapping = {
        include: ['characterId', 'chatId', 'dateCreated', 'name', 'isGroupChat']
    };

    self.characterId = ko.observable();
    self.chatId = ko.observable();
    self.dateCreated = ko.observable();
    self.name = ko.observable();
    self.isGroupChat = ko.observable(false);

    self.clear = function() {
        var values = new Item().exportValues();
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

    self.jid = ko.pureComputed(function() {
        if (self.isGroupChat()) {
            return self.chatId();
        }

        return '{}@conference.adventurerscodex.com'.replace('{}', self.chatId());
    });

    /* Convenience Methods */

    self.getUnreadMessages = function() {
        return PersistenceService.findByPredicates(ChatMessage, [
            new KeyValuePredicate('chatId', self.chatId()),
            new KeyValuePredicate('read', false)
        ]);
    };

    self.getAllMessages = function() {
        return PersistenceService.findByPredicates(ChatMessage, [
            new KeyValuePredicate('chatId', self.chatId())
        ]);
    };

}
