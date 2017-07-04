'use strict';

function ExhibitViewModel() {
    var self = this;

    self.name = ko.observable('');
    self.url = ko.observable('');

    self._isConnectedToParty = ko.observable(false);

    self.load = function() {
        Notifications.party.joined.add(self._connectionHasChanged);
        Notifications.xmpp.routes.pcard.add(self.exhibitGivenImage);
    };

    self.unload = function() {
        Notifications.party.joined.remove(self._connectionHasChanged);
        Notifications.xmpp.routes.pcard.remove(self.exhibitGivenImage);
    };

    self.exhibitGivenImage = function(newPCard) {
        var image = pCard.fromEntries(newPCard).get('exhibitImage')[0];
        if (self._isConnectedToParty() && image) {
            self.name(image.name);
            self.url(Utility.string.createDirectDropboxLink(image.url));

            if (!self._imageIsIdentical(image)) {
                Notifications.userNotification.infoNotification.dispatch('New image on Exhibit', '');
            }
        } else {
            self.name('');
            self.url('');
        }
    };

    /* Private Methods */

    self._connectionHasChanged = function() {
        var chat = ChatServiceManager.sharedService();
        self._isConnectedToParty(chat.currentPartyNode != null);
    };

    self._imageIsIdentical = function(image) {
        return self.name == image.name && self.url == image.url;
    };
}
