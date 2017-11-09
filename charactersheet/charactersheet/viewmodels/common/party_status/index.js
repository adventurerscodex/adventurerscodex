import ko from 'knockout';
import Strophe from 'strophe';

import { Notifications } from 'charactersheet/utilities';

import template from './index.html';

export function PartyStatusViewModel() {
    var self = this;

    self.partyStatus = ko.observable();

    self.load = function() {
        Notifications.party.joined.add(self._updatePartyStatus);
        Notifications.party.left.add(self._clearPartyStatus);
        Notifications.xmpp.disconnected.add(self._updatePartyStatus);
        Notifications.characterManager.changed.add(self._clearPartyStatus);
        // Make sure the first message is set
        self._updatePartyStatus(null, true);
    };

    self._updatePartyStatus = function(node, success) {
        if (!success) { return; }
        if (node) {
            self.partyStatus('<i>You\'re connected to <span class=\"text-info\">' + Strophe.getNodeFromJid(node) + '</span></i>.');
        } else {
            self.partyStatus('<i>You\'re not connected to a party.</i>');
        }
    };

    self._clearPartyStatus = function() {
        self.partyStatus('<i>You\'re not connected to a party.</i>');
    };
}

ko.components.register('party-status', {
    viewModel: PartyStatusViewModel,
    template: template
});