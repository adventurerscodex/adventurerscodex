import ko from 'knockout'

import template from './index.html'
/**
 * A View that handles displaying Messages of type SYSTEM.
 */
export function ChatLogSystemItem(message) {
    var self = this;

    self.message = message;

    // Chat Item Methods
    self.templateUrl = 'templates/common/chat';
    self.templateName = 'system_item.tmpl';
    self.timestamp = ko.pureComputed(function() {
        return self.message.dateReceived();
    });
    self.listItemClass = ko.observable('');

    // UI Methods

    self.html = ko.pureComputed(function() {
        return self.message.html();
    });
}

ko.components.register('chat-log-system-item', {
  viewModel: ChatLogSystemItem,
  template: template
})