'use strict';

function ExhibitViewModel() {
    var self = this;

    self.name = ko.observable('');
    self.url = ko.observable('');

    self.load = function() {
        Notifications.xmpp.routes.pcard.add(self.exhibitGivenImage);
    };

    self.unload = function() {
        Notifications.xmpp.routes.pcard.remove(self.exhibitGivenImage);
    };

    self.exhibitGivenImage = function(newPCard) {
        var image = pCard.fromEntries(newPCard).get('exhibitImage')[0];
        var playerType = pCard.fromEntries(newPCard).get('playerType')[0];

        // Ignore non-DM cards.
        if (PlayerTypes.dmPlayerType.key != playerType) { return; }

        if (image) {
            self.name(image.name);
            self.url(Utility.string.createDirectDropboxLink(image.url));
            Notifications.userNotification.infoNotification.dispatch('New image on Exhibit', '');
        } else {
            self.name('');
            self.url('');
        }
    };
}
