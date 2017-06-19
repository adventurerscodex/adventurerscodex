'use strict';

/**
An object representation of an XMPP presence message.

This class provides a number of different convenience methods for routing, and
reasoning about presence messages.
*/
function Presence(element) {
    var self = this;
    self.ps = PersistenceService.register(Presence, self);
    self.mapping = {
        'include': ['element']
    };

    self.element = element;

    // Model Methods

    self.clear = function() {
        var values = new Message().exportValues();
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

    // Role Methods

    self.hasParticipantRole = function() {
        return $(self.element).find('item[role="participant"]').length > 0;
    };

    self.hasModeratorRole = function() {
        return $(self.element).find('item[role="moderator"]').length > 0;
    };

    self.hasNoneRole = function() {
        return $(self.element).find('item[role="none"]').length > 0;
    };

    // From Methods

    self.from = function() {
        return $(self.element).attr('from');
    };

    self.fromNick = function() {
        return Strophe.getResourceFromJid(self.from());
    };

    self.fromBare = function() {
        return Strophe.getBareJidFromJid(self.from());
    };

    // Error Methods

    self.hasError = function() {
        return $(self.element).find('error').length > 0;
    };

    // Party/Room Methods

    self.regardsCurrentParty = function() {
        var chat = ChatServiceManager.sharedService();
        return self.fromBare() === chat.currentPartyNode;
    };

    self.regardsJoiningRoom = function() {
        return self.regardsCurrentParty() && (
            self.hasParticipantRole() || self.hasModeratorRole()
        );
    };

    self.regardsLeavingRoom = function() {
        return self.hasNoneRole() && self.regardsCurrentParty();
    };
}
