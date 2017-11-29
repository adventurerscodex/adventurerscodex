import ko from 'knockout';

import template from './index.html';
/**
 * A View that handles displaying Messages of type SYSTEM.
 */
export function ChatLogSystemItem(params) {
    var self = this;

    self.message = params.message;

    // Chat Item Methods
    self.timestamp = ko.pureComputed(function() {
        return self.message.dateReceived();
    });
    self.listItemClass = ko.observable('');

    self.load = function() {
        params.onrender();
    };

    // UI Methods

    self.html = ko.pureComputed(function() {
        return self.message.html();
    });
}

ko.components.register('chat-log-system-item', {
    viewModel: ChatLogSystemItem,
    template: template
});
