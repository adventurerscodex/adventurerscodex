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
        params.onrender(self.message);
    };

    // UI Methods

    self.html = ko.pureComputed(function() {
        return self.message.html();
    });

    self.dateLabel = ko.pureComputed(() => {
        const date = new Date(self.timestamp());
        return date.toLocaleString();
    });
}

ko.components.register('chat-log-system-item', {
    viewModel: ChatLogSystemItem,
    template: template
});
