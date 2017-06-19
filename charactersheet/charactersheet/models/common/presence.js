'use strict';

/**
An object representation of an XMPP presence message.

This class provides a number of different convenience methods for routing, and
reasoning about presence messages.
*/
function Presence() {
    var self = this;
    self.ps = PersistenceService.register(Presence, self);
    self.mapping = {
        include: ['hasParticipantRole', 'hasModeratorRole', 'hasNoneRole', 'from', 'hasError']
    };

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

    // From Methods

    self.fromNick = function() {
        return Strophe.getResourceFromJid(self.from());
    };

    self.fromBare = function() {
        return Strophe.getBareJidFromJid(self.from());
    };

    // Party/Room Methods

    self.regardsCurrentParty = function() {
        var chat = ChatServiceManager.sharedService();
        return self.fromBare() === Strophe.getBareJidFromJid(chat.currentPartyNode);
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


Presence.fromTree = function(element) {
    var presence = new Presence();
    presence.importValues({
        hasParticipantRole: $(element).find('item[role="participant"]').length > 0,
        hasModeratorRole: $(element).find('item[role="moderator"]').length > 0,
        hasNoneRole: $(element).find('item[role="none"]').length > 0,
        from: $(element).attr('from'),
        hasError: $(element).find('error').length > 0
    });
    return presence;
};
