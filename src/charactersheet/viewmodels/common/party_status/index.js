import { Notifications } from 'charactersheet/utilities';
import Strophe from 'strophe';
import ko from 'knockout';
import template from './index.html';

export function PartyStatusViewModel() {
    var self = this;

    self.partyStatus = ko.observable();
    self.isConnectedToParty = ko.observable();

    self.load = function() {
        Notifications.coreManager.changed.add(self._clearPartyStatus);
        // Make sure the first message is set
        self._updatePartyStatus(null, true);
    };

    self._updatePartyStatus = function(node, success) {
        // TODO
//         if (!success) { return; }
//         if (node) {
//             var chat = ChatServiceManager.sharedService();
//             self.partyStatus('<i>You\'re connected to <span class="text-info">' + Strophe.getNodeFromJid(chat.currentPartyNode) + '</span></i>.');
//         } else {
//             self.partyStatus('<i>You\'re not connected to a party.</i>');
//         }
    };

    self._clearPartyStatus = function() {
        self.partyStatus('<i>You\'re not connected to a party.</i>');
    };
}

ko.components.register('party-status', {
    viewModel: PartyStatusViewModel,
    template: template
});
