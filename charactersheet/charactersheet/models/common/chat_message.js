'use strict';


function ChatMessage() {
    var self = this;

    self.ps = PersistenceService.register(ChatMessage, self);
    self.mapping = {
        include: ['characterId', 'to', 'from', 'fromImage', 'id', 'message', 'dateSent']
    };

    self.characterId = ko.observable();
    self.to = ko.observable();
    self.from = ko.observable();
    self.fromImage = ko.observable();
    self.id = ko.observable();
    self.message = ko.observable();
    self.dateSent = ko.observable();

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
}
