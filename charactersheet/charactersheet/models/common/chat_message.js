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
