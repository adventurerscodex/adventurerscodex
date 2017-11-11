import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import {
    CHAT_MESSAGE_TYPES,
    ChatServiceManager,
    SharedServiceManager
} from 'charactersheet/services';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import Strophe from 'strophe';
import ko from 'knockout';

/**
An object representation of an XMPP presence message.

This class provides a number of different convenience methods for routing, and
reasoning about presence messages.
*/
export function Presence() {
    var self = this;
    self.ps = PersistenceService.register(Presence, self);
    self.mapping = {
        include: ['hasParticipantRole', 'hasModeratorRole', 'hasNoneRole', 'from', 'hasError', 'dateReceived']
    };

    self.messageType = ko.observable(CHAT_MESSAGE_TYPES.SYSTEM);

    // Model Methods

    self.clear = function() {
        var values = new Presence().exportValues();
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

    self.fromUsername = function() {
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

    self.regardsActiveRoom = function() {
        var chat = ChatServiceManager.sharedService();

        // We've joined a room, but there are no active rooms set yet.
        if (chat.getAllRooms().length == 0) {
            return true;
        }
        return chat.getAllRooms().some(function(jid, idx, _) {
            return self.fromBare() === Strophe.getBareJidFromJid(jid);
        });
    };

    self.regardsJoiningRoom = function() {
        return self.regardsActiveRoom() && (
            self.hasParticipantRole() || self.hasModeratorRole()
        );
    };

    self.regardsLeavingRoom = function() {
        return self.hasNoneRole();
    };

    self.regardsLeavingParty = function() {
        return self.hasNoneRole() && self.regardsCurrentParty();
    };

    self.html = ko.pureComputed(function() {
        if (self.regardsJoiningRoom()) {
            return self.fromUsername() + ' has joined the room.';
        } else if (self.regardsLeavingRoom()) {
            return self.fromUsername() + ' has left the room.';
        } else {
            return 'something else has happened.';
        }
    });

    self.shortHtml = self.html;
}


Presence.fromTree = function(element) {
    var presence = new Presence();
    presence.importValues({
        hasParticipantRole: $(element).find('item[role="participant"]').length > 0,
        hasModeratorRole: $(element).find('item[role="moderator"]').length > 0,
        hasNoneRole: $(element).find('item[role="none"]').length > 0,
        from: $(element).attr('from'),
        hasError: $(element).find('error').length > 0,
        dateReceived: (new Date()).getTime()
    });
    return presence;
};


PersistenceService.addToRegistry(Presence);
