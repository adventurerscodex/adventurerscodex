'use strict';

/**
 * A View that handles displaying Messages of type SYSTEM.
 */
function ChatLogSystemItem(message) {
    var self = this;

    self.message = message;

    // Chat Item Methods
    self.templateUrl = 'templates/common/chat';
    self.templateName = 'system_item.tmpl';
    self.timestamp = ko.pureComputed(function() {
        return self.message.dateReceived();
    });

    // UI Methods

    self.html = ko.pureComputed(function() {
        if (self.message.regardsJoiningRoom()) {
            return self.message.fromNick() + ' has joined the room.';
        } else if (self.message.regardsLeavingRoom()) {
            return self.message.fromNick() + ' has left the room.';
        } else {
            return 'something else has happened.';
        }
    });
}
