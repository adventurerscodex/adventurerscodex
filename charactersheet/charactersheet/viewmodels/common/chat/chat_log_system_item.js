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
        return self.message.html();
    });
}
